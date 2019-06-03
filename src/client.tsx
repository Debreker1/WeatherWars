import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/home/Home';
import AddBet from './pages/bets/AddBet'
import BaseComponent from './components/BaseComponent';
import {setWeb3, setAccounts} from './_actions/web3.actions';
import { connect } from 'react-redux';
import getWeb3 from './web3/getWeb3';
import BetDetails from './pages/bets/BetDetails';
import BetsOverview from './pages/bets/BetsOverview';

type Props = DispatchProps
type State = {
    web3: any,
    accounts: any,
    networkId: number
};

class Client extends React.Component<Props, State>
{

    constructor(props) {
        super(props);
    }

    public async componentWillMount(){
        try {
           const web3 = await getWeb3();
           const accounts = await web3.eth.getAccounts();
           web3.eth.transactionConfirmationBlocks = 1;
           this.props.setWeb3(web3);
           this.props.setAccounts(accounts);
        } catch(e){
            console.log(e);
        }
    }

    public render()
    {
        return(
                <BrowserRouter>
                    <Switch>
                        <Route exact={true} path="/" render={props => {
                            return(
                                <BaseComponent>
                                    <Home />
                                </BaseComponent>
                        )}} />
                        <Route exact={true} path="/bets/add" render={props => {
                            return(
                                <BaseComponent>
                                    <AddBet/>
                                </BaseComponent>
                            )
                        }}/>
                        <Route exact={true} path="/bets" render={props => {
                            return(
                                <BaseComponent>
                                    <BetsOverview/>
                                </BaseComponent>
                            )
                        }}/>
                        <Route exact={true} path="/bets/:slug" render={props =>{
                            return(
                                <BaseComponent>
                                    <BetDetails/>
                                </BaseComponent>
                            )
                        }}/>
                    </Switch>
                </BrowserRouter>
        )
    }
}

function mapStateToProps(state) {
    const {} = state;
    return {
    };
}
  
interface DispatchProps {
    setWeb3: typeof setWeb3,
    setAccounts: typeof setAccounts
}
  
  export default connect(mapStateToProps, { setWeb3, setAccounts } )(Client);