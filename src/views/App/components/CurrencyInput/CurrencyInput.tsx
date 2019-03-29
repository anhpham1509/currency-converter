import React from "react";

import Select from "react-select";

import {ValueType} from "react-select/lib/types";
import {ISelectOption} from "../../../../interfaces/selectOption";

interface IProps {
  currencies: ISelectOption[];
  placeholder: string;
  value: string;
  onChange: (value: ValueType<ISelectOption>) => void;
}

interface IState {}

export default class CurrencyInput extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);

    this.state = {
      selectedCurrency: null
    };
  }
  public render() {
    const {currencies, value, placeholder, onChange} = this.props;

    return (
      <Select
        // classes={classes}
        // styles={selectStyles}
        options={currencies}
        // components={components}
        value={!value ? null : this.getSelectedOption(currencies, value)}
        onChange={onChange}
        placeholder={placeholder}
        isClearable={true}
        // helperText="Please select your currency"
      />
    );
  }

  private getSelectedOption = (currencies: ISelectOption[], selectedCurrency: string) => {
    return currencies.find((option) => option.value === selectedCurrency);
  };
}
