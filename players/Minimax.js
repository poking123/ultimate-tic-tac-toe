const { makeOverallBoard, smallBoardIsFinished, getPossibleMoves, gameIsFinished, makeMove } = require('../BoardHelper');
const { minimaxMaxDepth } = require('../Constants');

function minimaxPlayer(board, player, lastSection) {
    let minimaxResults = minimax(board, player, lastSection); // returns array [optimalMove, moveEvalution]
    let optimalMoveIndex = 0;
    console.log('minimax move made');
    return minimaxResults[optimalMoveIndex];
}

function minimax(board, player, lastSection, maxDepth = minimaxMaxDepth, currDepth = 0) {
    // Player 1 = maximize
    // Player 2 = minimize
    if (currDepth === maxDepth) return [-1, evaluateBoard(board)]; // dummy value since we don't know the previous move
    console.log('currDepth is ', currDepth);
    let possibleMoves = getPossibleMoves(board, lastSection);
    console.log('lastSection is ', lastSection);
    // console.log('possibleMoves length is ', possibleMoves.length);
    // process.exit();
    
    let gameFinished = gameIsFinished(board);
    if (possibleMoves.length === 0 || gameFinished) return [-1, evaluateBoard(board)]; // dummy value since we don't know the previous move

    let optimalMoves = [];
    let optimalMoveValue;
    let optimalDepth;
    for (let i = 0; i < possibleMoves.length; i++) {
        let currMove = possibleMoves[i];
        
        let newBoard = makeMove(currMove, board, player);
        let minimaxResults = minimax(newBoard, 3 - player, maxDepth, currDepth + 1, evaluateBoard, getPossibleMoves, gameIsFinished, makeMove);
        let currBoardEvaluation = minimaxResults[1];
        if (optimalMoves.length === 0) {
            optimalMoves.push(currMove);
            optimalMoveValue = currBoardEvaluation;
            optimalDepth = currDepth;
        } else {
            if (currBoardEvaluation === optimalMoveValue) {
                if (optimalDepth === currDepth) {
                    optimalMoves.push(currMove);
                } else if (currDepth < optimalDepth) {
                    optimalMoves = [currMove];
                    optimalDepth = currDepth;
                }
            } else {
                if (player === 1) {
                    if (currBoardEvaluation > optimalMoveValue) {
                        optimalMoveValue = currBoardEvaluation;
                        optimalMoves = [currMove];
                    }
                } else {
                    if (currBoardEvaluation < optimalMoveValue) {
                        optimalMoveValue = currBoardEvaluation;
                        optimalMoves = [currMove];
                    }
                }
            }
        }

    }
    if (optimalMoves.length === 1) {
        return [optimalMoves[0], optimalMoveValue];
    } else {
        let choice = Math.floor(Math.random() * optimalMoves.length);
        return [optimalMoves[choice], optimalMoveValue];
    }
}

function evaluateBoard(board) {
    let overallBoard = makeOverallBoard(board);
    let result = smallBoardIsFinished(overallBoard);

    if (result === 1) {
        return 1;
    } else if (result === 2) {
        return -1;
    }

    return 0;
}


let toExport = {
    minimax,
};

module.exports = toExport;