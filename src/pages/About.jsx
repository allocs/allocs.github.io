import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import resume from '../assets/images/Alexandra Jans - Resume.png';
const Nowhere = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8 bg-cork'> 
        <div className='p-4 md:p-8' >
            <div className='font-serif bg-[#f8f7ed] p-4 md:p-8'>
                <div className='text-2xl'>
                    Hello! I'm Alex, or Alexandra, or Al.
                </div>
                <br/>
                <div className='text-lg'>
                    I am a artist / computer scientist / person living in Madison WI with my fiancee, Bella, and our two pet doves, Pydjy and Paloma. <br/><br/>
                    I made this website to share the things I make, either coding projects, videos, drawings, paintings, whatever, and to express myself! <br/><br/>
                    Especially with social media becoming even weirder, its nice to have a corner of the internet for my stuff. I hope you enjoy!<br/><br/>
                </div>
            </div>
        </div>
        <div>
        
        </div>
        <div className='p-4 md:p-8' >
            <div className='font-serif bg-[#f8f7ed] p-4 md:p-8'>
                <div className='text-2xl'>
                    Contact info:
                </div>
                <br/>
                <div className='text-lg'>
                    If you want to get in touch, the best way is probably e-mail at alexandracjans@gmail.com. <br/><br/>
                    I also have a phone number (224)-501-5649 <br/><br/>
                    Don't send me any pigeon mail. I will be keeping the pigeons. <br/><br/><br/><br/>
                </div>
            </div>
        </div>
        <div className=''>
            <NavLink className='flex flex-shrink-0 mr-4' to='/Resume'>
                <img
                    className='h-[475px] md:h-[720px] w-auto p-16'
                    src={resume}
                    alt='A sheet of Valentines Day cards featuring my dove, Pidgey. They read "I Dove You", "You Are So Coo!", and "You Make My Heart Soar".'
                />

            </NavLink>
        </div>
    </div>
  )
}

export default Nowhere