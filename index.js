let { board, testBoard, positionBoard } = require('./Boards');
const { getPossibleMoves, printBoard, makeOverallBoard, gameIsFinished } = require('./BoardHelper');
let { playGame, makeActualMove } = require('./PlayGame');
const { playMCST } = require('./players/MCST');
// const { makeHumanMove } = require('./HumanPlayer');
const { minimax } = require('./players/Minimax');
const { makeHumanMove } = require('./players/HumanPlayer');
const { makeRandomMove } = require('./players/Random');


let player1Win = 0;
let player2Win = 0;
let tie = 0;
let totalGames = 1;

let p1Iterations = 20000;
let p2Iterations = 2000;

let p1ExploreC = 0.1;
let p2ExploreC = 0.1;

let oneGameMatch = true;

while (oneGameMatch || p1Iterations <= p2Iterations) {
    if (oneGameMatch === false) break;
    oneGameMatch = false;
    // let player1 = playMCST(p1Iterations, p1ExploreC);
    // let player2 = playMCST(p2Iterations, p2ExploreC);

    let player1 = makeHumanMove;
    let player2 = makeRandomMove;
    
    console.log('Player 1: MCST - ', p1Iterations, 'Iterations, ', p1ExploreC, 'explore coefficient')
    console.log('Player 2: MCST - ', p2Iterations, 'Iterations, ', p2ExploreC, 'explore coefficient')
    
    let startTime = new Date().getTime();
    console.log('Starting Games')
    for (let i = 0; i < totalGames; i++) {
        let result;
        if (i % 2 == 0) {
            result = playGame(board, player1, player2);
            if (result === 1) {
                console.log('player 1 wins!')
                player1Win++;
            } else if (result === 2) {
                console.log('player 2 wins!')
                player2Win++;
            }
        } else {
            result = playGame(board, player2, player1);
            if (result === 1) {
                console.log('player 2 wins!')
                player2Win++;
            } else if (result === 2) {
                console.log('player 1 wins!')
                player1Win++;
            }
        }
        // The Tie Case Is The Same In Both Cases
        if (result === 3) {
            tie++;
        }
        
        if (i == totalGames / 2)
            console.log('50% Done')
        

    }
    let endTime = new Date().getTime();
    let totalTime = endTime - startTime;
    console.log('Games Done')
    console.log('Total Time: ', totalTime)
    
    console.log('player1Win = ', player1Win);
    console.log('player2Win = ', player2Win);
    console.log('tie = ', tie);
    console.log('totalGames = ', totalGames);

    if (player1Win >= totalGames / 2) {
        // Player 1 Won More, So We Decrease Player2Iterations
        p2Iterations -= 20;
    } else if (player1Win < totalGames / 2) {
        p1Iterations += 20;
    } else {
        // Tied, so we break
        console.log('Breaking')
        console.log('player1Win = ', player1Win);
        console.log('player2Win = ', player2Win);
        console.log('p1Iterations = ', p1Iterations)
        console.log('p2Iterations = ', p2Iterations)
        break;
    }

    // Reset Statistics
    player1Win = 0;
    player2Win = 0;
    tie = 0;
    console.log('Finished a loop')
}



