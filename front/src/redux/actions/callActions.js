import socket from "../../socket";
import axios from "../axios";
import { ActionTypes } from "../types";

export const findEmployee = (roomName, companyName) => (dispatch) => {
  dispatch({ type: ActionTypes.CALL.LOADING_EMPLOYEE });
  axios
    .post(`/call/start/${companyName}`, { roomName })
    .then(({ data }) => {
      dispatch({ type: ActionTypes.CALL.SET_EMPLOYEE, payload: data})
      socket.ref(`calls/${data.email.replace(".", "-")}`).update({
        roomId: roomName
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ActionTypes.CALL.SET_ERRORS,
        payload: err.response?.data,
      });
    });
};

export const endCall = (companyName, employeeEmail) => (dispatch) => {
    const callData = {
        companyName,
        employeeEmail
    };
    
    axios.post("/call/end", callData)
    .then(() => {
      dispatch({ type: ActionTypes.CALL.END_CALL})
      socket.ref(`calls/${employeeEmail.replace(".", "-")}`).update({
        roomId: ''
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ActionTypes.CALL.SET_ERRORS,
        payload: err.response?.data,
      });
    });
}
