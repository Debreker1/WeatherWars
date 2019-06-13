import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

function createData(Plaatsnaam, Datum, Temperatuur, Status) {
  return { Plaatsnaam, Datum, Temperatuur, Status };
}

const rows = [
  createData('Rotterdam', '12-6-2019', 18, 'Beschikbaar'),
  createData('Den Haag', '12-6-2019', 13, 'Beschikbaar'),
  createData('Groningen', '13-6-2019', 16, 'Beschikbaar'),
  createData('Amsterdam', '15-6-2019', 20, 'Beschikbaar'),
  createData('Breda', '26-6-2019', 21, 'Beschikbaar'),
];

export default function SimpleTable() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell><b>Plaatsnaam</b></TableCell>
            <TableCell align="right"><b>Datum</b></TableCell>
            <TableCell align="right"><b>Temperatuur</b></TableCell>
            <TableCell align="right"><b>Status</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.Plaatsnaam}>
              <TableCell component="th" scope="row">
                {row.Plaatsnaam}
              </TableCell>
              <TableCell align="right">{row.Datum}</TableCell>
              <TableCell align="right">{row.Temperatuur}</TableCell>
              <TableCell align="right">{row.Status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
