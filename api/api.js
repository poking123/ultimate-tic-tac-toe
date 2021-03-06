const express = require('express');
const router = express.Router();


// Game
let { makeActualMove } = require('../PlayGame');
const { getPossibleMoves, makeOverallBoard, gameIsFinished } = require('../BoardHelper');
const { playMCST } = require('../players/MCST');
const { returnSmallBoardSection } = require('../Section');

// api
router.post('/makeComputerMove', function(req, res) {
    let {board, player, lastSection} = req.body;
    let iterations = 5000;
    let exploreCoefficient = 0.4;
    let MCST = playMCST(iterations, exploreCoefficient); // MCST Is A Function
    let move = MCST(board, player, lastSection);
    board = makeActualMove(move, board, player);
    player = 3 - player;
    
    lastSection = returnSmallBoardSection(move);
    let row = Math.floor(lastSection / 3);
    let col = lastSection % 3;
    let overallBoard = makeOverallBoard(board);
    if (overallBoard[row][col] !== 0) {
        lastSection = -1;
    }

    let gameResult = gameIsFinished(board);

    res.send({board, player, lastSection, gameIsFinished: gameResult});
});

router.post('/makeHumanMove', function(req, res) {
    let {board, player, move, lastSection} = req.body;
    let allPossibleMoves = getPossibleMoves(board, lastSection);
    let moveMade = allPossibleMoves.includes(move);

    if (!moveMade) {
        res.send({moveMade});
    } else {
        board = makeActualMove(move, board, player);
        player = 3 - player;

        lastSection = returnSmallBoardSection(move);
        let row = Math.floor(lastSection / 3);
        let col = lastSection % 3;
        let overallBoard = makeOverallBoard(board);
        if (overallBoard[row][col] !== 0) {
            lastSection = -1;
        }

        let gameResult = gameIsFinished(board);

        res.send({board, player, lastSection, gameIsFinished: gameResult, moveMade});
    }  
});

module.exports = router;