import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    return (
        <button
        className={'square '+props.class}
        onClick={props.onClick}>
            {props.value}
        </button>
    );
}

const Points = (props) => {
    return(
        <li>
            <p>{props.value}</p>
        </li>
    );
}

class Board extends React.Component {

    // renderSquare(i) {
    //     return ( <Square
    //         value={this.props.squares[i]}
    //         onClick={() => this.props.onClick(i)} />
    //     );
    // }
    renderSquare(){
        const arr =
            [
                [0,1,2],
                [3,4,5],
                [6,7,8]
            ];
        const lines = this.props.lines;
        let w1;
        let w2;
        let w3;
        if(lines && lines.length>2){
            w1 = lines[0];
            w2 = lines[1];
            w3 = lines[2];
        }
        return arr.map((el => {
            return(
                <div key={el} className={'board-row'}>
                    {el.map((a2) => {
                        return ( <Square
                                key={a2}
                                class={a2 === w1 || a2===w2||a2===w3? 'red' : ''}
                                value={this.props.squares[a2]}
                                onClick={() => this.props.onClick(a2)} />
                        );
                    })}
                </div>
            );
        }));
    }


    render() {
        return (
            <div>
                <div className="status">{status}</div>
                {this.renderSquare()}
                {/*<div className="board-row">*/}
                {/*    {this.renderSquare(0)}*/}
                {/*    {this.renderSquare(1)}*/}
                {/*    {this.renderSquare(2)}*/}
                {/*</div>*/}
                {/*<div className="board-row">*/}
                {/*    {this.renderSquare(3)}*/}
                {/*    {this.renderSquare(4)}*/}
                {/*    {this.renderSquare(5)}*/}
                {/*</div>*/}
                {/*<div className="board-row">*/}
                {/*    {this.renderSquare(6)}*/}
                {/*    {this.renderSquare(7)}*/}
                {/*    {this.renderSquare(8)}*/}
                {/*</div>*/}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            points: Array(0),
            reverse: false
        };
    }
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        const points = this.state.points.slice();
        const pos = position(i, points);
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history : history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            points: pos
        });
    }
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }
    btnReverseClick(){
       this.setState({
           reverse: !this.state.reverse
       })
    }
    renderPoints(arr){
       return arr.map((el => {
            return <Points key={el} value={el}/>
        }));
    }
    renderButton(arg){
        return(
            <button
                className={'btn-reverse'}
                onClick={() => this.btnReverseClick(arg)}
            >
                {'reverse'}
            </button>
        );
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ?
                'Перейти к ходу #' + move :
                'К началу игры';
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });
        const reverse = this.state.reverse;
        const points = this.state.points;
        const movesLength = moves.length-1;
        let status;
        let lines;
        if(winner){
            status = 'Выиграл ' + winner.winner;
            lines = winner.lines;
        } else if(!winner && movesLength>8){
            status = 'Ничья';
        }else {
            status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                    squares = {current.squares}
                    lines = {lines}
                    onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div className={'btn-container'}>
                        {this.renderButton()}
                    <ol className={reverse ? 'reverse' : ''}>{moves}</ol>
                    </div>
                </div>
                <div className={'points'}>
                    <ol>{this.renderPoints(points)}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    let winner = {
        winner: null,
        lines: Array(3).fill(null)
    }
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            winner.winner = squares[a];
            winner.lines = lines[i];
            return winner;
        }
    }
    return null;
}
//my code
function position(p, pos) {

    const points = [
      [0,1,2],
      [3,4,5],
      [6,7,8]
    ];
    for (let i=0;i<points.length;i++){
        for (let j=0;j<points[i].length;j++){
            if(p===points[i][j]){
                pos.push('Строка ' + (i+1) + ' колонка ' + (j+1));
            }
        }
    }
    return pos;
}

