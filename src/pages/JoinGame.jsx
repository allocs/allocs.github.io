import React from 'react'
import { Peer } from 'peerjs';
import { useEffect, useState, useRef } from 'react';
import InstrumentCard from '../components/InstrumentCard';
import prompts from '../prompts.json';
import chordProgressions from '../chordProgressions.json'
import ChordCard from '../components/ChordCard';  



const JoinGame = () => {
    const peer = new Peer();                               // The player's PeerJS peer object
    const [userName, setUserName] = useState('');          // The set display name of the player
    const [playerNumber, setPlayerNumber] = useState('');  // The number given to the player by the Host
    const [room, setRoom] = useState('');                  // The roomCode we are connecting to, also the Host's peerId
    var [conn, setConn] = useState(null);                  // The PeerJS dataConnection to the Host peer 
    const [isConnected, setIsConnected] = useState(false); // A boolean to switch to setting player attributes (first userName)
    const [inLobby, setInLobby] = useState(false);         // A boolean to switch to a lobby, where the player sets instrument to "ready up"
    const [inst, setInst] = useState(-1);                  // The player's selected instrument to play
    const [gameStarted, setGameStarted] = useState(false); // A boolean to switch to the main Jam Session screen
    const [timeSig, setTimeSig] = useState(0);             // The time signature of the Jam session, given by the Host, decoded by the timeSignatures array
    const [bpm, setBpm] = useState('0');                   // The tempo / BPM of the Jam Session, given by the Host
    const [key, setKey] = useState('-1');                  // The key of the Jam Session, given by the Host, decoded by the keys array
    const [chordProgression, setChordProgression] = useState(-1); //The chord progression of the Jam Session, given by the Host, decoded by the chordProgressions JSON file
    const [myPrompts, setMyPrompts] = useState([]);        // The player's prompts, calculated and given by the Host based on the player's instrument
    // An array of the possible keys, organized going from Major to relative minor, then up the circle of fifths from the relative major
    const keys = ['C major','A minor','G major','E minor','D major','B minor','A major','F# minor','E major','C# minor','B major','Ab minor','F# major','Eb minor','Db major','Bb minor','Ab major','F minor','Eb major','C minor','Bb major','G minor','F major','D minor'];
    // An array of the possible time signatures, going from most common to least common
    const timeSignatures = [['4','4'],['3','4'],['6','8'], ['12','8'],['2','4'],['7','4'],['5','4'],['11','8']];
    // The following are variables for the metronome / lights during a Jam Session
    const timerId = useRef();                           // Where we store TimeOut s for the metronome
    const [chordLights, setChordLights] = useState([]); // The Volca Beats inspired lights to tell players which chord they are on
    const startingChord = useRef(0);                    // The starting chord of the chord progression, so the Host can decide to start some amount of bars in
    const [metronomeIsRunning, setMetronomeIsRunning] = useState(false); // A boolean of whether or not the metronome is running
    const metronome = new Timer(60000/parseInt(bpm));   // The timer object, with an interval of 60,000ms (1 minute) / the beats per minute of the Jam Session

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //// THE FOLLOWING SECTION HANDLES INCOMING DATA AFTER CONNECTION TO THE HOST HAS BEEN ESTABLISHED ////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
      // Make sure we have a connection to the host
      if (conn != null){
        // Handles data coming from a Host Peer.
        // Data sent and received is all understood by the first character of the data, which encodes
        // what information is being sent
        conn.on('data', function (data) {
            console.log(data, 'data');
            switch (data.charAt(0)){
              // 'R' means we are getting a playerNumber assigned by the Host
              case 'R':
                setIsConnected(true);
                setPlayerNumber(data.charAt(1));
                break;
              // 'D' means we are getting an instruction to destroy our connection (we are getting kicked)
              case 'D':
                console.log('Leaving');
                // Set isConnected and inLobby to false to go back to the first JoinGame screen
                setIsConnected(false);
                setInLobby(false);
                //nullify the connection
                setConn(null);
                //destroy the peer object
                peer.destroy();
                break
              // 'T' means we are getting a new Time Signature
              case 'T':
                let newTimeSig = data.substring(1);
                setTimeSig(newTimeSig);
                break;
              // 'B' means we are getting a new BPM, which we will also take as an instruction to start the game
              // (which means switch to the Jam Session screen) if we haven't already
              case 'B':
                setGameStarted(true);
                let newBpm = data.substring(1);
                setBpm(newBpm)
                break;
              // 'K' means we are getting a new key
              case 'K':
                let newKey = parseInt(data.substring(1));
                setKey(newKey);
                break;
              // 'P' means we are getting a prompt, which we add to the end out our myPrompts array
              case 'P':
                const newMyPrompt = parseInt(data.substring(1));
                setMyPrompts(myPrompts => [...myPrompts, newMyPrompt]);
                break;
              // 'C' means we are getting a new chord progression
              case 'C':
                let newChordProgression = parseInt(data.substring(1));
                setChordProgression(newChordProgression);
                break;
              // 'S' means we are getting a new starting chord, along with the size to make the chordLights array
              case 'S':
                // Get the index of the number of bars/chords (size of chordLights array)
                const numberOfBarsIndex = data.indexOf("N");
                // the chord to set is before it
                const newChord = parseInt(data.substring(1, numberOfBarsIndex));
                // the number of bars is after the index
                const numberOfBars = parseInt(data.substring(numberOfBarsIndex + 1))
                setNewStartingChord(newChord, numberOfBars);
                break;
              // 'M' means we are getting an instruction to start/restart the metronome, along with information to run it
              // which is the BPM, the starting chord, the number of bars before looping, and the number of beats in a bar
              // using our own just wouldnt work
              case 'M':
                // Set metronomeIsRunning if it isn't already
                setMetronomeIsRunning(true);
                // Get the indexes of the bpm, the starting chord, the number of chords/bars, and the number of beats
                const bpmIndex = data.indexOf("B");
                const startIndex = data.indexOf("S");
                const numberOfChordsIndex = data.indexOf("N");
                const numberOfBeatsIndex = data.indexOf("O");
                // with the indexes, get the expectedFirstBeat, the BPM, the starting chord, the number of chords/bars, and the number of beats
                const expectedFirstBeat = parseFloat(data.substring(1, bpmIndex));
                const myBPM = parseInt(data.substring(bpmIndex+1, startIndex));
                const myStart = parseInt(data.substring(startIndex+1, numberOfChordsIndex));
                const numberOfChords = parseInt(data.substring(numberOfChordsIndex+1, numberOfBeatsIndex));
                const numberOfBeats = parseInt(data.substring(numberOfBeatsIndex+1))
                console.log('Starting metronome with expected= ' + expectedFirstBeat + ', BPM = ' + myBPM + ', starting beat = ' + myStart + ', and ' + numberOfChords + ' chords and ' + numberOfBeats + ' beats.');
                //start the metronome
                metronome.start(expectedFirstBeat, myBPM, myStart,numberOfChords,numberOfBeats);
                break;
              // 'N' means to stop the metronome
              case 'N':
                // pause metronome
                metronome.stop();
                setMetronomeIsRunning(false);
                break;
              // 'X' means to eXit the Jam Session and reenter the lobby (which is still true)
              case 'X':
                setGameStarted(false);
                // empty the prompts array so new ones can come it and fun can be had in the future!
                const newEmptyArray = [];
                setMyPrompts([...newEmptyArray]);
                // stop the metronome if it is running
                metronome.stop();
                setMetronomeIsRunning(false);
                break;
              // 'E' means the userName we chose has been taken already, and we need to choose a new one
              case 'E':
                setInLobby(false);
                alert('This name is taken');
                break;
              default:
                break;
            };

        })
        // This handles the Host closing, which puts us back in the 'ENTER ROOMCODE' screen (but keeps the userName for easier switching of Hosts)
        conn.on('close', function() {
          setInst(-1);
          setIsConnected(false);
          setInLobby(false);
        })
      }
    }, [conn])

    // Sets a new starting chord to be lit up by the metronome
    function setNewStartingChord(chordToBe, numberOfBars){
      startingChord.current = chordToBe;
      // tell everyone we are starting on a different chord
      let newChordLights = [];
      while(newChordLights.length < numberOfBars){
        newChordLights.length == chordToBe?newChordLights.push(true):newChordLights.push(false);
      }
      // set the chordLights
      setChordLights(
        [...newChordLights]
      );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// THIS SECTION HANDLES ALL OUTGOING DATA, INCLUDING INITIAL CONNECTION, USERNAME, AND INSTRUMENT ////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // This handles the initial connection to the Host via PeerJS
    function handleConnect(roomID){
      // create a new dataConnection
      const newConn = peer.connect(roomID);
      // set conn to it
      setConn(newConn);
      // When it opens, set isConnected to true
      newConn.on('open', function() {
        setIsConnected(true);
      });
      // Here we are looking for data to either get a player number or to leave 
      newConn.on('data', function (data) {
        switch (data.charAt(0)){
          // 'R' means we are getting a player number, which we set
          case 'R':
            setIsConnected(true);
            setPlayerNumber(data.charAt(1));
            break;
          // 'D' means we are kicked, so we set everything to false and destroy ourselves :(
          case 'D':
            console.log('Leaving');
            setIsConnected(false);
            setInLobby(false);
            setConn(null);
            peer.destroy();
            break
          default:
            break;
        };
      });
    }

    // Crosses from the just connected screen to the lobby by submitting 
    // the userName to the Host and setting inLobby to true
    function enterLobby(){
      conn.send("U" + userName);
      setInLobby(true);
    }

    // In the lobby, allows the player to choose which instrument they
    // will play and sends that info to the Host
    function changeInst(goal){
      setInst(goal);
      console.log(goal);
      conn.send("I" + goal + playerNumber);
    }

    
    ///////////////////////////////////////////////////////////////////////////////
    //// THIS IS A SECTION FOR THE METRONOME/TIMER/CHORDLIGHTS DURING THE GAME ////
    ////                   IT IS DIFFERENT THAN HOST GAME'S                    ////
    ///////////////////////////////////////////////////////////////////////////////

    // This is built off of a video by Music and Coding called "How to make an 
    // accurate and precise timer in JavaScript", but is HEAVILY changed
    function Timer(){
      // starts metronome based on when the First beat is supposed to hit, the BPM, 
      // the starting chord, the number of chords/bars before looping, and the 
      // number of beats in a bar
      this.start = (expectedFirstBeat, myBpm, myStart, numberOfChords, numberOfBeats) => {
        // make sure we are starting clean
        clearTimeout(timerId.current);
        // makes each of the inputs a value we can reference elsewhere
        this.expected = expectedFirstBeat;
        this.timeInterval = 60000/myBpm;
        this.currentChord = myStart;
        this.numberOfChords = numberOfChords;
        this.numberOfBeats = numberOfBeats
        // this is an array of falses of the same length as chordLights used to clear it and easily get the length of chordLights
        this.chordLight = [];
        while( this.chordLight.length < this.numberOfChords){
          this.chordLight.push(false);
        }
        setChordLights(this.chordLight);
        // start the count at 1
        this.currentCount = 1;
        //create the timeout
        timerId.current = setTimeout(this.preround, this.expected - Date.now() - 50);
      }
      //stops timer
      this.stop = () => {
        clearTimeout(timerId.current);
        setMetronomeIsRunning(false);
        clearTimeout(timerId.current)
        console.log('Stopped timer');
      }
      // clears the lights 50 ms before round is triggered
      this.preround = () => {
        console.log(this.timeInterval)
        setChordLights(this.chordLight);
        clearTimeout(timerId.current);
        timerId.current = setTimeout(this.round, 50);
      }
      // Sets the correct chord light and creates a looped call to preround     
      this.round = () => {
        // change the lights first (then we calculate everything else for the next loop)
        setChordLights(
          chordLights => 
            [...chordLights.slice(0,this.currentChord),
              true,
              ...chordLights.slice(this.currentChord+1)
            ]
          );
        // calculate when the next beat is going to hit
        this.expected += this.timeInterval;
        // increment the count
        this.currentCount++;
        // if this puts the count higher than the beats in a bar, go to the next bar
        if (this.currentCount > this.numberOfBeats){
          this.currentCount = 1;
          this.currentChord++;
          // if this puts the bar farther than the last bar, go to the first bar and let everyone know when you are expecting to start the loop again
          if (this.currentChord == this.numberOfChords) this.currentChord = 0;
        }
        // just in case (this line is basically to quell anxiety)
        clearTimeout(timerId.current);
        // I don't see why this isn't a great way of setting it such that it is always aiming for the beat
        timerId.current = setTimeout(this.preround, this.expected - Date.now() - 50);
      }
    }
    
    // prevents timer skipping
    useEffect(() => {
      return () => clearTimeout(timerId.current);
    }, []);
    
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //// THIS STARTS A BIG SECTION OF HTML, MADE MORE IMPENITRABLE BY THE ADDITION OF TAILWIND ////
  ////  Basically it just checks which screen it should be (game, lobby, set name, or join)  ////
  ////  and then displays that one. Thankfully the buttons are easy to see, they are the     ////
  ////  most subject to change                                                               ////
  ///////////////////////////////////////////////////////////////////////////////////////////////

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
              {chordProgressions[chordProgression]?.name}
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
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={0} isSelected={(chordLights.length>0)?chordLights[0]:false} onSelect={()=>{}}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={1} isSelected={(chordLights.length>1)?chordLights[1]:false} onSelect={()=>{}}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={2} isSelected={(chordLights.length>2)?chordLights[2]:false} onSelect={()=>{}}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={3} isSelected={(chordLights.length>3)?chordLights[3]:false} onSelect={()=>{}}/>
    </div>
    <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-8 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={4} isSelected={(chordLights.length>4)?chordLights[4]:false} onSelect={()=>{}}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={5} isSelected={(chordLights.length>5)?chordLights[5]:false} onSelect={()=>{}}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={6} isSelected={(chordLights.length>6)?chordLights[6]:false} onSelect={()=>{}}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={7} isSelected={(chordLights.length>7)?chordLights[7]:false} onSelect={()=>{}}/>
    </div>
    <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-8 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={8} isSelected={(chordLights.length>8)?chordLights[8]:false} onSelect={()=>{}}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={9} isSelected={(chordLights.length>9)?chordLights[9]:false} onSelect={()=>{}}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={10} isSelected={(chordLights.length>10)?chordLights[10]:false} onSelect={()=>{}}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={11} isSelected={(chordLights.length>11)?chordLights[11]:false} onSelect={()=>{}}/>
    </div>
      </div>
    </div>
  )}
  else return (
    <div className='h-screen bg-backgroundblack'>
        <hr />
        <>{ inLobby
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
                  
                <button className='text-2xl bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 hover:border-b-4 rounded-full' onClick={() => enterLobby()}>Confirm</button>
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