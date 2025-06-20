import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '../libs/apiCall'
import Loading from '../components/Loading.jsx'
import Info from '../components/Info.jsx'
import Stats from '../components/Stats.jsx'
import { BiDoughnutChart } from 'react-icons/bi'
import DoughnutChart from '../components/Piechart.jsx'
import { Chart } from '../components/Chart.jsx'
import RecentTransaction from '../components/RecentTransaction.jsx'
import Accounts from '../components/Accounts.jsx'
import { DailyChart } from '../components/DailyChart.jsx'
import { MonthlyBarChart } from '../components/BargraphMonth.jsx'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    chartData: [],
    lastTransactions: [],
    lastAccounts: [],
    dailyChartData: []

  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  console.log("Acc",dashboardData.lastAccounts)

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await api.get('/transactions/dashboard')
      console.log('Dashboard data:', response.data)      
      setDashboardData({
        balance: response.data?.availableBalance || 0,
        income: response.data?.totalIncome || 0,
        expense: response.data?.totalExpense || 0,
        chartData: response.data?.chartData || [] ,
        lastTransactions: response.data?.lastTransactions || [],
        lastAccounts: response.data?.lastAccounts || [],
        dailyChartData: response.data?.dailyChartData || []

      })

    } catch (err) {
      console.error('Fetch error:', err)
      setError(err)
      toast.error(err?.response?.data?.message || "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <div className="p-4 text-center">
          <h3 className="mb-4 text-lg font-medium text-red-500">
            Failed to load dashboard data
          </h3>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-0 md:px-5 2xl:px-20">
      <Info
        title="Dashboard"
        subTitle="Monitor your financial activities"
      />
      <Stats dt={dashboardData} />


      <div className="flex flex-col-reverse items-stretch gap-6 w-full md:flex-row mt-8">
        <div className="flex-1 w-[100%]">
          <Chart data={dashboardData.chartData} />
        </div>
      </div>

      <div className="flex flex-col-reverse items-stretch gap-12 w-full md:flex-row mt-8">
        
        {(dashboardData.income > 0 || dashboardData.expense > 0) && (
          <div
            className="w-[20%] md:w-[25%]">
            <DoughnutChart dt={dashboardData} />
          </div>
        )}

        <MonthlyBarChart
          data={dashboardData.chartData}
          className="w-[70%] md:w-[100%]"
        />
      </div>

      <div className="flex flex-col-reverse gap-0 md:flex-row md:gap-10 2xl:gap-20">
        <RecentTransaction data={ dashboardData.lastTransactions} />
        {
          dashboardData?.lastAccounts?.length > 0 &&
          <Accounts data={ dashboardData.lastAccounts} />
        }
         
      </div>

      


      <div className="flex flex-col gap-6 mt-8">
  
  
        <div className="flex-1 w-full">
          <DailyChart
            data={dashboardData.dailyChartData}
          />
        </div>
  

      </div>


    </div>
  )
}

export default Dashboard