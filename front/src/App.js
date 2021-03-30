import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import store from "./redux/store";
import VideoChat from "./components/VideoCalls/VideoChat";
import jwtDecode from "jwt-decode";
import { getUserData, logoutUser } from "./redux/actions/userActions";
import Login from "./pages/auth/login/Login";
import SignUp from "./pages/auth/signup/SignUp";
import GetStarted from "./pages/auth/signup/GetStarted";
import Home from "./pages/home/Home";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";

function App() {
  let [token, setToken] = useState(localStorage.FBIdToken);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
  
      if (decodedToken.exp * 1000 < Date.now()) {
        console.log('expired')
        store.dispatch(logoutUser());
        window.location.href = "/login";
        setToken(undefined);
      } else {
        console.log('still')
        store.dispatch(getUserData());
      }
    } else {
      setToken(undefined);
    }
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/forgotpassword" component={ForgotPassword} />
          <Route exact path="/changepassword" component={ChangePassword} />
          <Route exact path="/invite/:token" component={SignUp} />
          <Route exact path="/getstarted" component={GetStarted} />
          <Route exact path="/call/:companyName" component={VideoChat} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
