import * as React from 'react';
import {Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type Props = {};
type State = {};


class BetsOverview extends React.Component<Props, State> {

  public render() {
    return (
      <div style={{marginTop: 50}}>
      <Card style={{maxWidth: 340}}>
      <CardActionArea>
        <CardContent style= {{backgroundColor: "#ff6600", maxHeight: 60}}>
          <Typography gutterBottom variant="h5" component="h2" style={{fontWeight: 500, color: "white"}}>
            Rotterdam
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" component="p" style={{fontSize: 16}}>
            Date: 20 September 19:15<br/>
            Guessed: 20 Degrees<br/>
            Stake: 10 ETH
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Join this bet
        </Button>
      </CardActions>
    </Card>
    </div>
    )
  }
}

export default BetsOverview;