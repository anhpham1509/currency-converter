import React from "react";

import Select from "react-select";

import {ValueType} from "react-select/lib/types";
import {ISelectOption} from "../../../../interfaces/selectOption";

import "./CurrencyInput.scss";

interface IProps {
  currencies: ISelectOption[];
  placeholder: string;
  value: string;
  onChange: (value: ValueType<ISelectOption>) => void;
  showError: boolean;
}

interface IState {
  focusing: boolean;
}

export default class CurrencyInput extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);

    this.state = {
      focusing: false
    };
  }

  public render() {
    const {currencies, value, placeholder, onChange, showError} = this.props;

    return (
      <React.Fragment>
        <Select
          className={this.shouldShowErrors() ? "has-error" : ""}
          options={currencies}
          value={!value ? null : this.getSelectedOption(currencies, value)}
          onChange={onChange}
          placeholder={placeholder}
          isClearable={true}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <p className="help-text">{showError && !value && "Please select currency"}</p>
      </React.Fragment>
    );
  }

  private getSelectedOption = (currencies: ISelectOption[], selectedCurrency: string) => {
    return currencies.find((option) => option.value === selectedCurrency);
  };

  private shouldShowErrors = () => {
    const {value, showError} = this.props;
    const {focusing} = this.state;

    return showError && !focusing && !value;
  };

  private onFocus = () => {
    this.setState({focusing: true});
  };

  private onBlur = () => {
    this.setState({focusing: false});
  };
}
