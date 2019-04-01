import React from "react";

import TextField from "@material-ui/core/TextField";

import "./AmountInput.scss";

interface IProps {
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
}

interface IState {
  focusing: boolean;
}

const numberInputProps = {
  type: "number",
  pattern: "[0-9]+([.,][0-9]+)?"
};

export default class AmountInput extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);

    this.state = {
      focusing: false
    };
  }

  public render() {
    const {value} = this.props;

    return (
      <TextField
        error={this.shouldShowErrors()}
        id="amount-input"
        label="Amount"
        value={value}
        className="amount-input"
        margin="normal"
        helperText={this.shouldShowErrors() && "Please input the conversion amount"}
        onChange={this.onInputChange}
        inputProps={numberInputProps}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    );
  }

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    return this.props.onChange(event.target.value);
  };

  private shouldShowErrors = () => {
    const {value, showError} = this.props;
    const {focusing} = this.state;

    return showError && !focusing && (!value || Number.parseFloat(value) <= 0);
  };

  private onFocus = () => {
    this.setState({focusing: true});
  };

  private onBlur = () => {
    this.setState({focusing: false});
  };
}
