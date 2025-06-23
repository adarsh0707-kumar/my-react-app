import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MdMoreVert } from 'react-icons/md'
import { BiTransfer } from 'react-icons/bi'
import { FaMoneyCheck } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import TransitionWrapper from './wrappers/transitionWrapper' // ✅ Make sure this path is correct

export default function AccountMenu ({ addMoney, transferMoney, deleteAccount }) {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <MenuButton className='inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-600 dark:text-gray-300'>
        <MdMoreVert />
      </MenuButton>
      <TransitionWrapper>
        <MenuItems className='absolute p-2 right-0 mt-2 w-45 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-700 shadow-lg'>
          <div className='px-1 py-1 space-y-2'>
            <MenuItem as={Fragment}>
            {({ active }) => (
               <button type='button' onClick={transferMoney} className={`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm ${
                                 active ? 'bg-gray-100 dark:bg-gray-700' : ''
                               } text-gray-700 dark:text-gray-400`}>
                 <BiTransfer /> Transfer Fund
               </button>
             )}
            </MenuItem>
            <MenuItem as={Fragment}>
            {({ active }) => (
               <button type='button' onClick={addMoney} className={`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm ${
                                 active ? 'bg-gray-100 dark:bg-gray-700' : ''
                               } text-gray-700 dark:text-gray-400`}>
                 <FaMoneyCheck /> Add Money
               </button>
             )}
            </MenuItem>
            {deleteAccount && (
                                                   <MenuItem as={Fragment}>
                                                     {({ active }) => (
                                                                           <button
                                                                             type="button"
                                                                             onClick={deleteAccount}
                                                                             className={`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm ${
                                   active ? 'bg-red-100 dark:bg-red-900' : ''
                                 } text-red-600 dark:text-red-400`}
                                                                           >
                                                                             <RiDeleteBin6Line />
                                                                             Delete Account
                                                                           </button>
                                                                         )}
                                                   </MenuItem>
                                                 )}
          </div>
        </MenuItems>
      </TransitionWrapper>
    </Menu>
  )
}
