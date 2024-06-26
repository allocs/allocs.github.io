import React from 'react'
import Peer from 'peerjs';
import HostCard from '../components/HostCard';
import { useEffect, useState, useRef } from 'react';
import prompts from '../prompts.json';
import chordProgressions from '../chordProgressions.json';
import ChordCard from '../components/ChordCard';
import reroll from '../assets/images/reroll.png';

const HostGame = () => {
  const [peerId, setPeerId] = useState('...'); // Our host's PeerJS peerId / Room Code. Starts as '...' so that it displays something pre room code calculation
  const hostIndex = useRef(-1);                               // An int for when the Host wants prompts generated for themselves (also allows single player, to an extent). -1 when the Host isn't playing, their index in the player arrays when they are
  const [dataConnections,setDataConnections] = useState([]); // Our hosts dataConnections. Keeps us attached to other players
  const [bandMateNames, setBandMateNames] = useState([]);   // The set display names of our players
  const [bandMateInsts, setBandMateInsts] = useState([]);  // The selected instruments of our players
  var waitingForName = false;                             // flags when we are expecting a name from a player
  const [gameStarted, setGameStarted] = useState(false); // flags when to exit the lobby and show main game/session screen
  const [timeSig, setTimeSig] = useState(0);            // The Time Signature of the Jam Session, decoded by the timeSignatures array
  const [bpm, setBpm] = useState('0');                 // The tempo / BPM of the Jam Session
  const [key, setKey] = useState('-1');               // The key of the Jam Session, decoded by the keys array
  const playerPrompts = useRef([]);                  // The prompts of the players
  const [chordProgression, setChordProgression] = useState('-1'); // the chord progression of the Jam Session, decoded by the chordProgressions JSON file
  // An array of arrays. 1 array for each instrument, the contents of which are the IDs of that instrument's possible prompts in the prompts JSON file
  const instrumentPromptMapping = [[0,1,2,26,27,28,29,30,34,35],                              // Rhythm Guitar (instrument 0) prompts
                                   [3,4,5,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],   // Lead Guitar (instrument 1) prompts
                                   [6,7,8],                                                   // Bass Guitar (instrument 2) prompts
                                   [9,10,11],                                                 // Drum (instrument 3) prompts
                                   [12,13,14],                                                // Keyboard (instrument 4) prompts
                                   [15,16,17,18,19,20,21,22,23,24,25,31,32]];                 // Vocal (instrument 5) prompts
  // An array of the possible keys, organized going from Major to relative minor, then up the circle of fifths from the relative major
  const keys = ['C major','A minor','G major','E minor','D major','B minor','A major','F# minor','E major','C# minor','B major','Ab minor','F# major','Eb minor','Db major','Bb minor','Ab major','F minor','Eb major','C minor','Bb major','G minor','F major','D minor'];
  // An array of the possible time signatures, going from most common to least common
  const timeSignatures = [['4','4'],['3','4'],['6','8'], ['12','8'],['2','4'],['7','4'],['5','4'],['11','8']];
  // An array that encodes the probabilities of rolling each time signature (what number you have to roll >= to get each key)
  const timeSignatureProbs = [50, 80, 88, 92, 95, 97, 99, 100];
  // The following are variables for the metronome / lights during a Jam Session
  const timerId = useRef();                           // Where we store TimeOut s for the metronome
  const [chordLights, setChordLights] = useState([]); // The Volca Beats inspired lights to tell players which chord they are on
  const currentChord = useRef(0);                     // The current chord of the chord progression 
  const currentCount = useRef(1);                     // The current count of the bar, starting at 1 and going to the numerator of the time signature
  const [metronomeIsRunning, setMetronomeIsRunning] = useState(false); // A boolean of whether or not the metronome is running
  const metronome = new Timer(60000/bpm);             // The timer object, with an interval of 60,000ms (1 minute) / the beats per minute of the Jam Session

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// THIS FIRST SECTION DEALS WITH THE Peer.js STUFF WITH CONNECTING AND INTERFACING WITH PEERS AND MAKING A ROOM/ROOMCODE ////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {

      // just in case I decide to make a filter for profanity, I could edit this to take out vowels or something. if not, i will just use "= Math.random().toString(36).slice(2,6);"
      const charsForRoomCode =  ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
      // create a 4 character room code
      const roomCode = charsForRoomCode[Math.floor(Math.random() * (charsForRoomCode.length))] + charsForRoomCode[Math.floor(Math.random() * (charsForRoomCode.length))] + charsForRoomCode[Math.floor(Math.random() * (charsForRoomCode.length))] + charsForRoomCode[Math.floor(Math.random() * (charsForRoomCode.length))]
      const peer = new Peer(roomCode); // Set up the Host peer
      var myDataConnections = []; // So we can know the length without waiting for async state updates

      // Ensures the Host Peer has the roomCode as its peerId
      peer.on('open', function () {
        setPeerId( roomCode);
      });

      // Handles a new connection to a peer
      peer.on('connection', function (conn) {
        console.log('connection found');
        console.log(conn.peer, 'conn.peer');
        console.log(conn, 'conn');
        // make sure conn isn't already in dataConnections
        // (for whatever reason, connections like to double up, but maybe that was just during testing on only 1 PC)
        let isNewDataConnection = true;
        for(let i = 0; i < myDataConnections.length; i++){
          if (myDataConnections[i].peer == conn.peer) {
            isNewDataConnection = false;
            break;
          }
        }
        // if conn isn't in dataConnections, add it and update bandMateInsts
        if (isNewDataConnection){
          setDataConnections((
            dataConnections => [...dataConnections, conn]
          ));
          // -1 signifies a player exists and hasn't selected an instrument
          setBandMateInsts(bandMateInsts => [...bandMateInsts, -1]);
          // add conn to myDataConnections 
          myDataConnections.push(conn);
        }

        // establish that we need a name for this player connection
        waitingForName = true;

        // When the connection is established, let the player know which connection they are
        // this is needed for them to send which instrument they want to play
        conn.on('open', function(){
          // 'R' signifies a player number in JoinGame
          // this ?: also fixes an issue where players overwrite the Host's instruments
          (hostIndex.current!=-1)?conn.send('R' + myDataConnections.length):conn.send('R' + (myDataConnections.length - 1)); 
        })

        // Handles data coming from a player Peer, which should only be a username or and instrument
        // Data sent and received is all understood by the first character of the data, which encodes
        // what information is being sent
        conn.on('data', function(data) {
          switch(data.charAt(0)){
            case '':
              console.log('got empty data')
              break;
            case 'U':
              // We are receiving a username
              // If we are expecting this, set it and turn waitingForName false
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
              // We are receiving a new player instrument
              // Parse which player's instrument we are updating
              // and what their newly selected instrument is
              const newInst = parseInt(data.charAt(1));
              const name = data.charAt(2);
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
              break;
          }

        });

        // Handles a connection closing by removing the conn from dataConnections and myDataConnections
        // and removes their corresponding bandMateName and bandMateInst 
        conn.on('close', function () {
          console.log('closing ' + conn.peer);
          const connIndex = myDataConnections.indexOf(conn);
          myDataConnections.splice(connIndex, 1);
          setDataConnections(dataConnections => {
            return dataConnections.filter((value, i) => i !== connIndex)
          });
          for(let i = 0; i < myDataConnections.length; i++){
            //this avoids trying to send a null connection, which is used when the host is getting prompts
            if (myDataConnections[i] != null) myDataConnections[i].send('R' + i);
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

      // Handles a peer Host getting disconnected
      peer.on('disconnected', function () {
        console.log('Connection lost. Attempting to reconnect');
        peer.reconnect();
      });
    }, [])


    // Kicks the player at the given index
    function sendKick(kickeeIndex){
      console.log('Kicking player ' + kickeeIndex);
      // see if the kickee is the host
      if (dataConnections[kickeeIndex] == null){
        //just remove their entries in dataConnections, bandMateNames, bandMateInsts, set hostIndex to -1, then returns
        setDataConnections(dataConnections => {
          return dataConnections.filter((value, i) => i !== kickeeIndex)
        });
        setBandMateNames(bandMateNames => {
          return bandMateNames.filter((value, i) => i !== kickeeIndex)
        }
        );
        setBandMateInsts(bandMateInsts => {
          return bandMateInsts.filter((value, i) => i !== kickeeIndex)
        });
        hostIndex.current = -1;
        return;
      }
      // If not the host, ind the data connection for given index
      let kickee = dataConnections[kickeeIndex];
      kickee.send('D'); // Tells someone to peer.destroy
    }

    // Allows the Host to generate prompts for themselves
    function hostJoinGame(){
      // So Host can't join twice
      if (hostIndex.current != -1 ) return;
      // update hostIndex
      hostIndex.current = dataConnections.length;
      // add a null pointer to myDataConnections and dataConnections
      setDataConnections(
        dataConnections => [...dataConnections, null]
      );
      setBandMateInsts(
        bandMateInsts => [...bandMateInsts, 0]
      );
      setBandMateNames(
        bandMateNames => [...bandMateNames, 'Host']
      );

    }

    // Changes the Host's instrument
    function changeHostInstrument(){
      if (hostIndex.current == -1) return;
      (bandMateInsts[hostIndex.current] < 5)
        ?setBandMateInsts(
          bandMateInsts => 
            [...bandMateInsts.slice(0,hostIndex.current),
              bandMateInsts[hostIndex.current] + 1,
              ...bandMateInsts.slice(hostIndex.current + 1)
            ]
        )
        :setBandMateInsts(
          bandMateInsts => 
            [...bandMateInsts.slice(0,hostIndex.current),
              0,
              ...bandMateInsts.slice(hostIndex.current + 1)
            ]
        )
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //// THIS SECTION IS ABOUT SWITCHING BETWEEN A GAME AND THE LOBBY, INCLUDING A HELPER METHOD ////
    ////    FOR ASSIGNING PROMPTS. startSession() and endSession() START AND END THE JAM SESH    ////
    /////////////////////////////////////////////////////////////////////////////////////////////////

    // Adds a prompts given the player's instrument and previous prompts' exclusions
    function addPrompt(bandMatePromptIds, inst){
      // make sure it is a valid instrument
      if (inst == -1){
        return bandMatePromptIds;
      }
      // A good prompt isn't excluded by any previous prompts and isn't a repeat
      // for the given player 
      let goodPrompt = false;
      let promptId1 = -1;
      do {
        // roll a number and map it to the array of the given instruments' prompts
        promptId1 = instrumentPromptMapping[inst][Math.floor(Math.random() * instrumentPromptMapping[inst].length)];
        goodPrompt = true;
        console.log(promptId1, 'promptId1')
        // make sure we aren't giving the same player two prompts
        // this checks if this is the second prompt we are generating for a player
        if(bandMatePromptIds.length % 2)
          // check if it is a repeat, and if so, its not a good prompt
          if(bandMatePromptIds[bandMatePromptIds.length-1] == promptId1) {
            goodPrompt = false;
          }
        // make sure prompt isn't hitting an exception
        check: {
          // For each existing prompt, check its' exclusions, and if it is excluding this prompt, mark it as not good
          for(let j = 0; j < bandMatePromptIds.length; j++){
            for(let k = 0; k < prompts[promptId1]?.exclusions.length; k++){
              if (bandMatePromptIds[j] == prompts[promptId1].exclusions[k]){
                goodPrompt = false;
                break check;
              }
            }
          }
        }
        // Repeat until you get a good prompt
      } while (!goodPrompt)
      // add the good prompt to bandMatePromptIds and return it
      bandMatePromptIds = [...bandMatePromptIds, promptId1];
      return bandMatePromptIds;
    }

    // This method sets the time signature, BPM, key, and chord progression, player prompts, and then sends
    // all that info out to each of the players and also changes the screen to the main game screen
    function startSession(){
      // Check if the players are ready (i.e. they have instruments selected, which is their "readying up")
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
      // Roll for a time signature (this allows for weird time signatures like 11/8 to be less frequent than ones like 4/4)
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
      setBpm(newBpm); // set the Bpm to a random number between 40 and 200
      const newKey = Math.floor(Math.random() * 24);
      setKey(newKey) // set the key (12 notes, major or minor)
      console.log(newBpm, keys[newKey]);
      var newChordProgression;
      // get a chord progression
      do{
        newChordProgression = Math.floor(Math.random() * Object.keys(chordProgressions).length);
      // make sure the tonality of key and proj match
      }while(chordProgressions[newChordProgression].tonality != newKey%2)
      setChordProgression(newChordProgression);
      // This changes the screen to the main game screen
      setGameStarted(true);
      // create an array to hold the players' prompt IDs
      var bandMatePromptIds = []
      // assign some prompts
      for(let i = 0; i < dataConnections.length; i++){
        bandMatePromptIds = addPrompt(bandMatePromptIds, bandMateInsts[i]);
        bandMatePromptIds = addPrompt(bandMatePromptIds, bandMateInsts[i]);
      }
      playerPrompts.current = bandMatePromptIds;
      console.log(bandMatePromptIds, 'bandMatePromptIds')
      // send out prompts and such
      for(let j = 0; j < dataConnections.length; j++){
        console.log('sending prompts to player ' + j + ". Prompts: " + bandMatePromptIds[j*2] + " " + bandMatePromptIds[j*2+1])
        // can't send to a null connection, which is used for the Host when they are getting prompts for themselves
        if (dataConnections[j] != null){
          let currentConn = dataConnections[j];
          currentConn.send('T' + newTimeSig); //'T' indicates a time signature for JoinGame
          currentConn.send('B' + newBpm); //'B' indicates a new BPM for JoinGame
          currentConn.send('K' + newKey); //'K' indicates a new key for JoinGame
          currentConn.send('C' + newChordProgression); //'C' indicates a new chord progression for JoinGame
          currentConn.send('P' + bandMatePromptIds[j*2]); //These lines send each player their prompts, which are calculated here
          currentConn.send('P' + bandMatePromptIds[j*2+1]); // so that we can handle the cross instrument exclusions
        }
      }
    }

    // Goes back to the lobby
    function endSession(){
      setGameStarted(false);
      // tell everyone to go back to the lobby too
      for(let j = 0; j < dataConnections.length; j++){
        if (dataConnections[j] != null){ // can't send to a null connection, which is used for the Host when they are getting prompts for themselves
          let currentConn = dataConnections[j];
          // 'X' indicates the end of a session in JoinGame
          currentConn.send('X');
        }
      }
    }

    ///////////////////////////////////////////////////////////////////////////////
    //// THIS IS A SECTION FOR THE METRONOME/TIMER/CHORDLIGHTS DURING THE GAME ////
    ///////////////////////////////////////////////////////////////////////////////

    // This is built off of a video by Music and Coding called "How to make an accurate and precise timer in JavaScript"
    // but heavily changed
    function Timer(timeInterval){
      this.timeInterval = timeInterval;
      // this is an array of falses of the same length as chordLights used to clear it and easily get the length of chordLights
      this.chordLight = [];
      while( this.chordLight.length < chordProgressions[chordProgression]?.scaleDegrees.length){
        this.chordLight.push(false);
      }
      // start timer/metronome
      this.start = () => {
        // starts from the start of a bar
        currentCount.current = 0;
        // the expected is when we are aiming to turn lights on, we turn all lights off 50 ms prior to give a little flash to indicate the beat / pulse
        this.expected = Date.now() + this.timeInterval;
        // clear the chord lights
        setChordLights(this.chordLight);
        // let everyone know when this timer starts
        for(let j = 0; j < dataConnections.length; j++){
          // make sure we aren't trying to send to the Host's null dataConnection
          if (dataConnections[j] != null) {
            let currentConn = dataConnections[j];
            console.log()
            currentConn.send('M' + this.expected + 'B' + bpm + 'S' + currentChord.current + 'N' + this.chordLight.length + 'O' + timeSignatures[timeSig][0]);  
          }
        }
        // set the Timeout to trigger preround 50 ms before the beat
        timerId.current = setTimeout(this.preround, this.expected - Date.now() - 50);
      }
      // stops the timer
      this.stop = () => {
        clearTimeout(timerId.current);
        setMetronomeIsRunning(false);
        // let everyone know it is stopping
        for(let j = 0; j < dataConnections.length; j++){
          // make sure we aren't trying to send to the Host's null dataConnection
          if (dataConnections[j] != null) {
            let currentConn = dataConnections[j];
            currentConn.send('N');
          }
        }
        // just in case, clear the timer again
        clearTimeout(timerId.current)
        console.log('Stopped timer');
      }
      // clears the lights 50 ms before round is triggered
      this.preround = () => {

        setChordLights(this.chordLight);
        clearTimeout(timerId.current);
        timerId.current = setTimeout(this.round, 50);
      }
      // Sets the correct chord light and creates a looped call to preround     
      this.round = () => {
        // change the lights first (then we calculate everything else for the next loop)
        setChordLights(
          chordLights => 
            [...chordLights.slice(0,currentChord.current),
              true,
              ...chordLights.slice(currentChord.current+1)
            ]
          );
        // calculate when the next beat is going to hit
        this.expected += this.timeInterval;
        // increment the count
        currentCount.current++;
        // if this puts the count higher than the beats in a bar, go to the next bar
        if (currentCount.current > parseInt(timeSignatures[timeSig][0])){
          currentCount.current = 1;
          currentChord.current++;
          // if this puts the bar farther than the last bar, go to the first bar and let everyone know when you are expecting to start the loop again
          if (currentChord.current == this.chordLight.length) {
            currentChord.current = 0;
            // help sync everyone up 
            for(let j = 0; j < dataConnections.length; j++){
              // make sure we aren't trying to send to the Host's null dataConnection
              if (dataConnections[j] != null){
                let currentConn = dataConnections[j];
                // JoinGame doesn't want to remember the bpm, currentChord, number of chords, or number of beats in a bar, so send all that info
                currentConn.send('M' + this.expected + 'B' + bpm + 'S' + currentChord.current + 'N' + this.chordLight.length + 'O' + timeSignatures[timeSig][0]);
              }
            }
          }
        }
        // just in case (this line is basically to quell anxiety)
        clearTimeout(timerId.current);
        // I don't see why this isn't a great way of setting it such that it is always aiming for the beat
        timerId.current = setTimeout(this.preround, this.expected- Date.now() - 50.0);
      }
    }

    // prevents timer skipping
    useEffect(() => {
      return () => clearTimeout(timerId.current);
    }, []);

    // Sets a new currentChord.current, informs peers, and updates the chordLights
    function setNewCurrentChord(chordToBeCurrent){
      // set the chord
      currentChord.current = chordToBeCurrent;
      // tell everyone we are starting on a different chord
      for(let j = 0; j < dataConnections.length; j++){
        // to prevent trying to send to the null pointer when the Host is generating prompts for themselves
        if (dataConnections[j] != null){
          let currentConn = dataConnections[j];
          currentConn.send('S' + chordToBeCurrent + 'N' + chordProgressions[chordProgression]?.scaleDegrees.length);
        }
      }
      // update the lights to reflect the new chord
      let newChordLights = [];
      while(newChordLights.length < chordProgressions[chordProgression]?.scaleDegrees.length){
        newChordLights.length == chordToBeCurrent?newChordLights.push(true):newChordLights.push(false);
      }
      setChordLights(
        [...newChordLights]
      );
    }

    // Turns on and off the metronome
    function toggleCount(){
      setMetronomeIsRunning(prevMetronomeIsRunning => !prevMetronomeIsRunning);
      metronomeIsRunning?metronome.stop():metronome.start();

    }
    /////////////////////////////////////////////////////////////////////////
    //// START OF A BIG SECTION FOR REROLLING THE VARIOUS JAM ATTRIBUTES ////
    /////////////////////////////////////////////////////////////////////////

    // Rerolls the time signature, informing peers and resetting the currentCount
    function rerollTimeSig(){
      console.log('rerolling time signature');
      // roll a new time signature
      // once again, it is done like this so weird time signatures appear less
      // frequently as more typical ones, using timeSignatureProbs
      const newTimeSigRoller = Math.floor(Math.random() * 100) + 1;
      let newTimeSig = 0;
      // see what you got by referencing timeSignatureProbs
      for (let i = 0; i < timeSignatureProbs.length; i++){
        if (newTimeSigRoller <= timeSignatureProbs[i]){
          newTimeSig = i;
          break;
        }
      }
      setTimeSig(newTimeSig); //set it
      // send to everyone
      for(let j = 0; j < dataConnections.length; j++){
        // to prevent trying to send to a null pointer when the Host is generating prompts for themselves
        if (dataConnections[j] != null){
          let currentConn = dataConnections[j];
          currentConn.send('T' + newTimeSig); // 'T' indicates a new timeSignature
        }
      }
      // make sure the beat isn't something out of bounds
      currentCount.current = 1;
    }

    // Rerolls the tempo/BPM and informs peers of new Bpm
    function rerollBpm(){
      console.log('rerolling BPM');
      // roll a new BPM between 40 and 200
      const newBpm = Math.floor(Math.random() * 160) + 40;
      setBpm(newBpm); // set it
      // send it
      for(let j = 0; j < dataConnections.length; j++){
        // to prevent trying to send to a null pointer when the Host is generating prompts for themselves
        if (dataConnections[j] != null){
          let currentConn = dataConnections[j];
          currentConn.send('B' + newBpm); // 'B' indicates a new Bpm
        }
      }
    }

    // Rerolls the key, using the same tonality as the previous key
    // and informs peers of the new key
    function rerollKey(){
      console.log('rerolling Key');
      // Roll a new key, but only the relative majors
      var newKey = Math.floor(Math.random() * 12)*2;
      // add the tonality of the current chord Progression (0 if major, 1 if minor)
      newKey += chordProgressions[chordProgression].tonality;
      setKey(newKey) // set it
      // send it
      for(let j = 0; j < dataConnections.length; j++){
        // to prevent trying to send to a null pointer when the Host is generating prompts for themselves
        if (dataConnections[j] != null){
          let currentConn = dataConnections[j];
          currentConn.send('K' + newKey);
        }
      }
    }

    // Rerolls the chord progression, using the tonality of the current key
    // and informs peers of the new chord progression
    function rerollChordProgression(){
      console.log('rerolling chord progression');
      var newChordProgression;
      //get a chord progression
      do{
        newChordProgression = Math.floor(Math.random() * Object.keys(chordProgressions).length);
      //make sure the tonality of key and proj match, if not, roll another
      }while(chordProgressions[newChordProgression].tonality != key%2)
      setChordProgression(newChordProgression);
      //send to everyone
      for(let j = 0; j < dataConnections.length; j++){
        // to prevent trying to send to a null pointer when the Host is generating prompts for themselves
        if (dataConnections[j] != null){
          let currentConn = dataConnections[j];
          currentConn.send('C' + newChordProgression);
        }
      }
      //make sure the current chord isn't out of bounds
      currentChord.current = 0;
    }
    
  ///////////////////////////////////////////////////////////////////////////////////////////////
  //// THIS STARTS A BIG SECTION OF HTML, MADE MORE IMPENITRABLE BY THE ADDITION OF TAILWIND ////
  ////  Basically it just checks which screen it should be (game or lobby screen) and then   ////
  ////   displays that one. Thankfully the buttons are easy to see, they are the hardest     ////
  ///////////////////////////////////////////////////////////////////////////////////////////////

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
    <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-4 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={0} isSelected={(chordLights.length>0)?chordLights[0]:false} onSelect={() => setNewCurrentChord(0)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={1} isSelected={(chordLights.length>1)?chordLights[1]:false} onSelect={() => setNewCurrentChord(1)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={2} isSelected={(chordLights.length>2)?chordLights[2]:false} onSelect={() => setNewCurrentChord(2)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={3} isSelected={(chordLights.length>3)?chordLights[3]:false} onSelect={() => setNewCurrentChord(3)}/>
    </div>
    <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-4 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={4} isSelected={(chordLights.length>4)?chordLights[4]:false} onSelect={() => setNewCurrentChord(4)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={5} isSelected={(chordLights.length>5)?chordLights[5]:false} onSelect={() => setNewCurrentChord(5)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={6} isSelected={(chordLights.length>6)?chordLights[6]:false} onSelect={() => setNewCurrentChord(6)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={7} isSelected={(chordLights.length>7)?chordLights[7]:false} onSelect={() => setNewCurrentChord(7)}/>
    </div>
    <div className='flex bg-backgroundgray w-screen border-backgroundblack items-center justify-center gap-4 border-4 border-blackgroundblack'>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={8} isSelected={(chordLights.length>8)?chordLights[8]:false} onSelect={() => setNewCurrentChord(8)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={9} isSelected={(chordLights.length>9)?chordLights[9]:false} onSelect={() => setNewCurrentChord(9)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={10} isSelected={(chordLights.length>10)?chordLights[10]:false} onSelect={() => setNewCurrentChord(10)}/>
      <ChordCard keyVal={key} chordProg={chordProgressions[chordProgression].scaleDegrees} index={11} isSelected={(chordLights.length>11)?chordLights[11]:false} onSelect={() => setNewCurrentChord(11)}/>
    </div>
    {
            (hostIndex.current != -1 ) &&
            <div className='flex-col  w-screen bg-backgroundgray text-offwhite text-lg md:text-xl lg:text-2xl text-center border-8 border-backgroundblack'>
            {
              prompts && prompts.map( prompt => {
                console.log(hostIndex.current, 'hostIndex.current');
                if (prompt.id == playerPrompts.current[hostIndex.current * 2]){
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
                console.log(playerPrompts, 'playerPrompts')
                if (prompt.id == playerPrompts.current[hostIndex.current * 2 + 1]){
                  return(
                    <div className= '' key = {prompt.id}>
                      {prompt.prompt}
                    </div>
                  )
                }
              })
            }
            </div>
          }
  </div>
  
    )}
    else return (
    <div className='border border-b-8 border-backgroundblack bg-backgroundblack h-screen'>
      <div className='grid grid-cols-3 bg-buttongold items-center justify-center border-8 border-backgroundblack'>
        {(hostIndex.current == -1)
        ?<button className='bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold  border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => hostJoinGame()}>Join on this device</button>
        :<button className='bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold  border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => changeHostInstrument()}>Change Host instrument</button>}
        <div className='bg-buttongold text-outlinebrown text-2xl  md:text-4xl lg:text-6xl xl:text-8xl font-bold py-2 justify-self-stretch mx-auto'>
          ROOM ID: 
          <div className='text-3xl md:text-5xl lg:text-8xl'>{peerId}</div>
        </div>
        {}<div>
        <button className='bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => startSession()}>Start Game</button>
        </div>
        <br/>
      </div>
      <div className='grid grid-cols-2 place-items-stretch gap-x-4 bg-backgroundblack border-8 border-backgroundblack h-max'>
        <HostCard 
        inst = {bandMateInsts?.length > 0 ? bandMateInsts[0] : -2} 
        name = {(dataConnections.length <=0) ? '' : (bandMateNames.length <= 0) ? '...' : bandMateNames[0]}
        >
          <br/>
          {dataConnections.length > 0 && 
            <button className= 'text-sm xl:text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(0)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 1 ? bandMateInsts[1] : -2} name = {(dataConnections.length <=1) ? '' : (bandMateNames.length <= 1) ? '...' : bandMateNames[1]} >
          <br/>
          {dataConnections.length > 1 && 
            <button className= 'text-sm xl:text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(1)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 2 ? bandMateInsts[2] : -2} name = {(dataConnections.length <=2) ? '' : (bandMateNames.length <= 2) ? '...' : bandMateNames[2]} >
          <br/>
          {dataConnections.length > 2 && 
            <button className= 'text-sm xl:text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(2)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 3 ? bandMateInsts[3] : -2} name = {(dataConnections.length <=3) ? '' : (bandMateNames.length <= 3) ? '...' : bandMateNames[3]} >
          <br/>
          {dataConnections.length > 3 && 
            <button className= 'text-sm xl:text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(3)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 4 ? bandMateInsts[4] : -2} name = {(dataConnections.length <=4) ? '' : (bandMateNames.length <= 4) ? '...' : bandMateNames[4]} >
        <br/>
        {dataConnections.length > 4 && 
            <button className= 'text-sm xl:text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(4)}>Kick Player</button>
          }
        </HostCard>

        <HostCard inst = {bandMateInsts.length > 5 ? bandMateInsts[5] : -2} name = {(dataConnections.length <=5) ? '' : (bandMateNames.length <= 5) ? '...' : bandMateNames[5]} >
        <br/>
        {dataConnections.length > 5 && 
            <button className= 'text-sm xl:text-lg bg-buttongold hover:bg-buttondarkgold text-outlinebrown font-bold py-2 px-4 border-2 border-outlinebrown border-b-8 rounded-full' onClick={() => sendKick(5)}>Kick Player</button>
          }
        </HostCard>
    </div>                         
    </div>

  )
}

export default HostGame