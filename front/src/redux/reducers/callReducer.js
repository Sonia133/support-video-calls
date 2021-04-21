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
        calls: action.payload[1],
        comments: action.payload[0],
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
    case ActionTypes.CALL.LOADING_FEEDBACK:
      return {
        ...state,
        loadingFeedback: true,
      };
    case ActionTypes.CALL.SET_FEEDBACK:
      return {
        ...state,
        loadingFeedback: false,
        feedback: action.payload
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
      case ActionTypes.CALL.SET_ERRORS_FEEDBACK:
        return {
          ...state,
          errorFeedback: action.payload,
          loadingFeedback: false,
        };
    case ActionTypes.CALL.END_CALL:
      return initialState;
    default:
      return state;
  }
};

export default CallReducer;
