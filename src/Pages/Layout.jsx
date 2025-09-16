import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex bg-gray-100 min-h-screen'>
        <Sidebar />
        <Outlet />
    </div>
  )
}

export default Layout