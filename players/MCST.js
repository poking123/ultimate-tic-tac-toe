const { playUntilFinished, makeMove, getPossibleMoves, makeAllBoards, gameIsFinished, printBoard, makeOverallBoard } = require('../BoardHelper');
let { playTurn, makeActualMove} = require('../PlayGame');
const Node = require('../Node2');
const { consoleLog } = require('../Constants');

function playMCST(MCSTIterations, exploreCoefficient) { // Returns A Version Of The Function Specifying The Number Of Iterations To Do
    return function (board, player, lastSection) {

        function runMCST(node, player, lastSection) {
            let originalPlayer = player;
            // Go Until Leaf Node
            while (node.hasChildren()) {
                // Choose The Optimal Node (Which Branch To Go Down)
                // This Should Choose Nodes That Have Never Been Visited
                node = MCSTOptimalNode(node, player);
                player = 3 - player;
            }
        
            // At Leaf Node
            // Has the Leaf Node ever been visited?
            let board = node.getBoard();
            let backPropogateNode; // We Need This Node To Know Where To Start Backpropogating
            let result;
            let score = 0;
            if (node.getVisits() === 0) { // No
                result = playUntilFinished(board, player, lastSection);
                backPropogateNode = node;
            } else { // Yes
                let possibleMovesArr = getPossibleMoves(board, lastSection);
                if (possibleMovesArr.length === 0) {
                    result = gameIsFinished(board);
                    backPropogateNode = node;
                } else {
                    // Makes Children Array Of All Possible Moves
                    let children = [];
                    for (let i = 0; i < possibleMovesArr.length; i++) {
                        let move = possibleMovesArr[i];
                        let newNode = new Node(makeMove(move, board, player), node, move);
                        children.push(newNode);
                    }
                    if (children.length === 0) { // Error If We Get Here But The Game Is Finished
                        console.log('children array is 0, something went wrong.');
                        console.log('possibleMovesArr is ', possibleMovesArr);
                        printBoard(board);
                        let ob = makeOverallBoard(board);
                    }
        
        
                    node.setChildren(children);
                    player = 3 - player; // Switches Player Since It Is The Other Player's Move
                    let firstChild = children[0];
                    result = playUntilFinished(firstChild.getBoard(), player, lastSection);
                    backPropogateNode = firstChild;
                }
                
            }
            if (result === originalPlayer) score = 1;
            backPropogateNode.backPropogateValues(score);
        }

        function MCSTFunction(node) {
            let visits = node.getVisits();
            if (visits === 0) {
                return Number.MAX_VALUE;
            }
        
            let parent = node.getParent();
        
            let expandValue = node.getScore() / visits;
            let exploreValue = exploreCoefficient * Math.sqrt(Math.log(parent.getVisits() / visits));
            return expandValue + exploreValue;
        }

        function MCSTOptimalNode(node, player, debug) {
            let optimalChildren = [];
            let optimalChildrenValue;
        
            let children = node.getChildren();
            // console.log('number of children are ', children.length)
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                // Prints Out Winning %
                if (debug) {
                    let childScore = child.getScore();
                    let childVisits = child.getVisits();
                    let expandValue = childScore / childVisits;
                    let parentVisits = child.getParent().getVisits();
                    let move = child.getMove();
                    
                    if (consoleLog) {
                        console.log('move is ' , move);
                        console.log('childScore is ' , childScore);
                        console.log('childVisits is ' , childVisits);
                        console.log('parentVisits is ' , parentVisits);
                        console.log('winning percentage = ' , expandValue);
                        console.log('total value is ', MCSTFunction(child, player))
                    }
                }
        
                // console.log('child score is ', child.getScore());
                // console.log('child visits is ', child.getVisits());
        
                let childValue = MCSTFunction(child, player);
        
                let switchOptimal = optimalChildrenValue === undefined || childValue > optimalChildrenValue;
        
                if (switchOptimal) {
                    optimalChildren = [child];
                    optimalChildrenValue = childValue;
                } else if (childValue === optimalChildrenValue) {
                    optimalChildren.push(child);
                }
            }
        
            let index = Math.random() * optimalChildren.length;
            let randomIndex = Math.floor(index);
            return optimalChildren[randomIndex];
        }


        if (!gameIsFinished(board)) {
            if (consoleLog)
                console.log('Computer is thinking...');
            let boardCopy = board.map(row => [...row]);
            let parent = null;
            let headNode = new Node(boardCopy, parent);
    
            // Run Iterations To Make The Tree
            for (let i = 0; i < MCSTIterations; i++) {
                runMCST(headNode, player, lastSection);
            }
            if (consoleLog)
                console.log('looking for optimal node');
            // Whichever Child has the Greatest Winning % Is The Optimal Node
            let optimalNode = MCSTOptimalNode(headNode, player, true);
            if (consoleLog)
                console.log('DONE looking for optimal node');
            // console.log('optimalNode is ', optimalNode);
            let optimalMove = optimalNode.getMove();
    
            if (consoleLog) {
                console.log('headnode')
                console.log('move = ', optimalNode.getMove())
                console.log('score = ', optimalNode.getScore())
                console.log('visits = ', optimalNode.getVisits())
            }
    
            // console.log('Computer\'s Move: ', optimalMove);
            // let newBoard = makeActualMove(optimalMove, board, player);
            // values.player = 3 - values.player;
            // playTurn(newBoard);
    
            return optimalMove;
        } else {
            if (consoleLog)
                console.log('Game has Finished.');
        }
    }
}







let toExport = {
    playMCST,
    // MCSTOptimalNode,
    // runMCST,
    // MCSTFunction,
};

module.exports = toExport;