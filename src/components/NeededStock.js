import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Alert,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Edit, Refresh, Info } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { calculateNeededStock, updateConsumptionRate, resetConsumptionRates, updateFeedingPeriod } from '../services/farmService';
import { useFoodTypes } from './FoodStockTables';

export default function NeededStock() {
  const { t } = useTranslation();
  const foodTypes = useFoodTypes();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [editingFoodType, setEditingFoodType] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');
  const [editDaysDialogOpen, setEditDaysDialogOpen] = useState(false);
  const [editingDaysFoodType, setEditingDaysFoodType] = useState(null);
  const [editDaysValue, setEditDaysValue] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await calculateNeededStock();
      if (result) {
        setData(result);
      } else {
        setError(t('foodStock.neededStock.errorLoading'));
      }
    } catch (err) {
      console.error('Error loading needed stock:', err);
      setError(t('foodStock.neededStock.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEditClick = (species, foodType, currentValue) => {
    setEditingSpecies(species);
    setEditingFoodType(foodType);
    setEditValue(currentValue.toString());
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    const numValue = parseFloat(editValue);
    if (isNaN(numValue) || numValue < 0) {
      return;
    }

    // Save as kg/day (no conversion needed)
    const success = await updateConsumptionRate(editingSpecies, editingFoodType, numValue);
    if (success) {
      setEditDialogOpen(false);
      loadData();
    }
  };

  const hasConsumptionRates = (rates) => {
    if (!rates) return false;
    return Object.values(rates).some(rate => rate > 0);
  };

  const allRatesSet = () => {
    if (!data) return false;
    return hasConsumptionRates(data.rates.cow) || hasConsumptionRates(data.rates.horse);
  };

  const handleResetRates = async (species) => {
    const success = await resetConsumptionRates(species);
    if (success) {
      loadData();
    }
  };

  const handleEditDaysClick = (foodType, currentDays) => {
    setEditingDaysFoodType(foodType);
    setEditDaysValue(currentDays.toString());
    setEditDaysDialogOpen(true);
  };

  const handleSaveDays = async () => {
    const numDays = parseInt(editDaysValue);
    if (isNaN(numDays) || numDays < 1 || numDays > 365) {
      return;
    }

    const success = await updateFeedingPeriod(editingDaysFoodType, numDays);
    if (success) {
      setEditDaysDialogOpen(false);
      loadData();
    }
  };

  const getFoodTypeLabel = (typeId) => {
    const foodType = foodTypes.find(ft => ft.id === typeId);
    return foodType ? foodType.label : typeId;
  };

  const getFoodTypeEmoji = (typeId) => {
    const foodType = foodTypes.find(ft => ft.id === typeId);
    return foodType ? foodType.emoji : '';
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography>{t('loading')}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return null;
  }

  const { neededStock, neededStockBySpecies = {}, animalCounts, rates, feedingPeriods = {}, speciesList = [] } = data;

  // Colors for different species cards
  const speciesColors = ['primary.main', 'secondary.main', 'info.main', 'warning.main', 'error.main'];

  // Get emoji for each species
  const getSpeciesEmoji = (species) => {
    const emojiMap = {
      cow: '🐄',
      horse: '🐴',
      sheep: '🐑',
      goat: '🐐',
      pig: '🐷',
      chicken: '🐔',
    };
    return emojiMap[species] || '🐾';
  };

  return (
    <Box>
      {/* Warning if no consumption rates set */}
      {!allRatesSet() && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('foodStock.neededStock.noRatesSet')}
          </Typography>
          <Typography variant="body2">
            {t('foodStock.neededStock.pleaseSetRates')}
          </Typography>
        </Alert>
      )}

      {/* No animals warning */}
      {speciesList.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            {t('foodStock.neededStock.noAnimals')}
          </Typography>
        </Alert>
      )}

      {/* Summary Cards - Dynamic for all species */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        {speciesList.map((species, index) => (
          <Grid item xs={12} sm={6} md={speciesList.length >= 3 ? 4 : 6} key={species}>
            <Card elevation={3}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <span style={{ fontSize: 28, marginRight: 8 }}>{getSpeciesEmoji(species)}</span>
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {t(species === 'cow' ? 'cows' : species === 'horse' ? 'horses' : species)}
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  color={speciesColors[index % speciesColors.length]}
                  sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
                >
                  {animalCounts[species] || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, mb: 2 }}>
                  {t('foodStock.neededStock.totalAnimals')}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, mb: 0.5 }}>
                  {t('foodStock.neededStock.annualNeed')}:
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 'bold' }}
                  color={speciesColors[index % speciesColors.length]}
                >
                  {neededStockBySpecies[species]?.total?.toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'} {t('kg')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Total Card */}
        {speciesList.length > 0 && (
          <Grid item xs={12} md={speciesList.length >= 3 ? 12 : 6}>
            <Card elevation={3} sx={{ bgcolor: 'success.light' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ mb: 1, color: 'success.contrastText', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {t('foodStock.neededStock.totalNeeded')}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ color: 'success.contrastText', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
                >
                  {neededStock.total.toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </Typography>
                <Typography variant="body2" sx={{ color: 'success.contrastText', opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {t('kg')} / {t('foodStock.neededStock.year')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Needed Stock by Food Type */}
      <Paper elevation={3} sx={{ mb: { xs: 2, sm: 3 }, p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {t('foodStock.neededStock.byFoodType')}
          </Typography>
          <Tooltip title={t('foodStock.neededStock.refresh')}>
            <IconButton onClick={loadData} color="primary" size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('foodStock.type')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('foodStock.neededStock.daysPerYear')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('foodStock.neededStock.annualNeed')} ({t('kg')})</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('foodStock.neededStock.percentage')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {['concentrates', 'fiber', 'greenFodder', 'succulents'].map((foodType) => (
                <TableRow key={foodType} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: 24, marginRight: 8 }}>{getFoodTypeEmoji(foodType)}</span>
                      {getFoodTypeLabel(foodType)}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {feedingPeriods[foodType] || 365}
                      </Typography>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditDaysClick(foodType, feedingPeriods[foodType] || 365)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" color="primary">
                      {neededStock[foodType].toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${((neededStock[foodType] / neededStock.total) * 100).toFixed(1)}%`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('foodStock.neededStock.total')}</TableCell>
                <TableCell /> {/* Empty cell for Days/Year column */}
                <TableCell align="right">
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {neededStock.total.toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip label="100%" size="small" color="success" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Consumption Rates */}
      {speciesList.length > 0 && (
        <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {t('foodStock.neededStock.consumptionRates')}
            </Typography>
            <Tooltip title={t('foodStock.neededStock.consumptionInfo')}>
              <Info color="action" sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            </Tooltip>
          </Box>

          <Alert severity="info" sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {t('foodStock.neededStock.setDailyRates')}
          </Alert>

          {/* Dynamic Rates Tables for Each Species */}
          {speciesList.map((species, index) => (
            <Box key={species} sx={{ mb: index < speciesList.length - 1 ? { xs: 2, sm: 3 } : 0 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                flexWrap: 'wrap',
                gap: 1
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  {t(species === 'cow' ? 'cows' : species === 'horse' ? 'horses' : species)} ({animalCounts[species]} {t('foodStock.neededStock.animals')})
                </Typography>
                <Button
                  size="small"
                  startIcon={<Refresh />}
                  onClick={() => handleResetRates(species)}
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                >
                  {t('foodStock.neededStock.resetToZero')}
                </Button>
              </Box>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('foodStock.type')}</TableCell>
                      <TableCell align="right">{t('foodStock.neededStock.perAnimalDay')} ({t('kg')})</TableCell>
                      <TableCell align="right">{t('foodStock.neededStock.perAnimalYear')} ({t('kg')})</TableCell>
                      <TableCell align="right">{t('foodStock.neededStock.totalForSpecies')} ({t('kg')})</TableCell>
                      <TableCell align="center">{t('actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {['concentrates', 'fiber', 'greenFodder', 'succulents'].map((foodType) => {
                      const daysPerYear = feedingPeriods[foodType] || 365;
                      return (
                        <TableRow key={foodType}>
                          <TableCell>
                            <span style={{ marginRight: 8 }}>{getFoodTypeEmoji(foodType)}</span>
                            {getFoodTypeLabel(foodType)}
                          </TableCell>
                          <TableCell align="right">
                            <strong>{rates[species]?.[foodType] || 0}</strong>
                          </TableCell>
                          <TableCell align="right">
                            {((rates[species]?.[foodType] || 0) * daysPerYear).toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={((rates[species]?.[foodType] || 0) * daysPerYear * animalCounts[species]).toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditClick(species, foodType, rates[species]?.[foodType] || 0)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Total row for this species */}
                    <TableRow sx={{ bgcolor: 'action.hover', borderTop: 2, borderColor: 'divider' }}>
                      <TableCell sx={{ fontWeight: 'bold' }} colSpan={3}>
                        {t('foodStock.neededStock.totalForSpecies')} - {t(species === 'cow' ? 'cows' : species === 'horse' ? 'horses' : species)}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={neededStockBySpecies[species]?.total?.toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'}
                          color="success"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Paper>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('foodStock.neededStock.editConsumption')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
              {editingSpecies && t(editingSpecies === 'cow' ? 'cow' : editingSpecies === 'horse' ? 'horse' : editingSpecies)} - {editingFoodType && getFoodTypeLabel(editingFoodType)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('foodStock.neededStock.enterDailyAmount')}
            </Typography>
            <TextField
              fullWidth
              label={`${t('foodStock.neededStock.dailyConsumption')} (${t('kg')}/${t('foodStock.neededStock.day')})`}
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              inputProps={{ min: 0, step: 0.1 }}
              helperText={t('foodStock.neededStock.perAnimalPerDay')}
            />
            {editValue && parseFloat(editValue) > 0 && editingFoodType && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('foodStock.neededStock.daysPerYear')}: <strong>{feedingPeriods[editingFoodType] || 365} {t('foodStock.neededStock.days')}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('foodStock.neededStock.annualEquivalent')}: <strong>{(parseFloat(editValue) * (feedingPeriods[editingFoodType] || 365)).toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {t('kg')}</strong> {t('foodStock.neededStock.perAnimal')}
                </Typography>
                <Typography variant="body2">
                  {t('foodStock.neededStock.totalAnnual')}: <strong>{(parseFloat(editValue) * (feedingPeriods[editingFoodType] || 365) * (data?.animalCounts?.[editingSpecies] || 0)).toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {t('kg')}</strong>
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>{t('cancel')}</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Feeding Days Dialog */}
      <Dialog open={editDaysDialogOpen} onClose={() => setEditDaysDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('foodStock.neededStock.editFeedingDays')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
              {editingDaysFoodType && getFoodTypeLabel(editingDaysFoodType)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('foodStock.neededStock.enterDaysPerYear')}
            </Typography>
            <TextField
              fullWidth
              label={t('foodStock.neededStock.daysPerYear')}
              type="number"
              value={editDaysValue}
              onChange={(e) => setEditDaysValue(e.target.value)}
              inputProps={{ min: 1, max: 365, step: 1 }}
              helperText={t('foodStock.neededStock.daysHelp')}
            />
            {editDaysValue && parseInt(editDaysValue) > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  {t('foodStock.neededStock.feedingPeriodInfo')}: <strong>{editDaysValue} {t('foodStock.neededStock.daysPerYear')}</strong>
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDaysDialogOpen(false)}>{t('cancel')}</Button>
          <Button onClick={handleSaveDays} variant="contained" color="primary">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
