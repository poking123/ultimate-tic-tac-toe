function minimax(board, player, maxDepth, currDepth = 0, evaluateBoard, getPossibleMoves, gameIsFinished, makeMove) {
    // Player 1 = maximize
    // Player 2 = minimize
    if (currDepth === maxDepth) return [-1, evaluateBoard(board)]; // dummy value since we don't know the previous move
    let possibleMoves = getPossibleMoves(board);
    let gameIsFinished = gameIsFinished(board);
    if (possibleMoves.length === 0 || gameIsFinished) return [-1, evaluateBoard(board)]; // dummy value since we don't know the previous move

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


let toExport = {
    minimax,
};

module.exports = toExport;