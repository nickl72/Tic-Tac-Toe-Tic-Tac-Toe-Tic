import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    z-index: 2;
    background: rgba(0,0,0,.3);
    display: flex;
    align-items: center;
    justify-content: center;
    form {
        background: white;
        height: 30vh;
        width: 30vw;
        padding: 5vw;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

`

const SignIn = (props) => {

    const setUsername = (e) => {
        e.preventDefault()
        const user = {}
        user.username = e.target.username.value
        user.symbol = e.target.symbol.value
        props.updateUser(user)
    }
    
    return (
        <Div>
            <form onSubmit={setUsername}>
                <input type='text' name='username' placeholder='username' />
                <input type='text' name='symbol' placeholder='symbol' />
                <input type='submit' value='submit'/>
            </form>
        </Div>
    )
}

export default SignIn