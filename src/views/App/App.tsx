import React from "react";
import {hot} from "react-hot-loader/root";

import {Button, Grid} from "@material-ui/core";
import LoopIcon from "@material-ui/icons/Loop";
import SendIcon from "@material-ui/icons/Send";

import "./App.scss";
import AmountInput from "./components/AmountInput";
import CurrencyInput from "./components/CurrencyInput";
import {ValueType} from "react-select/lib/types";
import {ISelectOption} from "../../interfaces/selectOption";

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
  amount: number;

  showError: boolean;
  result: IConversionResult | undefined;
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      timestamp: new Date(),
      rates: {},

      from: "USD",
      to: "EUR",
      amount: 100,

      showError: false,
      result: undefined
    };
  }

  public componentDidMount() {
    fetch("https://api.exchangeratesapi.io/latest")
      .then((res) => res.json())
      .then((body) => {
        console.log(body);
        this.setState({timestamp: new Date(body.date), rates: Object.assign({[body.base]: 1}, body.rates)});
      });
  }

  public componentDidUpdate() {
    const {showError} = this.state;

    if (!this.isValid() && !showError) {
      this.setState({showError: true});
    }
  }

  public render() {
    const {rates, result, from, to, amount, timestamp} = this.state;
    const currencies = Object.keys(rates).map((c) => ({value: c, label: c}));

    return (
      <Grid className="app" container={true} xs={10} sm={8} direction="column" justify="center" alignItems="center">
        <Grid container={true} direction="row" justify="center" alignItems="center">
          <h1>Currency Converter</h1>
        </Grid>

        <Grid className="row" container={true} direction="row" justify="center" alignItems="center">
          <Grid item={true} xs={5}>
            <label htmlFor="from">From</label>
          </Grid>

          <Grid item={true} xs={2} />

          <Grid item={true} xs={5}>
            <label htmlFor="to">To</label>
          </Grid>
        </Grid>

        <Grid className="row" container={true} direction="row" justify="center" alignItems="center">
          <Grid item={true} xs={5}>
            <CurrencyInput
              value={from}
              currencies={currencies}
              placeholder={"e.g. EUR"}
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
              currencies={currencies}
              placeholder={"e.g. USD"}
              onChange={this.onSelectInputChange("to")}
            />
          </Grid>
        </Grid>

        <Grid className="row" container={true} direction="row" justify="center" alignItems="center">
          <Grid item={true} xs={6} md={9}>
            {/* <label htmlFor="amount">Amount</label> */}
            <AmountInput value={amount} onChange={this.onAmountChange} />
          </Grid>

          <Grid item={true} xs={6} md={3}>
            <Button variant="contained" color="primary" onClick={this.convert}>
              Convert
              <SendIcon>convert</SendIcon>
            </Button>
          </Grid>
        </Grid>

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
      </Grid>
    );
  }

  private isValid = () => {
    const {from, to, amount} = this.state;

    return !!from && !!to && !!amount;
  };

  private onSelectInputChange = (key: string) => (option: ValueType<ISelectOption>) => {
    this.setState({[key]: !option ? null : (option as ISelectOption).value} as any);
  };

  private onAmountChange = (value: number) => {
    this.setState({amount: value});
  };

  private convert = () => {
    if (this.isValid()) {
      const {rates, from, to, amount} = this.state;
      const ltrRate = rates[to] / rates[from];

      this.setState({
        result: {
          srcAmount: amount,
          srcCurrency: from,

          dstAmount: ltrRate * amount,
          dstCurrency: to,

          ltrRate,
          rtlRate: 1 / ltrRate
        }
      });
    }
  };

  private switchCurrency = () => {
    if (this.isValid()) {
      const {from, to} = this.state;

      this.setState({from: to, to: from});
    }
  };

  private prettyNumber = (value: number): number => {
    return Math.round(value * 100) / 100;
  };
}

export default hot(App);
