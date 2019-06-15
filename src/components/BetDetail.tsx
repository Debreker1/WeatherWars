import * as React from 'react';
import weatherBet from '../contracts/BettingContract.json';
import { Card, CardContent, Typography, CardActions, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import getWeb3 from '../web3/getWeb3';
import { fromUnixTime, format } from 'date-fns';

type Props = {
    address: string
};
type State = {
    date: string,
    location: string,
    ownerBet: number,
    totalBetAmount: number
};

class BetDetail extends React.PureComponent<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            date: '',
            location: '',
            ownerBet: 0,
            totalBetAmount: 0
        }
    }

    async componentWillMount() {
        const web3 = await getWeb3();
        const weatherContract = await web3.eth.Contract(weatherBet.abi, this.props.address);
        const playerAmountRaw = await weatherContract.methods.playerCount().call();
  
        const players: number = await playerAmountRaw.toNumber();
        const location = await weatherContract.methods.location().call();
        const timestamRaw = await weatherContract.methods.timestamp().call();
        const date = await format(fromUnixTime(timestamRaw.toNumber()), 'dd-MM-yyyy HH:mm');
        const ownerBetRaw = await weatherContract.methods.initialBet().call();
        const ownerBet: number = ownerBetRaw.toNumber();
        const betAmountRaw = await weatherContract.methods.betAmount().call();
        const betAmount: number = await parseInt(web3.utils.fromWei(betAmountRaw.toString()));
        const totalBetAmount: number = await (betAmount * players);
        this.setState({date, location, ownerBet, totalBetAmount});
    };

    public render() {
        return (
            <Card key={this.props.address} style={{ maxWidth: 340, minWidth: 390, float: "left", margin: 8 }}>
            <CardContent style={{ backgroundColor: "#ff6600", maxHeight: 60 }}>
              <Typography gutterBottom variant="h5" component="h2" style={{ fontWeight: 500, color: "white" }}>
                {this.state.location}
          </Typography>
            </CardContent>
            <CardContent>
              <Typography variant="body2" component="p" style={{ fontSize: 16 }}>
                Date: {this.state.date}<br />
                Guessed: {this.state.ownerBet} Degrees<br />
                Stake: {this.state.totalBetAmount} ETH
          </Typography>
            </CardContent>
          <CardActions>
            <Link to={`/bets/${this.props.address}`}>
              <Button size="small" color="primary">
                    Join this bet
              </Button>
            </Link>
          </CardActions>
        </Card>
        );
    }
}

export default BetDetail;