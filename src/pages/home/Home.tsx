import * as React from 'react';
import ResponsiveDrawer from '../../components/Header';

type Props = {};
type State = {};

class Home extends React.Component<Props, State>
{

    public render()
    {
        return(
            <div>
                <ResponsiveDrawer />
                <p>Dit is de homepage</p>
            </div>
        )
    }
}
  
  export default Home;