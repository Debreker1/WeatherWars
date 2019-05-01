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
                <p>Dit is de homepage</p>
                <Button variant="contained" color="primary">Hello world</Button>
            </div>
        )
    }
}

export default Home