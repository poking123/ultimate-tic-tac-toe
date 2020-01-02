let { board, testBoard, positionBoard } = require('./Boards');
const { getPossibleMoves, printBoard, makeOverallBoard, overallBoardIsFinished } = require('./BoardHelper');
let { playGame, makeActualMove } = require('./PlayGame');
let values = require('./Values');
const { playMCST } = require('./MCST');
const { rl } = require('./ReadInput');

playGame(board);

// let b = makeOverallBoard(testBoard);
// console.log(b[0]);
// console.log(b[1]);
// console.log(b[2]);
// let result = overallBoardIsFinished(testBoard);
// console.log(result);
rl.on('line', (move) => {
    move = parseInt(move);
    let possibleMovesArr = getPossibleMoves(board, values.lastSection);
    if (possibleMovesArr.includes(move)) {
        makeActualMove(move, board, values.player);
        values.player = 3 - values.player;
        playMCST(board, values.player);
    } else {
        printBoard(board);
        printBoard(positionBoard);
        console.log("Invalid Move, please make another one.");
    }
});

// printBoard(testBoard);
// printBoard(positionBoard);
// let ob = makeOverallBoard(makeAllBoards(testBoard));
// console.log('ob is ', ob[0]);
// console.log('ob is ', ob[1]);
// console.log('ob is ', ob[2]);
// let result = getPossibleMoves(testBoard, 2);
// console.log(result);