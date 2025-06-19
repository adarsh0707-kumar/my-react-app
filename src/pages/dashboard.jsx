import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '../libs/apiCall'
import Loading from '../components/Loading.jsx'
import Info from '../components/Info.jsx'
import Stats from '../components/Stats.jsx'
import { BiDoughnutChart } from 'react-icons/bi'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    chartData: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
        chartData: response.data?.chartData || [] 
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


      <div className="flex flex-col-reverse items-center gap-10 w-full md:flex-row">
        <Chart data={dashboardData.chartData} />
        {
          (dashboardData.income > 0 && (
            <BiDoughnutChart
              dt={dashboardData}
            />
          ))
        }
        

      </div>


    </div>
  )
}

export default Dashboard