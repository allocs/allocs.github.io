import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/images/JamMateLogoOffwhite.png';
import homeIcon from '../assets/images/JamMateHome.png';


const DefaultJamMatebar = () => {
  return (
    <nav className= 'bg-backgroundblack'>
      <div className='mx-auto max-w-7x1 px-2 sm:px6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <NavLink className='flex flex-shrink-0 justify-self-center items-center mr-4' to='/JamMate'>
              <img
                  className='h-12 md:h-16 w-auto'
                  src={logo}
                  alt='Home'
              />
            </NavLink>
          </div>
          <NavLink className='flex flex-shrink-0 items-center justify-self-end mr-4' to='/'>
              <img
                  className='h-12 md:h-16 w-auto'
                  src={homeIcon}
                  alt='Home'
              />
            </NavLink>
        </div>
       </div>
    </nav>

  )
}

export default DefaultJamMatebar