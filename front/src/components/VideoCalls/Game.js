import { 
    Button,
    CircularProgress,
    IconButton
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { INSTRUCTIONS, RESULT, NAME } from "../../util/constants/connect4";
import { createInitialBoard, addNewMove, restartGame } from "../../redux/actions/gameActions";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../socket/index.js";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const Game = ({ roomId }) => {
    const dispatch = useDispatch();
    const { move, player, jmin, jmax, loadingMove, loadingBoard, end } = useSelector((state) => state.game)

    const [play, setPlay] = useState(false);
    const [decline, setDecline] = useState(false);
    const [next, setNext] = useState(false);
    const [board, setBoard] = useState([]);
    const [full, setFull] = useState([false, false, false, false, false, false, false])
    const [check, setCheck] = useState(false);

    let empty = 'rgb(25, 46, 102)';
    let ai = 'rgb(255, 255, 0)';
    let client = 'rgb(255, 0, 0)';

    useEffect(() => {
        if (end && play && !loadingBoard) {
            setCheck(true);
        } else {
            setCheck(false);
        }
    }, [end, play, loadingBoard])

    const declineGame = () => {
        setDecline(true);
    }

    const acceptGame = () => {
        setNext(true);
    }

    const startGame = () => {
        setPlay(true);
        dispatch(createInitialBoard(roomId, 'X', player));
    }

    const addMove = (column) => {
        let row = 0;
        for (let i = 5; i >= 0; i--) {
            if (move[i * 7 + column] === '.') {
                row = i;
                break;
            }
        }

        if (row === 0) {
            let prevState = full;
            prevState[column] = true;
            setFull(prevState);
        }

        dispatch(addNewMove(roomId, column, row, player, jmin));
    }

    const restart = () => {
        dispatch(restartGame(roomId, 'X'));
    }

    useEffect(() => {
        if (move) {
            console.log('here')
            let colors = [];
            for (let i = 0; i < 42; i++) {
                if (move[i] === '.') {
                    colors[i] = empty;
                } else if (move[i] === jmin) {
                    colors[i] = client;
                } else {
                    colors[i] = ai;
                }
            }

            let tt = [];
            for (let i = 0; i < 36; i += 7) {
                tt.push(colors.slice(i, i + 7));
            }
            console.log(tt)

            let ss = tt.map((t, index) => {
                return (<div className="game-row" key={index + 10}>
                    {t.map((p, index1) => {
                        return (<div className="game-slot" key={index1} style={{ backgroundColor: p }}></div>)
                    })}
                </div>)
            })


            setBoard(ss);
        }
    }, [move]);

    return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            {play && loadingBoard && (
                <div style={{ display: "flex", alignItems: "center", flexDirection: "column", marginBottom: "30px" }}>
                    <p style={{ color: "whitesmoke" }}>Game will start any moment...</p>
                </div>
            )}
            {play && (!loadingMove && !loadingBoard) && (
                <div style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%" }}>
                    <p style={{ color: "whitesmoke" }}>Select the column for your next move</p>
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
                        <IconButton style={{ marginRight: "3px", color: "whitesmoke" }} onClick={() => addMove(0)} disabled={full[0]}>
                            <ArrowDownwardIcon className="choose-column" />
                        </IconButton>
                        <IconButton style={{ marginRight: "3px", color: "whitesmoke" }} onClick={() => addMove(1)} disabled={full[1]}>
                            <ArrowDownwardIcon className="choose-column" />
                        </IconButton>
                        <IconButton style={{ marginRight: "3px", color: "whitesmoke" }} onClick={() => addMove(2)} disabled={full[2]}>
                            <ArrowDownwardIcon className="choose-column" />
                        </IconButton>
                        <IconButton style={{ marginRight: "3px", color: "whitesmoke" }} onClick={() => addMove(3)} disabled={full[3]}>
                            <ArrowDownwardIcon className="choose-column" />
                        </IconButton>
                        <IconButton style={{ marginRight: "3px", color: "whitesmoke" }} onClick={() => addMove(4)} disabled={full[4]}>
                            <ArrowDownwardIcon className="choose-column" />
                        </IconButton>
                        <IconButton style={{ marginRight: "3px", color: "whitesmoke" }} onClick={() => addMove(5)} disabled={full[5]}>
                            <ArrowDownwardIcon className="choose-column" />
                        </IconButton>
                        <IconButton style={{ color: "whitesmoke" }} onClick={() => addMove(6)} disabled={full[6]}>
                            <ArrowDownwardIcon className="choose-column" />
                        </IconButton>
                    </div>
                </div>
            )}
            {play && loadingMove && (
                <div style={{ display: "flex", alignItems: "center", flexDirection: "column", marginBottom: "30px" }}>
                    <p style={{ color: "whitesmoke" }}>AI is thinking...</p>
                </div>
            )}
            <div className="game-box">
                {!play && !decline && !next && (
                    <div style={{ margin: "auto", padding: "10%"}}>
                        <p style={{ textAlign: "center", color: "whitesmoke" }}>We are still searching for an employee. Would you like to play a game in the meantime?</p>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="contained" color="primary" style={{ marginRight: "5px" }} onClick={acceptGame}>Yes</Button>
                            <Button variant="contained" color="secondary" onClick={declineGame}>No</Button>
                        </div>
                    </div>
                )}
                {!play && decline && (
                    <div style={{ margin: "auto", padding: "10%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <p style={{ textAlign: "center", color: "whitesmoke" }}>Ok! We are still searching for an employee...</p>
                        <CircularProgress />
                    </div>
                )}
                {!play && !decline && next && (
                    <div style={{ margin: "auto", padding: "10%"}}>
                        <h3 style={{ textAlign: "center", color: "whitesmoke" }}>{NAME.toUpperCase()}</h3>
                        <p style={{ textAlign: "center", color: "whitesmoke" }}>{INSTRUCTIONS.RULES}</p>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="contained" onClick={startGame}>PLAY</Button>
                        </div>
                    </div>
                )}
                {play && loadingBoard && (
                    <div style={{ margin: "auto" }}>
                        <CircularProgress />
                    </div>
                )}
                {play && !loadingBoard && !end && board}
                {check && (
                    <div style={{ margin: "auto", padding: "10%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <p style={{ textAlign: "center", color: "whitesmoke" }}>{player === jmax? "You win!" : "You lose!"}</p>
                    </div>
                )}
            </div>
            {play && (
                <Button variant="contained" color="secondary" style={{ marginTop: "30px" }} onClick={restart}>Restart</Button>
            )}
        </div>
    );
};

export default Game;