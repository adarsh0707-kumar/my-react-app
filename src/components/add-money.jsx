
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '../libs/apiCall'
import DialogWrapper from './wrappers/dialogWrapper'
import { DialogPanel, DialogTitle } from '@headlessui/react'
import Input from './ui/input'
import Button from './ui/button'
import { formatCurrency } from '../libs'

const AddMoney = ({
  isOpen,
  setIsOpen,
  id,
  refetch
}) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    
  } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const submitHandler = async (data) => {
    try {
      setIsLoading(true)

      const { data: res } = await api.put(`accounts/add-money/${id}`, data)
      
      if (res?.data) {
        toast.success(res?.message)
        setIsOpen(false)
        refetch()
      }
      
    }
    catch (err) {
      console.error("Something went wrong:", err)
      toast.error(err?.response?.data?.message || err.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  function closeModel() {
    setIsOpen(false)
  }


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
            className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 md-4 uppercase"
          >
            Add Money to Account

          </DialogTitle>

          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-6"
          >

            <Input
              type="number"
              name="amount"
              label="Amount"
              placeholder="10.56"
              {...register("amount",{
                required: "Amount is required",
              })}
              error={errors.amount ? errors.amount.message : ''}
              className="inputStyles"
            />

            <div className="w-full mt-8">
              <Button
                disabled={isLoading}
                type="submit"
                
                className="bg-violet-700 text-white w-full"
              >
              {`Submit ${
                  watch("amount") ? formatCurrency(watch("amount")) : ''
                  }`
              }
              </Button>
            </div>

          </form>

        </DialogPanel>

      </DialogWrapper>
    </>
  )
}

export default AddMoney