import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import Title from './Title'

export const MonthlyBarChart = ({ data = [] }) => {
  // Colors
  const incomeColor = '#4ade80' // Green
  const expenseColor = '#f87171' // Red
  const currentMonth = new Date().toLocaleString('default', { month: 'short' })

  // Custom legend with colored text
  const renderCustomizedLegend = (props) => {
    const { payload } = props
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
        {payload.map((entry, index) => {
           const color = entry.value === 'Income' ? incomeColor : expenseColor
           return (
             <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
               <div style={{ width: '12px', height: '12px', backgroundColor: color, marginRight: '5px', borderRadius: '3px' }} />
               <span style={{ color}}>{entry.value}</span>
             </div>
           )
         })}
      </div>
    )
  }

  // Custom tooltip with colors
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 border border-gray-200 rounded shadow-md gap-6'>
          <p className='font-semibold'>
            {label}
          </p>
          <div className='flex items-center'>
            <div className='w-3 h-3 rounded-full mr-2' style={{ backgroundColor: incomeColor }} />
            <span className='mr-2'>Income:</span>
            <span>₹{payload[0].value.toLocaleString()}</span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 rounded-full mr-2' style={{ backgroundColor: expenseColor }} />
            <span className='mr-2'>Expense:</span>
            <span>₹{payload[1].value.toLocaleString()}</span>
          </div>
        </div>
      )
    }
    return null
  }


  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className='flex-1 w-full'>
        <Title title='Monthly Income vs Expense' />
        <div className='flex items-center justify-center h-64 text-gray-500'>
          No monthly data available
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 w-full mt-5'>
      <Title title='Monthly Income vs Expense' />
      <ResponsiveContainer width='100%' height={500}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={4}
          barCategoryGap={12}>
          <CartesianGrid strokeDasharray='0 3' stroke='#f0f0fa' />
          <XAxis dataKey='label' tick={{ fill: '#666' }} />
          <YAxis tick={{ fill: '#666' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderCustomizedLegend} />
          <ReferenceLine
            x={currentMonth}
            stroke='#ffa500'
            strokeDasharray='3 3'
            label={{ value: 'Current', position: 'top', fill: '#ffa5b0', fontSize: '14px' }} />
          <Bar
            dataKey='income'
            name='Income'
            radius={[4, 4, 0, 0]}
            animationDuration={1000}>
            {data.map((entry, index) => (
               <Cell key={`income-${index}`} fill={incomeColor} />
             ))}
          </Bar>
          <Bar
            dataKey='expense'
            name='Expense'
            radius={[4, 4, 0, 0]}
            animationDuration={1000}>
            {data.map((entry, index) => (
               <Cell key={`expense-${index}`} fill={expenseColor} />
             ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
