import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch";

import "./index.scss";

import App from "./views/App";

ReactDOM.render(<App />, document.getElementById("root"));
