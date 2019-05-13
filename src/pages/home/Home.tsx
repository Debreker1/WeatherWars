import * as React from 'react';
import { Button } from '@material-ui/core/';
import ResponsiveDrawer from '../../components/Header'
import getWeb3 from '../../web3/getWeb3';

const contract = require("truffle-contract");
const weatherContract = require("../../contracts/WeatherContract.json"); 

type Props = {};
type State = {
    web3: any,
    accounts: any
};

class Home extends React.Component<Props, State>
{

    public async componentDidMount()
    {
        console.log("mounted");
        this.state = {
            web3: await getWeb3(),
            accounts: []
        }
    }
    
    deployContract = async () => {
        console.log("knop2");
        const account = await this.state.web3.eth.getAccounts();
        console.log(account);
        this.setState({
            ...this.state,
            accounts: account
        })
        this.artifactsToContract(weatherContract)
        .then((WeatherContractAbstraction) => {
            WeatherContractAbstraction.deployed().then((deployed : any) => {
                console.log(deployed);
            })
        })
    }

    artifactsToContract = async (artifacts : any) => {
        const contractAbstraction = contract(artifacts);
        contractAbstraction.setProvider(this.state.web3.currentProvider);
        return contractAbstraction
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