import * as React from 'react';
import { useCallback } from 'react';
import { t } from 'i18next';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';

import { generateRows, getComparator, headCells } from '../services/utils';
import DeleteAnimalModal from './DeleteAnimalModal';
import ShowAnimalModal from './ShowAnimalModal';
import EditAnimalModal from './EditAnimalModal';
import { useIsAdmin } from '../contexts/IsAdminContext';
import useAlert from '../hooks/useAlert';
import { updateAnimal, deleteAnimal } from '../services/farmService';

const emojiMap = {
  'Cai': '🐎',
  'Vaci': '🐄',
  'Horses': '🐎',
  'Cows': '🐄',
  'cal': '🐎',
  'vaca': '🐄',
  'cow': '🐄',
  'horse': '🐎',
};

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, isAdmin } = props;
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
        {isAdmin && (
          <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('actions')}</TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const { type, emoji } = props;
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
        {type} {emoji && <span style={{ marginLeft: 8, fontSize: 28 }}>{emoji}</span>}
      </Typography>
    </Toolbar>
  );
}

const AnimalsTable = ({ animals, type, id, refetchAllAnimals }) => {
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

  const isAdmin = useIsAdmin();
  const { showAlert, AlertComponent } = useAlert();

  const handleRequestSort = useCallback((event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleChangeDense = useCallback((event) => {
    setDense(event.target.checked);
  }, []);

  const handleOpenDeleteModal = useCallback((row) => {
    setRowToDelete(row);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setRowToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async (rowId) => {
    if (!rowToDelete) return;
    const species = rowToDelete.species;
    const animalId = rowToDelete.animalId;
    if (!species) {
      console.error('Unknown species for deleteAnimal:', species, rowToDelete);
      showAlert(t('delete_animal_error_species_missing'), 'error');
      setDeleteModalOpen(false);
      setRowToDelete(null);
      return;
    }
    const result = await deleteAnimal(species, animalId);
    setDeleteModalOpen(false);
    setRowToDelete(null);
    if (result && typeof refetchAllAnimals === 'function') {
      await refetchAllAnimals();
      showAlert(t('delete_animal_success'), 'success');
    }
  }, [rowToDelete, refetchAllAnimals, showAlert]);

  const handleOpenShowModal = useCallback((row) => {
    setRowToShow(row);
    setShowModalOpen(true);
  }, []);

  const handleCloseShowModal = useCallback(() => {
    setShowModalOpen(false);
    setRowToShow(null);
  }, []);

  const handleOpenEditModal = useCallback((row) => {
    setRowToEdit(row);
    setEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setRowToEdit(null);
  }, []);

  const handleSaveEdit = useCallback(async (editedRow) => {
    if (!editedRow) return;
    const species = editedRow.species;
    const animalId = editedRow.animalId;
    const result = await updateAnimal(species, animalId, editedRow);
    setEditModalOpen(false);
    setRowToEdit(null);
    if (result && typeof refetchAllAnimals === 'function') {
      await refetchAllAnimals();
      showAlert(t('edit_animal_success'), 'success');
    }
  }, [refetchAllAnimals, showAlert]);

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
          <EnhancedTableToolbar type={type} emoji={emojiMap[type] || ''} />
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
                isAdmin={isAdmin}
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
                        {isAdmin && (
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
                        )}
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
      {AlertComponent}
    </LocalizationProvider>
  );
}

export default AnimalsTable;