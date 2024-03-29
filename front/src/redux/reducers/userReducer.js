import { ActionTypes } from "../types";

const initialState = {
  authenticated: !!localStorage.getItem("FBIdToken"),
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.USER.VALIDATE_TOKEN:
      return {
        ...state,
        token: action.payload
      }
    case ActionTypes.USER.SET_UNAUTHENTICATED:
      return {
        authenticated: false,
      };
    case ActionTypes.USER.SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case ActionTypes.USER.SET_IMAGE:
      return {
        ...state,
        imageUrl: action.payload,
        loadingPicture: false,
        error: null
      };
    case ActionTypes.USER.SET_AVAILABILITY:
      return {
        ...state,
        available: action.payload,
        loadingAvailability: false,
      };
    case ActionTypes.USER.LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.USER.STOP_LOADING_USER:
      return {
        ...state,
        loading: false,
      };
      case ActionTypes.USER.LOADING_PICTURE:
        return {
          ...state,
          loadingPicture: true,
        };
      case ActionTypes.USER.LOADING_AVAILABILITY:
        return {
          ...state,
          loadingAvailability: true,
        };
      case ActionTypes.USER.STOP_LOADING_PICTURE:
        return {
          ...state,
          loadingPicture: false,
        };
    case ActionTypes.USER.SET_ERRORS:
      return {
        ...state,
        error: action.payload,
        loading: false,
        loadingPicture: false
      };
    case ActionTypes.USER.CLEAR_ERRORS:
      return {
        ...state,
        error: null
      }
    default:
      return state;
  }
};

export default UserReducer;
