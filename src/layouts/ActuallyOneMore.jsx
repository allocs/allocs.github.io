import React from 'react'
import { Outlet } from 'react-router-dom'
import  Defaultbar from '../components/Defaultbar'

const OnlyLayout = () => {
  return (
    <div className='bg-backgroundblack'>
        <Defaultbar />
        <Outlet />
    </div>
  )
}

export default OnlyLayout