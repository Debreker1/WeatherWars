import * as React from 'react';
import getWeb3 from '../../web3/getWeb3';
import Betlist from '../../contracts/Betlist.json';
import BetDetail from '../../components/BetDetail';

type Props = {};
type State = {
  contractsAddresses: string[]
};


class BetsOverview extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      contractsAddresses: []   
    }
  }

  async componentDidMount() {
    const web3 = await getWeb3();
    web3.eth.transactionConfirmationBlocks = 1;
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Betlist.networks[networkId];
    const betList = await new web3.eth.Contract(
      Betlist.abi,
      deployedNetwork && deployedNetwork.address,
    );
    this.setState({contractsAddresses: await betList.methods.GetContracts().call()})
  };

  mapContracts = () : any => {
    const mapping = this.state.contractsAddresses.map((address: string) => {
      return(<BetDetail address={address}/>);
    });
    return mapping;
  }

  public render() {
    return (
      <div style={{ marginTop: 50 }}>
        {this.mapContracts()}
      </div>
    )
  }
}

export default BetsOverview;