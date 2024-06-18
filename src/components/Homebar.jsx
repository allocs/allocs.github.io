import React from 'react'
import { NavLink } from 'react-router-dom'
import whiteLogo from '../assets/images/JamMateLogoWhiteAlbum.png';
import exodusLogo from '../assets/images/JamMateLogoExodus.png';
import weezerLogo from '../assets/images/JamMateLogoWeezer.png';
import lovelessLogo from '../assets/images/JamMateLogoLoveless.png';
import disciplineLogo from '../assets/images/JamMateLogoDiscipline.png';

const theme = Math.floor(Math.random() * (5) );
var logo = null;
var dynamicClassName = '';
switch (theme) {
  case 0:
    //theme is the Beatles' white album
    logo = whiteLogo;
    dynamicClassName = 'bg-white border-b border-gray400';
    break;
  case 1:
    //theme is Bob Marley's Exodus
    logo = exodusLogo;
    dynamicClassName = 'bg-exodusgold border-b border-red700';
    break;
  case 2: 
  //theme is Weezer's Blue Album
    logo = weezerLogo;
    dynamicClassName = 'bg-weezerblue border-b border-weezerblue';
    break;
  case 3:
    //theme is My Bloody Valentine's Loveless
    logo = lovelessLogo;
    dynamicClassName = 'bg-lovelesspink border-b border-lovelessblack';
    break;
  case 4: 
    //theme is King Crimson's Discipline
    logo = disciplineLogo
    dynamicClassName = 'bg-disciplinered border-b border-disciplinered';
    break;
  default:
    logo = whiteLogo;
    dynamicClassName = 'bg-white border-b border-gray400';
    break;
}
console.log(dynamicClassName);





const Homebar = () => {
  return (
    <nav className= {dynamicClassName}>
      <div className='mx-auto max-w-7x1 px-2 sm:px6 lg:px-8'>
        <div className='flex h-20 items-center justify-center xl:justify-between'>
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

export default Homebar