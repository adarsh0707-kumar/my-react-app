import React from "react";
import Title from "./Title";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#0088FE", // Blue for income
  "#FF8042", // Orange for expense
];

const DoughnutChart = ({ dt }) => {
  const data = [
    { name: "Income", value: Number(dt?.income) || 0 },
    { name: "Expense", value: Number(dt?.expense) || 0 }
  ];

  return (
    <div className="w-full md:w-[130%] flex flex-col items-center bg-gray-50 dark:bg-transparent p-4 rounded-lg shadow">
      <Title title="Income vs Expense" />
      
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={60} // This creates the doughnut effect
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`$${value}`, value === dt?.income ? 'Income' : 'Expense']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;