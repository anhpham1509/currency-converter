import React from "react";
import {hot} from "react-hot-loader/root";

import {Button, Grid} from "@material-ui/core";
import LoopIcon from "@material-ui/icons/Loop";
import SendIcon from "@material-ui/icons/Send";
import AmountInput from "./components/AmountInput";
import CurrencyInput from "./components/CurrencyInput";

import {ValueType} from "react-select/lib/types";
import {ISelectOption} from "../../interfaces/selectOption";

import "./App.scss";

interface IProps {}

interface IConversionResult {
  srcAmount: number;
  srcCurrency: string;

  dstAmount: number;
  dstCurrency: string;

  ltrRate: number;
  rtlRate: number;
}

interface IState {
  timestamp: Date;
  rates: {[key: string]: number};

  from: string;
  to: string;
  amount: string;

  showError: boolean;
  result: IConversionResult | undefined;
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      timestamp: new Date(),
      rates: {},

      from: "",
      to: "",
      amount: "0",

      showError: false,
      result: undefined
    };
  }

  public componentDidMount() {
    fetch("https://api.exchangeratesapi.io/latest")
      .then((res) => res.json())
      .then((body) => {
        this.setState({timestamp: new Date(body.date), rates: Object.assign({[body.base]: 1}, body.rates)});
      });
  }

  public render() {
    return (
      <Grid className="app" container={true} xs={10} sm={8} direction="column" justify="center" alignItems="center">
        <Grid container={true} direction="row" justify="center" alignItems="center">
          <h1>Currency Converter</h1>
        </Grid>

        <form onSubmit={this.convert}>{this.renderForm()}</form>

        {this.renderResult()}
      </Grid>
    );
  }

  private renderForm = () => {
    const {rates, from, to, amount, showError} = this.state;
    const currencies = Object.keys(rates).map((c) => ({value: c, label: c}));

    return (
      <React.Fragment>
        <Grid className="row" container={true} direction="row" justify="center" alignItems="center">
          <Grid item={true} xs={5}>
            <label htmlFor="from">From</label>
          </Grid>

          <Grid item={true} xs={2} />

          <Grid item={true} xs={5}>
            <label htmlFor="to">To</label>
          </Grid>
        </Grid>

        <Grid className="row" container={true} direction="row" justify="center" alignItems="flex-start">
          <Grid item={true} xs={5}>
            <CurrencyInput
              value={from}
              currencies={currencies.filter((c) => c.value !== to)}
              placeholder={"e.g. EUR"}
              showError={showError}
              onChange={this.onSelectInputChange("from")}
            />
          </Grid>

          <Grid item={true} xs={2}>
            <LoopIcon className="switch-btn" onClick={this.switchCurrency}>
              switch
            </LoopIcon>
          </Grid>

          <Grid item={true} xs={5}>
            <CurrencyInput
              value={to}
              currencies={currencies.filter((c) => c.value !== from)}
              placeholder={"e.g. USD"}
              showError={showError}
              onChange={this.onSelectInputChange("to")}
            />
          </Grid>
        </Grid>

        <Grid className="row" container={true} direction="row" justify="center" alignItems="center">
          <Grid item={true} xs={6} md={9}>
            <AmountInput value={amount} onChange={this.onAmountChange} showError={showError} />
          </Grid>

          <Grid item={true} xs={6} md={3}>
            <Button className="submit-btn" variant="contained" color="primary" type="submit" onClick={this.convert}>
              Convert
              <SendIcon>convert</SendIcon>
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  private renderResult = () => {
    const {result, timestamp} = this.state;

    return (
      <Grid container={true} direction="row" justify="center" alignItems="center">
        {result && (
          <div>
            <h2>Conversion result</h2>
            <p>
              {`${result.srcAmount} ${result.srcCurrency} = ${this.prettyNumber(result.dstAmount)} ${
                result.dstCurrency
              }`}
              <br />
              {`1 ${result.srcCurrency} = ${this.prettyNumber(result.ltrRate)} ${result.dstCurrency}`}
              <br />
              {`1 ${result.dstCurrency} = ${this.prettyNumber(result.rtlRate)} ${result.srcCurrency}`}
              <br />
              <br />
              {`Last update: ${timestamp.toDateString()}`}
            </p>
          </div>
        )}
      </Grid>
    );
  };

  private isCurrencyValid = () => {
    const {from, to} = this.state;

    return !!from && !!to;
  };

  private getNumber = (str: string) => {
    return Number.parseFloat(str);
  };

  private isValid = () => {
    const {amount} = this.state;

    return this.isCurrencyValid() && !!amount && this.getNumber(amount) > 0;
  };

  private onSelectInputChange = (key: string) => (option: ValueType<ISelectOption>) => {
    this.setState({[key]: !option ? null : (option as ISelectOption).value} as any);
  };

  private onAmountChange = (value: string) => {
    this.setState({amount: value});
  };

  private convert = (event: React.FormEvent) => {
    event.preventDefault();

    if (!this.isValid()) {
      return this.setState({showError: true});
    }

    const {rates, from, to, amount} = this.state;
    const ltrRate = rates[to] / rates[from];
    const amountNumber = this.getNumber(amount);

    this.setState({
      result: {
        srcAmount: amountNumber,
        srcCurrency: from,

        dstAmount: ltrRate * amountNumber,
        dstCurrency: to,

        ltrRate,
        rtlRate: 1 / ltrRate
      }
    });
  };

  private switchCurrency = () => {
    if (!this.isCurrencyValid()) {
      return this.setState({showError: true});
    }

    const {from, to} = this.state;

    this.setState({from: to, to: from});
  };

  private prettyNumber = (value: number): number => {
    return Math.round(value * 100) / 100;
  };
}

export default hot(App);
