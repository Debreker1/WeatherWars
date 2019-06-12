import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import WeatherBet from '../../contracts/BettingContract.json';
import getWeb3 from '../../web3/getWeb3.js';


type Props = RouteComponentProps<{ slug: string }>;
type State = {
  contract: any,
  web3: any,
  accounts: string[]
};

class BetDetails extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      contract: null,
      web3: null,
      accounts: []
    }
  }

  public async componentWillMount() {
    const web3 = await getWeb3();
    const accounts: string[] = await web3.eth.getAccounts();
    web3.eth.transactionConfirmationBlocks = 1;
    const weatherContract = await new web3.eth.Contract(WeatherBet.abi, this.props.match.params.slug);
    this.setState({
      contract: weatherContract,
      web3: web3,
      accounts: accounts
    });
    console.log(weatherContract);
  };

  public render() {
    return (
      <div>Dit is de pagina voor een specifieke bet. Slug is: {this.props.match.params.slug}</div>
    )
  }
}

export default BetDetails;