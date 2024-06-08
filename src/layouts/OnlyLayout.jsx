import React from 'react'
import { Outlet } from 'react-router-dom'
import  Homebar from '../components/Homebar'

const OnlyLayout = () => {
  return (
    <>
        <Homebar />
        <Outlet />
    </>
  )
}

export default OnlyLayout