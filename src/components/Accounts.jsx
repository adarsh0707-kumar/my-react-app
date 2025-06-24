import React from 'react'
import { FaBtc, FaPaypal } from 'react-icons/fa'
import { GiCash } from 'react-icons/gi'
import { RiVisaLine } from 'react-icons/ri'
import Title from './Title'
import { Link } from 'react-router-dom'
import { formatCurrency, maskAccountNumber } from '../libs/index.js'

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

const Accounts = ({
  data = []
}) => {
  const getAccountIcon = (accountName) => {
    if (!accountName) return ICONS.default;
    
    const lowerName = accountName.toLowerCase();
    
    // Check for partial matches
    if (lowerName.includes('crypto')) return ICONS.crypto;
    if (lowerName.includes('visa')) return ICONS.visa;
    if (lowerName.includes('paypal')) return ICONS.paypal;
    if (lowerName.includes('cash')) return ICONS.cash;
    
    return ICONS.default;
  };

  return (
    <div
      className="mt-20 md:mt-0 py-5 md:py-20 w-full md:w-1/3">
      <Title title="Accounts" />
      <Link
        to="/accounts"
        className="text-sm text-gray-600 dark:text-gray-500 hover:text-violet-600 hover:underline mr-5"
      >
        View all your accounts
      </Link>

      <div
        className='w-full'>
        {
          data?.map((item, index) => {
          const accountName = item?.account_name || 'Cash';
          const accountIcon = getAccountIcon(accountName);
          
          return (
            <div
              key={index}
              className="flex items-center justify-between mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
            >
              <div
                className="flex items-center gap-4">
                <div>
                  {accountIcon}
                </div>

                <div>
                  <p
                    className="text-black dark:text-gray-300 text-base 2xl:text-lg font-medium">
                    {accountName}
                  </p>
                  <span
                    className="text-sm text-gray-600 dark:text-gray-400 2xl:text-base">
                    {
                      maskAccountNumber(item?.account_number) || '•••• •••• ••••'
                    }
                  </span>
                </div>
              </div>

              <div
                className="text-right">
                <p
                  className="text-lg 2xl:text-xl text-black dark:text-gray-300 font-medium">
                  {
                    formatCurrency(item?.account_balance || 0)
                  }
                </p>
                <span
                  className="text-xs 2xl:text-sm text-gray-500 dark:text-violet-400">
                  Account Balance
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Accounts
