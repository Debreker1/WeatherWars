import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import WeatherBet from '../../contracts/BettingContract.json';
import getWeb3 from '../../web3/getWeb3.js';
import { fromUnixTime, format } from 'date-fns';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Input } from '@material-ui/core';


enum status {
  view,
  sending,
  sent,
  error
}

type Props = RouteComponentProps<{ slug: string }>;
type State = {
  contract: any,
  web3: any,
  accounts: string[],
  totalBetAmount: number,
  betAmountRaw: string
  betAmount: number,
  players: number,
  ownerBet: number,
  location: string,
  date: string,
  fieldsDisabled: boolean,
  playerBet: boolean,
  status: status
};

class BetDetails extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      contract: null,
      web3: null,
      accounts: [],
      totalBetAmount: 0,
      betAmountRaw: '',
      betAmount: 0,
      players: 0,
      ownerBet: 0,
      location: '',
      date: '',
      fieldsDisabled: false,
      playerBet: true,
      status: status.view
    }
  }

  public async componentWillMount() {
    const web3 = await getWeb3();
    web3.eth.transactionConfirmationBlocks = 1;
    const accounts: string[] = await web3.eth.getAccounts();
    const weatherContract = await new web3.eth.Contract(WeatherBet.abi, this.props.match.params.slug);

    const betAmountRaw = await weatherContract.methods.betAmount().call();
    const betAmount: number = parseInt(web3.utils.fromWei(betAmountRaw.toString()));

    const playerAmountRaw = await weatherContract.methods.playerCount().call();
    const players: number = playerAmountRaw.toNumber();

    const ownerBetRaw = await weatherContract.methods.initialBet().call();
    const ownerBet = ownerBetRaw.toNumber();

    const location = await weatherContract.methods.location().call();

    const timestamRaw = await weatherContract.methods.timestamp().call();
    const date = format(fromUnixTime(timestamRaw.toNumber()), 'dd-MM-yyyy HH:mm');


    const totalBetAmount: number = (betAmount * players);

    this.setState({
      contract: weatherContract,
      web3: web3,
      accounts: accounts,
      players: players,
      betAmountRaw: betAmountRaw.toString(),
      betAmount: betAmount,
      totalBetAmount: totalBetAmount,
      ownerBet: ownerBet,
      location: location,
      date: date
    });
  };

  handleChange = (event: React.ChangeEvent<unknown>) => {
    const select: string = (event.target as HTMLInputElement).value;
    if (select == 'true') {
      this.setState({
        playerBet: true
      });
    } else {
      this.setState({
        playerBet: false
      });
    }
  }

  joinGame = async (e) => {
    e.preventDefault();
    try {
      this.setState({ fieldsDisabled: true, status: status.sending});
      await this.state.contract.methods.AddPlayer(this.state.playerBet).send({ from: this.state.accounts[0], value: this.state.betAmountRaw });
      this.setState({ fieldsDisabled: false, status: status.sent });
    } catch(error) {
      console.error(error);
      this.setState({fieldsDisabled: false, status: status.error});
    }
  }

  public render() {
    return (
      <div style={{marginTop: 50}}>
        <p>Dit is de pagina voor een specifieke bet. address is: {this.props.match.params.slug}</p>
        <p>Totaal in de pot: {this.state.totalBetAmount}</p>
        <p>Totaal aantal spelers: {this.state.players}</p>
        <p>Inleg om te mogen meespelen: {this.state.betAmount}</p>
        <p>Locatie: {this.state.location}</p>
        <p>Owner gokt op temparatuur: {this.state.ownerBet}</p>
        <p>Bet wordt gespeeld op: {this.state.date}</p>
        <br/>

        Deel met vrienden:<br/>
        <input type="text" value={`localhost:3000${this.props.location.pathname}`} style={{borderRadius: 4, border: "3px #3F51B5 solid", width: 500, height: 40, paddingLeft: 5}} />
        <br/><br/>

        <form onSubmit={this.joinGame}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Wordt de teparatuur hoger of lager?</FormLabel>
            <RadioGroup
              aria-label="guess"
              name="guess"
              value={this.state.playerBet.toString()}
              onChange={this.handleChange}
            >
              <FormControlLabel disabled={this.state.fieldsDisabled} value="true" control={<Radio />} label="Hoger" />
              <FormControlLabel disabled={this.state.fieldsDisabled} value="false" control={<Radio />} label="Lager" />
            </RadioGroup>
          </FormControl><br/>
          <input type="submit" style={{border: "none", backgroundColor: "#3F51B5", color: "white", borderRadius: 5, padding: 7, marginTop: 15, fontSize: 15}} value="Meespelen" />
        </form>
      </div>
    )
  }
}

export default BetDetails;