import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import resume from '../assets/images/Alexandra Jans - Resume.png';
import bannerBottom from '../assets/images/aboutBannerBottom.png';
import bannerMiddle from '../assets/images/aboutBannerMiddle.png';
import bannerTop from '../assets/images/aboutBannerTop.png';
import { Parallax, ParallaxProvider, } from 'react-scroll-parallax';

const Nowhere = () => {

return(
    <div className='bg-[#31406E] w-full h-screen '>

    <ParallaxProvider scrollAxis='vertical'>
        <Parallax speed={-99999} className='bg-[#31406E] w-full h-screen'/>
        <Parallax speed={-60} className='overflow-hidden absolute inset-0 w-full h-auto'>
                <img  className='w-full' src={bannerBottom}>
                </img>
        </Parallax> 
        <Parallax speed={-40} className='overflow-hidden absolute inset-0 w-full h-auto'>
                <img  className='w-full' src={bannerMiddle}>
                </img>
        </Parallax> 
        <Parallax speed={-20} className='overflow-hidden absolute inset-0 w-full h-auto'>
                <img  className='w-full' src={bannerTop}>
                </img>
        </Parallax>   
            {/* <Parallax speed={-40} className="overflow-x-hidden absolute w-screen inset-0 bg-cover bg-fixed parallax-bg bg-[url('/src/assets/images/aboutBannerMiddle.png')]"/> */}
            {/* <Parallax speed={-20} className="overflow-x-hidden absolute w-screen inset-0 bg-cover bg-fixed parallax-bg bg-[url('/src/assets/images/aboutBannerTop.png')]"/> */}
            <Parallax speed={0} className='absolute inset-0'>
                <div className='flex w-auto h-auto '>
                <div className='grid grid-cols-3 gap-2  text-center text-[#CEECCF] text-4xl h-screen w-screen'>
                <NavLink className='relative flex text-[#CEECCF] text-xl col-span-3' to='/'>
                    Back
                </NavLink>
                <div className='h-64 col-span-3'></div>
                    <div className='text-4xl text-left w-32' >
                        about alex jans
                    </div>
                    <div className='relative flex-column justify-center items-end p-4 text-left'>
                        <div className='p-16 xl:p-32 text-center'>
                            Hi! I'm Alex. I made this website to share some of the things I make.
                        </div>
                        <div className='h-1/4'/>
                        <div className='p-4 text-lg'>
                            I do a lot of random art, so my portfolio is a mix of some videos, some images, and a game.
                        </div>
                        <div className='p-4 text-lg'>
                            This website is also a portfolio piece. It has gotten me a lot more experience with HTML, CSS, JavaScript, etc.
                        </div>
                        <div className='p-4 text-lg'>
                            On top of all the art assets I made.
                        </div>
                        <div className='p-4 text-lg'>
                            Even the sketches and studies you see behind the text here.
                        </div>
                        <div className='p-4 text-lg'>
                            I don't know what else to write here as I feel that the website shows you plenty to get to know me...
                        </div>
                         <div className='p-4 text-lg'>
                            <NavLink className='flex flex-shrink-0 mr-4' to='/Resume'>
                            ...so here is my resume. 
                            </NavLink>
                        </div>
                        <div className='p-4'>
                            Thanks for visiting!
                        </div>
                    </div>
                    <div className='flex w-1/4'>
                        
                    </div>
                </div>
            </div>
            </Parallax>
    </ParallaxProvider>
    </div>
)

// return(
//     <div className='h-full bg-fixed bg-[#31406E]'>
//         <div className="h-screen bg-fixed bg-center bg-cover bg-[url('/src/assets/images/aboutBannerBottom.png')] transform-3d perspective" >

//             <img
//                 className='absolute w-full h-auto translate-z-4'
//                 src={bannerMiddle}
            
//             />
//             <img
//                 className='absolute w-full h-auto translate-z-8'
//                 src={bannerTop}
            
//             />
//             <div className='absolute items-center justify-center'>
                
//             </div>
//         </div>   

//     </div>
// )

//   return (
//     <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8 bg-cork'> 
//         <div className='p-4 md:p-8' >
//             <div className='font-serif bg-[#f8f7ed] p-4 md:p-8'>
//                 <div className='text-2xl'>
//                     Hello! I'm Alex!
//                 </div>
//                 <br/>
//                 <div className='text-lg'>
//                     I am what happens if you take an art-person and teach them how to code. <br/><br/>
//                     I made this website to share the things I make, either coding projects, videos, drawings, paintings, whatever. <br/><br/>
//                     It is also a portfolio, where I can show things I made money making. <br/><br/>
//                     Yes, it is supposed to be a bit weird looking. I guess I am going for some sort of nostagic simulacrum vibe, but I don't want to write an artist's statement for a website.<br/><br/>
//                 </div>
//             </div>
//         </div>
//         <div>
        
//         </div>
//         <div className='p-4 md:p-8' >
//             <div className='font-serif bg-[#f8f7ed] p-4 md:p-8'>
//                 <div className='text-2xl'>
//                     Contact info:
//                 </div>
//                 <br/>
//                 <div className='text-lg'>
//                     If you want to get in touch, the best way is probably e-mail at alexandracjans@gmail.com. <br/><br/>
//                     Don't send me any pigeon mail. I will be keeping the pigeons. <br/><br/><br/><br/>
//                 </div>
//             </div>
//         </div>
//         <div className=''>
//             <NavLink className='flex flex-shrink-0 mr-4' to='/Resume'>
//                 <img
//                     className='h-[475px] md:h-[720px] w-auto p-16'
//                     src={resume}
//                     alt="My resume is here. It isn't particularly impressive"
//                 />
//             </NavLink>
//         </div>
//     </div>
//   )
}

export default Nowhere