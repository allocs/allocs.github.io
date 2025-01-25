import React from 'react'

const HowTo = () => {
  return (
    <div className='font-mono bg-backgroundblack  md:h-[calc(100vh-81px)] w-screen'>
    <div className='bg-buttongold text-outlinebrown text-2xl text-center md:text-4xl lg:text-6xl xl:text-8xl font-bold py-2 justify-self-stretch mx-auto'>
      How To Play
    </div>
    <div className='text-offwhite text-base leading-relaxed p-8'>
      One player will click "Host A Game" in the main menu, giving you a room code. This is best to do on a device with a larger screen so everyone can see it <br/><br/>
      On other devices, the other bandmates will be able to then click "Join A Game" and enter that room <br/><br/>
      Once players enter, they pick a display name and what instrument they are going to play (or whatever is closest) <br/><br/>
      When everyone is in, the Host can start the game, giving the jam a tempo, time signature, key, and chord progression. Each of these can be rerolled by the Host as many times as y'all would like <br/><br/>
      Each player will also get to prompts for their instrument to guide their playing a little more. Feel free to follow these as much or as little as you'd like <br/><br/>
      Once everyone is ready, the host can play start to start a metronome to help players stay on the right chord. The host can pause it whenever, or even choose a different bar to start on 
    </div>
  </div>
  )
}

export default HowTo