import React, { useState, useMemo } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, TablePagination, TableSortLabel, IconButton } from "@mui/material";
import { visuallyHidden } from '@mui/utils';
import { updateFoodStock } from '../services/farmService';
import EditFoodStockModal from './EditFoodStockModal';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';

export function useFoodTypes() {
  const { t } = useTranslation();
  return [
    { id: 'concentrates', label: t('foodStock.concentrates'), emoji: '🌾' },
    { id: 'fiber', label: t('foodStock.fiber'), emoji: '🌱' },
    { id: 'greenFodder', label: t('foodStock.greenFodder'), emoji: '🥬' },
    { id: 'succulents', label: t('foodStock.succulents'), emoji: '🥕' },
  ];
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (orderBy === 'lastModifiedDate') {
    const aDate = a[orderBy]?.seconds ? new Date(a[orderBy].seconds * 1000) : new Date(a[orderBy]);
    const bDate = b[orderBy]?.seconds ? new Date(b[orderBy].seconds * 1000) : new Date(b[orderBy]);
    if (bDate < aDate) return -1;
    if (bDate > aDate) return 1;
    return 0;
  }
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function FoodStockTable({ items, title, emoji, onEdit }) {
  const { t } = useTranslation();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  function formatDate(dateValue) {
    if (!dateValue) return '-';
    let dateObj;
    if (typeof dateValue === 'object' && dateValue.seconds) {
      dateObj = new Date(dateValue.seconds * 1000);
    } else {
      dateObj = new Date(dateValue);
    }
    if (!isNaN(dateObj.getTime())) {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return '-';
  }

  const rows = useMemo(() => items || [], [items]);
  const sortedRows = useMemo(() => [...rows].sort(getComparator(order, orderBy)), [rows, order, orderBy]);
  const paginatedRows = useMemo(() => sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [sortedRows, page, rowsPerPage]);

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

  const localizedHeadCells = [
    { id: 'name', label: t('foodStock.name') },
    { id: 'quantity', label: t('foodStock.quantity') },
    { id: 'lastModifiedDate', label: t('foodStock.lastModified') },
    { id: 'observation', label: t('foodStock.observation') },
    { id: 'actions', label: t('common.actions') },
  ];

  return (
    <Paper sx={{ mb: 3, p: 2 }} elevation={3}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: 16, sm: 20 } }}>{title} {emoji && <span style={{ fontSize: 24, marginLeft: 8 }}>{emoji}</span>}</Typography>
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ tableLayout: { xs: 'auto', sm: 'fixed' }, minWidth: 600 }}>
          <TableHead>
            <TableRow>
              {localizedHeadCells.map((headCell, idx) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.id === 'actions' ? 'center' : 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{
                    fontWeight: idx === 0 ? 'bold' : undefined,
                    fontSize: { xs: 12, sm: 14 },
                    px: { xs: 1, sm: 2 },
                    width:
                      headCell.id === 'name' ? { xs: 'auto', sm: '20%' } :
                        headCell.id === 'quantity' ? { xs: 'auto', sm: '20%' } :
                          headCell.id === 'lastModifiedDate' ? { xs: 'auto', sm: '20%' } :
                            headCell.id === 'observation' ? { xs: 'auto', sm: '30%' } :
                              headCell.id === 'actions' ? { xs: 'auto', sm: '10%' } : undefined,
                    minWidth: headCell.id === 'actions' ? 48 : undefined
                  }}
                >
                  {headCell.id !== 'actions' ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={e => handleRequestSort(e, headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? t('common.sortedDesc') : t('common.sortedAsc')}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => (
                <TableRow key={row.id || idx} hover>
                  <TableCell sx={{ width: { xs: 'auto', sm: '20%' }, fontSize: { xs: 12, sm: 14 }, px: { xs: 1, sm: 2 } }}>{row.name || '-'}</TableCell>
                  <TableCell sx={{ width: { xs: 'auto', sm: '20%' }, fontSize: { xs: 12, sm: 14 }, px: { xs: 1, sm: 2 } }}>{row.quantity || '-'}</TableCell>
                  <TableCell sx={{ width: { xs: 'auto', sm: '20%' }, fontSize: { xs: 12, sm: 14 }, px: { xs: 1, sm: 2 } }}>{formatDate(row.lastModifiedDate)}</TableCell>
                  <TableCell sx={{ width: { xs: 'auto', sm: '30%' }, maxWidth: { xs: 100, sm: 180 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: { xs: 'normal', sm: 'nowrap' }, fontSize: { xs: 12, sm: 14 }, px: { xs: 1, sm: 2 } }}>{row.observation || '-'}</TableCell>
                  <TableCell align="center" sx={{ width: { xs: 'auto', sm: '10%' }, minWidth: 48, fontSize: { xs: 12, sm: 14 }, px: { xs: 1, sm: 2 } }}>
                    <IconButton color="primary" onClick={e => { e.stopPropagation(); onEdit(row, title, emoji); }} aria-label={t('foodStock.editAria', { name: row.name || '' })}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ fontSize: { xs: 12, sm: 14 } }}>{t('foodStock.noData')}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('foodStock.rowsPerPage')}
          sx={{ '.MuiTablePagination-toolbar': { flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }, fontSize: { xs: 12, sm: 14 } }}
        />
      </Box>
    </Paper>
  );
}

function FoodStockTables({ foodStock, fetchStock }) {
  const foodTypes = useFoodTypes();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalEmoji, setModalEmoji] = useState('');

  const grouped = useMemo(() => {
    const map = {};
    foodTypes.forEach(type => { map[type.id] = []; });
    if (foodStock && Array.isArray(foodStock)) {
      foodStock.forEach(item => {
        if (item.type && map[item.type]) {
          map[item.type].push(item);
        }
      });
    }
    return map;
  }, [foodStock, foodTypes]);

  const handleEdit = (row, title, emoji) => {
    setRowToEdit(row);
    setModalTitle(title);
    setModalEmoji(emoji);
    setEditModalOpen(true);
  };

  const handleSave = async (id, updatedData) => {
    setSaving(true);
    try {
      await updateFoodStock(id, updatedData);
      fetchStock();
      setEditModalOpen(false);
      setRowToEdit(null);
    } catch (error) {
      console.error('Error updating food stock:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {Object.keys(grouped).map(key => (
        <FoodStockTable
          key={key}
          items={grouped[key]}
          title={foodTypes.find(type => type.id === key)?.label}
          emoji={foodTypes.find(type => type.id === key)?.emoji}
          onEdit={handleEdit}
        />
      ))}
      {rowToEdit && (
        <EditFoodStockModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSave}
          row={rowToEdit}
          saving={saving}
          title={modalTitle}
          emoji={modalEmoji}
        />
      )}
    </>
  );
}

export default React.memo(FoodStockTables);
