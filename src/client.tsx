import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/home/Home';
import ResponsiveDrawer from './components/Header';


class Client extends React.Component
{
    public render()
    {
        return(
            <BrowserRouter>
                <ResponsiveDrawer />
                <Switch>
                    <Route exact={true} path="/" component={Home} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Client