import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import Title from './Title'

export const Chart = ({ data }) => {
  return (
    <div className='flex-1 w-full mt-5'>
      <Title title='Transaction Activity' />
      {/* Scroll container for small screens */}
      <div className='w-full overflow-x-auto'>
        <div className='min-w-[700px]'>
          {/* Adjust width based on data size */}
          <ResponsiveContainer width='100%' height={500}>
            <LineChart data={data} margin={{ top: 20, right: 40, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray='0 4' stroke='#e5e7eb' />
              <XAxis
                dataKey='label'
                padding={{ left: 20, right: 20 }}
                tick={{ fill: '#374151', fontSize: 18 }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={false} />
              <YAxis tick={{ fill: '#374151', fontSize: 18 }} axisLine={{ stroke: '#d1d5db' }} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }} labelStyle={{ color: '#6b7280' }} />
              <Legend wrapperStyle={{ paddingTop: 20 }} formatter={;(value) => (
                                                                     <span style={{ color: '#6b7280', fontSize: 18 }}>{value}</span>
                                                                   )} />
              <Line
                type='monotone'
                dataKey='income'
                stroke='#4ade80'
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 6 }}
                name='Income' />
              <Line
                type='monotone'
                dataKey='expense'
                stroke='#f87171'
                strokeWidth={2}
                dot={{ r: 5 }}
                name='Expense' />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
