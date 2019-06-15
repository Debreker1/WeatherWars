import * as React from 'react';
import {Link} from "react-router-dom";
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { IContract } from '../../model';
import getWeb3 from '../../web3/getWeb3';
import Betlist from '../../contracts/Betlist.json';
import weatherBet from '../../contracts/BettingContract.json';
import { fromUnixTime, format } from 'date-fns';

type Props = {};
type State = {
  contracts: IContract[]
};


class BetsOverview extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      contracts: []
    }
  }

  async componentDidMount() {
    const web3 = await getWeb3();
    web3.eth.transactionConfirmationBlocks = 1;
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Betlist.networks[networkId];
    const betList = await new web3.eth.Contract(
      Betlist.abi,
      deployedNetwork && deployedNetwork.address,
    );

    const contractsAddresses: (string)[] = await betList.methods.GetContracts().call();
    const allBets: IContract[] = [];
    contractsAddresses.map(async (address: string) => {
      const weatherContract = await web3.eth.Contract(weatherBet.abi, address);
      const playerAmountRaw = await weatherContract.methods.playerCount().call();

      const players: number = playerAmountRaw.toNumber();
      const location = await weatherContract.methods.location().call();
      const timestamRaw = await weatherContract.methods.timestamp().call();
      const date = format(fromUnixTime(timestamRaw.toNumber()), 'dd-MM-yyyy HH:mm');
      const ownerBetRaw = await weatherContract.methods.initialBet().call();
      const ownerBet: number = ownerBetRaw.toNumber();
      const betAmountRaw = await weatherContract.methods.betAmount().call();
      const betAmount: number = parseInt(web3.utils.fromWei(betAmountRaw.toString()));
      const totalBetAmount: number = (betAmount * players);
      const betInfo: IContract = {
        address: address,
        location: location,
        date: date,
        ownerBet: ownerBet,
        totalBetAmount: totalBetAmount
      };
      allBets.push(betInfo);
    });
     await this.setState({ contracts: allBets });
  }


  public render() {
    return (
      <div style={{ marginTop: 50 }}>
        {this.state.contracts.map((contract) => { return(
          <Card key={contract.address} style={{ maxWidth: 340, minWidth: 390, float: "left", margin: 8 }}>
            <CardContent style={{ backgroundColor: "#ff6600", maxHeight: 60 }}>
              <Typography gutterBottom variant="h5" component="h2" style={{ fontWeight: 500, color: "white" }}>
                {contract.location}
          </Typography>
            </CardContent>
            <CardContent>
              <Typography variant="body2" component="p" style={{ fontSize: 16 }}>
                Date: {contract.date}<br />
                Guessed: {contract.ownerBet} Degrees<br />
                Stake: {contract.totalBetAmount} ETH
          </Typography>
            </CardContent>
          <CardActions>
            <Link to={`/bets/${contract.address}`}>
              <Button size="small" color="primary">
                    Join this bet
              </Button>
            </Link>
          </CardActions>
        </Card>
        )})}
      </div>
    )
  }
}

export default BetsOverview;