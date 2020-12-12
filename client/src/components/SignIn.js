import React, {useState} from 'react';
import styled from 'styled-components';
import { CompactPicker } from 'react-color';
import Picker from 'emoji-picker-react';
import Emoji from './Emoji';


const Div = styled.div`
    position: fixed;
    margin: 0;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    z-index: 3;
    background: rgba(0,0,0,.3);
    display: flex;
    align-items: center;
    justify-content: center;
    form {
        background: white;
        min-height: 30vh;
        min-width: 30vw;
        padding: 5vw;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        border-radius: 3px;
    }
        box-shadow: .2em .2em 2em .2em ;
        .emoji {
            position: absolute;
            z-index: 5;
        }

`

const SignIn = (props) => {
    const [color, setColor] = useState('white')
    const [username, setName] = useState('');

    const setUsername = (e) => {
        e.preventDefault()
        if (!e.target.symbol.value || !e.target.username.value) {
            return
        }
        const user = {}
        user.username = e.target.username.value
        user.symbol = e.target.symbol.value
        user.color = color
        props.updateUser(user)
    }

    const handleColorChange = ({hex}) => setColor(hex)
    
    const onEmojiClick = (e, emoji) => {
        document.querySelector('.emoji-search').value = emoji.emoji
        
    }
    const firstClick = (e) => {
        const symbolInput = document.querySelector('.emoji-search')
        symbolInput.name = 'symbol'
    }

    return (
        <Div onClick={firstClick}>
            <form onSubmit={setUsername}>
                <input type='text' name='username' placeholder='username' value={username} onChange={(e) => {setName(e.target.value)}}/>
                {/* <span style={{background: player.color, border: '2px solid black', width: '2em',height: '2em'}}></span> */}
                <Picker 
                    onEmojiClick={onEmojiClick}
                    disableAutoFocus='true'
                    // className='emoji'
                    // groupNames={{smileys_people:"PEOPLE"}}
                    // onKeyPress={updateEmoji}
                />
                <CompactPicker 
                    color={color}
                    onChangeComplete={ handleColorChange } 
                />
                <input type='submit' value='submit'/>
            </form>
        </Div>
    )
}


export default SignIn