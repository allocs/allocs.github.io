import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import portfolioHeader from '../assets/images/PortfolioHeader.gif';
import videosHeader from '../assets/images/Video Header.png';
import artHeader from '../assets/images/Art Header.png';
//imports for pieces of Art
import Artwork1 from '../assets/images/Bella Cartoon.png';
import Artwork2 from '../assets/images/Self portrait.png';
import Artwork3 from '../assets/images/Pydjum Valentines less texture.png';


const Portfolio = () => {
  return (
    <div className='flex flex-col'>
        <div className= 'flex w-screen justify-between '>
            <img
                className='h-[272px] w-[432px] p-16 .pixelated'
                src={portfolioHeader}
                alt='Portfolio'
            /> 
        </div>

        <div className='flex'>
            <img
                className='h-[272px] w-[272px] p-16 .pixelated'
                src={videosHeader}
                alt='Portfolio'
            /> 
        
            <iframe className='p-16' width="560" height="315" src="https://www.youtube.com/embed/6tet8p_UsPA?si=QVSXStb9lp-oNwIu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
            <iframe className='p-16' width="560" height="315" src="https://www.youtube.com/embed/HXku_5jckAM?si=lsKfOMFmcBNaTF6n" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
            <iframe className='p-16' width="560" height="315" src="https://www.youtube.com/embed/kr5vC9QV-y8?si=UGTehRTiAo3ta6Ae" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
            <iframe className='p-16' width="560" height="315" src="https://www.youtube.com/embed/1d7fDApiG3M?si=1fYZRXktJoncHKCL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
        </div>
        <div className='flex'>
            <img
                className='h-[272px] h-[272px] p-16 .pixelated'
                src={artHeader}
                alt='Portfolio'
            /> 
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/Portfolio'>
                <img
                    className='h-[480px] w-auto p-16'
                    src={Artwork1}
                    alt='A cartoony illustration of my wife, Bella, done digitally'
                />
                <span className='invisible md:block text-white text-2xl font-bold ml-2'>
                Artwork 1
                </span>
            </NavLink>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/Portfolio'>
                <img
                    className='h-[350px] w-auto p-16'
                    src={Artwork2}
                    alt='A fauvist illustration of myself done digitally in high chroma blues and magentas'
                />
                <span className='invisible md:block text-white text-2xl font-bold ml-2'>
                Artwork 2
                </span>
            </NavLink>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/Portfolio'>
                <img
                    className='h-[480px] w-auto p-16'
                    src={Artwork3}
                    alt='A sheet of Valentines Day cards featuring my dove, Pidgey. They read "I Dove You", "You Are So Coo!", and "You Make My Heart Soar".'
                />
                <span className='invisible md:block text-white text-2xl font-bold ml-2'>
                Artwork 3
                </span>
            </NavLink>
        </div>
    </div>

  )
}

export default Portfolio