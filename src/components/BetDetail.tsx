import * as React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import web3Handler from '../classes/web3Handler';
import { IContract } from '../model.js';

type Props = {
  address: string
};
type State = {
  contract: IContract | null;
  handler: web3Handler;
};

class BetDetail extends React.PureComponent<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      contract: null,
      handler: new web3Handler()
    }
  }

  async componentWillMount() {
    this.setState({
      contract: await this.state.handler.getBetDetails(this.props.address)
    })
  };

  public render() {
    return (
      <div>
        {this.state.contract! && (
          <Card key={this.props.address} style={{ maxWidth: 340, minWidth: 390, float: "left", margin: 8 }}>
          <CardContent style={{ backgroundColor: "#ff6600", maxHeight: 60 }}>
            <Typography gutterBottom variant="h5" component="h2" style={{ fontWeight: 500, color: "white" }}>
              {this.state.contract!.location}
        </Typography>
          </CardContent>
          <CardContent>
            <Typography variant="body2" component="p" style={{ fontSize: 16 }}>
              Datum: {this.state.contract!.date}<br />
              De Owner gokt: {this.state.contract!.ownerBet} Degrees<br />
              Inzet: {this.state.contract!.totalBetAmount} ETH
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
        )}
      </div>
    );
  }
}

export default BetDetail;