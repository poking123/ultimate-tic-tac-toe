const { makeAllBoards, gameIsFinished, getPossibleMoves, printBoard } = require('./BoardHelper');
let { returnSmallBoardSection } = require('./Section');
const { positionBoard } = require('./Boards');

// let player = 1;
let lastSection = -1;

function playGame(board, player1, player2, currPlayer) {
    let result = gameIsFinished(board);
    while (!result) {
        console.log('Current Game Board');
        printBoard(board);
        console.log('Position Board');
        printBoard(positionBoard);
        let possibleMovesArr = getPossibleMoves(board, lastSection);
        console.log('Possible Moves: ', possibleMovesArr);
        let move;
        if (currPlayer === 1) {
            console.log('PLAYER 1 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            move = player1(board, currPlayer, lastSection);
        } else {
            console.log('PLAYER 2 #########################################################################');
            move = player2(board, currPlayer, lastSection);
        }
        console.log('currPlayer is ', currPlayer);
        makeActualMove(move, board, currPlayer);
        console.log('Move Played: ' + move);
        currPlayer = 3 - currPlayer;
        result = gameIsFinished(board);
    }

    printBoard(board);
    if (result === 1) {
        console.log('Player 1 Has Won!!!');
    } else if (result === 2) {
        console.log('Player 2 Has Won!!!');
    } else if (result === 3) {
        console.log('The game is drawn!!!');
    }
}

function playTurn(board) {
    if (!gameIsFinished(board)) {
        let possibleMovesArr = getPossibleMoves(board, lastSection);
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
    console.log('move is ', move);
    board[row][col] = player;
    lastSection = returnSmallBoardSection(move);

    return board;
}

let toExport = {
    playGame,
    playTurn,
    makeActualMove,
};

module.exports = toExport;