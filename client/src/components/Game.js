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
            {board.map((item, key) => (
                <div 
                    className={`row-${item.row} col-${item.col}`} key={key} 
                    onClick={(e) => {e.target.innerText = 'x'}} 
                >
                </div>))}
        </div>
    )
}

export default Game