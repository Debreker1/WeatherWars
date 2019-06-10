import * as React from 'react';
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router';
import WeatherBet from '../../contracts/BettingContract.json';
import Web3 from 'web3';


type Props = RouteComponentProps<{ slug: string }> & stateProps;
type State = {
  contract: any
};

class BetDetails extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      contract: null
    }
  }

  public async componentWillReceiveProps() {
    const weatherContract = await new this.props.web3.eth.Contract(WeatherBet.abi, this.props.match.params.slug);
    this.setState({
      contract: weatherContract
    });
    console.log(weatherContract);
    console.log(await weatherContract.betAmount());
  };

  public render() {
    return (
      <div>Dit is de pagina voor een specifieke bet. Slug is: {this.props.match.params.slug}</div>
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

export default connect(mapStateToProps)(BetDetails);