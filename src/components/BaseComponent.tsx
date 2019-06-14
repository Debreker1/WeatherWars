import * as React from 'react';
import Header from './Header';

type Props = {}
type State = {}

class BaseComponent extends React.Component<Props, State>{
    render(){
        return(
            <Header>
                <main className="content max-width">
                    {this.props.children}
                </main>
            </Header>
        )
    }
}

export default BaseComponent;