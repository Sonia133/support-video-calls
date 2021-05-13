import { 
    Button,
    CircularProgress,
    IconButton
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { PLAYERS, INSTRUCTIONS, RESULT, NAME } from "../../util/constants/connect4";

const Game = () => {
    const [play, setPlay] = useState(false);
    const [decline, setDecline] = useState(false);
    const [next, setNext] = useState(false);
    const [value, setValue] = useState(1);

    const declineGame = () => {
        setDecline(true);
    }

    const acceptGame = () => {
        setNext(true);
        console.log(play)
    }

    const chooseX = () => {
        console.log('X');
        setPlay(true);
    }
    
    const chooseO = () => {
        console.log('0');
        setPlay(true);
    }

    let rr = [];
    for (let i = 0; i < 42; i ++) {
        rr.push(i);
    }

    let tt = [];
    for (let i = 0; i < 36; i += 7) {
        tt.push(rr.slice(i, i + 7));
    }

    let ss = tt.map((t) => {
        return (<div className="game-row">
            {t.map((p) => {
                return (<div className="game-slot"></div>)
            })}
        </div>)
    })

    return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            {play && (
                <div style={{ display: "flex", alignItems: "center", flexDirection: "column", marginBottom: "30px" }}>
                    <p style={{ color: "whitesmoke" }}>Select the column for your next move</p>
                    <div>
                        <Button variant="contained" color="primary" style={{ marginRight: "3px" }}>1</Button>
                        <Button variant="contained" color="primary" style={{ marginRight: "3px" }}>2</Button>
                        <Button variant="contained" color="primary" style={{ marginRight: "3px" }}>3</Button>
                        <Button variant="contained" color="primary" style={{ marginRight: "3px" }}>4</Button>
                        <Button variant="contained" color="primary" style={{ marginRight: "3px" }}>5</Button>
                        <Button variant="contained" color="primary" style={{ marginRight: "3px" }}>6</Button>
                        <Button variant="contained" color="primary">7</Button>
                    </div>
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
                        <p style={{ textAlign: "center", color: "whitesmoke", fontWeight: "bold", margin: 0 }}>CHOOSE YOUR PLAYER</p>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <IconButton style={{ marginRight: "10px", color: "whitesmoke" }} onClick={chooseX}>{PLAYERS.X}</IconButton>
                            <IconButton style={{ color: "whitesmoke" }} onClick={chooseO}>{PLAYERS.O}</IconButton>
                        </div>
                    </div>
                )}
                {play && ss}
            </div>
            {play && (
                <Button variant="contained" color="secondary" style={{ marginTop: "30px" }}>Restart</Button>
            )}
        </div>
    );
};

export default Game;