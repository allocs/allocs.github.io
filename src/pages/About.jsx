import React from 'react'

const About = () => {
  return (
    <div className='bg-backgroundblack h-screen w-screen'>
      <div className='bg-buttongold text-outlinebrown text-2xl text-center md:text-4xl lg:text-6xl xl:text-8xl font-bold py-2 justify-self-stretch mx-auto'>
        About JamMate
      </div>
      <div className='text-offwhite text-base pl-16'>
        <br/>
        This is the first game made by Studio Pydjy (Pronounced Studio Pidgey). All of the coding and art has been done by Alex Jans <br/>
        with a lot of advice and suggestion from Bella Angiola and Connor Jans. <br/>
        It is a little party game for musicians to hopefully take some of the anxiety and self-doubt out of jam sessions by gamifying it a little <br/>
        I hope you enjoy, and if you want to find me, here if where you can do that: <br/>
        <br/>
        <div className='text-bold pl-16' >
          <a className='text-bold' href="https://github.com/allocs">GitHub</a> <br/>
          <a className='text-bold' href="https://github.com/allocs/allocs.github.io">JamMate's Repo</a> <br/>
          <a className='text-bold' href="https://www.linkedin.com/in/alex-c-jans/">LinkedIn</a> <br/> 
        </div>
        <br/>
        I'm also going to make a little video on the process because my (Alex Jans') second major outside of Computer Science was <br/> 
        Communication Arts, and it seems like a nice way of showing my process and what this project took. Plus I am hoping to get <br/>
        some help from a very old friend which would be nice to show. <br/>
      </div>
    </div>
  )
}

export default About