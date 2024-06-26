import instrument0 from '../assets/images/Instrument0.png'
import instrument1 from '../assets/images/Instrument1.png'
import instrument2 from '../assets/images/Instrument2.png'
import instrument3 from '../assets/images/Instrument3.png'
import instrument4 from '../assets/images/Instrument4.png'
import instrument5 from '../assets/images/Instrument5.png'
import noInstrument from '../assets/images/Instrument-1.png'
import join from '../assets/images/Instrument-2.png'
const HostCard = ({ children, inst, name }) => {
    let instrumentName = '';
    let imageOfInstrument;
    switch (inst){
        case 0:
            instrumentName = 'Rhythm Guitar';
            imageOfInstrument = instrument0;
            break;
        case 1:
            instrumentName = 'Lead Guitar';
            imageOfInstrument = instrument1;
            break;
        case 2:
            instrumentName = 'Bass Guitar';
            imageOfInstrument = instrument2;
            break;
        case 3:
            instrumentName = 'Drums';
            imageOfInstrument = instrument3;
            break;
        case 4:
            instrumentName = 'Keyboards';
            imageOfInstrument = instrument4;
            break;
        case 5:
            instrumentName = 'Vocals';
            imageOfInstrument = instrument5
            break;
        case -1:
            instrumentName = 'No Instrument'
            imageOfInstrument = noInstrument;
            break;
        case -2:
            instrumentName = '';
            imageOfInstrument = join;
        default:
            break;
    }


    return <div className='flex-col text-3xl font-bold text-offwhite mb-6 align-center bg-backgroundgray  border-8 border-backgroundblack rounded-bl-lg rounded-br-lg'>
        
        <div className='text-xl lg:text-4xl xl:text-6xl font-bold bg-buttongold text-outlinebrown w-full text-center rounded-tl-lg rounded-tr-lg'>  {name}</div>
        <br/>

        <img className='h-20 lg:h-24 xl:h-36 w-auto items-center mx-auto my-auto'
            src={imageOfInstrument}
            alt={instrumentName}
        />
        <h2 className=' text-lg lg:text-xl xl:text-2xl font-bol text-center'>{instrumentName}</h2>
        { children }
    </div>
};
export default HostCard;