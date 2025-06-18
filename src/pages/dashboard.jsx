
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '../libs/apiCall'

const Dashboard = () => {

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDashboardStats = async () => {
    const URL = `/transaction/dashboard`;
    try {
      const { data } = await api.get(URL)
      setData(data)

    }
    catch (err) {
      console.error(err)
      toast.error(
        err?.response?.data?.message || "Something unexpected happened. Try again later."
      )
      if (err?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user")
        window.location.reload()
      }
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchDashboardStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    )
  }


  return (
    <>
      dashboard
    </>
  )
}

export default Dashboard