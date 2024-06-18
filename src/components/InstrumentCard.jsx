import instrument0 from '../assets/images/Instrument0Brown.png'
import instrument1 from '../assets/images/Instrument1Brown.png'
import instrument2 from '../assets/images/Instrument2Brown.png'
import instrument3 from '../assets/images/Instrument3Brown.png'
import instrument4 from '../assets/images/Instrument4Brown.png'
import instrument5 from '../assets/images/Instrument5Brown.png'
import instrument0selected from '../assets/images/Instrument0.png'
import instrument1selected from '../assets/images/Instrument1.png'
import instrument2selected from '../assets/images/Instrument2.png'
import instrument3selected from '../assets/images/Instrument3.png'
import instrument4selected from '../assets/images/Instrument4.png'
import instrument5selected from '../assets/images/Instrument5.png'

const InstrumentCard = ({ inst, selected, onSelect }) => {
    let isSelected = (inst == selected);
    let instrumentName = '';
    let imageOfInstrument = null;
    switch (inst){
        case 0:
            instrumentName = 'Rhythm\nGuitar';
            imageOfInstrument = isSelected ? instrument0selected : instrument0;
            break;
        case 1:
            instrumentName = 'Lead Guitar';
            imageOfInstrument = isSelected ? instrument1selected : instrument1;
            break;
        case 2:
            instrumentName = 'Bass Guitar';
            imageOfInstrument = isSelected ? instrument2selected : instrument2;
            break;
        case 3:
            instrumentName = 'Drums';
            imageOfInstrument = isSelected ? instrument3selected : instrument3;
            break;
        case 4:
            instrumentName = 'Keyboards'
            imageOfInstrument = isSelected ? instrument4selected : instrument4;
            break;
        case 5:
            instrumentName = 'Vocals'
            imageOfInstrument = isSelected ? instrument5selected : instrument5;
            break;
        default:
            imageOfInstrument = instrument0;
            break;
    }

    return ( <>{isSelected  
     ?<button className='bg-backgroundgray p-10 rounded-lg'>
        <div className='container-xl size-28 lg:size-36 xl:size-48 m-auto'>
            <h2 className='text-xl xl:text-3xl font-bold text-offwhite xl:mb-6 text-center items-center'>
                {instrumentName}
            </h2>
            <img className='h-24 w-auto mx-auto'
            src={imageOfInstrument}
            alt={instrumentName}
            />
        </div>
    </button>
    :<button className='bg-buttongold hover:bg-buttondarkgold p-10 rounded-lg' onClick={onSelect}>
        <div className='container-xl size-28 lg:size-36 xl:size-48 m-auto'>
            <h2 className='text-xl xl:text-3xl font-bold text-outlinebrown xl:mb-6 text-center place-items-center'>
                {instrumentName}
            </h2>
            <img className='h-24 w-auto mx-auto'
            src={imageOfInstrument}
            alt={instrumentName}
            />
        </div>
    </button>
    }
</>
)};
export default InstrumentCard;