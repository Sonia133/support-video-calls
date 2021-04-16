import { ActionTypes } from "../types";

const initialState = {};

const CallReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.EMPLOYEE.LOADING:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.EMPLOYEE.SET_EMPLOYEES:
      return {
        ...state,
        loading: false,
        employees: action.payload,
      };
    case ActionTypes.EMPLOYEE.SET_EMPLOYEE:
      return {
        ...state,
        loading: false,
        employee: action.payload,
      };
    case ActionTypes.EMPLOYEE.LOADING_FEEDBACK:
      return {
        ...state,
        loadingFeedback: true,
      };
    case ActionTypes.EMPLOYEE.SET_FEEDBACK:
      return {
        ...state,
        loadingFeedback: false,
        employee: {
            ...state.employee,
            feedback: action.payload
        }
      }
    case ActionTypes.EMPLOYEE.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter((employee) => employee.email !== action.payload)
      };
    case ActionTypes.EMPLOYEE.SET_ERRORS:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.EMPLOYEE.SET_ERRORS_FEEDBACK:
      return {
        ...state,
        errorFeedback: action.payload,
        loadingFeedback: false,
      };
    default:
      return state;
  }
};

export default CallReducer;
