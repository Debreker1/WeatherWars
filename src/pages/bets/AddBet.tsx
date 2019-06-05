import * as React from 'react';
import { connect } from 'react-redux'
import WeatherBet from '../../contracts/BettingContract.json';
import { Button, Icon, FormControl, InputLabel, TextField } from '@material-ui/core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Loadbutton from '../../components/LoadButton';
import { Redirect } from 'react-router';
import { format, differenceInSeconds } from 'date-fns';

enum status {
  Add = "Add",
  Deploying = "Deploying",
  Done = "Done",
  Error = "Error"
}

type Props = stateProps;
type State = {
  betAmount: string,
  status: status,
  redirect: boolean,
  redirectLink: string,
  date: Date | null
};

class AddBet extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      betAmount: "1",
      status: status.Add,
      redirect: false,
      redirectLink: "",
      date: new Date()
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = event.target.name;
    const value: any = event.target.value;
    this.setState({
      ...this.state,
      [name]: value
    });
    console.log(name + " : " + value);
  }

  handleDateChange = (date: Date | null) => {
    this.setState({ date: date });
  };

  deployContract = async (e) => {
    e.preventDefault();
    if (this.state.date != null) {
      try {
        this.setState({ status: status.Deploying });
        const amountOfSeconds = differenceInSeconds(new Date(), this.state.date);
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
        this.setState({ status: status.Done, redirect: true, redirectLink: "/bets/" + deployed.options.address });
      } catch (err) {
        this.setState({ status: status.Error });
        throw err;
      }
    }
  };

  public render() {
    return this.formLayout();
  }

  formLayout = () => {
    return (
      <form>
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
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            margin="normal"
            id="mui-pickers-date"
            name="date"
            label="Datum en tijd van weer"
            disablePast={true}
            value={this.state.date}
            onChange={this.handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
      </form>
    );
  };
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