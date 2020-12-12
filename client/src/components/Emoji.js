import React from 'react';
import Picker from 'emoji-picker-react';


const Emoji = (props) => {
    return (
        <Picker 
            onEmojiClick={props.onEmojiClick}
            className='emoji'
        />  
    )
}

export default Emoji