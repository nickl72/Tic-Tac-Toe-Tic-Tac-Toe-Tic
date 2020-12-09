const gameBoard = document.querySelector('.game-board');
const gameBoardArr =[];
const rows = 25;
const columns = 25;
let playerOneTurn = true;


newGame();
console.log(gameBoard)
console.log(gameBoardArr)

function newGame() {
    let count = 0;
    for (i=0; i < rows; i++) {
        const row = document.createElement('div');
        row.classList.add(`row-${i}`, 'row');
        gameBoard.appendChild(row);
        gameBoardArr.push([]);
        for (j = 0; j < columns; j++) {
            const square = document.createElement('div');
            square.classList.add(`column-${j}`, `row-${i}`, 'pointer', 'square');
            square.attributes.column = j;
            square.attributes.row = i;
            row.appendChild(square);
            square.addEventListener('click', toggleClass);
            square.innerText = count;
            gameBoardArr[i].push(-1);
            count ++;
        }
    }
}

function toggleClass(event) {
    const clicked = event.target;
    clicked.classList.remove('pointer');
    clicked.removeEventListener('click', toggleClass);
    
    if (playerOneTurn) {
        clicked.classList.add('player-one');
        playerOneTurn = false;
        clicked.attributes.player = 1
    } else {
        clicked.classList.add('player-two');
        playerOneTurn = true;
        clicked.attributes.player = 2;
    }
    gameBoardArr[clicked.attributes.row][clicked.attributes.column] = clicked.attributes.player
    console.log(gameBoardArr)
    // checkBoard(clicked);
}

function checkBoard(element) {
    let index = ((element.attributes.row-1) * columns) + element.attributes.column-1;
    let currentDiv = gameBoard.children[index];
    console.log(currentDiv);
    console.log(element);
    
    // while (element.attributes.player === currentDiv.attributes.player) {
        if (currentDiv.attributes.player === element.attributes.player) {
            console.log('upleft')

        }
    // }
}

