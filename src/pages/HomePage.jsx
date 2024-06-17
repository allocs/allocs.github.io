import React from 'react'
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <section className='flex h-screen space-x-8 items-center bg-backgroundgray border-8 border-backgroundblack py-4'>
        <div className='flex flex-wrap space-x-8 items-center m-auto'>
        <div className='flex'>
            <Link
                to="/HostGame"
                className="text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full rounded-r"
                role="button"
            >
                Host a Game
            </Link>
        
            <Link
                to='/JoinGame'
                className="text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full rounded-l"
                role="button"
            >
                Join a Game
            </Link>
        </div>

        <div className='flex'>
        <Link
            to='/HowTo'
            className='text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full'
            role="button"
        >
            How to Play
        </Link>
        </div>

        <div className='flex'>
        <Link
            to='/About'
            className="text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full"
            role="button"
        >
            About JamMate
        </Link>
        </div>
    </div>
    </section>
  )
}

export default HomePage