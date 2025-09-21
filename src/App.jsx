
import React from 'react'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import Home from "./Pages/Home"
import Layout from './Pages/Layout'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Debts from './Pages/Debts'
import Employees from './Pages/Employees'
import Analytics from './Pages/Analytics'
import Inventory from './Pages/Inventory'
import Payroll from './Pages/Payroll'
import Purchases from './Pages/Purchases'
import Returns from './Pages/Returns'
import Sales from './Pages/Sales'
import UserManagement from './Pages/UserManagement'
import ErrorPage from './Pages/ErrorPage'

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/dashboard",
          element: <Dashboard />
        },
        {
          path: "/debts",
          element: <Debts />
        },
        {
          path: "/employees",
          element: <Employees />
        },
        {
          path: "/analytics",
          element: <Analytics />
        },
        {
          path: "/inventory",
          element: <Inventory />
        },
        {
          path: "/payroll",
          element: <Payroll />
        },
        {
          path: "/purchases",
          element: <Purchases />
        },
        {
          path: "/returns",
          element: <Returns />
        },
        {
          path: "/sales",
          element: <Sales />
        },
        {
          path: "/userManagement",
          element: <UserManagement />
        },
        
      ]
    },
    {
      path: "/login",
      element: <Login />
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App