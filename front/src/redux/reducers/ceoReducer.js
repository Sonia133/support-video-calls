import { ActionTypes } from "../types";

const initialState = {};

const CeoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CEO.LOADING:
        return {
          ...state,
          loading: true,
        };
    case ActionTypes.CEO.SET_CEOS:
      return {
        ...state,
        loading: false,
        ceos: action.payload,
      };
    case ActionTypes.CEO.SET_CEO:
        return {
          ...state,
          loading: false,
          ceo: action.payload,
        };
    case ActionTypes.CEO.DELETE_CEO:
      return {
        ...state,
        ceos: state.ceos.filter((ceo) => ceo.email !== action.payload)
      };
    case ActionTypes.CEO.SET_ERRORS:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.CEO.CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export default CeoReducer;
