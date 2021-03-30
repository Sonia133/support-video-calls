import socket from "../../socket";
import axios from "../axios";
import { ActionTypes } from "../types";

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

export const sendRegisterRequest = (userData) => (dispatch) => {
  dispatch({ type: ActionTypes.UI.LOADING_UI });
  axios.post("/requestAccount", userData)
  .then(() => {
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
  dispatch({ type: ActionTypes.USER.LOADING_USER });
  axios.post('/employee/changeAvailability', userData)
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
        });
      }
    })
    .catch((err) => console.log(err));
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  dispatch({ type: ActionTypes.USER.SET_UNAUTHENTICATED });
};
