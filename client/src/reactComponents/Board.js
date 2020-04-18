import React, { Component } from 'react';
import '../css/Board.css';
import x from '../images/x.png';
import o from '../images/o.png';
import { uuid } from 'uuidv4';

class Board extends Component {

    render() {
        let currBoard = [];
        let { board } = this.props.boardData;
        let pieceWidth = this.props.dimensionData.boardWidth / 3;
        let pieceHeight = this.props.dimensionData.boardHeight / 3;
        let topLeft = []; // 0, 3, 6 => 0
        let topMiddle = []; // 1, 4, 7 => 1
        let topRight = []; // 2, 5, 8 => 2
        let middleLeft = []; // 9, 12, 15 => 3
        let middleMiddle = [];
        let middleRight = [];
        let bottomLeft = [];
        let bottomMiddle = [];
        let bottomRight = [];
        let entireBoard = [topLeft, topMiddle, topRight,
                           middleLeft, middleMiddle, middleRight,
                           bottomLeft, bottomMiddle, bottomRight];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    let boardIndex = 9 * i + j + 3 * k;
                    let entireBoardIndex = Math.floor(boardIndex / 9) + boardIndex % 3;
                    for (let col = 0; col < 3; col++) {
                        
                        switch(board[boardIndex][col]) {
                            case 0:
                                entireBoard[entireBoardIndex].push(<div className="emptyBoardPiece" width={pieceWidth} height={pieceHeight} key={uuid()}></div>);
                                break;
                            case 1:
                                entireBoard[entireBoardIndex].push(<img src={x} onClick={e => e.stopPropagation()} width={pieceWidth} height={pieceHeight} key={uuid()} alt="X Piece" />);
                                break;
                            case 2:
                                entireBoard[entireBoardIndex].push(<img src={o} onClick={e => e.stopPropagation()} width={pieceWidth} height={pieceHeight} key={uuid()} alt="O Piece" />);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
        console.log('entireBoard is, ', entireBoard)
        let innerBoards = [];
        for (let i = 0; i < entireBoard.length; i++) {
            innerBoards.push(<div className="smallBoard" key={uuid()} >{ entireBoard[i] }</div>);
        }

        return (
            <div id="board" onClick={e => this.props.makeHumanMove(e)}>
                { innerBoards }
            </div>
        );
    }
}

export default Board;
