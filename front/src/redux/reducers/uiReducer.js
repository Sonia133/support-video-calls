import { ActionTypes } from "../types";

const initialState = {};

const UIReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UI.LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.UI.STOP_LOADING_UI:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.UI.SET_ERRORS:
    return {
        ...state,
        error: action.payload,
        loading: false,
    };
    default:
      return state;
  }
};

export default UIReducer;
