import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import Title from './Title'

export const DailyChart = ({ data }) => {
  // Get current date to highlight today in the chart
  const currentDay = new Date().getDate().toString()
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()


  return (
    <div className='flex-1 w-full'>
      <Title title={`Daily Transaction Activity of ${currentMonth} ${currentYear}`} />
      <ResponsiveContainer width='100%' height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray='0 3' stroke='#f0f0f0' />
          <XAxis dataKey='day' />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {/* Highlight today's date */}
          <ReferenceLine
            x={currentDay}
            stroke='#ff7300'
            strokeDasharray='3 3'
            label={{ value: 'Today', position: 'top', fill: '#ff7300', fontSize: '12px' }} />
          <Line
            type='monotone'
            dataKey='income'
            stroke='#8884d8'
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
            name='Income'
            animationDuration={1000}
          />
          <Line
            type='monotone'
            dataKey='expense'
            stroke='#ff7300'
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
            name='Expense'
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
