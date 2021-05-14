import axios from "../axios";
import { ActionTypes } from "../types";
import socket from "../../socket/index.js";

export const createInitialBoard = (roomId, jmin, player) => (dispatch) => {
    dispatch({ type: ActionTypes.GAME.LOADING_BOARD });
    axios
      .post(`/start/game/${roomId}`, { jmin })
      .then(({ data }) => {
        dispatch({ type: ActionTypes.GAME.SET_BOARD, payload: data.game });
      })
      .then(() => {
        socket.ref(`/game/${roomId}`)
        .on("value", (snapshot) => {
            if (snapshot.val().end === 0) {
                if (snapshot.val().player === snapshot.val().jmax) {
                    dispatch(addNewMove(roomId, 0, 0, player, jmin));
                }
            }
        });
      })
      .catch((err) => console.log(err));
};

export const restartGame = (roomId, jmin) => (dispatch) => {
    dispatch({ type: ActionTypes.GAME.LOADING_BOARD });
    axios
      .post(`/start/game/${roomId}`, { jmin })
      .then(({ data }) => {
        dispatch({ type: ActionTypes.GAME.SET_BOARD, payload: data.game });
      })
      .catch((err) => console.log(err));
}

export const addNewMove = (roomId, column, row, player, jmin) => (dispatch) => {
    let end;
    dispatch({ type: ActionTypes.GAME.LOADING_MOVE });
    axios
      .post(`/play/${roomId}`, { column, row })
      .then(({ data }) => {
        end = data.game.end;
        dispatch({ type: ActionTypes.GAME.SET_BOARD, payload: data.game });
      })
      .then(() => {
        if (player !== jmin || end) {
            dispatch({ type: ActionTypes.GAME.STOP_LOADING_MOVE });
        } 
      })
      .catch((err) => console.log(err));
};