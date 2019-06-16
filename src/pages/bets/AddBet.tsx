import * as React from 'react';
import { FormControl, InputLabel, TextField, Select, MenuItem } from '@material-ui/core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Redirect } from 'react-router';
import { isAfter} from 'date-fns';
import { status } from '../../model';
import web3Handler from '../../classes/web3Handler';
import {betVisability, City} from '../../model';

type Props = {};
type State = {
  betAmount: string,
  status: status,
  redirect: boolean,
  date: Date | null
  visability: betVisability,
  fieldsDisabled: boolean,
  newContractAddress: string,
  city: City,
  degrees: number,
  betList: any,
  handler: web3Handler
};

const visabilityOptions = Object.values(betVisability).map((value, index) => {
  return (
    <MenuItem key={index} value={value}>{value.toString()}</MenuItem>
  );
});

const CityOptions = Object.values(City).map((value, key) => {
  return (
    <MenuItem key={key} value={value}>{value.toString()}</MenuItem>
  );
});

class AddBet extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      betAmount: "1",
      status: status.Add,
      redirect: false,
      date: new Date(),
      visability: betVisability.Public,
      fieldsDisabled: false,
      newContractAddress: '',
      city: City.Rotterdam,
      degrees: 15,
      betList: null,
      handler: new web3Handler()
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = event.target.name;
    const value: any = event.target.value;
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  handleSelectChangeCity = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const value: City = event.target.value as City;
    this.setState({ city: value });
  };

  handleSelectChangeVisability = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const value: betVisability = event.target.value as betVisability;
    this.setState({ visability: value });
  }


  handleDateChange = (date: Date | null) => {
    this.setState({ date: date });
  };

  isPublic = () : boolean => {
    if(this.state.visability === betVisability.Public) {
      return true;
    } else {
      return false;
    }
  }

  deployContract = async (e) => {
    e.preventDefault();
    if (this.state.date != null && isAfter(this.state.date!, new Date())) {
      try {
        this.setState({ status: status.Deploying, fieldsDisabled: true });
        const betAmount: string = this.state.betAmount;
        const date: Date = this.state.date!;
        const degreeGuess: number = this.state.degrees;
        const location: string = this.state.city;
        const isPublic: boolean = this.isPublic();

        const betAddress = await this.state.handler.deployBet(betAmount, date, degreeGuess, location, isPublic);

        this.setState({ status: status.Done, newContractAddress: betAddress });
        window.setTimeout(() => { this.setState({ redirect: true }) }, 3000);
      } catch (err) {
        this.setState({ status: status.Error, fieldsDisabled: false });
        throw err;
      }
    }
  };

  handleRedirect = (contractAddress: string): any => {
    let link: string = "/bets/" + contractAddress;
    return <Redirect to={link} />
  }

  public render() {
    return (
      <div style={{marginTop: 50}}>
        {this.state.redirect && this.handleRedirect(this.state.newContractAddress)}
        <form onSubmit={this.deployContract}>
          <TextField
            id="betAmount"
            name="betAmount"
            label="Hoeveelheid Ethereum"
            value={this.state.betAmount}
            onChange={this.handleChange}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            disabled={this.state.fieldsDisabled}
          /><br/>
          <TextField
            id="degrees"
            name="degrees"
            label="Graden celsius"
            value={this.state.degrees}
            onChange={this.handleChange}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            disabled={this.state.fieldsDisabled}
          /><br/>
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
          </MuiPickersUtilsProvider><br/><br/>
          <FormControl>
            <InputLabel htmlFor="visability-select">Zichtbaarheid</InputLabel>
            <Select
              value={this.state.visability}
              onChange={this.handleSelectChangeVisability}
              disabled={this.state.fieldsDisabled}
            >
              {visabilityOptions}
            </Select>
          </FormControl><br/><br/>
          <FormControl>
            <InputLabel htmlFor="city-select">Plaats</InputLabel>
            <Select value={this.state.city} disabled={this.state.fieldsDisabled} onChange={this.handleSelectChangeCity}>
              {CityOptions}
            </Select>
          </FormControl><br/>
          <input type="submit" style={{border: "none", backgroundColor: "#3F51B5", color: "white", borderRadius: 5, padding: 7, marginTop: 15, fontSize: 15}} value="contract aanmaken" />
        </form>
        <p>Huidige status: {this.state.status}</p>
        {this.state.newContractAddress && <p>Contract aangemaakt!: {this.state.newContractAddress}</p>}

      </div>
    )
  }
}

export default AddBet;