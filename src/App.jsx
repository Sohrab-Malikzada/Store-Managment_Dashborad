
import React from 'react'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import Home from "@/Pages/Home"

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App