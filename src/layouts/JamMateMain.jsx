import React from 'react'
import { Outlet } from 'react-router-dom'
import  Homebar from '../components/JamMateHomebar'

const JamMateMain = () => {
  return (
    <>
        <Homebar />
        <Outlet />
    </>
  )
}

export default JamMateMain