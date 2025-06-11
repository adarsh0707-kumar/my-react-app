// Importing necessary libraries and components

import React from 'react'
import { Route, Outlet, Navigate, Routes } from 'react-router-dom'
import Login from './pages/auth/login'
import SignUp from './pages/auth/signUp'
import Dashboard from './pages/dashboard'
import Settings from './pages/settings'
import AccountPage from './pages/accountPage'
import Transaction from './pages/transaction' 
import useStore from './store/index.js'

const RootLayout = () => {
  const { user } = useStore((state) => state)
  console.log(user)

  return !user ? (
    <Navigate to="login" replace={true} />
  ) : (
    <>
      {/* <Navbar /> */}

      <div>
        <Outlet />
      </div>
    </>
  )
}

function App() {

  
  return (
    <>
      <div>
        <Routes >
          <Route element={<RootLayout />}>
            <Route path='/' element={<Navigate to="/overview" />} />
            <Route path='/overview' element={<Dashboard />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/account' element={<AccountPage />} />
            <Route path='/transaction' element={<Transaction />} />
          </Route>
          
          <Route path='/login' element={<Login />} />
          <Route path='/Signup' element={<SignUp />} />
        </Routes>
      </div>
    </>
  )
}

export default App
