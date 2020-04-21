import React, { Component } from 'react';
import Board from './Board';
import axios from 'axios';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [
                [0, 0, 0], [0, 0, 0], [0, 0, 0],
                [0, 0, 0], [0, 0, 0], [0, 0, 0],
                [0, 0, 0], [0, 0, 0], [0, 0, 0],
                [0, 0, 0], [0, 0, 0], [0, 0, 0],
                [0, 0, 0], [0, 0, 0], [0, 0, 0],
                [0, 0, 0], [0, 0, 0], [0, 0, 0],
                [0, 0, 0], [0, 0, 0], [0, 0, 0],
                [0, 0, 0], [0, 0, 0], [0, 0, 0],
                [0, 0, 0], [0, 0, 0], [0, 0, 0]
            ],
            player: 1,
            humanPlayer: 1,
            computerPlayer: 2,
            lastSection: -1,
            lastLastSection: -1,
            gameIsFinished: false,
            playerMessage: '',
            computerMoveQueue: [],
        };
    }

    gameConstants = Object.freeze({
        smallBoardWidth: 171.75,
        smallBoardHeight: 171.75,
        pieceLength: 51.5,
        emptySpace: 0,
                    emptyBoard: [
                        [0, 0, 0], [0, 0, 0], [0, 0, 0],
                        [0, 0, 0], [0, 0, 0], [0, 0, 0],
                        [0, 0, 0], [0, 0, 0], [0, 0, 0],
                        [0, 0, 0], [0, 0, 0], [0, 0, 0],
                        [0, 0, 0], [0, 0, 0], [0, 0, 0],
                        [0, 0, 0], [0, 0, 0], [0, 0, 0],
                        [0, 0, 0], [0, 0, 0], [0, 0, 0],
                        [0, 0, 0], [0, 0, 0], [0, 0, 0],
                        [0, 0, 0], [0, 0, 0], [0, 0, 0]
                    ],
        player: 1,
        humanPlayer: 1,
        computerPlayer: 2,
        lastSection: -1,
        lastLastSection: -1,
        gameIsFinished: false,
    });

    checkIfNeedToMakeMove = () => {
        console.log('checking if need to make move')
        let { gameIsFinished } = this.state;
        let playerMessage;

        console.log('gameIsFinished', gameIsFinished)

        if (gameIsFinished === 0) { // Draw
            playerMessage = <p>Draw! Nobody Wins!</p>;
        } else if (gameIsFinished) { // Winner
            playerMessage = <p>Player {3 - this.state.player} Has Won!!!</p>;
        } else { // Game Not Finished Yet
            console.log('got in here')
            playerMessage = <p>Player {this.state.player} to Move...</p>;
            console.log('computerToMove is ', this.computerToMove())
            console.log('player' , this.state.player)
            console.log('computerPlayer' , this.state.computerPlayer)
            if (this.computerToMove()) {
                this.makeComputerMove();
            }
        }
        this.setState({ playerMessage });
    }

    humanToMove = () => {
        return this.state.player === this.state.humanPlayer;
    }

    computerToMove = () => {
        return this.state.player === this.state.computerPlayer;
    }

    findIndex = (array, element) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === element) return i;
        }
        return -1;
    }

    makeHumanMove = (e) => {
        if (this.computerToMove() || this.state.gameIsFinished) return;
        e.preventDefault(); // might be unnecessary
        e.persist(); // might be unnecessary

        let smallBoard = e.target;

        let entireBoard = document.getElementById('board');

        let offsetX = e.nativeEvent.offsetX; // within smallBoard
        let offsetY = e.nativeEvent.offsetY;

        let gapLength = 20;
        let oneBoardLength = 170;

        if ((offsetX > oneBoardLength && offsetX < oneBoardLength + gapLength) || (offsetX > 2 * oneBoardLength + gapLength && offsetX < 2 * oneBoardLength + 2 * gapLength)
            || (offsetY > oneBoardLength && offsetY < oneBoardLength + gapLength) || (offsetY > 2 * oneBoardLength + gapLength && offsetY < 2 * oneBoardLength + 2 * gapLength)) {
                return;
        }

        if (e.target === entireBoard) return;

        let smallBoardsArr = entireBoard.children;

        let entireBoardIndex = this.findIndex(smallBoardsArr, smallBoard);
        console.log('entireBoardIndex', entireBoardIndex)


        let smallBoardRow = Math.floor(offsetY / (oneBoardLength / 3));
        let smallBoardCol = Math.floor(offsetX / (oneBoardLength / 3));

        let topLeftMoveIndices = [0, 3, 6, 27, 30, 33, 54, 57, 60];
        let move = topLeftMoveIndices[entireBoardIndex] + 9 * smallBoardRow + smallBoardCol;
        console.log('move is', move)
        axios.post('http://localhost:5000/api/makeHumanMove', {
            board: this.state.board,
            player: this.state.player,
            move,
            lastSection: this.state.lastSection,
        }).then(res => {
            if (this.humanToMove()) {
                let { board, player, lastSection, gameIsFinished, moveMade } = res.data;
                let lastLastSection = this.state.lastSection;
                if (moveMade) {
                    this.setState({
                        board,
                        player,
                        lastSection,
                        lastLastSection,
                        gameIsFinished,
                    }, () => this.checkIfNeedToMakeMove());
                }
            }
        });
    }

    makeComputerMove = () => {
        if (this.humanToMove() || this.state.gameIsFinished) return;
        let { computerMoveQueue } = this.state;
        if (computerMoveQueue.length !== 1) {
            computerMoveQueue.shift();
            this.setState({ computerMoveQueue });
        }
        axios.post('http://localhost:5000/api/makeComputerMove', {
            board: this.state.board,
            player: this.state.player,
            lastSection: this.state.lastSection,
        }).then(res => {
            if (this.computerToMove()) {
                let { board, player, lastSection, gameIsFinished } = res.data;
                this.setState({
                    board,
                    player,
                    lastSection,
                    gameIsFinished
                });
            }
        });
    }

    switchPlayerOrder = () => {
        let { humanPlayer, computerPlayer } = this.state;
        this.setState({
            humanPlayer: 3 - humanPlayer,
            computerPlayer: 3 - computerPlayer,
        }, () => {
            this.resetBoard();

        });
    }

    resetBoard = () => {
        let { computerMoveQueue } = this.state;
        let emptyBoardCopy = this.gameConstants.emptyBoard.map(row => [...row]);
        console.log('state is ', this.state);
        if (this.computerToMove()) {
            console.log('got into computerToMove - adding true - push');
            computerMoveQueue.push(true);
        }
        this.setState({
            computerMoveQueue,
            player: this.gameConstants.player,
            board: emptyBoardCopy,
            lastSection: this.gameConstants.lastSection,
            lastLastSection: this.gameConstants.lastLastSection,
            gameIsFinished: this.gameConstants.gameIsFinished,
        }, () => this.checkIfNeedToMakeMove());
    }

    componentDidMount() {
        let { computerMoveQueue } = this.state;
        if (this.computerToMove()) {
            computerMoveQueue.push(true);
        }
        this.setState({ 
            playerMessage: <p>Player {this.state.player} to Move...</p>,
            computerMoveQueue,
        });
        this.checkIfNeedToMakeMove();
    }
    
    render() {
        let boardData = {
            player: this.state.player,
            board: this.state.board,
        };

        let dimensionData = {
            pieceLength: this.gameConstants.pieceLength,
        };

        let { playerMessage, lastSection, lastLastSection } = this.state;

        let sectionIndexArr = ['Top Left', 'Top Middle', 'Top Right',
                            'Middle Left', 'Middle Middle', 'Middle Right',
                            'Bottom Left', 'Bottom Middle', 'Bottom Right',]
        let sectionMessage;
        sectionMessage = 'Current Section: ';
        if (this.computerToMove()) {
            sectionMessage += (lastLastSection === -1) ? 'Any Section' : sectionIndexArr[lastLastSection];
        } else {
            sectionMessage += (lastSection === -1) ? 'Any Section' : sectionIndexArr[lastSection];
        }

        let playerOneType = (this.state.humanPlayer === 1) ? 'human' : 'computer';
        let playerTwoType = (this.state.computerPlayer === 2) ? 'computer' : 'human'

        return (
            <div id="game">
                <h1>Ultimate Tic-Tac-Toe</h1>
                <Board makeHumanMove={this.makeHumanMove} boardData={boardData} dimensionData={dimensionData} />
                <br />
                {playerMessage}
                {sectionMessage}
                <br />
                <br />
                <button onClick={() => this.resetBoard()}>Reset Game</button>
                <br /><br />
                <button onClick={() => this.switchPlayerOrder()}>Switch Player Order</button>
                <br /><br />
                <p>Player 1: {playerOneType}</p>
                <p>Player 2: {playerTwoType}</p>
            </div>
        )
    }
}

export default Game;
