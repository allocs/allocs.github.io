import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/images/JamMateLogoOffwhite.png';


const Defaultbar = () => {
  return (
    <nav className= 'bg-backgroundblack'>
      <div className='mx-auto max-w-7x1 px-2 sm:px6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/'>
              <img
                  className='h-16 w-auto'
                  src={logo}
                  alt='Home'
              />
              <span className='invisible md:block text-white text-2xl font-bold ml-2'>
                JamMate
              </span>
            </NavLink>
          </div>
        </div>
       </div>
    </nav>

  )
}

export default Defaultbar