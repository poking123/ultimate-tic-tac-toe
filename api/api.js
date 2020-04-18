const express = require('express');
const router = express.Router();


// Game
let { makeActualMove } = require('../PlayGame');
const { playMCST } = require('../MCST');
const { returnSmallBoardSection } = require('../Section');

// api
router.post('/computerMove/', function(req, res) {
    let {board, player, lastSection} = req.body;
    let move = playMCST(board, player, lastSection);
    lastSection = returnSmallBoardSection(move);
    board = makeActualMove(move, board, player);
    player = 2 - player;

    console.log('In API');
    console.log('board is', board);
    console.log('player is', player);
    console.log('lastSection is', lastSection);

    res.send({board, player, lastSection});
});

module.exports = router;