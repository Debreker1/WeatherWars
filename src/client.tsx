import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/home/Home';
import AddBet from './pages/bet/AddBet';
import { Provider } from 'react-redux'
import store from './_store/store';


class Client extends React.Component
{
    public render()
    {
        return(
            <Provider store= {store}>
                <BrowserRouter>
                    <Switch>
                        <Route exact={true} path="/" component={Home} />
                        <Route exact={true} path="/bets/add" component={AddBet}/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        )
    }
}

export default Client