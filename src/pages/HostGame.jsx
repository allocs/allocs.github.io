import React from 'react'
import Peer from 'peerjs';
import HostCard from '../components/HostCard';
import { useEffect, useState, useRef } from 'react';
import prompts from '../prompts.json';

const HostGame = () => {
  const [peerId, setPeerId] = useState('...');
  const [dataConnections,setDataConnections] = useState([]);
  const [bandMateNames, setBandMateNames] = useState([]);
  const [bandMateInsts, setBandMateInsts] = useState([]);
  var waitingForName = false;
  const [gameStarted, setGameStarted] = useState(false);
  const [bpm, setBpm] = useState('0');
  const [key, setKey] = useState('-1');
  const instrumentBoundaries = [2,5,8,11,14,17]
  const keys = ['C major','A minor','G major','E minor','D major','B minor','A major','F# minor','E major','Db minor','B major','Ab minor','F# major','Eb minor','Db major','Bb minor','Ab major','F minor','Eb major','C minor','Bb major','G minor','F major','D minor'];


    useEffect(() => {
      //just in case I decide to make a filter for profanity, I could edit this to take out vowels or something. if not, i will just use "= Math.random().toString(36).slice(2,6);"
      const charsForRoomCode =  ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
      //create a 4 character room code
      const roomCode = charsForRoomCode[Math.floor(Math.random() * (charsForRoomCode.length))] + charsForRoomCode[Math.floor(Math.random() * (charsForRoomCode.length))] + charsForRoomCode[Math.floor(Math.random() * (charsForRoomCode.length))] + charsForRoomCode[Math.floor(Math.random() * (charsForRoomCode.length))]
      const peer = new Peer(roomCode);
      var myDataConnections = [];


      //creates a 4 character long random alphanumeric string for the id
      //const peerId = Math.random().toString(36).slice(2,6)

      peer.on('open', function () {
        setPeerId( roomCode);
        console.log(peer, 'peer'); //I was checking that peer takes an id as input lol

      });

      peer.on('connection', function (conn) {
        console.log('connection found');
        console.log(conn.peer, 'conn.peer');
        console.log(conn, 'conn');
        //make sure conn isn't already in dataConnections
        let isNewDataConnection = true;
        for(let i = 0; i < myDataConnections.length; i++){
          if (myDataConnections[i].peer == conn.peer) {
            isNewDataConnection = false;
            break;
          }
        }
        if (isNewDataConnection){
          setDataConnections((
            dataConnections => [...dataConnections, conn]
          ));
          setBandMateInsts(bandMateInsts => [...bandMateInsts, -1]); 
          myDataConnections.push(conn);
        }
        waitingForName = true;
        console.log(waitingForName);
        conn.on('open', function(){
          conn.send('R' + (myDataConnections.length - 1));

        })
        conn.on('data', function(data) {
          switch(data.charAt(0)){
            case '':
              console.log('got empty data')
              break;
            case 'U':
              //receiving a username
              console.log(data);
              if (waitingForName){ 
                let name = data.substring(1);
                setBandMateNames(
                  bandMateNames => [...bandMateNames, name]
                )
                waitingForName = false;
                break;
              }
              break; 
            case 'I':
              //receiving an instrument
              console.log(data, 'data');
              console.log('new Inst');
              const newInst = parseInt(data.charAt(1));
              const name = data.charAt(2);
              let bandMateInstruments = bandMateInsts;
              bandMateInstruments[name] = newInst;
              //need a new object to pass in, hense the ...
              setBandMateInsts(
                bandMateInsts => 
                  [...bandMateInsts.slice(0,name),
                    newInst,
                    ...bandMateInsts.slice(name+1)
                  ]
                );
              break;      
            default:
              console.log(data, 'data');
              console.log(dataConnections, 'dataConnections');
              console.log(bandMateNames, 'bandMateNames');
              console.log(bandMateInsts, 'bandMateInsts')
              break;
          }

        });
        conn.on('close', function () {
          console.log('closing ' + conn.peer);
          const connIndex = myDataConnections.indexOf(conn);
          myDataConnections.splice(connIndex, 1);
          setDataConnections(dataConnections => {
            return dataConnections.filter((value, i) => i !== connIndex)
          });
          for(let i = 0; i < myDataConnections.length; i++){
            myDataConnections[i].send('R' + i);
          }
          setBandMateNames(bandMateNames => {
            return bandMateNames.filter((value, i) => i !== connIndex)
          }
          );
          setBandMateInsts(bandMateInsts => {
            return bandMateInsts.filter((value, i) => i !== connIndex)
          });
          conn = null;
        });
      });
      peer.on('disconnected', function () {
        console.log('Connection lost. Please reconnect');

        // Workaround for peer.reconnect deleting previous id
        // peer.id = lastPeerId;
        // peer._lastServerId = lastPeerId;
        peer.reconnect();
      });
    }, [])

    function sendPing(){
      console.log('Starting game');
      for(let j = 0; j < dataConnections.length; j++){
        let conn = dataConnections[j];
        conn.send('Starting')
      }

    }

    function sendKick(kickeeIndex){
      console.log('Kicking player ' + kickeeIndex);
            
      // //send a message to make that user peer.destroy
      let kickee = dataConnections[kickeeIndex];
      console.log(kickee.peer, 'kickee.peer');
      kickee.send('D');


    }
    
    function addPrompt(bandMatePromptIds, inst){
      if (inst == -1){
        return bandMatePromptIds;
      }

      for(let l = 0; l < 2; l++){
        let goodPrompt = false;
        let promptId1 = -1;
        var upperBound;
        var lowerBound;
        if(inst == 0){
          upperBound = instrumentBoundaries[inst];
          lowerBound = 0;
        } else {
          upperBound = instrumentBoundaries[inst];
          lowerBound = instrumentBoundaries[inst - 1] + 1;
        }
        do {
          promptId1 = Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
          goodPrompt = true;
          //make sure it isnt repeated
          if(bandMatePromptIds.length % 2)
            if(bandMatePromptIds[bandMatePromptIds.length-1] == promptId1) {
              goodPrompt = false;
            }
          //make sure prompt isn't hitting an exception
          check: {
            for(let j = 0; j < bandMatePromptIds.length; j++){
              for(let k = 0; k < prompts[promptId1].exclusions.length; k++){
                console.log(promptId1, 'promptId1')
                console.log(prompts[promptId1].exclusions, 'exclusions')
                if (bandMatePromptIds[j] == prompts[promptId1].exclusions[k]){
                  goodPrompt = false;
                  break check;
                }
              }
            }
          }
        } while (!goodPrompt)
        bandMatePromptIds = [...bandMatePromptIds, promptId1];
        return bandMatePromptIds;
      }
    }

    function startGame(){
      console.log('starting game');
      var playersReady = true;
      for (let i = 0; i < bandMateInsts.length; i++){
        if (bandMateInsts[i] == -1){
          playersReady = false;
          break;
        }
      }
      if (!playersReady){
        alert('Players need to select their instruments!');
        return;
      }
      const newBpm = Math.floor(Math.random() * 160) + 40;
      setBpm(newBpm); //set the Bpm to a random number between 40 and 200
      const newKey = Math.floor(Math.random() * 24);
      setKey(newKey) //set the key (12 notes, major or minor)
      console.log(newBpm, keys[newKey]);
      setGameStarted(true);
      var bandMatePromptIds = []
      //assign some prompts
      for(let i = 0; i < dataConnections.length; i++){
        bandMatePromptIds = addPrompt(bandMatePromptIds, bandMateInsts[i]);
        bandMatePromptIds = addPrompt(bandMatePromptIds, bandMateInsts[i]);
      }
      console.log(bandMatePromptIds, 'bandMatePromptIds')
      //send out prompts and such
      for(let j = 0; j < dataConnections.length; j++){
        console.log('sending prompts to player ' + j + ". Prompts: " + bandMatePromptIds[j*2] + " " + bandMatePromptIds[j*2+1])
        let currentConn = dataConnections[j];
        currentConn.send('B' + newBpm);
        currentConn.send('K' + newKey);
        currentConn.send('P' + bandMatePromptIds[j*2])
        currentConn.send('P' + bandMatePromptIds[j*2+1])
      }
    }

    function endSession(){
      console.log('going back to lobby');
      setGameStarted(false);
      for(let j = 0; j < dataConnections.length; j++){
        let currentConn = dataConnections[j];
        currentConn.send('X');
      }
    }
    

    

  if (gameStarted){
    return (
      <div className='border border-b-8 border-backgroundblack bg-backgroundblack h-screen'>
        <div className='flex flex-wrap space-x-16 w-screen bg-buttongold items-center border-8 border-backgroundblack'>
        <div className='bg-buttongold text-outlinebrown text-8xl font-bold py-2 px-4  '>
    {bpm} bpm, <br/>
    {keys[key]} <br/>
    </div>
    <button className='bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => endSession()}> End Jam </button>
    </div>
  </div>
  
    )}
    else return (
    <div className='border border-b-8 border-backgroundblack bg-backgroundblack h-screen'>
      <div className='flex space-x-16 w-screen bg-buttongold items-center border-8 border-backgroundblack'>
        <div className='bg-buttongold text-outlinebrown text-8xl lg:text-6xl md:text-4xl sm:text-2xl text-font-bold py-2 px-4  '>
          ROOM ID: {peerId}
        </div>
        {}
        <button className='bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => startGame()}>Start Game</button>
        <br/>
      </div>
      <div className='grid grid-cols-2 place-items-stretch gap-x-4 bg-backgroundblack border-8 border-backgroundblack h-max'>
        <HostCard 
        inst = {bandMateInsts?.length > 0 ? bandMateInsts[0] : -2} 
        name = {(dataConnections.length <=0) ? '' : (bandMateNames.length <= 0) ? '...' : bandMateNames[0]}>
          <br/>
          {dataConnections.length > 0 && 
            <button className= 'text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(0)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 1 ? bandMateInsts[1] : -2} name = {(dataConnections.length <=1) ? '' : (bandMateNames.length <= 1) ? '...' : bandMateNames[1]}>
          <br/>
          {dataConnections.length > 1 && 
            <button onClick={() => sendKick(1)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 2 ? bandMateInsts[2] : -2} name = {(dataConnections.length <=2) ? '' : (bandMateNames.length <= 2) ? '...' : bandMateNames[2]}>
          <br/>
          {dataConnections.length > 2 && 
            <button onClick={() => sendKick(2)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 3 ? bandMateInsts[3] : -2} name = {(dataConnections.length <=3) ? '' : (bandMateNames.length <= 3) ? '...' : bandMateNames[3]}>
          <br/>
          {dataConnections.length > 3 && 
            <button onClick={() => sendKick(3)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 4 ? bandMateInsts[4] : -2} name = {(dataConnections.length <=4) ? '' : (bandMateNames.length <= 4) ? '...' : bandMateNames[4]} >
        <br/>
        {dataConnections.length > 4 && 
            <button onClick={() => sendKick(4)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 5 ? bandMateInsts[5] : -2} name = {(dataConnections.length <=5) ? '' : (bandMateNames.length <= 5) ? '...' : bandMateNames[5]}>
        <br/>
        {dataConnections.length > 5 && 
            <button onClick={() => sendKick(5)}>Kick Player</button>
          }
        </HostCard>
    </div>                         
    </div>

  )
}

export default HostGame