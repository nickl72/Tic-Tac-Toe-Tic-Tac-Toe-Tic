const gameboard = document.querySelector('.game-board');
const rows = 25;
const columns = 25;

for (i=0; i < columns; i++) {
    for (j = 0; j < rows; j++) {
        const square = document.createElement('div');
        square.classList.add(`column-${i}`, `row-${j}`);
        gameboard.appendChild(square);
    }
}