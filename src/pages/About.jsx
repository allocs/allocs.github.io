import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import resume from '../assets/images/Alexandra Jans - Resume.png';
const Nowhere = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8 bg-cork'> 
        <div className='p-4 md:p-8' >
            <div className='font-serif bg-[#f8f7ed] p-4 md:p-8'>
                <div className='text-2xl'>
                    Hello! I'm Alex!
                </div>
                <br/>
                <div className='text-lg'>
                    I am what happens if you take an art-person and teach them how to code. <br/><br/>
                    I made this website to share the things I make, either coding projects, videos, drawings, paintings, whatever. <br/><br/>
                    It is also a portfolio, where I can show things I made money making. <br/><br/>
                    Yes, it is supposed to be a bit weird looking. I guess I am going for some sort of nostagic simulacrum vibe, but I don't want to write an artist's statement for a website.<br/><br/>
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
                    Don't send me any pigeon mail. I will be keeping the pigeons. <br/><br/><br/><br/>
                </div>
            </div>
        </div>
        <div className=''>
            <NavLink className='flex flex-shrink-0 mr-4' to='/Resume'>
                <img
                    className='h-[475px] md:h-[720px] w-auto p-16'
                    src={resume}
                    alt="My resume is here. It isn't particularly impressive"
                />

            </NavLink>
        </div>
    </div>
  )
}

export default Nowhere