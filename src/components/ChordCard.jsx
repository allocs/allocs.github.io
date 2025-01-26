const ChordCard = ({ keyVal, chordProg, index, isSelected, onSelect, promptsAr }) => {
    if(index >= chordProg.length) return <div/>;
    //const keys = ['C major','A minor','G major','E minor','D major','B minor','A major','F# minor','E major','Db minor','B major','Ab minor','F# major','Eb minor','Db major','Bb minor','Ab major','F minor','Eb major','C minor','Bb major','G minor','F major','D minor'];
    const keys = [['C','D','E','F','G','A','B'],['G','A','B','C','D','E','F#'],['D','E','#F','G','A','B','C#'],['A','B','C#','D','E','F#','G#'],['E','F#','G#','A','B','C#','D#'],['B','C#','D#','E','F#','G#','A#'],['F#','G#','A#','B','C#','D#','E#'],['Db','Eb','F','Gb','Ab','Bb','C'],['Ab','Bb','C','Db','Eb','F','G'],['Eb','F','G','Ab','Bb','C','D'],['Bb','C','D','Eb','F','G','A'],['F','G','A','Bb','C','D','E']]
    const chordModifyingPrompts = [30];
    const myKey = keys[Math.floor(keyVal/2)];
    let chord = chordProg[index];
    //check this chord for being modified by the prompt
    let modifyingPrompt = -1;
    console.log(promptsAr);
    //first check for the prompts
    for (let i = 0; i < promptsAr.length; i++){
        for (let j = 0; j < chordModifyingPrompts.length; j++){
            if (promptsAr[i].id == chordModifyingPrompts[j]){
                console.log('found one!')
                modifyingPrompt = chordModifyingPrompts[j];
            }
        }
    }
    //check if this chord is modified by said prompt
    switch (modifyingPrompt){
        // This switches I -> iv and i->III
        case 30:
            if (chord == 1) {
                chord = -6
            }else{
                if (chord == -1)
                    chord = 3
            }
            break;
    }
    let offSet = 0;
    if (keyVal % 2 == 1) offSet = 5;
    //the %10 is because chords that arent just triads are stored as such:
    // __7   = 7_   (ex: V7 = 75)
    // __dim = 1_   (ex: viidim = 17)
    
    var myChordName = myKey[(offSet + (Math.abs(chord)%10) -1 )%7];
    if ( Math.abs(chord) < 10 ){
        (chord > 0) ? myChordName += "" : myChordName += "m"
    }else{
        switch (Math.floor(Math.abs(chord)/10 % 10)){
            case 1:
                myChordName += "dim";
                break;
            case 2:
                myChordName += "sus2";
                break;
            case 3:
                myChordName += "";
                break;
            case 4:
                myChordName += "sus4";
                break;
            case 5:
                myChordName += "";
                break;
            case 6:
                myChordName += "";
                break;
            case 7:
                myChordName += "7";
                break;
            case 8:
                myChordName += "";
                break;
            case 9:
                myChordName += "";
                break;
        }
    }



    return ( <>{isSelected  
     ?<button className='bg-chordgold rounded-lg py-3 pb-4'>
        <div className='bg-yellowlight blur-sm text-outlinebrown font-bold h-3 w-3 mx-auto    rounded-full'> </div>
        <div className='m-auto font-bold py-2'>
        {myChordName}

        </div>
        <div className='text-chordgold font-bold'>
            G#sus4
        </div>
    </button>
    :<button onClick={onSelect} className='bg-chordgold  rounded-lg py-4'>
        <div className='bg-backgroundgray  text-outlinebrown font-bold h-2 w-2 mx-auto py-1 px-1   rounded-full'> </div>
        <div className='m-auto font-bold py-2 '>
        {myChordName}

        </div>
        <div className='text-chordgold font-bold'>
            G#sus4
        </div>
    </button>
    }
</>
)};
export default ChordCard;