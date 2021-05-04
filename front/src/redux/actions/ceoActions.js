import axios from "../axios";
import { ActionTypes } from "../types";

export const getCeos = () => (dispatch) =>{
    dispatch({ type: ActionTypes.CEO.LOADING });
    axios.get(`/ceos`)
    .then(({ data }) => {
        dispatch({ type: ActionTypes.CEO.SET_CEOS, payload: data});
    })
    .catch((err) => {
        console.log(err);
        dispatch({
          type: ActionTypes.CEO.SET_ERRORS,
          payload: err.response?.data,
        });
      });
}

export const getCeo = (ceoEmail) => (dispatch) =>{
    dispatch({ type: ActionTypes.CEO.LOADING });
    axios.get(`/ceo/${ceoEmail}`)
    .then(({ data }) => {
        dispatch({ type: ActionTypes.CEO.SET_CEO, payload: data});
    })
    .catch((err) => {
        console.log(err);
        dispatch({
          type: ActionTypes.CEO.SET_ERRORS,
          payload: err.response?.data,
        });
      });
}

export const deleteCeo = (ceoEmail) => (dispatch) => {
    axios.delete(`/ceo/${ceoEmail}`)
    .then(({data}) => {
      dispatch({ type: ActionTypes.CEO.DELETE_CEO, payload: ceoEmail });
      data.employeeEmails.forEach((email) => {
        console.log(email)
        dispatch({ type: ActionTypes.EMPLOYEE.DELETE_EMPLOYEE, payload: email })
      })
    })
    .catch((err) => {
        console.log(err);
        dispatch({
          type: ActionTypes.CEO.SET_ERRORS,
          payload: err.response?.data,
        });
      });
}