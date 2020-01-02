const { makeAllBoards, overallBoardIsFinished, getPossibleMoves, printBoard } = require('./BoardHelper');
let { nextMoveSection } = require('./Section');
const { positionBoard } = require('./Boards');
let values = require('./Values');

function playGame(board) {
    playTurn(board);
}

function playTurn(board) {
    if (!overallBoardIsFinished(board)) {
        let possibleMovesArr = getPossibleMoves(board, values.lastSection);
        console.log('Current Game Board');
        printBoard(board);
        console.log('Position Board');
        printBoard(positionBoard);
        console.log('Possible Moves: ', possibleMovesArr);
    } else {
        console.log('Game has Finished.');
    }
}

function makeActualMove(move, board, player) {
    let row = Math.floor(move / 3);
    let col = move % 3;
    board[row][col] = player;
    values.lastSection = nextMoveSection(move);

    return board;
}

let toExport = {
    playGame,
    playTurn,
    makeActualMove,
};

module.exports = toExport;