import React, { useContext } from 'react';

import { DiveContext } from '../../shared/context/dive-context';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import DiveTableActions from '../components/DiveTableActions';

const columns = [
  { id: 'diveNumber', label: 'Dive#' },
  { id: 'date', label: 'Date', minWidth: 20 },
  {
    id: 'diveSite',
    label: 'Divesite',
    minWidth: 170,
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'timeIn',
    label: 'Time In',
    width: 25,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'duration',
    label: 'Duration',
    minWidth: 25,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'maxDepth',
    label: 'Max Depth',
    minWidth: 25,
    align: 'center',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'center',
  },
];

function createData(
  diveNumber,
  date,
  diveSite,
  timeIn,
  duration,
  maxDepth,
  actions,
  id
) {
  return {
    diveNumber,
    date,
    diveSite,
    timeIn,
    duration,
    maxDepth,
    actions,
    id,
  };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

const DiveTable = (props) => {
  const dContext = useContext(DiveContext);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const rows = dContext.dives.map((d) =>
    createData(
      d.diveNumber,
      d.date,
      d.diveSite,
      d.timeIn.toString(),
      d.diveDuration,
      d.maxDepth.toString(),
      (() => <DiveTableActions dataid={d._id} />)(),
      d._id
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DiveTable;
