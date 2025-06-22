
import React, { useEffect, useState } from 'react'
import useStore from '../store'
import { useForm } from 'react-hook-form';
import api from '../libs/apiCall';
import { toast } from 'sonner';
import DialogWrapper from './wrappers/dialogWrapper';
import { DialogPanel, DialogTitle } from '@headlessui/react';
import { formatCurrency } from '../libs';
import { MdOutlineWarning } from 'react-icons/md';
import Input from './ui/input';
import Button from './ui/button';

const TransferMoney = ({
  isOpen,
  setIsOpen,
  refetch
}) => {

  const { user } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [formAccountInfo, setFormAccountInfo] = useState([])
  const [toAccountInfo, setToAccountInfo] = useState([])

  const submitHandler = async (data) => {
    try {
      setLoading(true)
      const newData = {
        ...data,
        from_account: formAccountInfo.id,
        to_account: toAccountInfo.id 
      }

      const { data: res } = await api.put(
        `/transactions/transfer-money`, newData
      );

      if (res?.status === "success") {
        toast.success(res?.message)
        setIsOpen(false)
        refetch()
      }
    }
    catch (err) {
      console.error("Sumething went wrong: ", err)
      toast.error(err?.response?.data?.message || err?.message)
    }
    finally {
      setLoading(false

      )
    }
  } 

  const getAccountBalance = (setAccount, val) => {
    const filteredAccount = accountData?.find(
      (account) => account.account_name === val
    )

    setAccount(filteredAccount)
  }

  function closeModel(){
    setIsOpen(false)
  }

  const fetchAccounts = async () => {
    try {
      const { data: res } = await api.get('/accounts')
      setAccountData(res?.data)
    }
    catch (err) {
      console.error(err)
    }
    finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  return (
    <>
      <DialogWrapper
        isOpen={isOpen}
        closeModel={closeModel}
      >
        <DialogPanel
          className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left"
        >
          
          <DialogTitle
            as='h3'
            className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase"
          >
            Transfer Money

          </DialogTitle>

          {
            isLoading ? (
              <Loading />
            ) : (
                <form
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div className="flex flex-col gap-1 mb-2">
                    <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                      Select Account

                    </p>

                    <select
                      onChange={(e) => {
                        getAccountBalance(setFormAccountInfo, e.target.value)
                      }}
                      className="inputStyles"
                    >
                      <option
                        disabled
                        selected
                        className="w-full flex items-center justify-center dark:bg-slate-900"
                      >
                        Select Account 

                      </option>

                      {
                        accountData?.map((acc, index) => (
                          <option
                            key={index}
                            value={acc?.account_name}
                            className="w-full flex items-center justify-center dark:bg-slate-900"
                          > 
                            {acc?.account_name} {" - "} 
                            {formatCurrency(acc?.account_balance)}
                            
                          </option>
                        ))
                      }
                      
                    </select>

                  </div>

                  <div className="flex flex-col gap-1 mb-2">
                    <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                      From Account
                    </p>

                    <select 
                      onChange={(e) => {
                        getAccountBalance(setToAccountInfo, e.target.value)
                      }}
                      className='inputStyles'
                    >
                      <option 
                        disabled
                        selected
                        className='w-full flex items-center justify-center dark:bg-slate-900'
                      >
                        To Account

                      </option>

                      {
                        accountData?.map((acc, index) => (
                          <option
                            key={index}
                            value={acc?.account_name}
                            className='w-full flex items-center justify-center dark: bg-slate-900'
                          >
                            {acc?.account_name} {" - "}
                            {formatCurrency(acc?.account_balance)}

                          </option>
                        ))
                      }

                    </select>

                  </div>

                  {
                    formAccountInfo?.acc <= 0 && (
                      <div className="flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded">
                        <MdOutlineWarning size={30} />
                        <span className='text-sm'>
                          You can not transfer money from this account. Insufficient account balance.
                        </span>

                      </div>
                    )
                  }

                  {
                    formAccountInfo.account_balance > 0 && toAccountInfo.id && (
                      <>
                        <div>

                        </div>

                        <Input
                          type='number'
                          name='amount'
                          label='Amount'
                          placeholder='10.56'
                          {...register("amount", {
                            required: "Transaction amount is required!",
                          })}
                          error={errors.amount ? errors.amount.message : ''}
                        />
                        <div className="w-full mt-8">
                          <Button 
                            disabled={loading}
                            type='submit'
                            className='bg-violet-700 text-white w-full'
                          >
                            {
                              `Transfer ${
                                watch("amount")  ? formatCurrency(watch("amount")) : ''
                              }`
                            }

                          </Button>

                        </div>

                      </>
                    )
                  }

                </form>
            )
          }

        </DialogPanel>

      </DialogWrapper>
    </>
  )
}

export default TransferMoney