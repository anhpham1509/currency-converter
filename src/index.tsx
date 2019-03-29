import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch";

import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "./config/theme";

import "./index.scss";

import App from "./views/App";

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById("root")
);
