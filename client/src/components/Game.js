import React from 'react';

const Game = (props) => {
    console.log(props)
    const board = []
    
    return (
        <div className='game-board'>
            {props.board.map((item, key) => (
                <div 
                    className={`row-${item.row} col-${item.col}`} 
                    key={key} 
                    index={key}
                    onClick={props.boardClick} 
                >
                {props.board[key].symbol}
                </div>))}
        </div>
    )
}

export default Game