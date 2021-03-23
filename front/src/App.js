import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import store from "./redux/store";
import VideoChat from "./components/VideoCalls/VideoChat";
import jwtDecode from "jwt-decode";
import { getUserData, logoutUser } from "./redux/actions/userActions";
import Login from "./pages/login/Login";
import Home from "./components/Home";

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
          <Route exact path="/call/:companyName" component={VideoChat} />
        </Switch>
      </Router>
    </Provider>
  );
}

// sorina@mail.com: {
//   roomId: "id camera"
//   joinedAt: "timestamp"
// }

export default App;
