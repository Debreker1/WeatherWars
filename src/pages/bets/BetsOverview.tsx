import * as React from 'react';
import BetDetail from '../../components/BetDetail';
import web3Handler from '../../classes/web3Handler';

type Props = {};
type State = {
  contractsAddresses: string[],
  handler: web3Handler
};


class BetsOverview extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      contractsAddresses: [],
      handler: new web3Handler()
    }
  }

  async componentWillMount() {
    const result: string[] = await this.state.handler.getAllBets();
    this.setState({contractsAddresses: result})
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