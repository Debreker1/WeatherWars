import * as React from 'react';
import { Button } from '@material-ui/core/';
import ResponsiveDrawer from '../../components/Header'
import getWeb3 from '../../web3/getWeb3';
import WeatherContract from "../../contracts/WeatherContract.json";

import { connect } from 'react-redux'

import {setBet} from '../../_actions/bet.actions';
import {setWeb3} from '../../_actions/web3.actions';

type Props = DispatchProps
type State = {
    web3: any,
    accounts: any,
    networkId: number
};

class Home extends React.Component<Props, State>
{

    public async componentDidMount()
    {
        console.log("I'm fired");
        
        try
        {
            console.log("try start");
           const web3 = await getWeb3();
           console.log("Got web3");
           web3.eth.transactionConfirmationBlocks = 1;
           console.log("setbet");
           this.props.setBet("bet");
           const accounts = await web3.eth.getAccounts();
           const networkId = await web3.eth.net.getId();
           this.state = {
            web3: web3,
            accounts: accounts,
            networkId: networkId
            } 
        }
        catch(error)
        {
            console.error(error);
        }
    }
    
    deployContract = async () => {
        const account = this.state.accounts[0]
        const nonce = await this.state.web3.eth.getTransactionCount(account);
        const weathercontract = await new this.state.web3.eth.Contract(WeatherContract.abi);
        const createdContract = weathercontract.deploy({
            data: WeatherContract.bytecode
        }).send({from: account})
        .then((contract) => {
            console.log("pay up!");
            contract.methods.update().send({from: account})
        });
        
        // createdContract.methods.update().call();
    }

    public render()
    {
        return(
            <div>
                <ResponsiveDrawer />
                <p>Dit is de homepage</p>
                <Button onClick={this.deployContract} variant="contained" color="primary">Hello world</Button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {} = state;
    return {
    };
}
  
interface DispatchProps {
    setBet: typeof setBet;
    setWeb3: typeof setWeb3;
}
  
  export default connect(mapStateToProps, { setBet, setWeb3 } )(Home);