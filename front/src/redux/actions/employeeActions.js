import axios from "../axios";
import { ActionTypes } from "../types";

export const getFeedback = (companyName, employeeEmail) => (dispatch) => {
    dispatch({ type: ActionTypes.EMPLOYEE.LOADING_FEEDBACK });
    axios.get(`/employee/feedback/${companyName}/${employeeEmail}`)
      .then(({ data }) => {
        dispatch({ type: ActionTypes.EMPLOYEE.SET_FEEDBACK, payload: data });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: ActionTypes.EMPLOYEE.SET_ERRORS_FEEDBACK,
          payload: err.response?.data,
        });
      });
}

export const getEmployees = (companyName) => (dispatch) =>{
    dispatch({ type: ActionTypes.EMPLOYEE.LOADING });
    axios.get(`/employees/${companyName}`)
    .then(({ data }) => {
        dispatch({ type: ActionTypes.EMPLOYEE.SET_EMPLOYEES, payload: data});
    })
    .catch((err) => {
        console.log(err);
        dispatch({
          type: ActionTypes.EMPLOYEE.SET_ERRORS,
          payload: err.response?.data,
        });
      });
}

export const getEmployee = (companyName, employeeEmail) => (dispatch) => {
    dispatch({ type: ActionTypes.EMPLOYEE.LOADING });
    axios.get(`/employee/${companyName}/${employeeEmail}`)
    .then(({ data }) => {
        dispatch({ type: ActionTypes.EMPLOYEE.SET_EMPLOYEE, payload: data});
    })
    .catch((err) => {
        console.log(err);
        dispatch({
          type: ActionTypes.EMPLOYEE.SET_ERRORS,
          payload: err.response?.data,
        });
      });
}

export const deleteEmployee = (employeeEmail) => (dispatch) => {
    axios.delete(`/employee/${employeeEmail}`)
    .then(() => {
        dispatch({ type: ActionTypes.EMPLOYEE.DELETE_EMPLOYEE, payload: employeeEmail });
    })
    .catch((err) => {
        console.log(err);
        dispatch({
          type: ActionTypes.EMPLOYEE.SET_ERRORS,
          payload: err.response?.data,
        });
      });
}