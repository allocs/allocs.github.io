const ChordCard = ({ keyVal, chordProg, index, isSelected }) => {
    if(index >= chordProg.length) return <div/>;
    //const keys = ['C major','A minor','G major','E minor','D major','B minor','A major','F# minor','E major','Db minor','B major','Ab minor','F# major','Eb minor','Db major','Bb minor','Ab major','F minor','Eb major','C minor','Bb major','G minor','F major','D minor'];
    const keys = [['C','D','E','F','G','A','B'],['G','A','B','C','D','E','F#'],['D','E','#F','G','A','B','C#'],['A','B','C#','D','E','F#','G#'],['E','F#','G#','A','B','C#','D#'],['B','C#','D#','E','F#','G#','A#'],['F#','G#','A#','B','C#','D#','E#'],['Db','Eb','F','Gb','Ab','Bb','C'],['Ab','Bb','C','Db','Eb','F','G'],['Eb','F','G','Ab','Bb','C','D'],['Bb','C','D','Eb','F','G','A'],['F','G','A','Bb','C','D','E']]
    const myKey = keys[Math.floor(keyVal/2)];
    const chord = chordProg[index];
    let offSet = 0;
    if (keyVal % 2 == 1) offSet = 5;
    //the %10 is because chords that arent just triads are stored as such:
    // __7   = 7_   (ex: V7 = 75)
    // __dim = 1_   (ex: viidim = 17)
    
    var myChordName = myKey[(offSet + (Math.abs(chord)%10) -1 )%7];
    if ( Math.abs(chord) < 10 ){
        (chord > 0) ? myChordName += "maj" : myChordName += "min"
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
     ?<button className='bg-buttongold p-10 rounded-lg'>
        <div className='container-xl size-28 lg:size-36 xl:size-48 m-auto font-bold text-backgroundgray'>
        {myChordName}

        </div>
    </button>
    :<button className='bg-buttongold hover:bg-buttondarkgold p-10 rounded-lg'>
        <div className='container-xl size-28 lg:size-36 xl:size-48 m-auto'>
        {myChordName}

        </div>
    </button>
    }
</>
)};
export default ChordCard;