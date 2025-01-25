import React from 'react'
import { NavLink } from 'react-router-dom';
import Hello1 from '../assets/images/Hello1.gif'
import Hello2 from '../assets/images/Hello2.gif'
import openPortfolio from '../assets/images/portfolioOpen.png';
import closedPortfolio from '../assets/images/portfolioClosed.png';
import stickyNote from '../assets/images/aboutMeStickyNote.png';
import upStickyNote from '../assets/images/aboutMeStickyNoteUp.png';
import phone from '../assets/images/JamMatePhone.png';
import ringingPhone from '../assets/images/JamMatePhoneRing.png'
import typing from '../assets/images/typing.gif'

const HomePage = () => {
    let hello = null;
    if (Math.floor(Math.random() * (2) ) == 0){
        hello = Hello1;
    } else {
        hello = Hello2;
    }
  return (
    <div className="h-screen flex items-center flex-col bg-homepage bg-fixed">
        
         <img
                  className='w-[652px] h-auto px-16 py-6 .pixelated'
                  src={hello}
                  alt='Hello!'
              /> 
        <div className='font-sans text-[#413702] text-2xl italic font-bold px-8 md:p-8 pb-16 md:pb-32'>
            Welcome to the personal website of Alex Jans
        </div>

        <div className="flex flex-wrap">
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/Portfolio'>
            <div className ='group'>
            <div className="group-hover:hidden">
                <img
                                className='h-16 md:h-32 w-auto'
                                src={closedPortfolio}
                                alt='Closed Portfolio'
                />
            </div>
            <div className="hidden group-hover:flex">
                <img
                                className='h-16 md:h-32 w-auto'
                                src={openPortfolio}
                                alt='Opened Portfolio'
                />
            </div>
            </div>


            </NavLink>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/About'>
            <div className ='group'>
            <div className="group-hover:hidden">
                <img
                                className='h-16 md:h-32 w-auto'
                                src={stickyNote}
                                alt='Sticky Note that reads "about me"'
                />
            </div>
            <div className="hidden group-hover:flex">
                <img
                                className='h-16 md:h-32 w-auto'
                                src={upStickyNote}
                                alt='Sticky Note that reads "About Me" being pulled up'
                />
            </div>
            </div>

            </NavLink>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/JamMate'>
            <div className ='group'>
            <div className="group-hover:hidden">
                <img
                                className='h-16 md:h-32 w-auto'
                                src={phone}
                                alt='Pixelated phone that says "Jam Mate"'
                />
            </div>
            <div className="hidden group-hover:flex">
                <img
                                className='h-16 md:h-32 w-auto'
                                src={ringingPhone}
                                alt='Pixelated phone that says "Jam Mate" that is ringing'
                />
            </div>
            </div>


            </NavLink>
        </div>

        <img
                                className='h-[498px] w-auto p-16'
                                src={typing}
                                alt='An animated text/video chat with allocs'
                />
    </div>
  )
}

export default HomePage