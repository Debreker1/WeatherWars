import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    wrapper: {
      // margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
    fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1,
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

function CircularIntegration() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<number>();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  function handleButtonClick() {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          className={buttonClassname}
          disabled={loading}
          onClick={handleButtonClick}
        >
          Accept terms
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
}

// export default CircularIntegration;

enum Status {
  Default,
  Loading,
  Done,
  Error
}

type Props = {
  onClick: any
};
type State = {
  status: Status
};

class LoadButton extends React.Component<Props, State> {

  constructor(props : Props) {
    super(props);
    this.state = {
      status: Status.Default
    }
  }

  DoClick = async () => {
    try {
      this.setState({status: Status.Loading});
      await this.props.onClick();
      this.setState({status: Status.Done});
    } catch (error) {
      this.setState({status: Status.Error});
    }
  }

  public render() {
    return (
      <div>
        <Button
        variant="contained"
        color="primary"
        onClick={this.DoClick}
        disabled={this.state.status == Status.Loading}
        >
        {this.props.children}
        </Button>
        {this.state.status == Status.Loading && <CircularProgress size={24} />}
      </div>
    );
  };

}
export default LoadButton;