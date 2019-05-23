import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/home/Home';
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
                    </Switch>
                </BrowserRouter>
            </Provider>
        )
    }
}

export default Client