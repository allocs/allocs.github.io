import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import portfolioHeader from '../assets/images/Portfolio Header.png';
import videosHeader from '../assets/images/Video Header.png';
import artHeader from '../assets/images/Art Header.png';
//imports for pieces of Art
import Artwork1 from '../assets/images/Bella Cartoon.png';
import Artwork2 from '../assets/images/Self portrait.png';
import Artwork3 from '../assets/images/Pydjum Valentines less texture.png';
import kalecabbagebrocolli from '../assets/images/Kale, Cabbage, Brocolli.jpg';
import waitingRoom from '../assets/images/publicDefenderWeWillBeRightBack.png';
import wispdIntro from '../assets/images/wispd_intro.gif'
import { Rnd } from 'react-rnd';

//calculate the starting x and ys as well of the various things
//im gonna calculate a cluster center (marked by the label, not really quite a center) based on the screen width, and the elements will base their x/y on that
//an ipad pro's width is 1024. That seems like a good cut off
const portfolioCoords = [15, 15];
const videoCoords = [19,200];
const artCoords = [19,1100];
const videoDims = [384,216, .8];
const spacing = [0,225];
if (screen.width > 1024){
    portfolioCoords[0] = screen.width*(0.35);
    portfolioCoords[1] = 15;
    videoCoords[0] = 10;
    videoCoords[1] = 100;
    artCoords[0] = screen.width*.4;
    artCoords[1] = 98;
    videoDims[0] = 480;
    videoDims[1] = 270;
    videoDims[2] = 1;
    spacing[0] = screen.width*.2;
    spacing[1] = 135;
}

