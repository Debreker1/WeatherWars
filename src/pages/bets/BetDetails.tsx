import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import WeatherBet from '../../contracts/BettingContract.json';
import getWeb3 from '../../web3/getWeb3.js';


type Props = RouteComponentProps<{ slug: string }>;
type State = {
  contract: any,
  web3: any,
  accounts: string[],
  totalBetAmount: number,
  betAmount: number,
  players: number;
};

class BetDetails extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      contract: null,
      web3: null,
      accounts: [],
      totalBetAmount: 0,
      betAmount: 0,
      players: 0
    }
  }

  public async componentWillMount() {
    const web3 = await getWeb3();
    web3.eth.transactionConfirmationBlocks = 1;
    const accounts: string[] = await web3.eth.getAccounts();
    const weatherContract = await new web3.eth.Contract(WeatherBet.abi, this.props.match.params.slug);
    const totalBetweiRaw = await weatherContract.methods.betAmount().call();
    const totalBetAmount = web3.utils.fromWei(totalBetweiRaw.toString());
    const playersRaw = await weatherContract.methods.playerCount().call();
    const totalPlayers = playersRaw.toNumber();

    this.setState({
      contract: weatherContract,
      web3: web3,
      accounts: accounts,
      totalBetAmount: totalBetAmount,
      players: totalPlayers
    });
  };

  public render() {
    return (
      <div>
        <p>Dit is de pagina voor een specifieke bet. Slug is: {this.props.match.params.slug}</p>
        <p>Totaal in de pot: {this.state.totalBetAmount}</p>
        <p>Totaal aantal spelers: {this.state.players}</p>
      </div>
    )
  }
}

export default BetDetails;