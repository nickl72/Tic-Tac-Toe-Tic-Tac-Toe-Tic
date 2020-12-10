import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    background: rgba(0,0,0,.3);
    div {
        background: white;
        height: 30vh;
        width: 30vw;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }
`

const Winner = (props) => {
    return (
        <Div>
            <div>
                <h1>{props.winner} Wins</h1>
                <button onClick={props.resetGame}>Start New Game</button>
            </div>
        </Div>
    )
}

export default Winner