import React from 'react'
import { Link } from 'react-router-dom';
import StudioLogo from '../assets/images/Made by Studio Pydjy.png'

const HomePage = () => {
  return (
    <div className=' grid grid-col'>
        <section className="flex flex-wrap h-[calc(100vh-208px)] space-x-8 items-center bg-amp border-8 border-backgroundblack py-4">
            <div className='flex flex-col lg:flex-row flex-wrap space-x-8 items-center gap-4  m-auto'>
            <div className='flex'>
                <Link
                    to="/JamMate/HostGame"
                    className="font-mono text-xl lg:text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full rounded-r"
                    role="button"
                >
                    HOST
                </Link>
            
                <Link
                    to='/JamMate/JoinGame'
                    className="font-mono text-xl lg:text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full rounded-l"
                    role="button"
                >
                    JOIN
                </Link>
            </div>

            <div className='flex'>
            <Link
                to='/JamMate/HowTo'
                className='font-mono text-xl lg:text-2xl bg-buttongold hover:bg-buttondarkgold  text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full'
                role="button"
            >
                HOW TO
            </Link>
            </div>

            <div className='flex'>
            <Link
                to='/JamMate/About'
                className="font-mono text-xl lg:text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full"
                role="button"
            >
                ABOUT
            </Link>
            </div>
        </div>
        </section>
        <img
            className='h-24 lg:h-32 w-auto m-auto'
            src={StudioLogo}
            alt='Made by Studio Pydjy'
        />
    </div>
  )
}

export default HomePage