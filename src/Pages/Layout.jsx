import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex m-10 bg-gray-100 min-h-screen">
  <Sidebar />
  <div className="flex-1">
    <Outlet />
  </div>
</div>
  )
}

export default Layout