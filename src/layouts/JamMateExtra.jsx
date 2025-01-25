import React from 'react'
import { Outlet } from 'react-router-dom'
import  DefaultJamMatebar from '../components/DefaultJamMatebar'

const JamMateExtra = () => {
  return (
    <div className='bg-backgroundblack font-mono'>
        <DefaultJamMatebar />
        <Outlet />
    </div>
  )
}

export default JamMateExtra