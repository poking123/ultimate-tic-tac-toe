const { playUntilFinished, makeMove, getPossibleMoves, makeAllBoards, overallBoardIsFinished, printBoard, makeOverallBoard } = require('./BoardHelper');
let { playTurn, makeActualMove} = require('./PlayGame');
const { MCSTIterations } = require('./Constants');
let values = require('./Values');
const Node = require('./Node2');

function playMCST(board) {
    if (!overallBoardIsFinished(board)) {
        console.log('Computer is thinking...');
        let boardCopy = board.map(row => [...row]);
        let parent = null;
        let headNode = new Node(boardCopy, parent);

        for (let i = 0; i < MCSTIterations; i++) {
            runMCST(headNode, values.player);
        }

        let optimalNode = MCSTOptimalNode(headNode);
        // console.log('optimalNode is ', optimalNode);
        let optimalMove = optimalNode.getMove();

        console.log('Computer\'s Move: ', optimalMove);
        let newBoard = makeActualMove(optimalMove, board, values.player);
        values.player = 3 - values.player;
        playTurn(newBoard);
    } else {
        console.log('Game has Finished.');
    }
}

function MCSTOptimalNode(node) {
    let optimalChildren = [];
    let optimalChildrenValue;
    let optimalFound = false;

    let children = node.getChildren();
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let childValue = MCSTFunction(child);
        if (childValue === Number.MAX_VALUE) {
            if (optimalFound) {
                optimalChildren.push(child);
            } else {
                optimalChildren = [child];
            }
            optimalFound = true;
        }
        if (optimalFound) continue;

        let switchOptimal = (values.player === 1) ? (optimalChildrenValue === undefined || childValue > optimalChildrenValue) : (optimalChildrenValue === undefined || childValue < optimalChildrenValue)

        if (switchOptimal) {
            optimalChildren = [child];
            optimalChildrenValue = childValue;
        } else if (childValue === optimalChildrenValue) {
            optimalChildren.push(child);
        }
    }

    let randomIndex = Math.floor(Math.random() * optimalChildren.length);
    return optimalChildren[randomIndex];
}

function runMCST(node, player) {
    // Go Until Leaf Node
    while (node.hasChildren()) {
        node = MCSTOptimalNode(node);
        player = 3 - player;
    }

    // At Leaf Node
    // Has the Leaf Node ever been visited?
    let board = node.getBoard();
    let backPropogateNode;
    let result;
    let score = 0;
    if (node.getVisits() === 0) { // No
        result = playUntilFinished(board, player, values.lastSection);
        backPropogateNode = node;
    } else { // Yes
        let possibleMovesArr = getPossibleMoves(board, values.lastSection);
        if (possibleMovesArr.length === 0) {
            result = overallBoardIsFinished(board);
            backPropogateNode = node;
        } else {
            let children = [];
            for (let i = 0; i < possibleMovesArr.length; i++) {
                let move = possibleMovesArr[i];
                let newNode = new Node(makeMove(move, board, player), node, move);
                children.push(newNode);
            }
            if (children.length === 0) {
                console.log('children array is 0, something went wrong.');
                console.log('possibleMovesArr is ', possibleMovesArr);
                printBoard(board);
                let ob = makeOverallBoard(board);
            }
            player = 3 - player;
            node.setChildren(children);
            let firstChild = children[0];
            result = playUntilFinished(firstChild.getBoard(), player, values.lastSection);
            backPropogateNode = firstChild;
        }
        
    }
    if (result === 1) score = 1;
    backPropogateNode.backPropogateValues(score);
}

function MCSTFunction(node) {
    let visits = node.getVisits();
    if (visits === 0) return Number.MAX_VALUE;

    let parent = node.getParent();

    let expandValue = node.getScore() / visits;
    let exploreValue = Math.sqrt(Math.log(parent.getVisits() / visits));
    return expandValue + exploreValue;
}

let toExport = {
    playMCST,
    MCSTOptimalNode,
    runMCST,
    MCSTFunction,
};

module.exports = toExport;