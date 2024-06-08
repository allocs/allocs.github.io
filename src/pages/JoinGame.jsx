import React from 'react'
import {Peer } from 'peerjs';
import { useEffect, useState, useRef } from 'react';
import InstrumentCard from '../components/InstrumentCard';
import prompts from '../prompts.json';



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
    const [bpm, setBpm] = useState('0');
    const [key, setKey] = useState('-1');
    const keys = ['C major','A minor','G major','E minor','D major','B minor','A major','F# minor','E major','Db minor','B major','Ab minor','F# major','Eb minor','Db major','Bb minor','Ab major','F minor','Eb major','C minor','Bb major','G minor','F major','D minor'];
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
              case 'X':
                setGameStarted(false);
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
      <div className='flex space-x-16 w-screen bg-buttongold items-center border-8 border-backgroundblack'>
        <div className='bg-buttongold text-outlinebrown text-4xl font-bold py-2   '>
          {bpm} bpm, <br/>
          {keys[key]} <br/>
        </div>
      </div>
      <div className='flex-col space-x-16 px-4 w-screen bg-backgroundgray text-offwhite text-2xl justify-center border-8 border-backgroundblack'>
        {
          prompts && prompts.map( prompt => {
            if (prompt.id == myPrompts[0]){
              return(
                <div className= 'justify-center' key = {prompt.id}>
                  {prompt.prompt}
                </div>
              )
            }
          })
        } <br/>
        {
          prompts && prompts.map( prompt => {
            if (prompt.id == myPrompts[1]){
              return(
                <div className= 'justify-center' key = {prompt.id}>
                  {prompt.prompt}
                </div>
              )
            }
          })
        } <br/>
      </div>
    </div>
  )}
  else return (
    <div>
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
            <div className='flex space-x-8 items-center m-auto'> 
            <div className='text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full'>
            Set a Username:
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)}  />
            </div>
                  
                <button className='text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full' onClick={() => initializeGame()}>Confirm</button>
              </div> 
              </div>    
            : <div className='flex h-screen space-x-8 items-center bg-backgroundgray border-8 border-backgroundblack py-4'>
              <div className='flex space-x-8 items-center m-auto'>
                <div className='text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full'>
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