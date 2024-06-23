import React from 'react'
import Peer from 'peerjs';
import HostCard from '../components/HostCard';
import { useEffect, useState, useRef } from 'react';
import prompts from '../prompts.json';
import chordProgressions from '../chordProgressions.json';
import ChordCard from '../components/ChordCard';
import reroll from '../assets/images/reroll.png';

const HostGame = () => {
  const [peerId, setPeerId] = useState('...');
  const [dataConnections,setDataConnections] = useState([]);
  const [bandMateNames, setBandMateNames] = useState([]);
  const [bandMateInsts, setBandMateInsts] = useState([]);
  var waitingForName = false;
  const [gameStarted, setGameStarted] = useState(false);
  const [timeSig, setTimeSig] = useState(0);
  const [bpm, setBpm] = useState('0');
  const [key, setKey] = useState('-1');
  const [chordProgression, setChordProgression] = useState('-1');
  const [chordLights, setChordLights] = useState([]);
  //const instrumentBoundaries = [2,5,8,11,14,17]
  const instrumentPromptMapping = [[0,1,2,26,27,28,29,30,34,35],
                                   [3,4,5,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
                                   [6,7,8],
                                   [9,10,11],
                                   [12,13,14],
                                   [15,16,17,18,19,20,21,22,23,24,25,31,32]];
  const keys = ['C major','A minor','G major','E minor','D major','B minor','A major','F# minor','E major','C# minor','B major','Ab minor','F# major','Eb minor','Db major','Bb minor','Ab major','F minor','Eb major','C minor','Bb major','G minor','F major','D minor'];
  const timeSignatures = [['4','4'],['3','4'],['6','8'], ['12','8'],['2','4'],['7','4'],['5','4'],['11','8']];
  const timeSignatureProbs = [50, 80, 88, 92, 95, 97, 99, 100];

  const timerId = useRef();
  const currentBar = useRef(0);
  const currentChord = useRef(0);
  const currentCount = useRef(1);
  const expectedTimerReturn = useRef();
  const [metronomeIsRunning, setMetronomeIsRunning] = useState(false);
  const metronome = new Timer(60000/bpm);


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
        do {
          promptId1 = instrumentPromptMapping[inst][Math.floor(Math.random() * instrumentPromptMapping[inst].length)];
          goodPrompt = true;
          console.log(promptId1, 'promptId1')
          //make sure it isnt repeated
          if(bandMatePromptIds.length % 2)
            if(bandMatePromptIds[bandMatePromptIds.length-1] == promptId1) {
              goodPrompt = false;
            }
          //make sure prompt isn't hitting an exception
          check: {
            for(let j = 0; j < bandMatePromptIds.length; j++){
              for(let k = 0; k < prompts[promptId1]?.exclusions.length; k++){
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
      const newTimeSigRoller = Math.floor(Math.random() * 100) + 1;
      let newTimeSig = 0;
      for (let i = 0; i < timeSignatureProbs.length; i++){
        if (newTimeSigRoller <= timeSignatureProbs[i]){
          newTimeSig = i;
          break;
        }
      }
      setTimeSig(newTimeSig);
      console.log(newTimeSig);
      const newBpm = Math.floor(Math.random() * 160) + 40;
      setBpm(newBpm); //set the Bpm to a random number between 40 and 200
      const newKey = Math.floor(Math.random() * 24);
      setKey(newKey) //set the key (12 notes, major or minor)
      console.log(newBpm, keys[newKey]);
      var newChordProgression;
      //get a chord progression
      do{
        newChordProgression = Math.floor(Math.random() * Object.keys(chordProgressions).length);
      //make sure the tonality of key and proj match
      }while(chordProgressions[newChordProgression].tonality != newKey%2)
      setChordProgression(newChordProgression);
      console.log(chordProgressions);
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
        currentConn.send('T' + newTimeSig);
        currentConn.send('B' + newBpm);
        currentConn.send('K' + newKey);
        currentConn.send('C' + newChordProgression);
        currentConn.send('P' + bandMatePromptIds[j*2]);
        currentConn.send('P' + bandMatePromptIds[j*2+1]);
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
    


      // This is built off of a video by Music and Coding called "How to make an accurate and precise timer in JavaScript"
      // but heavily changed
      function Timer(timeInterval){
        this.timeInterval = timeInterval;
        this.chordLight = [];
        while( this.chordLight.length < chordProgressions[chordProgression]?.scaleDegrees.length){
          this.chordLight.push(false);
        }
        //start timer
        this.start = () => {
          this.expected = Date.now() + this.timeInterval + 100;
          timerId.current = setTimeout(this.preround, this.timeInterval + 90);
          setChordLights(this.chordLight);
          //let everyone know when this timer starts
          for(let j = 0; j < dataConnections.length; j++){
            let currentConn = dataConnections[j];
            currentConn.send('M' + this.expected);
          }
          console.log('Started timer');
          console.log(timeSignatures[timeSig][1])
        }
        //stop timer
        this.stop = () => {
          clearTimeout(timerId.current);
          setMetronomeIsRunning(false);
          //let everyone know it is stopping
          for(let j = 0; j < dataConnections.length; j++){
            let currentConn = dataConnections[j];
            currentConn.send('S');
          }
          clearTimeout(timerId.current)
          console.log('Stopped timer');
        }
        //sets the first callback 10 ms before the second
        this.preround = () => {

          setChordLights(this.chordLight);
          clearTimeout(timerId.current);
          timerId.current = setTimeout(this.round, 10);
        }
        //does callback2 and adjusts timeInterval      
        this.round = () => {
          let drift = Date.now() - this.expected;
          setChordLights(
            chordLights => 
              [...chordLights.slice(0,currentChord.current),
                true,
                ...chordLights.slice(currentChord.current+1)
              ]
            );
          this.expected += timeInterval;
          console.log(this.timeInterval);
          console.log(currentChord.current);
          currentCount.current++;
          if (currentCount.current > parseInt(timeSignatures[timeSig][0])){
            currentCount.current = 1;
            currentChord.current++;
            if (currentChord.current == this.chordLight.length) currentChord.current = 0;
          }
          clearTimeout(timerId.current);
          timerId.current = setTimeout(this.preround, this.timeInterval - drift - 10);
        }
      }
      useEffect(() => {
        //const myInterval = setInterval(turnCorrectChordLightOn, 60000/bpm);
        return () => clearTimeout(timerId.current);
      }, []);

    function setNewCurrentChord(chordToBeCurrent){
      currentChord.current = chordToBeCurrent;
      //tell everyone we are starting on a different chord
      for(let j = 0; j < dataConnections.length; j++){
        let currentConn = dataConnections[j];
        currentConn.send('C' + chordToBeCurrent);
      }
      let newChordLights = [];
      while(newChordLights.length < chordProgressions[chordProgression]?.scaleDegrees.length){
        newChordLights.length == chordToBeCurrent?newChordLights.push(true):newChordLights.push(false);
      }
      setChordLights(
        [...newChordLights]
      );
    }

    function toggleCount(){
      console.log(metronomeIsRunning, "metronomeIsRunning");
      
      setMetronomeIsRunning(prevMetronomeIsRunning => !prevMetronomeIsRunning);
      metronomeIsRunning?metronome.stop():metronome.start();
      console.log("TOGGLING");
    }

    function rerollTimeSig(){
      console.log('rerolling time signature');
      const newTimeSigRoller = Math.floor(Math.random() * 100) + 1;
      console.log(newTimeSigRoller, 'newTimeSigRoller')
      let newTimeSig = 0;
      for (let i = 0; i < timeSignatureProbs.length; i++){
        if (newTimeSigRoller <= timeSignatureProbs[i]){
          newTimeSig = i;
          break;
        }
      }
      console.log(newTimeSig, 'newTimeSig')
      setTimeSig(newTimeSig);
      for(let j = 0; j < dataConnections.length; j++){
        let currentConn = dataConnections[j];
        currentConn.send('T' + newTimeSig);
      }
    }
    function rerollBpm(){
      console.log('rerolling BPM');
      const newBpm = Math.floor(Math.random() * 160) + 40;
      setBpm(newBpm);
      for(let j = 0; j < dataConnections.length; j++){
        let currentConn = dataConnections[j];
        currentConn.send('B' + newBpm);
      }
    }
    function rerollKey(){
      console.log('rerolling Key');
      //first check the tonality of the chord progression
      
      var newKey = Math.floor(Math.random() * 12)*2;

      newKey += chordProgressions[chordProgression].tonality;
      setKey(newKey)
      for(let j = 0; j < dataConnections.length; j++){
        let currentConn = dataConnections[j];
        currentConn.send('K' + newKey);
      }
    }
    function rerollChordProgression(){
      console.log('rerolling chord progression');
      var newChordProgression;
      //get a chord progression
      do{
        newChordProgression = Math.floor(Math.random() * Object.keys(chordProgressions).length);
      //make sure the tonality of key and proj match
      }while(chordProgressions[newChordProgression].tonality != key%2)
      setChordProgression(newChordProgression);
      for(let j = 0; j < dataConnections.length; j++){
        let currentConn = dataConnections[j];
        currentConn.send('C' + newChordProgression);
      }
    }
    

    

  if (gameStarted){
    return (
      <div className='bg-backgroundblack h-screen w-screen'>
        <div className='flex space-x-16 bg-buttongold items-center border-8 border-backgroundblack'>
        <div className='text-outlinebrown text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold py-2  justify-center  w-screen'>
          <div className='grid grid-rows-4 grid-flow-col gap-4 place-content-center'>
            <div className='mx-auto'>
              <div className='flex flex-col justify-center text-xl xl:text-3xl mx-auto'>
                <div className='border-b-2 border-backgroundgray text-center'>{timeSignatures[timeSig][0]}</div>
                <div className='text-center'>{timeSignatures[timeSig][1]}</div>
              </div>
            </div>
            <button className='bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold h-8 w-8 mx-auto border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => rerollTimeSig()}> 
                <img className='h-4 w-auto mx-auto'
                  src= {reroll}
                  alt="Reroll"
                />
            </button>
            {
              (chordProgressions[chordProgression].name.length < 15)
              ?<div className='justify-center mx-auto'>
                  <div className='text-center'>
                    {chordProgressions[chordProgression].name}
                  </div>
                </div>
              :(chordProgressions[chordProgression].name.length < 25)
              ?<div className='justify-center mx-auto'>
                  <div className='text-center text-lg md:text-xl lg:text-2xl xl:text-4xl'>
                    {chordProgressions[chordProgression].name}
                  </div>
                </div>
              :<div className='justify-center mx-auto'>
                  <div className='text-center text-sm md:text-base lg:text-xl xl:text-3xl'>
                    {chordProgressions[chordProgression].name}
                  </div>
                </div>
            }
            <button className='bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold h-8 w-8 mx-auto py-1 px-1 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => rerollChordProgression()}> 
                <img className='h-4 w-auto mx-auto'
                  src= {reroll}
                  alt="Reroll"
                />
              </button>
            <div> 
              <div> {bpm} bpm</div> 

            </div>
            <button className='bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold h-8 w-8 mx-auto py-1 px-1 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => rerollBpm()}> 
                <img className='h-4 w-auto mx-auto'
                  src= {reroll}
                  alt="Reroll"
                />
              </button>
            <div className=''>
              <div>{keys[key]} </div>
            </div>
            <button className='bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold h-8 w-8 mx-auto py-1 px-1 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => rerollKey()}> 
                <img className='h-4 w-auto mx-auto'
                  src= {reroll}
                  alt="Reroll"
                />
            </button>
            {metronomeIsRunning
              ?<button className='bg-buttondarkgold grid-rows-subgrid row-span-2 lg:hover:bg-buttongold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => toggleCount()}> Pause </button>
              :<button className='bg-buttongold grid-rows-subgrid row-span-2 lg:hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => toggleCount()}> Start </button>
            }
            
           

            <button className='bg-buttongold  grid-rows-subgrid row-span-2  hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => endSession()}> Exit Jam </button>
          </div>
          
          
        </div>
      </div>
    {
      //This is the volca beats looking chord chart
    }
    <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-8 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={0} isSelected={(chordLights.length>0)?chordLights[0]:false} onSelect={() => setNewCurrentChord(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={1} isSelected={(chordLights.length>1)?chordLights[1]:false} onSelect={() => setNewCurrentChord(1)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={2} isSelected={(chordLights.length>2)?chordLights[2]:false} onSelect={() => setNewCurrentChord(2)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={3} isSelected={(chordLights.length>3)?chordLights[3]:false} onSelect={() => setNewCurrentChord(3)}/>
    </div>
    <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-8 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={4} isSelected={(chordLights.length>4)?chordLights[4]:false} onSelect={() => setNewCurrentChord(4)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={5} isSelected={(chordLights.length>5)?chordLights[5]:false} onSelect={() => setNewCurrentChord(5)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={6} isSelected={(chordLights.length>6)?chordLights[6]:false} onSelect={() => setNewCurrentChord(6)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={7} isSelected={(chordLights.length>7)?chordLights[7]:false} onSelect={() => setNewCurrentChord(7)}/>
    </div>
    <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-8 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={8} isSelected={(chordLights.length>8)?chordLights[8]:false} onSelect={() => setNewCurrentChord(8)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={9} isSelected={(chordLights.length>9)?chordLights[9]:false} onSelect={() => setNewCurrentChord(9)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={10} isSelected={(chordLights.length>10)?chordLights[10]:false} onSelect={() => setNewCurrentChord(10)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={11} isSelected={(chordLights.length>11)?chordLights[11]:false} onSelect={() => setNewCurrentChord(11)}/>
    </div>
  </div>
  
    )}
    else return (
    <div className='border border-b-8 border-backgroundblack bg-backgroundblack h-screen'>
      <div className='grid grid-cols-3 bg-buttongold items-center justify-center border-8 border-backgroundblack'>
        <div></div>
        <div className='bg-buttongold text-outlinebrown text-2xl  md:text-4xl lg:text-6xl xl:text-8xl font-bold py-2 justify-self-stretch mx-auto'>
          ROOM ID: 
          <div className='text-3xl md:text-5xl lg:text-8xl'>{peerId}</div>
        </div>
        {}<div>
        <button className='bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => startGame()}>Start Game</button>
        </div>
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
            <button className= 'text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(1)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 2 ? bandMateInsts[2] : -2} name = {(dataConnections.length <=2) ? '' : (bandMateNames.length <= 2) ? '...' : bandMateNames[2]}>
          <br/>
          {dataConnections.length > 2 && 
            <button className= 'text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(2)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 3 ? bandMateInsts[3] : -2} name = {(dataConnections.length <=3) ? '' : (bandMateNames.length <= 3) ? '...' : bandMateNames[3]}>
          <br/>
          {dataConnections.length > 3 && 
            <button className= 'text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(3)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 4 ? bandMateInsts[4] : -2} name = {(dataConnections.length <=4) ? '' : (bandMateNames.length <= 4) ? '...' : bandMateNames[4]} >
        <br/>
        {dataConnections.length > 4 && 
            <button className= 'text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(4)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 5 ? bandMateInsts[5] : -2} name = {(dataConnections.length <=5) ? '' : (bandMateNames.length <= 5) ? '...' : bandMateNames[5]}>
        <br/>
        {dataConnections.length > 5 && 
            <button className= 'text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(5)}>Kick Player</button>
          }
        </HostCard>
    </div>                         
    </div>

  )
}

export default HostGame