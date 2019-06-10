import * as React from 'react';
import { Button } from '@material-ui/core/';
import ResponsiveDrawer from '../../components/Header'


class Home extends React.Component
{
    public render()
    {
        return(
            <div>
                <ResponsiveDrawer />
                <div>
                    <p1>Home</p1>
                </div>
            </div>
        )
    }
}

export default Home