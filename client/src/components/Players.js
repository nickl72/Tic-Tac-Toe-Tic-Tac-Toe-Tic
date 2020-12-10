import React from 'react';

const Players = (props) => {
    return (
        <div className='players'>
            <h2>Players</h2>
            {props.players.map((player, key) => (
                <div key={key}><h3>{player.username}: <span style={{background: player.color, border: '2px solid black', width: '2em',height: '2em'}}>{player.symbol}</span></h3></div>
            ))}
        </div>
    )
}

export default Players