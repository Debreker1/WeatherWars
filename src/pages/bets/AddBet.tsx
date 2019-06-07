import * as React from 'react';
import { connect } from 'react-redux'
import WeatherBet from '../../contracts/BettingContract.json';
import { FormControl, InputLabel, TextField, Select, MenuItem } from '@material-ui/core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// import { Redirect } from 'react-router';
import { differenceInSeconds } from 'date-fns';
import GoogleMaps from '../../components/GoogleMaps';

enum status {
  Add = "Add",
  Deploying = "Deploying",
  Done = "Done",
  Error = "Error"
}

enum betVisability {
  Public = "Public",
  Private = "Private"
}

type Props = stateProps;
type State = {
  betAmount: string,
  status: status,
  redirect: boolean,
  date: Date | null
  visability: betVisability,
  lat: number,
  lng: number,
  fieldsDisabled: boolean
};

class AddBet extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      betAmount: "1",
      status: status.Add,
      redirect: false,
      date: new Date(),
      visability: betVisability.Public,
      lat: 0,
      lng: 0,
      fieldsDisabled: false
    }
  }

  setLocation = (lat: number, lng: number) => {
    console.log("setting location in addBet");
    this.setState({
      lat: lat,
      lng: lng
    })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = event.target.name;
    const value: any = event.target.value;
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const value: betVisability = event.target.value as betVisability;
    this.setState({ visability: value });
    console.log(value);
  };

  handleDateChange = (date: Date | null) => {
    this.setState({ date: date });
  };

  deployContract = async (e) => {
    e.preventDefault();
    if (this.state.date != null) {
      try {
        this.setState({ status: status.Deploying, fieldsDisabled: true });
        const amountOfSeconds = differenceInSeconds(this.state.date, new Date());
        const account = this.props.accounts[0];
        const valueAmount = await this.props.web3.utils.toWei(this.state.betAmount, "ether")
        const weatherContract = await new this.props.web3.eth.Contract(WeatherBet.abi);
        const betDeploy = await weatherContract.deploy({
          data: WeatherBet.bytecode,
          arguments: [amountOfSeconds, valueAmount]
        });
        // const gasAmount = await betDeploy.estimateGas({from: this.state.accounts[0], value: valueAmount});
        const deployed = await betDeploy.send({
          from: account,
          value: valueAmount,
          gas: 3000000
        });
        this.setState({ status: status.Done, redirect: true });
      } catch (err) {
        this.setState({ status: status.Error, fieldsDisabled: false });
        throw err;
      }
    }
  };

  public render() {
    return (
      <div>
        <form onSubmit={this.deployContract}>
          <TextField
            id="betAmount"
            name="betAmount"
            label="Bet Amount"
            value={this.state.betAmount}
            onChange={this.handleChange}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            disabled={this.state.fieldsDisabled}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              margin="normal"
              id="weather-date-picker"
              name="date"
              label="Datum en tijd van weer"
              disablePast={true}
              value={this.state.date}
              onChange={this.handleDateChange}
              disabled={this.state.fieldsDisabled}
              KeyboardButtonProps={{
                'aria-label': 'Datum veranderen',
              }}
            />
          </MuiPickersUtilsProvider>
          <FormControl>
            <InputLabel htmlFor="visability-select">Zichtbaarheid</InputLabel>
            <Select
              value={this.state.visability}
              onChange={this.handleSelectChange}
              disabled={this.state.fieldsDisabled}
            >
              <MenuItem value={betVisability.Public}>{betVisability.Public}</MenuItem>
              <MenuItem value={betVisability.Private}>{betVisability.Private}</MenuItem>
            </Select>
          </FormControl>
          <GoogleMaps passLocation={this.setLocation} />
          <input type="submit" value="contract aanmaken" />
        </form>
        <p>Huidige status: {this.state.status}</p>
      </div>
    )
  }
}

interface stateProps {
  web3: any
  accounts: string[]
};

const mapStateToProps = (state: any) => ({
  web3: state.web3Reducer.Web3,
  accounts: state.web3Reducer.Accounts
});

export default connect(mapStateToProps)(AddBet);