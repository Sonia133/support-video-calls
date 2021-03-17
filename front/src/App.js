import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import store from "./redux/store";
import Lobby from "./views/lobby/Lobby";

// const theme = createMuiTheme(themeFile);

function App() {
  return (
    // <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/call/:companyName" component={Lobby} />
        </Switch>
      </Router>
    </Provider>
    // </MuiThemeProvider>
  );
}

export default App;
