import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  saveLocationConditions,
  fetchExternalLocationData
} from "../services/farmService";

const EditLocationConditionsModal = ({ open, onClose, currentData, onDataUpdated }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    climate: {
      temperature: { value: '', unit: '°C', source: 'manual' },
      precipitation: { value: '', unit: 'mm/year', source: 'manual' },
      frostDays: { value: '', unit: 'days/year', source: 'manual' }
    },
    soil: {
      pH: { value: '', unit: '', source: 'manual' },
      soilType: { value: '', unit: '', source: 'manual' },
      waterRetention: { value: '', unit: '%', source: 'manual' },
      nitrogen: { value: '', unit: 'g/kg', source: 'manual' }
    },
    altitude: {
      elevation: { value: '', unit: 'm', source: 'manual' }
    },
    previousCrop: {
      cropId: '',
      harvestDate: null,
      source: 'manual'
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form with current data
  useEffect(() => {
    if (open) {
      setFormData({
        climate: {
          temperature: {
            value: currentData?.climate?.temperature?.value ?? '',
            unit: currentData?.climate?.temperature?.unit || '°C',
            source: currentData?.climate?.temperature?.source || 'manual'
          },
          precipitation: {
            value: currentData?.climate?.precipitation?.value ?? '',
            unit: currentData?.climate?.precipitation?.unit || 'mm/year',
            source: currentData?.climate?.precipitation?.source || 'manual'
          },
          frostDays: {
            value: currentData?.climate?.frostDays?.value ?? '',
            unit: currentData?.climate?.frostDays?.unit || 'days/year',
            source: currentData?.climate?.frostDays?.source || 'manual'
          }
        },
        soil: {
          pH: {
            value: currentData?.soil?.pH?.value ?? '',
            unit: currentData?.soil?.pH?.unit || '',
            source: currentData?.soil?.pH?.source || 'manual'
          },
          soilType: {
            value: currentData?.soil?.soilType?.value ?? '',
            unit: currentData?.soil?.soilType?.unit || '',
            source: currentData?.soil?.soilType?.source || 'manual'
          },
          waterRetention: {
            value: currentData?.soil?.waterRetention?.value ?? '',
            unit: currentData?.soil?.waterRetention?.unit || '%',
            source: currentData?.soil?.waterRetention?.source || 'manual'
          },
          nitrogen: {
            value: currentData?.soil?.nitrogen?.value ?? '',
            unit: currentData?.soil?.nitrogen?.unit || 'g/kg',
            source: currentData?.soil?.nitrogen?.source || 'manual'
          }
        },
        altitude: {
          elevation: {
            value: currentData?.altitude?.elevation?.value ?? '',
            unit: currentData?.altitude?.elevation?.unit || 'm',
            source: currentData?.altitude?.elevation?.source || 'manual'
          }
        },
        previousCrop: {
          cropId: currentData?.previousCrop?.cropId ?? '',
          harvestDate: currentData?.previousCrop?.harvestDate
            ? dayjs(currentData.previousCrop.harvestDate.seconds ? new Date(currentData.previousCrop.harvestDate.seconds * 1000) : currentData.previousCrop.harvestDate)
            : null,
          source: currentData?.previousCrop?.source || 'manual'
        }
      });
      setErrors({});
    }
  }, [currentData, open]);

  const handleFieldChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: {
          ...prev[category][field],
          value: value,
          source: 'manual',
          lastModified: new Date()
        }
      }
    }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [`${category}.${field}`]: null }));
  };

  const handlePreviousCropChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      previousCrop: {
        ...prev.previousCrop,
        [field]: value,
        source: 'manual',
        lastModified: new Date()
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate temperature (-50 to 50°C)
    const temp = parseFloat(formData.climate.temperature.value);
    if (formData.climate.temperature.value !== '' && (isNaN(temp) || temp < -50 || temp > 50)) {
      newErrors['climate.temperature'] = t('locationConditions.errors.temperatureRange', 'Temperature must be between -50 and 50°C');
    }

    // Validate precipitation (0 to 10000 mm/year)
    const precip = parseFloat(formData.climate.precipitation.value);
    if (formData.climate.precipitation.value !== '' && (isNaN(precip) || precip < 0 || precip > 10000)) {
      newErrors['climate.precipitation'] = t('locationConditions.errors.precipitationRange', 'Precipitation must be between 0 and 10000 mm/year');
    }

    // Validate frost days (0 to 365)
    const frost = parseInt(formData.climate.frostDays.value);
    if (formData.climate.frostDays.value !== '' && (isNaN(frost) || frost < 0 || frost > 365)) {
      newErrors['climate.frostDays'] = t('locationConditions.errors.frostDaysRange', 'Frost days must be between 0 and 365');
    }

    // Validate pH (0 to 14)
    const pH = parseFloat(formData.soil.pH.value);
    if (formData.soil.pH.value !== '' && (isNaN(pH) || pH < 0 || pH > 14)) {
      newErrors['soil.pH'] = t('locationConditions.errors.pHRange', 'pH must be between 0 and 14');
    }

    // Validate water retention (0 to 100%)
    const retention = parseFloat(formData.soil.waterRetention.value);
    if (formData.soil.waterRetention.value !== '' && (isNaN(retention) || retention < 0 || retention > 100)) {
      newErrors['soil.waterRetention'] = t('locationConditions.errors.waterRetentionRange', 'Water retention must be between 0 and 100%');
    }

    // Validate elevation (-500 to 9000m)
    const elev = parseFloat(formData.altitude.elevation.value);
    if (formData.altitude.elevation.value !== '' && (isNaN(elev) || elev < -500 || elev > 9000)) {
      newErrors['altitude.elevation'] = t('locationConditions.errors.elevationRange', 'Elevation must be between -500 and 9000m');
    }

    // Validate nitrogen (0 to 10 g/kg)
    const nitrogen = parseFloat(formData.soil.nitrogen.value);
    if (formData.soil.nitrogen.value !== '' && (isNaN(nitrogen) || nitrogen < 0 || nitrogen > 10)) {
      newErrors['soil.nitrogen'] = t('locationConditions.errors.nitrogenRange', 'Nitrogen must be between 0 and 10 g/kg');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        ...currentData,
        climate: formData.climate,
        soil: formData.soil,
        altitude: formData.altitude,
        previousCrop: {
          cropId: formData.previousCrop.cropId || null,
          harvestDate: formData.previousCrop.harvestDate ? formData.previousCrop.harvestDate.toDate() : null,
          source: formData.previousCrop.source,
          lastModified: new Date()
        },
        lastUpdated: new Date()
      };

      const success = await saveLocationConditions(updatedData);
      if (success) {
        onDataUpdated();
        onClose();
      } else {
        setErrors({ general: t('locationConditions.saveError', 'Error saving data. Please try again.') });
      }
    } catch (error) {
      console.error('Error saving location conditions:', error);
      setErrors({ general: t('locationConditions.saveError', 'Error saving data. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  const handleRevertToAuto = async () => {
    if (!currentData?.location) {
      setErrors({ general: t('locationConditions.noLocationError', 'Location not available.') });
      return;
    }

    setLoading(true);
    try {
      const results = await fetchExternalLocationData(
        currentData.location.latitude,
        currentData.location.longitude
      );

      const newData = {
        ...currentData,
        climate: results.climate,
        soil: results.soil,
        altitude: results.altitude,
        lastAutoFetch: new Date(),
        lastUpdated: new Date()
      };

      const success = await saveLocationConditions(newData);
      if (success) {
        onDataUpdated();
        onClose();
      } else {
        setErrors({ general: t('locationConditions.saveError', 'Error saving data. Please try again.') });
      }
    } catch (error) {
      console.error('Error reverting to auto:', error);
      setErrors({ general: t('locationConditions.fetchError', 'Error fetching data. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {t('locationConditions.editTitle', 'Edit Location Conditions')}
      </DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('locationConditions.manualOverrideWarning', 'Manual changes will override automatic data')}
        </Alert>

        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        {/* Climate Data Accordion */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                {t('locationConditions.climate', 'Climate')}
              </Typography>
              <Box component="span" sx={{ fontSize: 18 }}>📊</Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                type="number"
                label={`${t('locationConditions.avgTemperature', 'Avg. Temperature')} (°C)`}
                value={formData.climate.temperature.value || ''}
                onChange={(e) => handleFieldChange('climate', 'temperature', e.target.value)}
                error={!!errors['climate.temperature']}
                helperText={errors['climate.temperature'] || t('locationConditions.helpers.temperature', 'Average annual temperature (-50 to 50°C)')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="number"
                label={`${t('locationConditions.precipitation', 'Precipitation')} (${t('locationConditions.units.mmPerYear', 'mm/year')})`}
                value={formData.climate.precipitation.value || ''}
                onChange={(e) => handleFieldChange('climate', 'precipitation', e.target.value)}
                error={!!errors['climate.precipitation']}
                helperText={errors['climate.precipitation'] || t('locationConditions.helpers.precipitation', 'Annual precipitation (0 to 10000 mm/year)')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="number"
                label={`${t('locationConditions.frostDays', 'Frost Days')} (${t('locationConditions.units.daysPerYear', 'days/year')})`}
                value={formData.climate.frostDays.value || ''}
                onChange={(e) => handleFieldChange('climate', 'frostDays', e.target.value)}
                error={!!errors['climate.frostDays']}
                helperText={errors['climate.frostDays'] || t('locationConditions.helpers.frostDays', 'Average frost days per year (0 to 365)')}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Soil Data Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                {t('locationConditions.soil', 'Soil')}
              </Typography>
              <Box component="span" sx={{ fontSize: 18 }}>🌱</Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                type="number"
                label={t('locationConditions.pH', 'pH Level')}
                value={formData.soil.pH.value || ''}
                onChange={(e) => handleFieldChange('soil', 'pH', e.target.value)}
                error={!!errors['soil.pH']}
                helperText={errors['soil.pH'] || t('locationConditions.helpers.pH', 'Soil pH level (0 to 14)')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label={t('locationConditions.soilType', 'Soil Type')}
                value={formData.soil.soilType.value || ''}
                onChange={(e) => handleFieldChange('soil', 'soilType', e.target.value)}
                helperText={t('locationConditions.helpers.soilTypeMultiple', 'Enter soil type(s), separate multiple types with commas')}
                InputLabelProps={{ shrink: true }}
                placeholder="Clay, Sandy Loam"
              />
              <TextField
                fullWidth
                type="number"
                label={`${t('locationConditions.waterRetention', 'Water Retention')} (${t('locationConditions.units.percent', '%')})`}
                value={formData.soil.waterRetention.value || ''}
                onChange={(e) => handleFieldChange('soil', 'waterRetention', e.target.value)}
                error={!!errors['soil.waterRetention']}
                helperText={errors['soil.waterRetention'] || t('locationConditions.helpers.waterRetention', 'Water retention capacity (0 to 100%)')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="number"
                label={`${t('locationConditions.nitrogen', 'Nitrogen')} (g/kg)`}
                value={formData.soil.nitrogen.value || ''}
                onChange={(e) => handleFieldChange('soil', 'nitrogen', e.target.value)}
                error={!!errors['soil.nitrogen']}
                helperText={errors['soil.nitrogen'] || t('locationConditions.helpers.nitrogen', 'Soil nitrogen content (0 to 10 g/kg)')}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Altitude Data Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                {t('locationConditions.altitude', 'Altitude')}
              </Typography>
              <Box component="span" sx={{ fontSize: 18 }}>⛰️</Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              type="number"
              label={`${t('locationConditions.elevation', 'Elevation')} (${t('locationConditions.units.meters', 'm')})`}
              value={formData.altitude.elevation.value || ''}
              onChange={(e) => handleFieldChange('altitude', 'elevation', e.target.value)}
              error={!!errors['altitude.elevation']}
              helperText={errors['altitude.elevation'] || t('locationConditions.helpers.elevation', 'Elevation above sea level (-500 to 9000m)')}
              InputLabelProps={{ shrink: true }}
            />
          </AccordionDetails>
        </Accordion>

        {/* Agriculture Data Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                {t('locationConditions.agriculture', 'Agriculture')}
              </Typography>
              <Box component="span" sx={{ fontSize: 18 }}>🚜</Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="previous-crop-label">{t('locationConditions.previousCrop', 'Previous Crop')}</InputLabel>
                <Select
                  labelId="previous-crop-label"
                  value={formData.previousCrop.cropId || ''}
                  label={t('locationConditions.previousCrop', 'Previous Crop')}
                  onChange={(e) => handlePreviousCropChange('cropId', e.target.value)}
                >
                  <MenuItem value="">{t('locationConditions.noPreviousCrop', 'None / Not specified')}</MenuItem>
                  <MenuItem value="corn">{t('cropRecommendations.crops.corn', 'Corn')}</MenuItem>
                  <MenuItem value="wheat">{t('cropRecommendations.crops.wheat', 'Wheat')}</MenuItem>
                  <MenuItem value="barley">{t('cropRecommendations.crops.barley', 'Barley')}</MenuItem>
                  <MenuItem value="potato">{t('cropRecommendations.crops.potato', 'Potato')}</MenuItem>
                  <MenuItem value="sunflower">{t('cropRecommendations.crops.sunflower', 'Sunflower')}</MenuItem>
                  <MenuItem value="soybean">{t('cropRecommendations.crops.soybean', 'Soybean')}</MenuItem>
                  <MenuItem value="oats">{t('cropRecommendations.crops.oats', 'Oats')}</MenuItem>
                  <MenuItem value="rapeseed">{t('cropRecommendations.crops.rapeseed', 'Rapeseed')}</MenuItem>
                  <MenuItem value="alfalfa">{t('cropRecommendations.crops.alfalfa', 'Alfalfa')}</MenuItem>
                  <MenuItem value="sugar_beet">{t('cropRecommendations.crops.sugar_beet', 'Sugar Beet')}</MenuItem>
                  <MenuItem value="rye">{t('cropRecommendations.crops.rye', 'Rye')}</MenuItem>
                  <MenuItem value="clover">{t('cropRecommendations.crops.clover', 'Clover')}</MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t('locationConditions.harvestDate', 'Harvest Date')}
                  value={formData.previousCrop.harvestDate}
                  onChange={(newValue) => handlePreviousCropChange('harvestDate', newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: t('locationConditions.helpers.harvestDate', 'When was the previous crop harvested?')
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Location info display */}
        {currentData?.location && currentData.location.latitude && currentData.location.longitude && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {t('locationConditions.currentLocation', 'Current Location')}: {currentData.location.latitude.toFixed(4)}, {currentData.location.longitude.toFixed(4)}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button
          onClick={handleRevertToAuto}
          color="warning"
          disabled={loading}
        >
          {t('locationConditions.revertToAuto', 'Revert to Auto')}
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {t('save', 'Save Changes')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(EditLocationConditionsModal);
