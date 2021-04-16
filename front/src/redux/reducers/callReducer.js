import { ActionTypes } from "../types";

const initialState = {};

const CallReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CALL.LOADING_CALLS:
        return {
            ...state,
            loadingCalls: true,
        };
    case ActionTypes.CALL.SET_CALLS:
      return {
        ...state,
        calls: action.payload,
        loadingCalls: false
      };
    case ActionTypes.CALL.LOADING_EMPLOYEE:
        return {
            ...state,
            loading: true,
        };
    case ActionTypes.CALL.SET_EMPLOYEE:
      return {
        loading: false,
        ...action.payload,
      };
    case ActionTypes.CALL.SET_ERRORS:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.CALL.SET_ERRORS_CALLS:
      return {
        ...state,
        errorCalls: action.payload,
        loadingCalls: false,
      };
    case ActionTypes.CALL.END_CALL:
      return initialState;
    default:
      return state;
  }
};

export default CallReducer;
