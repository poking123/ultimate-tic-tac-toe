let { board, testBoard, positionBoard } = require('./Boards');
const { getPossibleMoves, printBoard, makeOverallBoard, gameIsFinished } = require('./BoardHelper');
let { playGame, makeActualMove } = require('./PlayGame');
const { playMCST } = require('./MCST');
const { makeHumanMove } = require('./HumanPlayer');
const { minimax } = require('./Minimax');

playGame(board, makeHumanMove, playMCST, 1);
