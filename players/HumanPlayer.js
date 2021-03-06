let { board } = require('../Boards');
var readlineSync = require('readline-sync');
const { rl } = require('../ReadInput');

function makeHumanMove(board, player, moves) {
    let move = readlineSync.questionInt('What is your move? (Careful, what you type will not show up.) (Input -1 to Quit)\n');
    if (move === -1) {
        process.exit();
    }

    while (!moves.includes(move))
    move = readlineSync.questionInt('What is your move? (Careful, what you type will not show up.) (Input -1 to Quit)\n');
    return move;
}

let toExport = {
    makeHumanMove,
};

module.exports = toExport;