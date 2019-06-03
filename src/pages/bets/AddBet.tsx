import * as React from 'react';
import { connect } from 'react-redux'
import WeatherBet from '../../contracts/BettingContract.json';
import { Button, Icon } from '@material-ui/core';
import Loadbutton from '../../components/LoadButton'

enum status {
  Add = "Add",
  Deploying = "Deploying",
  Done = "Done",
  Error = "Error"
}

type Props = stateProps;
type State = {
  betAmount: string,
  status: status
};

class AddBet extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      betAmount: "1",
      status: status.Add
    }
  }

  handleChange = (event) => {
    const name: string = event.target.name;
    const value: any = event.target.value;
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  deployContract = async () => {
    // e.preventDefault();
    try {
      this.setState({ status: status.Deploying });
      const account = this.props.accounts[0];
      const valueAmount = await this.props.web3.utils.toWei(this.state.betAmount, "ether")
      const weatherContract = await new this.props.web3.eth.Contract(WeatherBet.abi);
      const betDeploy = await weatherContract.deploy({
        data: WeatherBet.bytecode,
        arguments: [5, valueAmount]
      });
      // const gasAmount = await betDeploy.estimateGas({from: this.state.accounts[0], value: valueAmount});
      const deployed = await betDeploy.send({
        from: account,
        value: valueAmount,
        gas: 3000000
      });
      this.setState({ status: status.Done });
    } catch (err) {
      this.setState({ status: status.Error });
      throw err;
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
            <input name="betAmount" type="number" min="1" step="any" value={this.state.betAmount} onChange={this.handleChange} />
          </div>
          <div>
            <Loadbutton onClick={this.deployContract}>Contract Aanmaken</Loadbutton>
          </div>
        </form>
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