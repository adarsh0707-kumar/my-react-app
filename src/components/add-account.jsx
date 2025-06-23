import React, { useState } from 'react'
import useStore from '../store'
import { useForm } from 'react-hook-form'
import { generateAccountNumber } from '../libs/index.js'
import DialogWrapper from './wrappers/dialogWrapper.jsx'
import { DialogPanel, DialogTitle } from '@headlessui/react'
import { MdOutlineWarning } from 'react-icons/md'
import Input from '../components/ui/input.jsx'
import { BiLoader } from 'react-icons/bi'
import Button from "../components/ui/button.jsx"
import { toast } from 'sonner'
import api from "../libs/apiCall.js"

const baseAccounts = ["crypto", "visa debit", "visa", "cash", "paypal", "default"]

export default function AddAccount({ isOpen, setIsOpen, refetch }) {
  const { user } = useStore(state => state)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { account_number: generateAccountNumber() }
  })

  const [accounts, setAccounts] = useState(baseAccounts)
  const [selectedAccount, setSelectedAccount] = useState(accounts[0])
  const [customName, setCustomName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async formValues => {
    setIsLoading(true)
    let nameToUse = selectedAccount === 'default'
      ? customName.trim()
      : selectedAccount

    if (selectedAccount === 'default' && !nameToUse) {
      toast.error('Please provide a custom account name')
      setIsLoading(false)
      return
    }

    if (selectedAccount === 'default' && !accounts.includes(nameToUse)) {
      setAccounts(prev => [
        ...prev.slice(0, prev.length - 1),
        nameToUse,
        'default'
      ])
    }

    const payload = { ...formValues, name: nameToUse }

    try {
      const { data: res } = await api.post("/accounts/create", payload)
      if (res?.data) {
        toast.success(res.message)
        setIsOpen(false)
        refetch()
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogWrapper isOpen={isOpen} closeModel={() => setIsOpen(false)}>
      <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left">
        <DialogTitle
          as='h3'
          className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase"
        >
          Add Account
        </DialogTitle>

        {/* Icon preview removed */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-1 mb-2">
            <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
              Select Account
            </p>
            <select
              value={selectedAccount}
              onChange={e => {
                const val = e.target.value
                setSelectedAccount(val)
                if (val !== 'default') setCustomName('')
              }}
              className="bg-transparent appearance-none border border-gray-300 dark:border-gray-800 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-500 outline-none focus:ring-1 ring-blue-500"
            >
              {accounts.map((acc, i) => (
                <option key={i} value={acc} className="w-full dark:bg-slate-900">
                  {acc}
                </option>
              ))}
            </select>
          </div>

          {selectedAccount === 'default' && (
            <Input
              name="customName"
              label="Custom Account Name"
              placeholder="Enter custom account name"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              required
              className="inputStyle"
            />
          )}

          {user.accounts?.includes(
            selectedAccount === 'default' ? customName.trim() : selectedAccount
          ) && (
            <div className="flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded">
              <MdOutlineWarning size={30} />
              <span className="text-sm">
                This account has already been activated. Try another one. Thank you.
              </span>
            </div>
          )}

          {!user.accounts?.includes(
            selectedAccount === 'default' ? customName.trim() : selectedAccount
          ) && (
            <>
              <Input
                name="account_number"
                label="Account Number"
                {...register("account_number", { required: "Account Number is required!" })}
                error={errors.account_number?.message}
                className="inputStyle"
              />

              <Input
                type="number"
                name="amount"
                label="Initial Amount"
                {...register("amount", { required: "Initial amount is required!" })}
                error={errors.amount?.message}
                className="inputStyle"
              />

              <Button disabled={isLoading} type="submit" className="bg-violet-700 text-white w-full mt-4">
                {isLoading ? (
                  <BiLoader className="text-xl animate-spin text-white" />
                ) : (
                  "Create account"
                )}
              </Button>
            </>
          )}
        </form>
      </DialogPanel>
    </DialogWrapper>
  )
}
