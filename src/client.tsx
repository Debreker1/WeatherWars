import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/home/Home';
import AddBet from './pages/bets/AddBet'
import BaseComponent from './components/BaseComponent';
import BetDetails from './pages/bets/BetDetails';
import BetsOverview from './pages/bets/BetsOverview';

type Props = {}
type State = {};

class Client extends React.Component<Props, State>
{

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
                                    <BetDetails {...props}/>
                                </BaseComponent>
                            )
                        }}/>
                    </Switch>
                </BrowserRouter>
        )
    }
}

export default Client;