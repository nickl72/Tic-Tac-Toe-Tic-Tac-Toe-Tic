import React, {useState} from 'react';
import styled from 'styled-components';
import { CompactPicker } from 'react-color';
import Picker from 'emoji-picker-react';


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
    }

`

const SignIn = (props) => {
    const [color, setColor] = useState('white')
    const [chosenEmoji, setChosenEmoji] = useState('');
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
        console.log(emoji)
        setChosenEmoji(emoji.emoji)

    }

    return (
        <Div>
            <form onSubmit={setUsername}>
                <input type='text' name='username' placeholder='username' value={username} onChange={(e) => {setName(e.target.value)}}/>
                <input type='text' name='symbol' placeholder='symbol' value={chosenEmoji} onChange={(e) => {setChosenEmoji(e.target.value)}} maxLength='1'/>
                <CompactPicker 
                    color={color}
                    onChangeComplete={ handleColorChange } 
                />
                <Picker onEmojiClick={onEmojiClick}/>
                <input type='submit' value='submit'/>
            </form>
        </Div>
    )
}

export default SignIn