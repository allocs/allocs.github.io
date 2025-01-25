import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import AlexJansStill from '../assets/images/Alexandra Jans.png'
import AlexJansAnimated from '../assets/images/Alexandra Jans.gif'
import backArrowAnimated from '../assets/images/Back Home Arrow.png';
import backArrowStill from '../assets/images/Back Home Arrow Static.png'

const CorkboardLayout = () => {
  return (
    <>
        <nav className= 'bg-[#f8f7e6]'>
          <div className='mx-auto max-w-7x1 px-2 sm:px6 lg:px-8'>
            <div className='flex h-20 items-center justify-between'>


              <NavLink className='flex flex-shrink-0 items-center mr-4' to='/'>
                    <div className ='group'>
                        <div className="group-hover:hidden">
                            <img
                                className='h-16 w-auto'
                                src={AlexJansStill}
                                alt='Label that reads "property of Alexandra Jans"'
                            />
                        </div>
                        <div className="hidden group-hover:flex">
                            <img
                                className='h-16 w-auto'
                                src={AlexJansAnimated}
                                alt='Label that reads "property of Alexandra Jans"'
                            />
                        </div>
                    </div>
            
                    <span className='invisible md:block text-white text-2xl font-bold ml-2'>
                        Back
                    </span>
                </NavLink>
                <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
                </div>
                <NavLink className='flex flex-shrink-0 items-center mr-4 justify-end' to='/'>
                    <div className ='group'>
                        <div className="group-hover:hidden">
                            <img
                                className='h-16 w-auto'
                                src={backArrowStill}
                                alt='Back arrow to home'
                            />
                        </div>
                        <div className="hidden group-hover:flex">
                            <img
                                className='h-16 w-auto'
                                src={backArrowAnimated}
                                alt='animated back arrow / house'
                            />
                        </div>
                    </div>
            
                    <span className='invisible md:block text-white text-2xl font-bold ml-2'>
                        Back
                    </span>
                </NavLink>
            </div>
           </div>
        </nav>
        <div className="h-[calc(100vh-80px)] bg-cork">
            <Outlet />
        </div>
    </>
  )
}

export default CorkboardLayout