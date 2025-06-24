
import React, { useEffect, useState } from 'react'
import useStore  from '../store/index.js'
import { FaBtc, FaPaypal } from 'react-icons/fa'
import { RiVisaLine } from 'react-icons/ri'
import { GiCash } from 'react-icons/gi'
import { toast } from 'sonner'
import api from '../libs/apiCall.js'
import Loading from '../components/Loading.jsx'
import Title from '../components/Title.jsx'
import { MdAddCircle, MdVerifiedUser } from 'react-icons/md'
import AccountMenu from '../components/account-dialog.jsx'
import {formatCurrency, maskAccountNumber } from "../libs/index.js"
import AddAccount from '../components/add-account.jsx'
import AddMoney from '../components/add-money.jsx'
import TransferMoney from '../components/transfer-money.jsx'


const AccountPage = () => {
  


  const { user } = useStore((state) => state)
  
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenTopup, setIsOpenTopup] = useState(false)
  const [isOpenTransfer, setIsOpenTransfer] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenAddMoney = (el) => {
    setSelectedAccount(el?.id)
    setIsOpenTopup(true)
  }

  const handleTransferMoney = (el) => {
    setSelectedAccount(el?.id)
    setIsOpenTransfer(true)
  }
  const handleDeleteAccount = async (account) => {
    setSelectedAccount(account);
    console.log("Account:", account);
  
    if (!window.confirm('Are you sure you want to delete this account?')) return;
  
    try {
      const storedUser = JSON.parse(localStorage.getItem("user")); // ✅ parse string
      console.log("Parsed user:", storedUser);
  
      if (storedUser?.id === account?.user_id) {
        const { data } = await api.delete(`/accounts/delete-account/${account?.id}`);
        toast.success(data?.message || "Account deleted successfully");
        fetchAccounts();
      } else {
        console.log("Id not match");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };
  
  const ICONS = {
    crypto: (
      <div
        className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
        <FaBtc size={26} />
      </div>
    ),
    "visa debit": (
      <div
        className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
        <RiVisaLine size={26} />
      </div>
    ),
    "visa": (
      <div
        className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
        <RiVisaLine size={26} />
      </div>
    ),
    cash: (
      <div
        className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full">
        <GiCash size={26} />
      </div>
    ),
    paypal: (
      <div
        className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
        <FaPaypal size={26} />
      </div>
    ),
    default: (
      <div
        className="w-12 h-12 bg-gray-600 text-white flex items-center justify-center rounded-full">
        <GiCash size={26} />
      </div>
    )
  }

  const getIconFor = (accountName) => {
    switch (accountName?.toLowerCase()) {
      case "crypto":
        return ICONS.crypto;
      case "visa debit":
      case "visa":
        return ICONS["visa debit"];
      case "cash":
        return ICONS.cash;
      case "paypal":
        return ICONS.paypal;
      default:
        return ICONS.default;  // fallback
    }
  }
  

  const fetchAccounts = async () => {
    try {
      

      const { data: res } = await api.get(`/accounts/${user?.id}`)
      
      setData(res?.data)
    }
    catch (err) {
      console.error('Error fetching accounts:', err)

      toast.error(err.response?.data?.message || err.message)

      if(err.response?.status === "auth_failed") {
        localStorage.removeItem('user')
        window.location.reload()
      }
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchAccounts()
  }, [])

  if (isLoading) {
    return <Loading />
  }
 
  return (
    <>
      <div
        className="w-full py-10">

        <div
          className="flex items-center justify-between">
          <Title title="Account Information"/>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="py-1.5 px-2 rounded bg-black dark:bg-violet-600 text-white dark:text-white flex items-center justify-center gap-2 border border-gray-500"
            >
              <MdAddCircle size={22} />
              <span className="">Add</span>

            </button>

          </div>

        </div>

        {
          data?.length === 0 ? (
            <>
              <div
                className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg">
                No Account Found
              </div>
              
            </>

          ) : (
              <div
                className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 py-10 gap-6">
                {
                  data?.map((acc, index) => (
                    <div
                      key={index}
                      className="w-full h-48 flex gap-4 bg-gray-50 dark:bg-slate-800 p-3 rounded shadow"
                    >

                      <div>
                        {getIconFor(acc.account_name)}

                      </div>
                      <div
                        className="space-y-2 w-full">
                        <div
                          className="flex items-center justify-between">
                          <div
                            className="flex items-center">
                            <p
                              className=" text-black dark:text-white text-2xl font-bold">
                              {acc?.account_name}
                            </p>

                            <MdVerifiedUser
                              size={26}
                              className="text-emerald-600 ml-1"
                            />
                          </div>

                          <AccountMenu
                            addMoney={() => handleOpenAddMoney(acc)}
                            transferMoney={() => handleTransferMoney(acc)}
                            deleteAccount={() => handleDeleteAccount(acc)}
                          />
                        </div>

                        <span
                          className="text-gray-600 dark:text-gray-400 font-light leading-loose">
                          {
                            maskAccountNumber(acc?.account_number)
                          }
                        </span>
                        <p
                          className="text-gray-600 dark:text-gray-500">
                          {
                            new Date(acc?.created_at).toLocaleDateString("en-US",
                              {dateStyle: "full"}
                            )
                          }
                        </p>

                        <div
                          className="flex items-center justify-between">
                          <p
                            className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                            {formatCurrency(acc?.account_balance)}

                          </p>
                          <button
                            onClick={() => handleOpenAddMoney(acc)}
                            className="text-sm outline-none text-violet-600 hover:underline"
                          >
                            Add Money
                          </button>

                        </div>

                      </div>

                    </div>
                  ))
                }
              
              </div>
            )
        }

      </div>

      <AddAccount
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchAccounts}
        key={new Date().getTime()}
      />

      <AddMoney
        isOpen={isOpenTopup}
        setIsOpen={setIsOpenTopup}
        id={selectedAccount}
        refetch={fetchAccounts}
        key={new Date().getTime() + 1}

      />

      <TransferMoney
        isOpen={isOpenTransfer}
        setIsOpen={setIsOpenTransfer}
        id={selectedAccount}
        refetch={fetchAccounts}
        key={new Date().getTime() + 2}
      />

    </>
  )
}

export default AccountPage
