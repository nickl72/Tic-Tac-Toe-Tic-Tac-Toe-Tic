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
        font-size: large;
        background: white;
        min-height: 30vh;
        min-width: 30vw;
        padding: 2em;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        border-radius: 3px;
        box-shadow: .2em .2em 2em .2em ;
        .form-child{
            margin: 1em;
        }


    }

`

const SignIn = (props) => {
    const [color, setColor] = useState('white')
    const [username, setName] = useState('');
    const [symbol, setSymbol] = useState('');

    const setUsername = (e) => {
        e.preventDefault()
        const symbolUnavailable = (props.users.length ? props.users.reduce((acc,user) => acc * (user.symbol === symbol), true) : false)
        const usernameUnavailable = props.users.length ? props.users.reduce((acc,user) => acc * (user.username === e.target.username.value), true): false
        console.log(usernameUnavailable, symbolUnavailable)
        if (!symbol || !e.target.username.value || symbolUnavailable || usernameUnavailable) {
            return
        }
        const user = {}
        user.username = e.target.username.value
        user.symbol = symbol
        user.color = color
        props.updateUser(user)
    }

    const handleColorChange = ({hex}) => setColor(hex)
    
    const onEmojiClick = (e, emoji) => {
        document.querySelector('.emoji-search').value = ''
        setSymbol(emoji.emoji)
        
    }
    const firstClick = (e) => {
        const symbolInput = document.querySelector('.emoji-search')
        symbolInput.name = 'symbol'
        symbolInput.setAttribute('autocomplete', 'off')
        symbolInput.addEventListener('change', (e) => {setSymbol(e.target.value)})
        symbolInput.addEventListener('keyup', (e) => {setSymbol(e.target.value)})

    }

    return (
        <Div onClick={firstClick}>
            <form onSubmit={setUsername}>
                <input className='form-child' type='text' name='username' placeholder='username' value={username} onChange={(e) => {setName(e.target.value)}}/>
                <span className='form-child' style={{background: color, border: '2px solid black', width: '2em',height: '2em'}}>{symbol}</span>
                <div className='form-child'>
                    <Picker 
                        onEmojiClick={onEmojiClick}
                        disableAutoFocus='true'
                    />
                </div>
                <CompactPicker 
                    className='form-child'
                    color={color}
                    onChangeComplete={ handleColorChange } 
                />
                <input className='form-child' type='submit' value='submit' />
            </form>
        </Div>
    )
}


export default SignIn