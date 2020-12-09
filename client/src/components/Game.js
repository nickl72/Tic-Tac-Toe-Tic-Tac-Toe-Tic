import React from 'react';

const Game = () => {
    const board = []
    for (let row= 1; row<= 25; row++) {
        for (let col = 1; col<=25; col++) {
            board.push({row, col})
        }
    }
    return (
        <div className='game-board'>
            {board.map(item => {
                return (<div>x</div>)
            })}

        </div>
    )
}

export default Game