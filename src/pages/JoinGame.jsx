import React from 'react'
import {Peer } from 'peerjs';
import { useEffect, useState, useRef } from 'react';
import InstrumentCard from '../components/InstrumentCard';
import prompts from '../prompts.json';
import chordProgressions from '../chordProgressions.json'
import ChordCard from '../components/ChordCard';  



const JoinGame = () => {
    const [userName, setUserName] = useState('');
    const [playerNumber, setPlayerNumber] = useState('');
    const [room, setRoom] = useState('');
    //const peerInstance = useRef(null);
    var [conn, setConn] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [waitingRoom, setWaitingRoom] = useState(false);
    const [inst, setInst] = useState(-1);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeSig, setTimeSig] = useState(0);
    const [bpm, setBpm] = useState('0');
    const [key, setKey] = useState('-1');
    const [chordProgression, setChordProgression] = useState(-1);
    const [chordLights, setChordLights] = useState([]);
    const keys = ['C major','A minor','G major','E minor','D major','B minor','A major','F# minor','E major','C# minor','B major','Ab minor','F# major','Eb minor','Db major','Bb minor','Ab major','F minor','Eb major','C minor','Bb major','G minor','F major','D minor'];
    const timeSignatures = [['4','4'],['3','4'],['6','8'], ['12','8'],['2','4'],['7','4'],['5','4'],['11','8']];
    const [myPrompts, setMyPrompts] = useState([]);
    var playerPrompts = [];
    
    const peer = new Peer();


    useEffect(() => {
      if (conn != null){
        conn.on('data', function (data) {
            console.log(data, 'data');
            switch (data.charAt(0)){
              case 'R':
                setIsConnected(true);
                setPlayerNumber(data.charAt(1));
                //initializeGame();
                break;
              case 'D':
                console.log('Leaving');
                setIsConnected(false);
                setWaitingRoom(false);
                setConn(null);
                peer.destroy();
                break
              case 'T':
                let newTimeSig = data.substring(1);
                setTimeSig(newTimeSig);
                break;
              case 'B':
                setGameStarted(true);
                let newBpm = data.substring(1);
                setBpm(newBpm)
                break;
              case 'K':
                let newKey = parseInt(data.substring(1));
                setKey(newKey);
                break;
              case 'P':
                const newMyPrompt = parseInt(data.substring(1));
                const newMyPrompts = [...playerPrompts, newMyPrompt];
                setMyPrompts([...newMyPrompts]);
                playerPrompts = newMyPrompts;
                break;
              case 'C':
                let newChordProgression = parseInt(data.substring(1));
                setChordProgression(newChordProgression);
                break;
              case 'S':
                //new starting chord
                currentChord.current = parseInt(data.substring(1));
                let newChordLights = [];
                while(newChordLights.length < chordProgressions[chordProgression]?.scaleDegrees.length){
                  newChordLights.length ==  parseInt(data.substring(1))?newChordLights.push(true):newChordLights.push(false);
                }
                setChordLights(
                  [...newChordLights]
                );
                break;
              case 'M':
                //start metronome
                break;
              case 'N':
                //pause metronome
                break;
              case 'X':
                setGameStarted(false);
                const newEmptyArray = [];
                setMyPrompts([...newEmptyArray]);
                break;
              case 'E':
                setWaitingRoom(false);
                alert('This name is taken');
                break;
              default:
                break;
            };

        })
        conn.on('close', function() {
          setIsConnected(false);
          setWaitingRoom(false);
        })
    }

    }, [conn])

    function handleConnect(roomID){

      console.log(peer);
      const newConn = peer.connect(roomID);
      setConn(newConn);
      console.log(userName);
      console.log(newConn.peer);
      console.log(peer);
      newConn.on('open', function() {
        setIsConnected(true);
      });
      newConn.on('data', function (data) {
        console.log(data, 'data')
        switch (data.charAt(0)){
          case 'R':
            setIsConnected(true);
            setPlayerNumber(data.charAt(1));
            //initializeGame();
            break;
          case 'D':
            console.log('Leaving');
            setIsConnected(false);
            setWaitingRoom(false);
            setConn(null);
            peer.destroy();
            break
          default:
            break;
        };


      });
    }
    
    function handlePing() {
      if(conn != null)
        conn.send('Ping');
      console.log('Ping sent!');
    }
    
    function initializeGame(){
      console.log('Setting up game');
      console.log('Sending username');
      conn.send("U" + userName);
      setWaitingRoom(true);
    }

    function changeInst(goal){
      setInst(goal);
      console.log(goal);
      conn.send("I" + goal + playerNumber);
    }

