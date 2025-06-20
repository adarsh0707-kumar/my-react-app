// Importing necessary libraries and components

import React, { useEffect } from 'react'
import { Route, Outlet, Navigate, Routes } from 'react-router-dom'
import SignUp from './pages/auth/SignUp.jsx'
import Dashboard from './pages/dashboard'
import Settings from './pages/settings'
import AccountPage from './pages/accountPage'
import Transaction from './pages/transaction' 
import useStore from './store/index.js'
import Login from './pages/auth/Login.jsx'
import { setAuthToken }  from './libs/apiCall.js'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar.jsx'

const RootLayout = () => {
  const { user } = useStore((state) => state)
  setAuthToken(user?.token || "")

  return !user ? (
    <Navigate to="login" replace={true} />
  ) : (
    <>
      <Navbar />

        <div
          className="min-h-[cal(h-screen-100px)]"  
        >
          <Outlet />
        </div>
    </>
  )
}

function App() {

  const {theme} = useStore((state) => state)
  
  useEffect(() => {
    if(theme === 'dark') {
      document.body.classList.add('dark')
    }
    else {
      document.body.classList.remove('dark')
    }
  }, [theme])
  return (
    <>
      <div
        className="w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-slate-900"  
      >
        <Routes >

          
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<SignUp />} />

          <Route element={<RootLayout />}>
            <Route path='/' element={<Navigate to="/overview" />} />
            <Route path='/overview' element={<Dashboard />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/account' element={<AccountPage />} />
            <Route path='/transaction' element={<Transaction />} />
          </Route>
          
        </Routes>
      </div>
      <Toaster richColors position='top-ceter'/>
    </>
  )
}

export default App
