import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import store from "./redux/store";
import VideoChat from "./components/VideoCalls/VideoChat";
import jwtDecode from "jwt-decode";
import { getUserData, logoutUser } from "./redux/actions/userActions";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import GetStarted from "./pages/signup/GetStarted";
import Home from "./pages/home/Home";

function App() {
  const token = localStorage.FBIdToken;

  if (token) {
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      store.dispatch(logoutUser());
      window.location.href = "/login";
    } else {
      store.dispatch(getUserData());
    }
  }

  return (
    <Provider store={store}>
      <Router>
        {/* if busy render VideoChat, otherwise home */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/invite/:token" component={SignUp} />
          <Route exact path="/getstarted" component={GetStarted} />
          <Route exact path="/call/:companyName" component={VideoChat} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
