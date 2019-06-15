import * as React from 'react';
import { Button } from '@material-ui/core/';
import {Link} from 'react-router-dom';


type Props = {};
type State = {};

class Home extends React.Component<Props, State>
{

    public render()
    {
        return(
            <div id="home" style={{marginTop: "100px"}}>
                <div id="header" className="container-fluid text-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1 style={{margin: "40px 0", fontWeight: "lighter",color: "rgba(71, 73, 88, 0.93)", textAlign: "center"}}>Home</h1>
                            <hr style={{border: "0px",
                                height: "1px",
                                width: "300px",
                                backgroundColor: "rgba(71, 73, 88, 0.93)"}} />
                        </div>
                    </div>
                </div>
                <div id="info" className="container-fluid text-center">
                    <div className="row">
                        <div className="col-md-12">
                            <h3 style={{textAlign: "center", margin: "40px"}}>What is Weather Wars?</h3>
                            {/* TODO: align image to center */}
                            <img src="https://i1.wp.com/metro.co.uk/wp-content/uploads/2018/02/ios_weather_icons-e1519660727179.png?quality=90&strip=all&zoom=1&resize=644%2C483&ssl=1" style={{height: 322, width: 421, display: "block", marginRight: "auto", marginLeft: "auto"}}></img>
                            <p style={{textAlign: "center", marginLeft: "400px", marginRight: "400px", marginBottom: "40px"}}>Weather Wars is a web-application which allows users to bet on the weather. Users bet Ether and try to predict the weather in a certain place, at a certain time. Players are able to create and join both private and public bets. Furthermore, Weather Wars has functionality for group bets.</p>
                            <p style={{textAlign: "center", marginLeft: "400px", marginRight: "400px", marginBottom: "40px"}}>Because Weather Wars is on a blockchain, any Ethereum transactions will be transferred safely and nearly instantaneously.</p>
                            
                            <hr style={{border: "0px",
                                height: "1px",
                                width: "300px",
                                backgroundColor: "rgba(71, 73, 88, 0.93)"}} />
                        </div>
                    </div>
                </div>
                {/* TODO: align buttons to center */}
                <div id="navbuttons" className="container-fluid text-center">
                    <div className="col-md-12" style={{alignItems: "center"}}>
                        <Link to="/bets/add"><Button style={{backgroundColor: "#3f51b5", color: "white", marginTop: "40px", marginBottom: "40px", marginRight: "20px"}}>Create New Bet</Button></Link>
                        <Link to="/bets"><Button style={{backgroundColor: "#3f51b5", color: "white", marginTop: "40px", marginBottom: "40px", marginLeft: "20px"}}>View Active Bets</Button></Link>
                    </div>
                </div>
            </div>
        )
    }
}

 export default Home;