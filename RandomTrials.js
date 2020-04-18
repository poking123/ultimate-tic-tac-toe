const { makeAllBoards, getPossibleMoves, playUntilFinished, } = require('./BoardHelper');
const { player, playTurn, makeMove, makeActualMove} = require('./PlayGame');

function playRandomTrialsComputerMove(board, lastSection) {
    if (!gameIsFinished(board)) {
        console.log('Computer is thinking...');
        let possibleMovesArr = getPossibleMoves(board, lastSection);
        let optimalMove;
        let optimalMoveWins;

        for (let i = 0; i < possibleMovesArr.length; i++) {
            let currWins = 0;
            let move = possibleMovesArr[i];
            let newBoard = board.map(row => [...row]);
            newBoard = makeMove(move, newBoard, player);

            for (let j = 0; j < 10000; j++) {
                let result = playUntilFinished(newBoard, player, lastSection);
                if (result === player) {
                    currWins++;
                }
            }

            if (optimalMove === undefined || currWins > optimalMoveWins) {
                optimalMove = move;
                optimalMoveWins = currWins;
            }
        }

        console.log('Computer\'s Move: ', optimalMove);
        console.log('optimal wins is ', optimalMoveWins);
        makeActualMove(optimalMove, board, player);
        player = 3 - player;
        playTurn();
    } else {
        console.log('Game has Finished.');
    }
}

let toExport = {
    playRandomTrialsComputerMove,
};

module.exports = toExport;