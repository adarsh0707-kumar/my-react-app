import React, { useState } from 'react'
import useStore from '../store'
import { LuSunMoon } from 'react-icons/lu'
import { IoMoonOutline } from 'react-icons/io5'

const ThemeSwitch = () => {
  const { theme, setTheme } = useStore((state) => state)
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark')

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark'
    setIsDarkMode(!isDarkMode)
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button onClick={toggleTheme} className='outline-none'>
      {isDarkMode ? (
         <LuSunMoon size={26} className='text-gray-500' />
         ) : (
         <IoMoonOutline size={26} className='text-gray-500' />
         )}
    </button>
  )
}

export default ThemeSwitch
