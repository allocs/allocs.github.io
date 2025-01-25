import React from 'react'
import { NavLink } from 'react-router-dom'
import homeIcon from '../assets/images/JamMateHome.png';
import whiteLogo from '../assets/images/JamMateLogoWhiteAlbum.png';
import exodusLogo from '../assets/images/JamMateLogoExodus.png';
import weezerLogo from '../assets/images/JamMateLogoWeezer.png';
import lovelessLogo from '../assets/images/JamMateLogoLoveless.png';
import disciplineLogo from '../assets/images/JamMateLogoDiscipline.png';
import logo77 from '../assets/images/JamMateLogo77.png';
import bleachLogo from '../assets/images/JamMateLogoBleach.png';
import blurLogo from '../assets/images/JamMateLogoBlur.png';
import bratLogo from'../assets/images/JamMateLogoBrat.png';
import channelOrangeLogo from '../assets/images/JamMateLogoChannelOrange.png';
import comedownMachineLogo from '../assets/images/JamMateLogoComedownMachine.png';
import darkSideLogo from '../assets/images/JamMateLogoDarkSideOfTheMoon.png';
import goodNewsLogo from '../assets/images/JamMateLogoGoodNews.png';
import igorLogo from '../assets/images/JamMateLogoIgor.png';
import isThisItLogo from '../assets/images/JamMateLogoIsThisIt.png';
import neverMindTheBollocksLogo from '../assets/images/JamMateLogoNeverMindTheBollocks.png';
import prideLogo from '../assets/images/JamMateLogoPride.png';
import pureGuavaLogo from '../assets/images/JamMateLogoPureGuava.png';
import purpleRainLogo from '../assets/images/JamMateLogoPurpleRain.png';
import thePodLogo from '../assets/images/JamMateLogoThePod.png';
import theSmithsLogo from '../assets/images/JamMateLogoTheSmiths.png';
import whenThePawnLogo from '../assets/images/JamMateLogoWhenThePawn.png';
import wallsocketLogo from '../assets/images/JamMateLogoWallsocket.png';

const numberOfThemes = 23;

const theme = Math.floor(Math.random() * (numberOfThemes) );

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
  case 5: 
    //theme is Talking Heads 77
    logo = logo77
    dynamicClassName = 'bg-77red border-b border-77red';
    break;
  case 6: 
    //theme is Nirvana's Bleach
    logo = bleachLogo
    dynamicClassName = 'bg-black border-b border-black';
    break;
  case 7: 
    //theme is blur's blur
    logo = blurLogo
    dynamicClassName = 'bg-blurorange border-b border-blurorange';
    break;
  case 8: 
    //theme is charlie xcx's brat
    logo = bratLogo
    dynamicClassName = 'bg-bratgreen border-b border-bratgreen';
    break;
  case 9: 
    //theme is Frank Ocean's Channel Orange
    logo = channelOrangeLogo
    dynamicClassName = 'bg-channelorange border-b border-channelorange';
    break;

  case 10:
    //theme is Pink Floyd's darkside of the moon
    logo = darkSideLogo;
    dynamicClassName = 'bg-darksideblack border-b border-darksideblack';
    break;
  case 11:
    //theme is Good news for people who like bad news by modest mouse
    logo = goodNewsLogo;
    dynamicClassName = 'bg-goodnewsgreen border-b border-goodnewsgreen';
    break;
  case 12:
    //theme is IGOR by Tyler, the Creator
    logo = igorLogo;
    dynamicClassName = 'bg-igorpink border-b border-igorpink';
    break;
  case 13:
    //theme is Is This It by the STrokes
    logo = isThisItLogo;
    dynamicClassName = 'bg-white border-b border-gray400';
    break;
  case 14:
    //theme is Never mind the bollocks its the Sex Pistols
    logo = neverMindTheBollocksLogo;
    dynamicClassName = 'bg-nevermindthebollocksyellow border-b border-nevermindthebollocksyellow';
    break;
  case 15:
    //theme is trans pride :)
    logo = prideLogo;
    dynamicClassName = 'bg-prideblue border-b border-prideblue';
    break;
  case 16:
    //theme is Pure Guava by Ween
    logo = pureGuavaLogo;
    dynamicClassName = 'bg-pureguavaorange border-b border-pureguavaorange';
    break;
  case 17:
    //theme is Purple Rain by Prince
    logo = purpleRainLogo;
    dynamicClassName = 'bg-black border-b border-black';
    break;
  case 18:
    //theme is the Pod by Ween
    logo = thePodLogo;
    dynamicClassName = 'bg-thepodtan border-b border-thepodtan';
    break;
  case 19:
    // theme is the Smiths
    logo = theSmithsLogo;
    dynamicClassName = 'bg-thesmithspurple border-b border-thesmithspurple';
    break;
  case 20:
    //theme is When The Pawn... by Fiona Apple
    logo = whenThePawnLogo;
    dynamicClassName = 'bg-whenthepawnred border-b border-whenthepawnred';
    break;
  case 21:
    //theme is Wallsocket by Underscores
    logo = wallsocketLogo;
    dynamicClassName = 'bg-wallsocketblue border-b border-wallsocketblue';
    break;
  case 22: 
    //theme is the Stroke's comedown machine
    logo = comedownMachineLogo
    dynamicClassName = 'bg-comedownmachinered border-b border-comedownmachinered';
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
        <div className='flex h-20 items-center justify-between  xl:justify-between'>
          <div className='flex flex-1 items-center justify-between md:items-stretch md:justify-start'>
          <NavLink className='flex flex-shrink-0 items-center mr-4' to='/JamMate'>
              <img
                  className='h-12 md:h-16 w-auto'
                  src={logo}
                  alt='JamMate'
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

export default Homebar