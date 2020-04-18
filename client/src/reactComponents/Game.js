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
            lastSection: -1
        };
    }

    gameConstants = Object.freeze({
        boardWidth: 546,
        boardHeight: 546,
        emptySpace: 0,
        playerOne: 1,
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
        lastSection: -1
    });

    makeHumanMove = (e) => {
        let offsetX = e.nativeEvent.offsetX;
        let offsetY = e.nativeEvent.offsetY;
        let boardWidth = e.target.offsetWidth;
        let boardHeight = e.target.offsetHeight;

        let gapLength = 20;
        let oneBoardLength = 170;

        console.log('x is ', offsetX);
        console.log('y is ', offsetY);

        if ((offsetX > oneBoardLength && offsetX < oneBoardLength + gapLength) || (offsetX > 2 * oneBoardLength && offsetX < 2 * oneBoardLength + gapLength)
            || (offsetY > oneBoardLength && offsetY < oneBoardLength + gapLength) || (offsetY > 2 * oneBoardLength && offsetY < 2 * oneBoardLength + gapLength)) {
                return;
        }

        console.log('boardWidth is ', boardWidth);
        console.log('boardHeight is ', boardHeight);

        let row = Math.floor(offsetY / (boardHeight / 3));
        let col = Math.floor(offsetX / (boardWidth / 3));

        console.log('row is ', row);
        console.log('col is ', col);

        let relativeX = offsetX - col * (gapLength + oneBoardLength);
        let relativeY = offsetY - row * (gapLength + oneBoardLength);

        console.log('relativeX is ', relativeX);
        console.log('relativeY is ', relativeY);

        let relativeRow = Math.floor(relativeY / (oneBoardLength / 3));
        let relativeCol = Math.floor(relativeX / (oneBoardLength / 3));

        console.log('relativeRow is ', relativeRow);
        console.log('relativeCol is ', relativeCol);

        let topLeftBoardIndex = row * 9 + col;

        let innerBoardIndex = topLeftBoardIndex + 3 * row;

        let {board, player} = this.state;
        board[innerBoardIndex][col] = player;

        console.log('innerBoard Index is', innerBoardIndex);
        console.log('col is', col);
        console.log('player is', player);

        this.setState(board,
            () => console.log(this.state.board));
    }

    makeComputerMove = () => {
        axios.post('http://localhost:5000/api/computerMove', {
            board: this.state.board,
            player: this.state.player,
            lastSection: this.state.lastSection,
        }).then(res => {
            let { board, player, lastSection } = res.data;
            this.setState({
                board: board,
                player: player,
                lastSection: lastSection
            });
        });
    }
    
    render() {
        let boardData = {
            player: this.state.player,
            board: this.state.board,
        };

        let dimensionData = {
            width: this.gameConstants.width,
            height: this.gameConstants.height,
        };

        return (
            <div id="game">
                <h1>Ultimate Tic-Tac-Toe</h1>
                <Board makeHumanMove={this.makeHumanMove} boardData={boardData} dimensionData={dimensionData} />
            </div>
        )
    }
}

export default Game;
