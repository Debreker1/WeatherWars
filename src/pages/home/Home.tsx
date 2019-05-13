import * as React from 'react';
import { Button } from '@material-ui/core/';
import ResponsiveDrawer from '../../components/Header'
import getWeb3 from '../../web3/getWeb3';
import WeatherContract from "../../contracts/WeatherContract.json";

type Props = {};
type State = {
    web3: any,
    accounts: any,
    networkId: number
};

class Home extends React.Component<Props, State>
{

    public async componentDidMount()
    {
        try
        {
           const web3 = await getWeb3();
           web3.eth.transactionConfirmationBlocks = 1;
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

export default Home