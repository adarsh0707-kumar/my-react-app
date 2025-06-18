import { Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

const transitionWrapper = ({children}) => {
  return (
    <Transition
      as={Fragment}
      enter='transition ease-out duration-100'
      enterFrom='trasform opacity-0 scale-95'
      enterTo='transform opacity-100 scale-100'
      leave='transition ease-in duration-75'
      leaveFrom='trasform opacity-100 scale-100'
      leaveTo='trasform opacity-0 scale-95'
    >
      {children}
    </Transition>
  )
}

export default transitionWrapper
