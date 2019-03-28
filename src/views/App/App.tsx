import React from "react";

import sampleImg from "../../images/sample.jpg";
import "./App.scss";

class App extends React.Component {
  public render() {
    return (
      <div className="app">
        <h1>Hello World!</h1>
        <img src={sampleImg} alt="Sample image" />
      </div>
    );
  }
}

export default App;
