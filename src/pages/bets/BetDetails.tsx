import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import WeatherBet from '../../contracts/BettingContract.json';


type Props = RouteComponentProps<{ slug: string }>;
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

  // public async componentWillReceiveProps() {
  //   const weatherContract = await new this.props.web3.eth.Contract(WeatherBet.abi, this.props.match.params.slug);
  //   this.setState({
  //     contract: weatherContract
  //   });
  //   console.log(weatherContract);
  //   console.log(await weatherContract.betAmount());
  // };

  public render() {
    return (
      <div>Dit is de pagina voor een specifieke bet. Slug is: {this.props.match.params.slug}</div>
    )
  }
}

export default BetDetails;