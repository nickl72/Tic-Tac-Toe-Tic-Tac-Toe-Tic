import React from 'react';

const Players = (props) => {
    return (
        <div>
            <h2>Players</h2>
            {props.players.map((player, key) => (
                <div><h3>{player.username}: {player.symbol}</h3></div>
            ))}
        </div>
    )
}

export default Players