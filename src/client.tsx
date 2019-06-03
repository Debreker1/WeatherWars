import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/home/Home';
import AddBet from './pages/bets/AddBet'

import {setWeb3} from './_actions/web3.actions';
import { connect } from 'react-redux';
import getWeb3 from './web3/getWeb3';

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
           console.log("Got web3");
           web3.eth.transactionConfirmationBlocks = 1;
           this.props.setWeb3(web3);
        } catch(e){
            console.log(e);
        }
    }

    public render()
    {
        return(
                <BrowserRouter>
                    <Switch>
                        <Route exact={true} path="/" component={Home} />
                        <Route exact={true} path="/bets/add" component={AddBet}/>
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
    setWeb3: typeof setWeb3;
}
  
  export default connect(mapStateToProps, { setWeb3 } )(Client);