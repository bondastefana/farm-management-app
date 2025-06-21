import * as React from 'react';
import { t } from 'i18next';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';

import { generateRows, getComparator, headCells } from '../services/utils';
import DeleteAnimalModal from './DeleteAnimalModal';
import ShowAnimalModal from './ShowAnimalModal';
import EditAnimalModal from './EditAnimalModal';

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={idx === 0 ? { fontWeight: 'bold' } : {}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Stergere</TableCell>
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const { type } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {type}
      </Typography>
    </Toolbar>
  );
}

const AnimalsTable = ({ animals, type, id }) => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState(null);
  const [showModalOpen, setShowModalOpen] = React.useState(false);
  const [rowToShow, setRowToShow] = React.useState(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [rowToEdit, setRowToEdit] = React.useState(null);
  const formattedAnimalsRows = generateRows(animals);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleOpenDeleteModal = (row) => {
    setRowToDelete(row);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  const handleConfirmDelete = (id) => {
    // Empty function for now
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  const handleOpenShowModal = (row) => {
    setRowToShow(row);
    setShowModalOpen(true);
  };

  const handleCloseShowModal = () => {
    setShowModalOpen(false);
    setRowToShow(null);
  };

  const handleOpenEditModal = (row) => {
    setRowToEdit(row);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setRowToEdit(null);
  };

  const handleSaveEdit = (editedRow) => {
    // Add your save logic here (e.g., update state or call API)
    setEditModalOpen(false);
    setRowToEdit(null);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - formattedAnimalsRows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...formattedAnimalsRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [formattedAnimalsRows, order, orderBy, page, rowsPerPage],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', mb: 2 }} id={id}>
        <Paper sx={{ width: '100%', mb: 2, pr: 2, pl: 2 }}>
          <EnhancedTableToolbar type={type} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-row-${index}`;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleOpenShowModal(row)}
                    >
                      {/* Render animal data cells */}
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.animalId}
                      </TableCell>
                      <TableCell >{row.birthDate}</TableCell>
                      <TableCell >{row.age}</TableCell>
                      <TableCell >{row.gender}</TableCell>
                      <TableCell >{row.treatment}</TableCell>
                      <TableCell >{row.observation}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenEditModal(row);
                            }}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenDeleteModal(row);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={formattedAnimalsRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={t('rows_per_page')}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label={t('dense_padding')}
        />
        <DeleteAnimalModal
          open={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          row={rowToDelete}
        />
        <ShowAnimalModal
          open={showModalOpen}
          onClose={handleCloseShowModal}
          row={rowToShow}
        />
        <EditAnimalModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          row={rowToEdit}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default AnimalsTable;