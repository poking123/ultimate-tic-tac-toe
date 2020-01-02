const readline = require("readline");
const { getPossibleMoves, printBoard } = require('./BoardHelper');
let { board, positionBoard } = require('./Boards');
const { makeActualMove } = require('./PlayGame');
const { playMCST } = require('./MCST');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let toExport = {
    rl,
};

module.exports = toExport;