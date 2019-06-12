import * as React from 'react';

type Props = {};
type State = {};

class BetsOverview extends React.Component<Props, State> {

  public render() {
    return (
      <div>
        <h2>Bekijk hier alle actieve bets</h2>
        <dl>
          <dt>Amsterdam-Zuid</dt>
          <dd>3-6-2019: 21 graden celsius</dd>
          <dt>Den Haag</dt>
          <dd>5-6-2019: 17 graden celsius</dd>
          <dt>Rotterdam</dt>
          <dd>5-6-2019: 18 graden celsius</dd>
          <dt>Rotterdam</dt>
          <dd>4-6-2019: 22 graden celsius</dd>
          <dt>Breda</dt>
          <dd>7-6-2019: 19 graden celsius</dd>
        </dl>
      </div>
    )
  }
}

export default BetsOverview;