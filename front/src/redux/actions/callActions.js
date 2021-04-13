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

export const endCall = (companyName, employeeEmail, localParticipant, remoteParticipant) => (dispatch) => {
    const callData = {
        companyName,
        employeeEmail,
        localParticipant,
        remoteParticipant
    };
    
    axios.post("/call/end", callData)
    .then(() => {
      dispatch({ type: ActionTypes.CALL.END_CALL})
      socket.ref(`calls/${employeeEmail.replace(".", "-")}`).update({
        roomId: ''
      });
    })
    .then(() => {
      socket.ref("calls")
        .once("value", (data) => {
          console.log(data.val())
          let clients = Object.values(data.val()).filter((snapshot) => snapshot.isClient === true);
          let clientsCompany = clients.filter((client) => client.companyName === companyName);
          clientsCompany.sort((a, b) => {
            return (a.joinedAt < b.joinedAt) ? -1 : ((a.joinedAt > b.joinedAt) ? 1 : 0); 
          });
          console.log(clientsCompany[0])
          dispatch(findEmployee(clientsCompany[0].roomId, clientsCompany[0].companyName));
          return null;
        })
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ActionTypes.CALL.SET_ERRORS,
        payload: err.response?.data,
      });
    });
}

export const sendFeedback = (formData) => (dispatch) => {
  console.log(formData)
  dispatch({ type: ActionTypes.UI.LOADING_UI });
  axios.post('/call/feedback', formData)
  .then(() => {
    dispatch({ type: ActionTypes.UI.STOP_LOADING_UI });
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.UI.SET_ERRORS,
      payload: err.response?.data,
    });
  });
}