import React from 'react';
import Winner from './Winner';
import styled from 'styled-components';

const Div = styled.div`
    position: relative;
`

const Game = (props) => {
    console.log(props)
    return (
        <div className='game-container'>
            {props.winner && <Winner resetGame={props.resetGame} winner={props.winner} />}
            <Div className='game-board'>
                {props.board.map((item, key) => (
                    <div 
                        className={`row-${item.row} col-${item.col}`} 
                        key={key} 
                        index={key}
                        onClick={props.boardClick}
                        style={{background: item.color}} 
                    >
                    {props.board[key].symbol}
                    </div>))}
            </Div>
        </div>
    )
}

export default Game