import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// じゃんけんボタンを生成する関数。valueはplayerhandが設定される
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

// 3つのボタンを作るコンポーネント
class Board extends React.Component {
    // value（グー・チョキ・パー）とクリックイベントを持たせてSquareを呼び出し
    renderSquare(i) {
        return (
            <Square
                value={this.props.playerHand[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    // renderSquareを実行
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
            </div>
        );
    }
}

// 大元となるコンポーネント
class Janken extends React.Component {
    // constructorにstateを設定
    constructor(props) {
        super(props);
        this.state = {
            playerHand: ['グー', 'チョキ', 'パー'],
            comHand: ['グー', 'チョキ', 'パー'],
            com: 'じゃんけんゲーム',
            showResult: '',
            studies: [33, 33, 34],
            images: `${process.env.PUBLIC_URL}/janken_boys.png`,
        };
    }

    // ボタンクリック時のイベント
    handleClick(i) {
        const studies = this.state.studies.slice();
        const comHand = this.state.comHand.slice();
        let images = this.state.images;
        let rand, comNumber, com;


        // 乱数を百分率にする
        rand = Math.floor(Math.random() * 100);
        console.log(rand);

        // com学習のための条件分岐。グーを出した場合、パーを出す確率をUP、チョキを出す確率DOWN
        if (i == 0) {
            if (studies[2] != 0) {
                studies[0] += 1;
                studies[2] -= 1;
            }
        } else if (i == 1) {
            if (studies[0] != 0) {
                studies[1] += 1;
                studies[0] -= 1;
            }
        } else {
            if (studies[1] != 0) {
                studies[2] += 1;
                studies[1] -= 1;
            }
        }

        // 確率に従ってcomの手役を決定。おまけで画像も設定
        if (rand < studies[0]) {
            comNumber = 2;
            com = '相手の手：' + comHand[2];
            images = `${process.env.PUBLIC_URL}/janken_pa.png`;
        } else if (rand >= studies[0] && rand < (studies[0] + studies[1])) {
            comNumber = 0;
            com = '相手の手：' + comHand[0];
            images = `${process.env.PUBLIC_URL}/janken_gu.png`;
        } else {
            comNumber = 1;
            com = '相手の手：' + comHand[1];
            images = `${process.env.PUBLIC_URL}/janken_choki.png`;
        }
        // 現在の学習内容を確認するためのconsole.log
        console.log(studies[0], studies[1], studies[2]);

        // 勝敗確認をするcalculateWinnerにjudge['playerの手','comの手']を持たせて実行
        const judge = [i, comNumber];
        const result = calculateWinner(judge);
        console.log(result);

        // setStateで再render
        this.setState({
            com: com,
            showResult: result,
            studies, studies,
            images: images,
        });

    }

    // 実際に表示するとこ
    render() {
        return (
            <div className="container">
                <div className="random-result">
                    <div>
                        {this.state.com}
                    </div>
                    <div className="images">
                        <img src={this.state.images} alt="Logo" className="image" />
                    </div>

                    <Board
                        playerHand={this.state.playerHand}
                        onClick={(i) => this.handleClick(i)}
                    />
                    <div>勝負の結果：{this.state.showResult}</div>
                </div>
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    <Janken />,
    document.getElementById('root')
);

// 勝敗判定の関数
function calculateWinner(judge) {
    // 勝負の結果パターンを全通りlinesに代入
    const lines = [
        [0, 0, 'Draw'],
        [0, 1, 'Win'],
        [0, 2, 'Lose'],
        [1, 0, 'Lose'],
        [1, 1, 'Draw'],
        [1, 2, 'Win'],
        [2, 0, 'Win'],
        [2, 1, 'Lose'],
        [2, 2, 'Draw'],
    ];
    for (let i = 0; i < lines.length; i++) {
        // 結果パターン（9通り）のうち1つを[a,b,c]に代入
        const [a, b, c] = lines[i];
        // a,bそれぞれのvalueが等しいかどうかを判定し、結果（c）を返す
        if (judge[0] == [a] && judge[1] == [b]) {
            return c;
        }
    }
    return null;
}