if (gameStarted){
  return (
    <div className='border border-b-8 border-backgroundblack bg-backgroundblack h-screen'>
      <div className='flex space-x-16 bg-buttongold items-center border-8 border-backgroundblack'>
        <div className='text-outlinebrown text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold py-2  justify-center  w-screen'>
          <div className='grid grid-cols-2 gap-4 place-content-center'>
            <div className='mx-auto'>
              <div className='flex flex-col justify-center text-xl xl:text-3xl mx-auto'>
                <div className='border-b-2 border-backgroundgray text-center'>{timeSignatures[timeSig][0]}</div>
                <div className='text-center'>{timeSignatures[timeSig][1]}</div>
              </div>
            </div>
            <div> {bpm} bpm </div>
            
            <div className='text-center'>
              {chordProgressions[chordProgression].name}
            </div>
            <div className='flex flex-wrap'>
              in {keys[key]} <br/>
            </div>
          </div>
          
          
        </div>
      </div>
      <div className='flex-col  w-screen bg-backgroundgray text-offwhite text-lg md:text-xl lg:text-2xl text-center border-8 border-backgroundblack'>
        {
          prompts && prompts.map( prompt => {
            if (prompt.id == myPrompts[myPrompts.length-2]){
              return(
                <div className= '' key = {prompt.id}>
                  {prompt.prompt}
                </div>
              )
            }
          })
        } <br/>
        {
          prompts && prompts.map( prompt => {
            if (prompt.id == myPrompts[myPrompts.length-1]){
              return(
                <div className= '' key = {prompt.id}>
                  {prompt.prompt}
                </div>
              )
            }
          })
        } <br/>
        <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-8 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={0} isSelected={(chordLights.length>0)?chordLights[0]:false} onSelect={console.log(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={1} isSelected={(chordLights.length>1)?chordLights[1]:false} onSelect={console.log(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={2} isSelected={(chordLights.length>2)?chordLights[2]:false} onSelect={console.log(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={3} isSelected={(chordLights.length>3)?chordLights[3]:false} onSelect={console.log(0)}/>
    </div>
    <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-8 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={4} isSelected={(chordLights.length>4)?chordLights[4]:false} onSelect={console.log(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={5} isSelected={(chordLights.length>5)?chordLights[5]:false} onSelect={console.log(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={6} isSelected={(chordLights.length>6)?chordLights[6]:false} onSelect={console.log(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={7} isSelected={(chordLights.length>7)?chordLights[7]:false} onSelect={console.log(0)}/>
    </div>
    <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-8 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={8} isSelected={(chordLights.length>8)?chordLights[8]:false} onSelect={console.log(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={9} isSelected={(chordLights.length>9)?chordLights[9]:false} onSelect={console.log(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={10} isSelected={(chordLights.length>10)?chordLights[10]:false} onSelect={console.log(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={11} isSelected={(chordLights.length>11)?chordLights[11]:false} onSelect={console.log(0)}/>
    </div>
      </div>
    </div>
  )}
  else return (
    <div className='h-screen bg-backgroundblack'>
        <hr />
        <>{ waitingRoom
          ? <div className='grid grid-cols-2 place-items-center bg-backgroundblack border-8 border-backgroundblack h-screen'>
            {/* I am putting comments here bc this is gonna be hard to track. I (without really checking what Tailwind and bootstrap were) 
            straight up uninstalled tailwind and installed bootstrap to try and get a nice radio button thing, but it didnt work, so i then
            uninstalled bootstrap and reinstalled tailwind and i am just gonna do it manually in a way that makes sense. */}
            <InstrumentCard inst = {0} selected = {inst} onSelect={() => changeInst(0)}/>
            <InstrumentCard inst = {1} selected = {inst} onSelect={() => changeInst(1)}/>
            <InstrumentCard inst = {2} selected = {inst} onSelect={() => changeInst(2)}/>
            <InstrumentCard inst = {3} selected = {inst} onSelect={() => changeInst(3)}/>
            <InstrumentCard inst = {4} selected = {inst} onSelect={() => changeInst(4)}/>
            <InstrumentCard inst = {5} selected = {inst} onSelect={() => changeInst(5)}/>

          </div>
          :<>{ isConnected 
            ? <div className='flex h-screen space-x-8 items-center bg-backgroundgray border-8 border-backgroundblack py-4'>
            <div className='flex flex-wrap flex-col xl:flex-row space-x-8 items-center m-auto'> 
            <div className='text-xl lg:text-2xl bg-buttongold text-center hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full'>
            Set a Username:
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)}  />
            </div>
                  
                <button className='text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full' onClick={() => initializeGame()}>Confirm</button>
              </div> 
              </div>    
            : <div className='flex h-screen space-x-8 items-center bg-backgroundgray border-8 border-backgroundblack py-4'>
              <div className='flex flex-wrap flex-col xl:flex-row space-x-8 items-center m-auto'>
                <div className='text-xl lg:text-2xl bg-buttongold text-center hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full'>
                  ENTER A ROOMCODE: <input type="text" value={room} onChange={e => setRoom(e.target.value)} />
                </div>
                
                
                <button className='text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full' onClick={() => handleConnect(room)}>CONNECT</button>
              </div>
              </div>
          } </>
        
        }</>

        <br/>
    </div>
  )
}


export default JoinGame