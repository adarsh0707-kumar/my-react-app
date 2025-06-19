import React from 'react'
import { BsCashCoin, BsCurrencyRupee } from 'react-icons/bs'
import { BiMoney } from 'react-icons/bi'
import { Card } from './ui/card'
import { formatCurrency } from '../libs/index.js'

const Stats = ({ dt = {} }) => {
  const statsData = [
    {
      label: 'Total Balance',
      amount: dt.balance || 0,
      icon: <BsCurrencyRupee size={24} />,
      bgColor: 'bg-blue-100/80 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
      shadow: 'shadow-blue-200/50 dark:shadow-blue-900/30'
    },
    {
      label: 'Total Income',
      amount: dt.income || 0,
      icon: <BsCashCoin size={24} />,
      bgColor: 'bg-emerald-100/80 dark:bg-emerald-900/30',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'shadow-emerald-200/50 dark:shadow-emerald-900/30'
    },
    {
      label: 'Total Expense',
      amount: dt.expense || 0,
      icon: <BiMoney size={24} />,
      bgColor: 'bg-rose-100/80 dark:bg-rose-900/30',
      textColor: 'text-rose-600 dark:text-rose-400',
      shadow: 'shadow-rose-200/50 dark:shadow-rose-900/30'
    }
  ]

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {statsData.map((stat, index) => (
         <Card key={index} className={`p-6 transition-all duration-300 hover:shadow-lg ${stat.shadow}`}>
           <div className='flex items-center gap-4'>
             <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.textColor}`}>
               {stat.icon}
             </div>
             <div>
               <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                 {stat.label}
               </p>
               <p className={`text-2xl font-semibold ${stat.textColor}`}>
                 {formatCurrency(stat.amount)}
               </p>
               <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                 {stat.increase ? `↑ ${stat.increase}% from last month` : 'No change'}
               </p>
             </div>
           </div>
         </Card>
       ))}
    </div>
  )
}

export default Stats
