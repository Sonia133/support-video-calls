import socket from "../../socket";
import axios from "../axios";
import { ActionTypes } from "../types";

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

export const getUserData = () => (dispatch) => {
  dispatch({ type: ActionTypes.USER.LOADING_USER });
  axios
    .get("/user")
    .then(({ data }) => {
      dispatch({ type: ActionTypes.USER.SET_USER, payload: data });
      console.log(data);
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
