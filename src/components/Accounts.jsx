
import React from 'react'
import { FaBtc, FaPaypal } from 'react-icons/fa'
import { GiCash } from 'react-icons/gi'
import { RiVisaLine } from 'react-icons/ri'
import Title from './Title'
import { Link } from 'react-router-dom'

const ICONS = {
  crypto: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <FaBtc size={26} />
    </div>
  ),

  "visa debit card": (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <RiVisaLine size={26} />
    </div>
  ),

  chsh: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <GiCash size={26} />
    </div>
  ),

  paypal: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <FaPaypal size={26} />
    </div>
  )
}


const Accounts = ({ data }) => {

  return (
    <div className="mt-20 md:mt-0 py-5 md:py-20 w-full md:w-1/3">
      <Title title="Accounts" />
      <Link
        to="/accounts"
        className="text-sm text-gray-600 dark:text-gray-500 hover:text-violet-600 hover:underline mr-5"
      >
        View all your accounts
      </Link>

      <div>
        
      </div>

    </div>
  )
}

export default Accounts