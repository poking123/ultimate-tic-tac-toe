const { sectionStartArray, sectionIsFinished, returnOverallBoardSection, returnSmallBoardSection } = require('./Section');
const { emptySpace, boardIsDrawnValue } = require('./Constants');

function makeMove(move, board, player) {
    let row = Math.floor(move / 3);
    let col = move % 3;
    let newBoard = board.map(arr => [...arr]);
    newBoard[row][col] = player;
    return newBoard;
}

function printBoard(board) {
    let output = '';
    for (let b = 0; b < 3; b++) {
        for (let a = 0; a < 3; a++) {
            for (let i = 0; i < 3; i++) {
                let arr = board[9 * b + 3 * a + i];
                for (let j = 0; j < 3; j++) {
                    if (arr[j] < 10) {
                        output += ' ' + arr[j] + ' ';
                    } else {
                        output += arr[j] + ' '
                    }
                }
                if (i !== 2) {
                    output += '| ';
                }
            }
            output += '\n';
        }
        if (b !== 2) {
            output += '----------------------------\n';
        }
    }
    console.log(output);
}

function makeAllBoards(board) {
    let tl = [
        board[0],
        board[3],
        board[6],
    ];
    let tm = [
        board[1],
        board[4],
        board[7],
    ];
    let tr = [
        board[2],
        board[5],
        board[8],
    ];
    let ml = [
        board[9],
        board[12],
        board[15],
    ];
    let mm = [
        board[10],
        board[13],
        board[16],
    ];
    let mr = [
        board[11],
        board[14],
        board[17],
    ];
    let bl = [
        board[18],
        board[21],
        board[24],
    ];
    let bm = [
        board[19],
        board[22],
        board[25],
    ];
    let br = [
        board[20],
        board[23],
        board[26],
    ];

    
    return [tl, tm, tr, ml, mm, mr, bl, bm, br];
}

function makeOverallBoard(board) {
    let allBoards = makeAllBoards(board);
    let overallBoard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    for (let i = 0; i < allBoards.length; i++) {
        let smallBoard = allBoards[i];
        let result = smallBoardIsFinished(smallBoard);
        
        if (result) {
            let row = Math.floor(i / 3);
            let col = i % 3;
            overallBoard[row][col] = result;
        }
    }
    return overallBoard;
}

function getPossibleMoves(board, lastSection) {
    let sectionPossibleMovesArr = sectionPossibleMoves(board, lastSection);
    let overallBoard = makeOverallBoard(board);

    if (sectionIsFinished(lastSection, overallBoard) || sectionPossibleMovesArr.length === 0) {
        // console.log('in allPossibleMoves');
        return allPossibleMoves(board, overallBoard);
    } else {
        // console.log('in sectionPossibleMoves');
        return sectionPossibleMoves(board, lastSection);
    }
}

function sectionPossibleMoves(board, section) {
    if (section < 0 || section > 8) return [];
    // console.log('sectionPossibleMoves - section is ', section);
    // console.log('sectionStartArray is ', sectionStartArray);
    let topLeft = sectionStartArray[section];

    let possibleMoves = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let index = i * 9 + j + topLeft;
            let row = Math.floor(index / 3);
            let col = index % 3;
            if (board[row][col] === emptySpace) {
                possibleMoves.push(index);
            }
        }
    }

    return possibleMoves;
}

function allPossibleMoves(board, overallBoard) {
    let allPossibleMoves = [];
    for (let index = 0 ; index < 81; index++) {
        let section = returnOverallBoardSection(index);
        let overallBoardRow = Math.floor(section / 3);
        let overallBoardCol = section % 3;

        if (section !== -1 && overallBoard[overallBoardRow][overallBoardCol] !== emptySpace) continue;

        let row = Math.floor(index / 3);
        let col = index % 3;
        if (board[row][col] === emptySpace) {
            allPossibleMoves.push(index);
        }
    }
    return allPossibleMoves;
}

function smallBoardIsFinished(board) {
    // Rows
    for (let row = 0; row < 3; row++) {
        let entireRow = board[row];
        let player = entireRow[0];
        if (player === emptySpace) continue;
        if (player === entireRow[1] && player === entireRow[2]) 
            return player;
    }

    // Cols
    for (let col = 0; col < 3; col++) {
        let player = board[0][col];
        if (player === emptySpace) continue;
        if (player === board[1][col] && player === board[2][col]) 
            return player;
    }

    // Diagonals
    let player = board[0][0];
    if (player !== emptySpace) {
        if (player === board[1][1] && player === board[2][2])
            return player;
    }

    player = board[0][2];
    if (player !== emptySpace) {
        if (player === board[1][1] && player === board[2][0])
            return player;
    }

    // Board is Filled
    let boardFilled = true;
    for (let i = 0; i < 9; i++) {
        let row = Math.floor(i / 3);
        let col = i % 3;
        if (board[row][col] === emptySpace) {
            boardFilled = false;
            break;
        }
    }
    if (boardFilled) return boardIsDrawnValue;

    return false;
}

function gameIsFinished(board) {
    let overallBoard = makeOverallBoard(board);
    let overallBoardResult = smallBoardIsFinished(overallBoard);
    return overallBoardResult;
}

function playUntilFinished(board, player, lastSection) {
    let newBoard = board.map(row => [...row]);
    let result = gameIsFinished(newBoard);
    while (!result) {
        let possibleMovesArr = getPossibleMoves(newBoard, lastSection);
        let randomIndex = Math.floor(Math.random() * possibleMovesArr.length);
        // console.log('possibleMovesArr is ', possibleMovesArr);
        // console.log('randomIndex is ', randomIndex);
        let move = possibleMovesArr[randomIndex];
        // console.log('move is ', move);
        lastSection = returnSmallBoardSection(move);
        newBoard = makeMove(move, newBoard, player);
        player = 3 - player;
        // printBoard(newBoard);
        allBoards = makeAllBoards(newBoard);
        // console.log('allBoards is ', allBoards);
        result = gameIsFinished(newBoard);
    }
    return result;
}


let toExport = {
    makeMove,
    printBoard,
    makeAllBoards,
    makeOverallBoard,
    getPossibleMoves,
    sectionPossibleMoves,
    allPossibleMoves,
    smallBoardIsFinished,
    gameIsFinished,
    playUntilFinished,
};

module.exports = toExport;