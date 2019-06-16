import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import web3Handler from '../../classes/web3Handler';
import { IContract } from '../../model.js';


enum status {
  view,
  sending,
  sent,
  error
}

type Props = RouteComponentProps<{ slug: string }>;
type State = {
  contract: IContract | null,
  fieldsDisabled: boolean,
  playerBet: boolean,
  status: status,
  handler: web3Handler,
  interval: any
};
let interval;
class BetDetails extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      contract: null,
      fieldsDisabled: false,
      playerBet: true,
      status: status.view,
      handler: new web3Handler(),
      interval: null
    }
  }

  componentDidMount() {
    this.fetchContractInfo();
    interval = setInterval(() => { this.fetchContractInfo() }, 5000);
  };

  componentWillUnmount() {
    clearInterval(interval);
  }

  fetchContractInfo = async () => {
    this.setState({ contract: await this.state.handler.getBetDetails(this.props.match.params.slug) });
  };

  handleChange = (event: React.ChangeEvent<unknown>) => {
    const select: string = (event.target as HTMLInputElement).value;
    if (select === "true") {
      this.setState({
        playerBet: true
      });
    } else {
      this.setState({
        playerBet: false
      });
    }
  }

  joinGame = async (e) => {
    e.preventDefault();
    try {
      this.setState({ fieldsDisabled: true, status: status.sending });
      await this.state.handler.playerJoin(this.state.contract!.address, this.state.playerBet);
      this.setState({ fieldsDisabled: false, status: status.sent });
    } catch (error) {
      console.error(error);
      this.setState({ fieldsDisabled: false, status: status.error });
    }
  }

  public render() {
    return (
      <div style={{ marginTop: 50 }}>
        {this.state.contract! && (
          <>
            <p>Contract address: {this.props.match.params.slug}</p>
            <p>Totaal in de pot: {this.state.contract!.totalBetAmount}</p>
            <p>Totaal aantal spelers: {this.state.contract!.players}</p>
            <p>Inleg om te mogen meespelen: {this.state.contract!.betAmount}</p>
            <p>Locatie: {this.state.contract!.location}</p>
            <p>Eigenaar gokt op temperatuur: {this.state.contract!.ownerBet}</p>
            <p>Weddenschap wordt gespeeld op: {this.state.contract!.date}</p>
            <br />

            Deel met vrienden:<br />
            <input type="text" readOnly={true} value={window.location.href} style={{ borderRadius: 4, border: "3px #3F51B5 solid", width: 500, height: 40, paddingLeft: 5 }} />
            <br /><br />

            <form onSubmit={this.joinGame}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Wordt de temperatuur hoger of lager?</FormLabel>
                <RadioGroup
                  aria-label="guess"
                  name="guess"
                  value={this.state.playerBet.toString()}
                  onChange={this.handleChange}
                >
                  <FormControlLabel disabled={this.state.fieldsDisabled} value="true" control={<Radio />} label="Hoger" />
                  <FormControlLabel disabled={this.state.fieldsDisabled} value="false" control={<Radio />} label="Lager" />
                </RadioGroup>
              </FormControl><br />
              <input type="submit" style={{ border: "none", backgroundColor: "#3F51B5", color: "white", borderRadius: 5, padding: 7, marginTop: 15, fontSize: 15 }} value="Meespelen" />
            </form>
          </>
        )}
      </div>
    );
  }
}

export default BetDetails;