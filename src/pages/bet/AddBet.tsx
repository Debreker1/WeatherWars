import * as React from 'react';
import getWeb3 from '../../web3/getWeb3';
import WeatherBet from '../../contracts/WeatherBet.json';

type Props = {};
type State = {
  betAmount: number,
  web3: any,
  account: string
};

class AddBet extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      betAmount: 1,
      web3: null,
      account: ''
    }
  }

  async componentDidMount() {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    this.setState({
      ...this.state,
      web3: web3,
      account: accounts[0]
    });
    this.state.web3.eth.transactionConfirmationBlocks = 1;
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
    const valueAmount = await this.state.web3.utils.toWei(this.state.betAmount, "ether")
    const weatherContract = await new this.state.web3.eth.Contract(WeatherBet.abi);
    const betDeploy = await weatherContract.deploy({
      data: WeatherBet.bytecode,
      arguments: [5]
    });
    const gasAmount = await betDeploy.estimateGas({from: this.state.account, value: valueAmount});
    console.log(gasAmount);
    betDeploy.send({
      from: this.state.account,
      value: valueAmount,
      gas: 3000000
    });
  };

  public render() {
    return (
      <div>
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

export default AddBet;