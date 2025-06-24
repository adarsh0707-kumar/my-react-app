import React, { useEffect } from 'react'
import useStore from '../store'
import { LuSunMoon } from 'react-icons/lu'
import { IoMoonOutline } from 'react-icons/io5'

const ThemeSwitch = () => {
  const { theme, setTheme } = useStore((state) => state)

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [setTheme])

  return (
    <button
      onClick={toggleTheme}
      className='outline-none p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors' aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
    >
      {
        theme === 'dark' ? (
         <LuSunMoon size={26} className='text-yellow-400' />
         ) : (
            <IoMoonOutline
              size={26}
              className='text-gray-600 dark:text-gray-300'
            />
        )
      }
    </button>
  )
}

export default ThemeSwitch
