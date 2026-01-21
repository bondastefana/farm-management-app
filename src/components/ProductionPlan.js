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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Chip,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Refresh, TrendingUp, Calculate as CalculateIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  fetchProductionPlans,
  addProductionPlan,
  updateProductionPlan,
  deleteProductionPlan,
  calculateNeededStock
} from '../services/farmService';
import { useFoodTypes } from './FoodStockTables';

const HARVEST_SEASONS = ['spring', 'summer', 'autumn', 'winter'];

export default function ProductionPlan() {
  const { t } = useTranslation();
  const foodTypes = useFoodTypes();
  const [plans, setPlans] = useState([]);
  const [neededStock, setNeededStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    culture: '',
    cropType: 'concentrates',
    surfaceHectares: '',
    estimatedYield: '',
    lossPercentage: '',
    harvestDate: null,
    harvestSeason: 'summer'
  });
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [plansData, stockData] = await Promise.all([
        fetchProductionPlans(),
        calculateNeededStock()
      ]);
      setPlans(plansData);
      setNeededStock(stockData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(t('foodStock.productionPlan.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        culture: plan.culture,
        cropType: plan.cropType,
        surfaceHectares: plan.surfaceHectares,
        estimatedYield: plan.estimatedYield,
        lossPercentage: plan.lossPercentage,
        harvestDate: plan.harvestDate ? dayjs(plan.harvestDate) : null,
        harvestSeason: plan.harvestSeason
      });
    } else {
      setEditingPlan(null);
      setFormData({
        culture: '',
        cropType: 'concentrates',
        surfaceHectares: '',
        estimatedYield: '',
        lossPercentage: '',
        harvestDate: null,
        harvestSeason: 'summer'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPlan(null);
    setFormData({
      culture: '',
      cropType: 'concentrates',
      surfaceHectares: '',
      estimatedYield: '',
      lossPercentage: '',
      harvestDate: null,
      harvestSeason: 'summer'
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.culture || !formData.surfaceHectares || !formData.estimatedYield) {
      return false;
    }
    if (parseFloat(formData.surfaceHectares) <= 0 || parseFloat(formData.estimatedYield) <= 0) {
      return false;
    }
    if (formData.lossPercentage && (parseFloat(formData.lossPercentage) < 0 || parseFloat(formData.lossPercentage) > 100)) {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setError(t('foodStock.productionPlan.invalidData'));
      return;
    }

    const planData = {
      culture: formData.culture,
      cropType: formData.cropType,
      surfaceHectares: parseFloat(formData.surfaceHectares),
      estimatedYield: parseFloat(formData.estimatedYield),
      lossPercentage: formData.lossPercentage ? parseFloat(formData.lossPercentage) : 0,
      harvestDate: formData.harvestDate ? formData.harvestDate.toISOString() : null,
      harvestSeason: formData.harvestSeason,
      createdAt: editingPlan ? editingPlan.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingPlan) {
        await updateProductionPlan(editingPlan.id, planData);
      } else {
        await addProductionPlan(planData);
      }
      handleCloseDialog();
      loadData();
    } catch (err) {
      console.error('Error saving plan:', err);
      setError(t('foodStock.productionPlan.errorSaving'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('foodStock.productionPlan.confirmDelete'))) {
      try {
        await deleteProductionPlan(id);
        loadData();
      } catch (err) {
        console.error('Error deleting plan:', err);
        setError(t('foodStock.productionPlan.errorDeleting'));
      }
    }
  };

  // Calculate all production metrics for a plan
  const calculateProductionMetrics = (plan, neededStockForType = 0) => {
    const grossProduction = plan.surfaceHectares * plan.estimatedYield;
    const losses = (grossProduction * plan.lossPercentage) / 100;
    const netProduction = grossProduction - losses;
    const coverage = neededStockForType > 0 ? (netProduction / neededStockForType) * 100 : 0;
    const deficitOrSurplus = netProduction - neededStockForType;
    const additionalSurfaceNeeded = deficitOrSurplus < 0 && plan.estimatedYield > 0
      ? Math.abs(deficitOrSurplus) / plan.estimatedYield
      : 0;

    return {
      grossProduction,
      losses,
      netProduction,
      coverage,
      deficitOrSurplus,
      additionalSurfaceNeeded
    };
  };

  // Calculate metrics for form data in real-time
  const calculateFormMetrics = () => {
    if (!formData.surfaceHectares || !formData.estimatedYield) {
      return null;
    }

    const surface = parseFloat(formData.surfaceHectares) || 0;
    const yield_ = parseFloat(formData.estimatedYield) || 0;
    const lossPercent = parseFloat(formData.lossPercentage) || 0;

    const grossProduction = surface * yield_;
    const losses = (grossProduction * lossPercent) / 100;
    const netProduction = grossProduction - losses;

    // Get needed stock for this crop type
    const neededForType = neededStock
      ? (neededStock.neededStock[formData.cropType] || 0) / 1000
      : 0;

    const coverage = neededForType > 0 ? (netProduction / neededForType) * 100 : 0;
    const deficitOrSurplus = netProduction - neededForType;
    const additionalSurfaceNeeded = deficitOrSurplus < 0 && yield_ > 0
      ? Math.abs(deficitOrSurplus) / yield_
      : 0;

    return {
      grossProduction,
      losses,
      netProduction,
      coverage,
      deficitOrSurplus,
      additionalSurfaceNeeded,
      neededForType
    };
  };

  const getProductionByType = () => {
    const productionByType = {};
    foodTypes.forEach(type => {
      productionByType[type.id] = 0;
    });

    plans.forEach(plan => {
      const metrics = calculateProductionMetrics(plan);
      productionByType[plan.cropType] = (productionByType[plan.cropType] || 0) + metrics.netProduction;
    });

    return productionByType;
  };

  const getFoodTypeLabel = (typeId) => {
    const foodType = foodTypes.find(ft => ft.id === typeId);
    return foodType ? foodType.label : typeId;
  };

  const getFoodTypeEmoji = (typeId) => {
    const foodType = foodTypes.find(ft => ft.id === typeId);
    return foodType ? foodType.emoji : '';
  };

  const productionByType = getProductionByType();
  const totalProduction = Object.values(productionByType).reduce((sum, val) => sum + val, 0);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      {neededStock && (
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                  <TrendingUp sx={{ mr: 1, color: 'primary.main', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                  <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}>
                    {t('foodStock.productionPlan.totalPlanned')}
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  color="primary.main"
                  sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
                >
                  {totalProduction.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {t('foodStock.neededStock.tonnes')} / {t('foodStock.neededStock.year')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ mb: 1, fontSize: { xs: '0.95rem', sm: '1.25rem' } }}>
                  {t('foodStock.productionPlan.totalNeeded')}
                </Typography>
                <Typography
                  variant="h3"
                  color="secondary.main"
                  sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
                >
                  {(neededStock.neededStock.total / 1000).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {t('foodStock.neededStock.tonnes')} / {t('foodStock.neededStock.year')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              elevation={3}
              sx={{
                bgcolor: totalProduction >= (neededStock.neededStock.total / 1000) ? 'success.light' : 'warning.light'
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ mb: 1, color: 'inherit', fontSize: { xs: '0.95rem', sm: '1.25rem' } }}>
                  {t('foodStock.productionPlan.coverage')}
                </Typography>
                <Typography variant="h3" sx={{ color: 'inherit', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                  {neededStock.neededStock.total > 0
                    ? ((totalProduction / (neededStock.neededStock.total / 1000)) * 100).toFixed(1)
                    : 0}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.9, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {totalProduction >= (neededStock.neededStock.total / 1000)
                    ? t('foodStock.productionPlan.sufficient')
                    : t('foodStock.productionPlan.insufficient')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Production by Type Comparison */}
      {neededStock && (
        <Paper elevation={3} sx={{ mb: { xs: 2, sm: 3 }, p: { xs: 1.5, sm: 2 } }}>
          <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {t('foodStock.productionPlan.comparisonByType')}
          </Typography>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('foodStock.type')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {t('foodStock.productionPlan.plannedProduction')} ({t('foodStock.neededStock.tonnes')})
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {t('foodStock.productionPlan.needed')} ({t('foodStock.neededStock.tonnes')})
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {t('foodStock.productionPlan.difference')}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    {t('foodStock.productionPlan.status')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {foodTypes.map(foodType => {
                  const planned = productionByType[foodType.id] || 0;
                  const needed = (neededStock.neededStock[foodType.id] || 0) / 1000;
                  const difference = planned - needed;
                  const isSufficient = difference >= 0;

                  return (
                    <TableRow key={foodType.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: 20, marginRight: 8 }}>{foodType.emoji}</span>
                          {foodType.label}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{planned.toFixed(2)}</strong>
                      </TableCell>
                      <TableCell align="right">
                        {needed.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            color: isSufficient ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {difference >= 0 ? '+' : ''}{difference.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={isSufficient
                            ? t('foodStock.productionPlan.sufficient')
                            : t('foodStock.productionPlan.insufficient')
                          }
                          color={isSufficient ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Production Plans Table */}
      <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {t('foodStock.productionPlan.plans')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title={t('foodStock.neededStock.refresh')}>
              <IconButton onClick={loadData} color="primary" size="small">
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />}
              onClick={() => handleOpenDialog()}
              size="small"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t('foodStock.productionPlan.addPlan')}
            </Button>
          </Box>
        </Box>

        {plans.length === 0 ? (
          <Alert severity="info" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {t('foodStock.productionPlan.noPlans')}
          </Alert>
        ) : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('foodStock.productionPlan.culture')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('foodStock.productionPlan.cropType')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('foodStock.productionPlan.surface')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('foodStock.productionPlan.yield')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('foodStock.productionPlan.grossProduction')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('foodStock.productionPlan.losses')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('foodStock.productionPlan.netProduction')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('foodStock.productionPlan.harvestDate')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('foodStock.productionPlan.season')}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.map((plan) => {
                  const metrics = calculateProductionMetrics(plan);
                  return (
                    <TableRow key={plan.id} hover>
                      <TableCell>{plan.culture}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: 8 }}>{getFoodTypeEmoji(plan.cropType)}</span>
                          {getFoodTypeLabel(plan.cropType)}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{plan.surfaceHectares} ha</TableCell>
                      <TableCell align="right">{plan.estimatedYield} t/ha</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {metrics.grossProduction.toFixed(2)} t
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="error.main">
                          -{metrics.losses.toFixed(2)} t ({plan.lossPercentage}%)
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${metrics.netProduction.toFixed(2)} t`}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {plan.harvestDate ? dayjs(plan.harvestDate).format('DD/MM/YYYY') : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`foodStock.productionPlan.seasons.${plan.harvestSeason}`)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(plan)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={false}
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 64px)' }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          {editingPlan
            ? t('foodStock.productionPlan.editPlan')
            : t('foodStock.productionPlan.addPlan')}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('foodStock.productionPlan.culture')}
                  value={formData.culture}
                  onChange={(e) => handleInputChange('culture', e.target.value)}
                  required
                  helperText={t('foodStock.productionPlan.cultureHelper')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label={t('foodStock.productionPlan.cropType')}
                  value={formData.cropType}
                  onChange={(e) => handleInputChange('cropType', e.target.value)}
                  required
                >
                  {foodTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: 8 }}>{type.emoji}</span>
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('foodStock.productionPlan.surface')}
                  value={formData.surfaceHectares}
                  onChange={(e) => handleInputChange('surfaceHectares', e.target.value)}
                  required
                  inputProps={{ min: 0, step: 0.1 }}
                  helperText={t('foodStock.productionPlan.surfaceHelper')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('foodStock.productionPlan.yield')}
                  value={formData.estimatedYield}
                  onChange={(e) => handleInputChange('estimatedYield', e.target.value)}
                  required
                  inputProps={{ min: 0, step: 0.1 }}
                  helperText={t('foodStock.productionPlan.yieldHelper')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('foodStock.productionPlan.loss')}
                  value={formData.lossPercentage}
                  onChange={(e) => handleInputChange('lossPercentage', e.target.value)}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                  helperText={t('foodStock.productionPlan.lossHelper')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label={t('foodStock.productionPlan.season')}
                  value={formData.harvestSeason}
                  onChange={(e) => handleInputChange('harvestSeason', e.target.value)}
                  required
                >
                  {HARVEST_SEASONS.map((season) => (
                    <MenuItem key={season} value={season}>
                      {t(`foodStock.productionPlan.seasons.${season}`)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label={t('foodStock.productionPlan.harvestDate')}
                  value={formData.harvestDate}
                  onChange={(newValue) => handleInputChange('harvestDate', newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: t('foodStock.productionPlan.harvestDateHelper')
                    }
                  }}
                />
              </Grid>
              {/* Calculated Fields - Read-Only */}
              {formData.surfaceHectares && formData.estimatedYield && (() => {
                const metrics = calculateFormMetrics();
                if (!metrics) return null;

                return (
                  <Grid item xs={12}>
                    <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1.5, sm: 2 } }}>
                        <CalculateIcon sx={{ color: 'primary.main', mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          {t('foodStock.productionPlan.calculations')}
                        </Typography>
                      </Box>

                      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                        {/* Production Metrics */}
                        <Grid item xs={12} sm={6} md={4}>
                          <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, height: '100%' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {t('foodStock.productionPlan.grossProduction')}
                            </Typography>
                            <Typography variant="h5" color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                              {metrics.grossProduction.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {t('foodStock.neededStock.tonnes')}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, height: '100%' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {t('foodStock.productionPlan.lossesAmount')}
                            </Typography>
                            <Typography variant="h5" color="error" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                              {metrics.losses.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {t('foodStock.neededStock.tonnes')} ({formData.lossPercentage || 0}%)
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, height: '100%', bgcolor: 'success.main' }}>
                            <Typography variant="body2" sx={{ mb: 1, color: 'white', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {t('foodStock.productionPlan.netProduction')}
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                              {metrics.netProduction.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'white', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {t('foodStock.neededStock.tonnes')}
                            </Typography>
                          </Paper>
                        </Grid>

                        {/* Comparison Metrics */}
                        <Grid item xs={12} sm={6}>
                          <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, height: '100%' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {t('foodStock.productionPlan.requiredStock')}
                            </Typography>
                            <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                              {metrics.neededForType.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {t('foodStock.neededStock.tonnes')}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, height: '100%' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {t('foodStock.productionPlan.coverage')}
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{ color: metrics.coverage >= 100 ? 'success.main' : '#FB8C00', fontSize: { xs: '1.5rem', sm: '2rem' } }}
                            >
                              {metrics.coverage.toFixed(1)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {metrics.coverage >= 100 ? t('foodStock.productionPlan.sufficient') : t('foodStock.productionPlan.insufficient')}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12}>
                          <Paper
                            elevation={2}
                            sx={{
                              p: { xs: 1.5, sm: 2 },
                              bgcolor: metrics.deficitOrSurplus >= 0 ? 'success.light' : 'grey.100',
                              border: metrics.deficitOrSurplus < 0 ? '2px solid' : 'none',
                              borderColor: metrics.deficitOrSurplus < 0 ? 'warning.main' : 'transparent'
                            }}
                          >
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {t('foodStock.productionPlan.deficitSurplus')}
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{
                                color: metrics.deficitOrSurplus >= 0 ? 'success.dark' : 'error.main',
                                fontWeight: 'bold',
                                fontSize: { xs: '1.5rem', sm: '2rem' }
                              }}
                            >
                              {metrics.deficitOrSurplus >= 0 ? '+' : ''}{metrics.deficitOrSurplus.toFixed(2)} {t('foodStock.neededStock.tonnes')}
                            </Typography>
                            {metrics.deficitOrSurplus < 0 && (
                              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: 'warning.dark', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                {t('foodStock.productionPlan.additionalSurface')}: {metrics.additionalSurfaceNeeded.toFixed(2)} ha
                              </Typography>
                            )}
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                );
              })()}
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('cancel')}</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
