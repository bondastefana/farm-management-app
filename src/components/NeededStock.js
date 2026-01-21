import React, { useState, useEffect } from 'react';
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
  CardContent
} from '@mui/material';
import { Edit, Refresh, Info } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { calculateNeededStock, updateConsumptionRate, resetConsumptionRates } from '../services/farmService';
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

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const { neededStock, animalCounts, rates, speciesList = [] } = data;

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
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {t('foodStock.neededStock.totalAnimals')}
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
                  {(neededStock.total / 1000).toFixed(2).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'success.contrastText', opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {t('foodStock.neededStock.tonnes')} / {t('foodStock.neededStock.year')}
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
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('foodStock.neededStock.annualNeed')} ({t('foodStock.neededStock.tonnes')})</TableCell>
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
                    <Typography variant="h6" color="primary">
                      {(neededStock[foodType] / 1000).toFixed(2)}
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
                <TableCell align="right">
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {(neededStock.total / 1000).toFixed(2)}
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
                      <TableCell align="right">{t('foodStock.neededStock.totalForSpecies')} ({t('foodStock.neededStock.tonnes')})</TableCell>
                      <TableCell align="center">{t('actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {['concentrates', 'fiber', 'greenFodder', 'succulents'].map((foodType) => (
                      <TableRow key={foodType}>
                        <TableCell>
                          <span style={{ marginRight: 8 }}>{getFoodTypeEmoji(foodType)}</span>
                          {getFoodTypeLabel(foodType)}
                        </TableCell>
                        <TableCell align="right">
                          <strong>{rates[species]?.[foodType] || 0}</strong>
                        </TableCell>
                        <TableCell align="right">
                          {((rates[species]?.[foodType] || 0) * 365).toFixed(1)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${(((rates[species]?.[foodType] || 0) * 365 * animalCounts[species]) / 1000).toFixed(2)}`}
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
                    ))}
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
            {editValue && parseFloat(editValue) > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('foodStock.neededStock.annualEquivalent')}: <strong>{(parseFloat(editValue) * 365).toFixed(1)} {t('kg')}</strong> {t('foodStock.neededStock.perAnimal')}
                </Typography>
                <Typography variant="body2">
                  {t('foodStock.neededStock.totalAnnual')}: <strong>{((parseFloat(editValue) * 365 * (data?.animalCounts?.[editingSpecies] || 0)) / 1000).toFixed(2)} {t('foodStock.neededStock.tonnes')}</strong>
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
    </Box>
  );
}
