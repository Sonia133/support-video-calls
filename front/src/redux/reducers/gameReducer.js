import { ActionTypes } from "../types";

const initialState = {};

const GameReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GAME.LOADING_MOVE:
        return {
            ...state,
            loadingMove: true,
        };
    case ActionTypes.GAME.STOP_LOADING_MOVE:
        return {
            ...state,
            loadingMove: false,
        };
    case ActionTypes.GAME.SET_BOARD:
      return {
        ...state,
        move: action.payload.move,
        player: action.payload.player,
        jmin: action.payload.jmin,
        jmax: action.payload.jmax,
        end: action.payload.end,
        loadingBoard: false
      };
    case ActionTypes.GAME.LOADING_BOARD:
        return {
            ...state,
            loadingBoard: true,
        };
    default:
      return state;
  }
};

export default GameReducer;
