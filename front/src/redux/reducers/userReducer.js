import { ActionTypes } from "../types";

const initialState = {
  authenticated: !!localStorage.getItem("FBIdToken"),
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.USER.SET_UNAUTHENTICATED:
      return initialState;
    case ActionTypes.USER.SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case ActionTypes.USER.LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.USER.SET_ERRORS:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default UserReducer;
