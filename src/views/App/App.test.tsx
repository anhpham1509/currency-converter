import React from "react";
import {create} from "react-test-renderer";
import App from "./App";

describe("<App />", () => {
  it("renders without crashing", () => {
    const wrapper = create(<App />);
    expect(wrapper).toMatchSnapshot();
  });
});
