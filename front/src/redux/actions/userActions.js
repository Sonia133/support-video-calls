import socket from "../../socket";
import axios from "../axios";
import { ActionTypes } from "../types";
import { findEmployee } from "./callActions";

export const validateTokenEnroll = (token) => (dispatch) => {
  dispatch({ type: ActionTypes.UI.LOADING_UI });
  axios.get(`/invite/validation/${token}`)
  .then(({ data }) => {
    dispatch({ type: ActionTypes.USER.VALIDATE_TOKEN, payload: data });
    dispatch({ type: ActionTypes.UI.STOP_LOADING_UI });
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.UI.SET_ERRORS,
      payload: err.response?.data,
    });
  })
}

export const signup = (userData, token, history) => (dispatch) => {
  dispatch({ type: ActionTypes.USER.LOADING_USER });
  axios.post(`/signup/${token}`, userData)
  .then(({ data }) => {
    localStorage.setItem("FBIdToken", data.token);
    dispatch(getUserData());
    dispatch({ type: ActionTypes.USER.CLEAR_ERRORS });
    history.push('/');
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.USER.SET_ERRORS,
      payload: err.response?.data,
    });
  });
}

export const sendRegisterRequest = (userData, history) => (dispatch) => {
  dispatch({ type: ActionTypes.UI.LOADING_UI });
  axios.post("/requestAccount", userData)
  .then(() => {
    dispatch({ type: ActionTypes.UI.STOP_LOADING_UI });
    dispatch({ type: ActionTypes.UI.CLEAR_ERRORS })
    if (userData.role === 'employee') {
      history.push('/');
    }
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.UI.SET_ERRORS,
      payload: err.response?.data,
    });
  })
}

export const loginUser = (userData) => (dispatch) => {
  dispatch({ type: ActionTypes.USER.LOADING_USER });
  axios
    .post("/login", userData)
    .then(({ data }) => {
      localStorage.setItem("FBIdToken", data.token);
      dispatch(getUserData());
      dispatch({ type: ActionTypes.USER.CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ActionTypes.USER.SET_ERRORS,
        payload: err.response?.data,
      });
    });
};

export const forgotPassword = (userData, history) => (dispatch) => {
    dispatch({ type: ActionTypes.UI.LOADING_UI });
    axios.post('/forgotPassword', userData)
    .then(() => {
        history.push('/login');
        dispatch({ type: ActionTypes.UI.STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ActionTypes.USER.SET_ERRORS,
        payload: err.response?.data,
      });
    });
}

export const changePassword = (userData, history) => (dispatch) => {
  dispatch({ type: ActionTypes.UI.LOADING_UI });
  axios.post('/changePassword', userData)
  .then(() => {
      history.push('/');
      dispatch({ type: ActionTypes.UI.STOP_LOADING_UI });
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.USER.SET_ERRORS,
      payload: err.response?.data,
    });
  });
}

export const updateSchedule = (schedule) => (dispatch) => {
  dispatch({ type: ActionTypes.USER.LOADING_USER });
  axios.post('/employee/updateSchedule', schedule)
  .then(() => {
    dispatch(getUserData());
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.USER.SET_ERRORS,
      payload: err.response?.data,
    });
  });
}

export const changeAvailability = (userData) => (dispatch) => {
  dispatch({ type: ActionTypes.USER.LOADING_AVAILABILITY });
  axios.post('/employee/changeAvailability', userData)
  .then(() => {
    dispatch(getUserAvailability());
  })
  .catch((err) => {
    console.log(err);
    dispatch({
      type: ActionTypes.USER.SET_ERRORS,
      payload: err.response?.data,
    });
  });
}

export const getUserData = () => (dispatch) => {
  dispatch({ type: ActionTypes.USER.LOADING_USER });
  axios
    .get("/user")
    .then(({ data }) => {
      dispatch({ type: ActionTypes.USER.SET_USER, payload: data });
      if (data.role === "employee") {
        socket.ref(`calls/${data.email.replace(".", "-")}`).remove();
        socket.ref(`calls/${data.email.replace(".", "-")}`).set({
          roomId: "",
          joinedAt: new Date().toISOString(),
          isClient: false
        });

        socket.ref("calls")
          .once("value", (snapshot) => {
            let clients = Object.values(snapshot.val()).filter((snapshot) => snapshot.isClient === true);
            let clientsCompany = clients.filter((client) => client.companyName === data.companyName);
            clientsCompany.sort((a, b) => {
              return (a.joinedAt < b.joinedAt) ? -1 : ((a.joinedAt > b.joinedAt) ? 1 : 0); 
            });
            if (clientsCompany[0]) {
              dispatch(findEmployee(clientsCompany[0].roomId, clientsCompany[0].companyName));
            }
            return null;
          })
      }
    })
    .catch((err) => console.log(err));
};

export const getUserImage = () => (dispatch) => {
  axios
    .get("/user")
    .then(({ data }) => {
      dispatch({ type: ActionTypes.USER.SET_IMAGE, payload: data.imageUrl });
    })
    .catch((err) => console.log(err));
};

export const getUserAvailability = () => (dispatch) => {
  axios
    .get("/user")
    .then(({ data }) => {
      dispatch({ type: ActionTypes.USER.SET_AVAILABILITY, payload: data.available });
      if (data.role === "employee") {
        socket.ref(`calls/${data.email.replace(".", "-")}`).remove();
        socket.ref(`calls/${data.email.replace(".", "-")}`).set({
          roomId: "",
          joinedAt: new Date().toISOString(),
          isClient: false
        });

        socket.ref("calls")
          .once("value", (snapshot) => {
            let clients = Object.values(snapshot.val()).filter((snapshot) => snapshot.isClient === true);
            let clientsCompany = clients.filter((client) => client.companyName === data.companyName);
            clientsCompany.sort((a, b) => {
              return (a.joinedAt < b.joinedAt) ? -1 : ((a.joinedAt > b.joinedAt) ? 1 : 0); 
            });
            if (clientsCompany[0]) {
              dispatch(findEmployee(clientsCompany[0].roomId, clientsCompany[0].companyName));
            }
            return null;
          })
      }
    })
    .catch((err) => console.log(err));
};

export const uploadImage = (formData)  => (dispatch) => {
  dispatch({ type: ActionTypes.USER.LOADING_PICTURE });
  axios.post('/updateImage', formData)
      .then(() => {
          dispatch(getUserImage());
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: ActionTypes.USER.SET_ERRORS,
          payload: err.response?.data,
        });
      });
}

export const deleteProfilePicture = ()  => (dispatch) => {
  dispatch({ type: ActionTypes.USER.LOADING_PICTURE });
  axios.post('/deleteProfilePicture')
      .then(() => {
          dispatch(getUserImage());
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: ActionTypes.USER.SET_ERRORS,
          payload: err.response?.data,
        });
      });
}

export const logoutUser = (role) => (dispatch) => {  
  if (role === 'employee') {
    axios.post('/employee/changeAvailability', { available: false })
    .then(() => {
      localStorage.removeItem("FBIdToken");
      dispatch({ type: ActionTypes.USER.SET_UNAUTHENTICATED });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ActionTypes.USER.SET_ERRORS,
        payload: err.response?.data,
      });
    });
  } else {
    localStorage.removeItem("FBIdToken");
    dispatch({ type: ActionTypes.USER.SET_UNAUTHENTICATED });
  }
  
};