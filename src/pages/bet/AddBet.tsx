import * as React from 'react';
import { connect } from 'react-redux'
import WeatherBet from '../../contracts/BettingContract.json';

enum status {
  Add,
  Deploying,
  Done,
  Error
}

type Props = stateProps;
type State = {
  betAmount: number,
  accounts: string[],
  status: status
};

class AddBet extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      betAmount: 1,
      accounts: [],
      status: status.Add
    }
  }

  async componentDidMount() {
    const accounts : string[] = await this.props.web3.eth.getAccounts();
    this.setState({
      ...this.state,
      accounts: accounts
    });
  }

  handleChange = (event) => {
    const name : string = event.target.name;
    const value : any = event.target.value;
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  deployContract = async (e) => {
    e.preventDefault();
    try {
      this.setState({status: status.Deploying});
      const valueAmount = await this.props.web3.utils.toWei(this.state.betAmount, "ether")
      const weatherContract = await new this.props.web3.eth.Contract(WeatherBet.abi);
      const betDeploy = await weatherContract.deploy({
        data: WeatherBet.bytecode,
        arguments: [5, valueAmount]
      });
      // const gasAmount = await betDeploy.estimateGas({from: this.state.accounts[0], value: valueAmount});
      betDeploy.send({
        from: this.state.accounts[0],
        value: valueAmount,
        gas: 3000000
      });
      this.setState({status: status.Done});
    } catch(err) {
      this.setState({status: status.Error});
      console.error(err);
    }
  };

  public render() {
    return (
      <div>
        <p>Current status: {this.state.status}</p>
        <h1>Add bet</h1>
        <form className="createBet-login" onSubmit={this.deployContract}>
          <div>
            <label htmlFor="betAmount">Ethereum:</label>
            <input name="betAmount" type="number" min="1" step="any" value={this.state.betAmount} onChange={this.handleChange}/>
          </div>
          <div>
            <input type="submit" value="Aanmaken"/>
          </div>
        </form>
      </div>
    )
  }
}

interface stateProps {
  web3: any
  // accounts: string[]
};

const mapStateToProps = (state: any) => ({
  web3: state.Web3
});

export default connect(mapStateToProps)(AddBet);