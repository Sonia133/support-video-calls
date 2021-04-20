import socket from "../../socket";
import axios from "../axios";
import { ActionTypes } from "../types";
import { groupCalls } from "../../util/functions/groupCalls";
import { groupFeedback } from "../../util/functions/groupFeedback";

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
          let clients = Object.values(data.val()).filter((snapshot) => snapshot.isClient === true);
          let clientsCompany = clients.filter((client) => client.companyName === companyName);
          clientsCompany.sort((a, b) => {
            return (a.joinedAt < b.joinedAt) ? -1 : ((a.joinedAt > b.joinedAt) ? 1 : 0); 
          });
          if (clientsCompany[0]) {
            dispatch(findEmployee(clientsCompany[0].roomId, clientsCompany[0].companyName));
          }
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

export const getCalls = () => (dispatch) => {
  dispatch({ type: ActionTypes.CALL.LOADING_CALLS });
  axios.get('/calls')
  .then(({ data }) => {
    dispatch({ type: ActionTypes.CALL.SET_CALLS, payload: groupCalls(data)});
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.CALL.SET_ERRORS_CALLS,
      payload: err.response?.data,
    });
  });
}

export const getCallsPerCompany = (companyName) => (dispatch) => {
  console.log('here')
  dispatch({ type: ActionTypes.CALL.LOADING_CALLS });
  axios.get(`/calls/company/${companyName}`)
  .then(({ data }) => {
    dispatch({ type: ActionTypes.CALL.SET_CALLS, payload: groupCalls(data)});
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.CALL.SET_ERRORS_CALLS,
      payload: err.response?.data,
    });
  });
}

export const getCallsPerEmployee = (companyName, employeeEmail) => (dispatch) => {
  dispatch({ type: ActionTypes.CALL.LOADING_CALLS });
  axios.get(`/calls/employee/${companyName}/${employeeEmail}`)
  .then(({ data }) => {
    dispatch({ type: ActionTypes.CALL.SET_CALLS, payload: groupCalls(data)});
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.CALL.SET_ERRORS_CALLS,
      payload: err.response?.data,
    });
  });
}

export const getFeedback = () => (dispatch) => {
  dispatch({ type: ActionTypes.CALL.LOADING_FEEDBACK });
  axios.get('/ceos/feedback')
  .then(({ data }) => {
    dispatch({ type: ActionTypes.CALL.SET_FEEDBACK, payload: groupFeedback(data)});
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.CALL.SET_ERRORS_CALLS,
      payload: err.response?.data,
    });
  });
}

export const getFeedbackPerCompany = (companyName) => (dispatch) => {
  dispatch({ type: ActionTypes.CALL.LOADING_FEEDBACK });
  axios.get(`/ceo/feedback/${companyName}`)
  .then(({ data }) => {
    dispatch({ type: ActionTypes.CALL.SET_FEEDBACK, payload: groupFeedback(data)});
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.CALL.SET_ERRORS_CALLS,
      payload: err.response?.data,
    });
  });
}

export const getFeedbackPerEmployee = (companyName, employeeEmail) => (dispatch) => {
  dispatch({ type: ActionTypes.CALL.LOADING_FEEDBACK });
  axios.get(`/employee/feedback/${companyName}/${employeeEmail}`)
    .then(({ data }) => {
      dispatch({ type: ActionTypes.CALL.SET_FEEDBACK, payload: groupFeedback(data) });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ActionTypes.CALL.SET_ERRORS_FEEDBACK,
        payload: err.response?.data,
      });
    });
}