const Portfolio = () => {
  return (
    <div className="flex h-full bg-cork bg-fixed bg-repeat">

            <Rnd
                className='col-span-2'
                default={{
                x: portfolioCoords[0],
                y: portfolioCoords[1],
                width: 300,
                height: 180,
                }}
                lockAspectRatio={true}
                minWidth={100}

            >
                <img
                    className='h-full w-full pixel'
                    src={portfolioHeader}
                    alt='Index card that says "Portfolio"'
                    draggable='false'
                /> 
            </Rnd>
            <Rnd
                default={{
                x: videoCoords[0],
                y: videoCoords[1],
                width: 200,
                height: 200,
                }}
                lockAspectRatio={true}
                minWidth={100}

            >
                <img
                    className='h-full w-full pixel'
                    src={videosHeader}
                    alt='Sticky note that says "Videos"'
                    draggable='false'
                /> 
            </Rnd>
            <Rnd
                default={{
                x: artCoords[0] + spacing[0],
                y: artCoords[1],
                width: 200,
                height: 200,
                }}
                lockAspectRatio={true}
                minWidth={100}

            >
                <img
                    className='h-full w-full pixel'
                    src={artHeader}
                    alt='Sticky note that says "art"'
                    draggable='false'
                /> 
            </Rnd>
            <Rnd
                default={{
                x: videoCoords[0] - 5 + spacing[0],
                y: videoCoords[1] + spacing[1],
                width: videoDims[0],
                height: videoDims[1],
                }}
                lockAspectRatio={true}
                minWidth={100}

            >   
                <iframe className='h-full w-full p-4'  src="https://www.youtube.com/embed/6tet8p_UsPA?si=QVSXStb9lp-oNwIu" title="Growth" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                </iframe>
            </Rnd>
            <Rnd
                default={{
                x: videoCoords[0] - 10,
                y: videoCoords[1] + (spacing[1]*2),
                width: videoDims[0],
                height: videoDims[1],
                }}
                lockAspectRatio={true}
                minWidth={100}
                className='justify-center'

            >

                <iframe className='h-full w-full p-4'  src="https://www.youtube.com/embed/HXku_5jckAM?si=lsKfOMFmcBNaTF6n" title="Bella's family" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                </iframe>
            </Rnd>
            <Rnd
                default={{
                x: videoCoords[0] +3 + spacing[0],
                y: videoCoords[1] + (spacing[1]*3),
                width: videoDims[0],
                height: videoDims[1],
                }}
                lockAspectRatio={true}
                minWidth={100}

            >

                <iframe className='h-full w-full p-4'  src="https://www.youtube.com/embed/1d7fDApiG3M?si=1fYZRXktJoncHKCL" title="Between the Lines Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                </iframe>
            </Rnd>
                        < Rnd
                default={{
                x: artCoords[0] ,
                y: artCoords[1] + spacing[1],
                width: videoDims[0],
                height: videoDims[1],
                }}
                lockAspectRatio={true}
                minWidth={100}

            >
                <img
                    className='h-full w-full'
                    src={waitingRoom}
                    alt='Art made for the Wisconsin State Public Defenders Office depicting Gideon, Lady Liberty, and Lady Justice in a waiting room.'
                    draggable='false'
                /> 
            </Rnd>
            <Rnd
                default={{
                x: artCoords[0] - 10 + spacing[0],
                y: artCoords[1] + spacing[1]*2,
                width: 476 * videoDims[2],
                height: 378 * videoDims[2],
                }}
                lockAspectRatio={true}
                minWidth={100}

            >
                <img
                    className='h-full w-full'
                    src={kalecabbagebrocolli}
                    alt='A still life of kale, cabbage, and brocolli'
                    draggable='false'
                /> 
            </Rnd>
            < Rnd
                default={{
                x: artCoords[0] + 2 ,
                y: artCoords[1] + spacing[1]*3 + 120,
                width: videoDims[0],
                height: videoDims[1],
                }}
                lockAspectRatio={true}
                minWidth={100}

            >
                <img
                    className='h-full w-full pixel'
                    src={wispdIntro}
                    alt='Gif of a simple animation made for the Wisconsin State Public Defenders Office using their logo.'
                    draggable='false'
                /> 
            </Rnd>
            <div className='h-[2200px] md:h-full'></div>
    </div>
  );
    <div className='flex flex-col'>
        <div className= 'flex w-screen justify-between '>
            <img
                className='h-[272px] w-[432px] p-16 .pixelated'
                src={portfolioHeader}
                alt='Portfolio'
            /> 
        </div>

        <div className='flex flex-wrap bg-cork'>
            <img
                className='h-[272px] w-[272px] p-16 .pixelated'
                src={videosHeader}
                alt='Portfolio'
            /> 
        
            <iframe className='p-12 md:p-16' width="560" height="315" src="https://www.youtube.com/embed/6tet8p_UsPA?si=QVSXStb9lp-oNwIu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
            <iframe className='p-12 md:p-16' width="560" height="315" src="https://www.youtube.com/embed/HXku_5jckAM?si=lsKfOMFmcBNaTF6n" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
            <iframe className='p-12 md:p-16' width="560" height="315" src="https://www.youtube.com/embed/kr5vC9QV-y8?si=UGTehRTiAo3ta6Ae" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
            <iframe className='p-12 md:p-16' width="560" height="315" src="https://www.youtube.com/embed/1d7fDApiG3M?si=1fYZRXktJoncHKCL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
        </div>
        <div className='flex flex-wrap bg-cork'>
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

            </NavLink>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/Portfolio'>
                <img
                    className='h-[350px] w-auto p-16'
                    src={Artwork2}
                    alt='A fauvist illustration of myself done digitally in high chroma blues and magentas'
                />

            </NavLink>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/Portfolio'>
                <img
                    className='h-[360px] md-h-[480px] w-auto pl-16 py-16 md:p-16'
                    src={Artwork3}
                    alt='A sheet of Valentines Day cards featuring my dove, Pidgey. They read "I Dove You", "You Are So Coo!", and "You Make My Heart Soar".'
                />

            </NavLink>
        </div>
    </div>

  
}

export default Portfolio