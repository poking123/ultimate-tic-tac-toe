function makeRandomMove (board, player, moves) {
    let numOfMoves = moves.length;
    return moves[getRandomInt(numOfMoves)];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

let toExport = {
    makeRandomMove,
};

module.exports = toExport;