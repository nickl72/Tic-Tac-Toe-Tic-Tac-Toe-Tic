import React from 'react';

const Footer = (props) => {
    return (
        <footer>
            <p onClick={props.restartGame}>Created by Nick LaPointe</p>
        </footer>
    )
}

export default Footer