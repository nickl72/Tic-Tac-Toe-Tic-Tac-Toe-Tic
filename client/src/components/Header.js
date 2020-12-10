import React from 'react';

const Header = (props) => {
console.log(props.turn)
    return (
        <header>
            <h1>Tic-Tac-Toe-Tic-Tac-Toe-Tic</h1>
            <h2>{props.turn ? 
                `${props.turn}'s Turn`
                :
                'Waiting for game to start'
            }</h2>
        </header>
    )
}

export default Header