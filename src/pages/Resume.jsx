import React from 'react'
import { Link } from 'react-router-dom';

const Resume = () => {
    let width = screen.width;
    if (width >= 950){
        return (
            <iframe className='p-16 bg-cork' width="918" height="1200" src="https://docs.google.com/document/d/e/2PACX-1vQZE4toLVNhS3mPHuqsO5tHJZTJVWkPBCidauPGI6saqJJEc7gG4JMUqgobWZeKt8E_uOrD0xWh9dR5/pub?embedded=true"></iframe>
          )
    }else{
        return(
            <>
            <div className='font-serif bg-[#f8f7ed] p-4 md:p-8'>
            Because you are on a small device, the formatting is messed up, but the content should be the same.
            </div>
            <iframe className='p-8 bg-cork' width="400" height="540" src="https://docs.google.com/document/d/e/2PACX-1vQZE4toLVNhS3mPHuqsO5tHJZTJVWkPBCidauPGI6saqJJEc7gG4JMUqgobWZeKt8E_uOrD0xWh9dR5/pub?embedded=true"></iframe>
            </>
          )
    }

}

export default Resume