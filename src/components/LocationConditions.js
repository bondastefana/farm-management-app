import React from "react";
import {
  Typography,
  Paper,
  Box,
  Grid,
  IconButton,
  Chip,
  Button,
  CircularProgress,
  Alert
} from "@mui/material";
import { useTranslation } from "react-i18next";
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CreateIcon from '@mui/icons-material/Create';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ScienceIcon from '@mui/icons-material/Science';
import TerrainIcon from '@mui/icons-material/Terrain';
import OpacityIcon from '@mui/icons-material/Opacity';
import LandscapeIcon from '@mui/icons-material/Landscape';
import GrassIcon from '@mui/icons-material/Grass';
import {
  fetchLocationConditions,
  saveLocationConditions,
  fetchExternalLocationData
} from "../services/farmService";
import EditLocationConditionsModal from './EditLocationConditionsModal';

const LocationConditions = ({ location }) => {
  const { t } = useTranslation();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  // Fetch data from Firebase on mount
  const loadData = React.useCallback(async () => {
    setLoading(true);
    const result = await fetchLocationConditions();
    setData(result);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle fetching data from external APIs
  const handleFetchData = React.useCallback(async () => {
    if (!location || !location.latitude || !location.longitude) {
      setError(t('locationConditions.noLocationError', 'Location not available. Please enable location services.'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await fetchExternalLocationData(location.latitude, location.longitude);

      const newData = {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address || ''
        },
        climate: results.climate,
        soil: results.soil,
        altitude: results.altitude,
        lastAutoFetch: new Date()
      };

      const success = await saveLocationConditions(newData);
      if (success) {
        setData(newData);
        if (results.errors.length > 0) {
          setError(t('locationConditions.partialFetchError', `Some data could not be fetched: ${results.errors.join(', ')}`));
        }
      } else {
        setError(t('locationConditions.saveError', 'Error saving data. Please try again.'));
      }
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError(t('locationConditions.fetchError', 'Error fetching data. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, [location, t]);

  // Auto-fetch external data if no data exists and location is available
  React.useEffect(() => {
    const autoFetchIfNeeded = async () => {
      // Only auto-fetch if:
      // 1. Location is available
      // 2. No data exists yet
      // 3. Not currently loading
      if (location && location.latitude && location.longitude && !data && !loading) {
        console.log("Auto-fetching location conditions for first-time setup...");
        await handleFetchData();
      }
    };

    autoFetchIfNeeded();
  }, [location, data, loading, handleFetchData]);

  // Handle refresh - re-fetch auto fields only
  const handleRefresh = React.useCallback(async () => {
    if (!data || !data.location) {
      handleFetchData();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await fetchExternalLocationData(data.location.latitude, data.location.longitude);

      // Merge with existing data, preserving manual overrides
      const updatedData = { ...data };

      // Update climate data (preserve manual overrides)
      if (results.climate && updatedData.climate) {
        Object.keys(results.climate).forEach(key => {
          if (updatedData.climate[key]?.source !== 'manual') {
            updatedData.climate[key] = results.climate[key];
          }
        });
      } else if (results.climate) {
        updatedData.climate = results.climate;
      }

      // Update soil data (preserve manual overrides)
      if (results.soil && updatedData.soil) {
        Object.keys(results.soil).forEach(key => {
          if (updatedData.soil[key]?.source !== 'manual') {
            updatedData.soil[key] = results.soil[key];
          }
        });
      } else if (results.soil) {
        updatedData.soil = results.soil;
      }

      // Update altitude data (preserve manual overrides)
      if (results.altitude && updatedData.altitude) {
        Object.keys(results.altitude).forEach(key => {
          if (updatedData.altitude[key]?.source !== 'manual') {
            updatedData.altitude[key] = results.altitude[key];
          }
        });
      } else if (results.altitude) {
        updatedData.altitude = results.altitude;
      }

      updatedData.lastAutoFetch = new Date();

      const success = await saveLocationConditions(updatedData);
      if (success) {
        setData(updatedData);
        if (results.errors.length > 0) {
          setError(t('locationConditions.partialFetchError', `Some data could not be refreshed: ${results.errors.join(', ')}`));
        }
      } else {
        setError(t('locationConditions.saveError', 'Error saving data. Please try again.'));
      }
    } catch (err) {
      console.error('Error refreshing location data:', err);
      setError(t('locationConditions.fetchError', 'Error refreshing data. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, [data, handleFetchData, t]);

  // Render source badge
  const SourceBadge = ({ source }) => {
    if (source === 'auto') {
      return (
        <Chip
          label={t('locationConditions.auto', 'Auto')}
          size="small"
          icon={<SmartToyIcon />}
          color="primary"
          sx={{ height: 20, fontSize: '0.7rem' }}
        />
      );
    }
    return (
      <Chip
        label={t('locationConditions.manual', 'Manual')}
        size="small"
        icon={<CreateIcon />}
        color="secondary"
        sx={{ height: 20, fontSize: '0.7rem' }}
      />
    );
  };

  // Render data field
  const DataField = ({ icon, label, value, unit, source, translateValue }) => {
    let displayValue;
    if (value === null || value === undefined) {
      displayValue = '-';
    } else if (translateValue) {
      // Translate soil type values (handle multiple types separated by comma)
      if (typeof value === 'string' && value.includes(',')) {
        const types = value.split(',').map(type => type.trim());
        const translatedTypes = types.map(type => {
          const translationKey = `locationConditions.soilTypes.${type.toLowerCase().replace(/\s+/g, '')}`;
          return t(translationKey, type);
        });
        displayValue = translatedTypes.join(', ');
      } else {
        const translationKey = `locationConditions.soilTypes.${value.toLowerCase().replace(/\s+/g, '')}`;
        displayValue = t(translationKey, value);
      }
    } else {
      // Translate unit
      let translatedUnit = unit;
      if (unit === 'mm/year') {
        translatedUnit = t('locationConditions.units.mmPerYear', 'mm/year');
      } else if (unit === 'days/year') {
        translatedUnit = t('locationConditions.units.daysPerYear', 'days/year');
      } else if (unit === '°C') {
        translatedUnit = t('locationConditions.units.celsius', '°C');
      } else if (unit === 'm') {
        translatedUnit = t('locationConditions.units.meters', 'm');
      } else if (unit === '%') {
        translatedUnit = t('locationConditions.units.percent', '%');
      }
      displayValue = `${value}${translatedUnit}`;
    }

    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        mb: 2,
        py: 0.5
      }}>
        {/* Icon - Fixed width for alignment */}
        <Box sx={{
          minWidth: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: 0.5
        }}>
          {icon}
        </Box>

        {/* Label and Value */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', lineHeight: 1.4 }}>
            {label}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
              {displayValue}
            </Typography>
            {source && <SourceBadge source={source} />}
          </Box>
        </Box>
      </Box>
    );
  };

  // Empty state
  if (!loading && !data) {
    return (
      <Paper
        sx={{
          p: 2,
          minHeight: 500,
          maxHeight: 500,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        elevation={3}
      >
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
          {t('locationConditions.noData', 'No location conditions data available.')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleFetchData}
          disabled={!location}
        >
          {t('locationConditions.fetchData', 'Fetch Location Data')}
        </Button>
        {!location && (
          <Typography variant="caption" sx={{ mt: 1, color: 'error.main' }}>
            {t('locationConditions.locationRequired', 'Location services required')}
          </Typography>
        )}
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 2,
        minHeight: 500,
        maxHeight: 500,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        pt: 0,
        pb: 2,
        px: 2,
      }}
      elevation={3}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          position: 'sticky',
          top: 0,
          zIndex: 99,
          pb: 1,
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5">
            {t('locationConditions.title', 'Location Conditions')}
          </Typography>
          <Box component="span" sx={{ fontSize: 22 }} role="img" aria-label="location">
            🌍
          </Box>
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={handleRefresh}
            disabled={loading}
            title={t('locationConditions.refresh', 'Refresh Data')}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setEditModalOpen(true)}
            disabled={loading}
            title={t('locationConditions.edit', 'Edit Conditions')}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Data display */}
      {!loading && data && (
        <>
          <Grid container spacing={3}>
            {/* Climate Section */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2, pb: 1, borderBottom: '2px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {t('locationConditions.climate', 'Climate')}
                  </Typography>
                  <Box component="span" sx={{ fontSize: 18 }} role="img" aria-label="climate">
                    📊
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <DataField
                      icon={<ThermostatIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                      label={t('locationConditions.avgTemperature', 'Avg. Temperature')}
                      value={data.climate?.temperature?.value}
                      unit={data.climate?.temperature?.unit || '°C'}
                      source={data.climate?.temperature?.source}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <DataField
                      icon={<WaterDropIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                      label={t('locationConditions.precipitation', 'Precipitation')}
                      value={data.climate?.precipitation?.value}
                      unit={data.climate?.precipitation?.unit || 'mm/year'}
                      source={data.climate?.precipitation?.source}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <DataField
                      icon={<AcUnitIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                      label={t('locationConditions.frostDays', 'Frost Days')}
                      value={data.climate?.frostDays?.value}
                      unit={data.climate?.frostDays?.unit || ' days/year'}
                      source={data.climate?.frostDays?.source}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Soil Section */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2, pb: 1, borderBottom: '2px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {t('locationConditions.soil', 'Soil')}
                  </Typography>
                  <Box component="span" sx={{ fontSize: 18 }} role="img" aria-label="soil">
                    🌱
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DataField
                      icon={<ScienceIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                      label={t('locationConditions.pH', 'pH Level')}
                      value={data.soil?.pH?.value}
                      unit={data.soil?.pH?.unit || ''}
                      source={data.soil?.pH?.source}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DataField
                      icon={<TerrainIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                      label={t('locationConditions.soilType', 'Soil Type')}
                      value={data.soil?.soilType?.value}
                      unit={data.soil?.soilType?.unit || ''}
                      source={data.soil?.soilType?.source}
                      translateValue={true}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DataField
                      icon={<OpacityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                      label={t('locationConditions.waterRetention', 'Water Retention')}
                      value={data.soil?.waterRetention?.value}
                      unit={data.soil?.waterRetention?.unit || '%'}
                      source={data.soil?.waterRetention?.source}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DataField
                      icon={<GrassIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                      label={t('locationConditions.nitrogen', 'Nitrogen')}
                      value={data.soil?.nitrogen?.value}
                      unit={data.soil?.nitrogen?.unit || 'g/kg'}
                      source={data.soil?.nitrogen?.source}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Altitude Section */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.default' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2, pb: 1, borderBottom: '2px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {t('locationConditions.altitude', 'Altitude')}
                  </Typography>
                  <Box component="span" sx={{ fontSize: 18 }} role="img" aria-label="altitude">
                    ⛰️
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <DataField
                      icon={<LandscapeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                      label={t('locationConditions.elevation', 'Elevation')}
                      value={data.altitude?.elevation?.value}
                      unit={data.altitude?.elevation?.unit || 'm'}
                      source={data.altitude?.elevation?.source}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

          </Grid>

          {/* Last updated timestamp */}
          {data.lastUpdated && (
            <Typography variant="caption" sx={{ mt: 2, textAlign: 'right', color: 'text.secondary' }}>
              {t('locationConditions.lastUpdated', 'Last updated')}: {new Date(data.lastUpdated.seconds * 1000 || data.lastUpdated).toLocaleDateString()}
            </Typography>
          )}
        </>
      )}

      {/* Edit Modal */}
      <EditLocationConditionsModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        currentData={data}
        onDataUpdated={loadData}
      />
    </Paper>
  );
};

export default React.memo(LocationConditions);
