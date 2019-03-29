import React from "react";

import TextField from "@material-ui/core/TextField";

import "./AmountInput.scss";

interface IProps {
  value: number;
  onChange: (value: number) => void;
}

interface IState {}

export default class AmountInput extends React.Component<IProps, IState> {
  public render() {
    const {value} = this.props;

    return (
      <TextField
        // error={true}
        id="amount-input"
        label="Amount"
        value={value}
        className="amount-input"
        margin="normal"
        // variant="outlined"
        type="number"
        helperText="Please select your currency"
        onChange={this.onInputChange}
      />
    );
  }

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    return this.props.onChange(Number.parseFloat(event.target.value));
  };
}