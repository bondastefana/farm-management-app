import React, { useEffect, useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import LocationConditions from '../components/LocationConditions';
import CropRecommendations from '../components/CropRecommendations';
import SoilAnalysisWizard from '../components/SoilAnalysisWizard';
import SoilAnalysisList from '../components/SoilAnalysisList';
import { getFarmLocation } from '../services/farmService';

const ParcelDetails = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // For now, using a default parcel ID (you can extend this to select from a list)
  const defaultParcelId = "parcel_floresti_north";
  const defaultParcelName = "North Field - Florești";

  useEffect(() => {
    // Fetch persisted farm location (or use geolocation on first setup, or fallback to default)
    const fetchLocation = async () => {
      const farmLocation = await getFarmLocation();
      if (farmLocation) {
        setLocation({
          latitude: farmLocation.latitude,
          longitude: farmLocation.longitude
        });
      }
    };

    fetchLocation();
  }, []);

  const handleOpenWizard = () => {
    setWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setWizardOpen(false);
  };

  const handleAnalysisSuccess = (analysisId) => {
    console.log('Soil analysis created:', analysisId);
    // Trigger refresh of the analysis list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAnalysisClick = (analysis) => {
    console.log('Analysis clicked:', analysis);
    // Future: navigate to analysis details or show modal with full data
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('parcelDetailsPage.title', 'Parcel Details')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('parcelDetailsPage.subtitle', 'Manage your parcel conditions and view crop recommendations')}
        </Typography>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Soil Analysis List - First Section */}
        <Grid size={{ xs: 12 }}>
          <SoilAnalysisList
            parcelId={defaultParcelId}
            parcelName={defaultParcelName}
            onAnalysisClick={handleAnalysisClick}
            onAddNew={handleOpenWizard}
            refreshTrigger={refreshTrigger}
          />
        </Grid>

        {/* Location Conditions - Full Width */}
        <Grid size={{ xs: 12 }}>
          <LocationConditions location={location} />
        </Grid>

        {/* Crop Recommendations - Full Width */}
        <Grid size={{ xs: 12 }}>
          <CropRecommendations />
        </Grid>
      </Grid>

      {/* Soil Analysis Wizard Modal */}
      <SoilAnalysisWizard
        open={wizardOpen}
        onClose={handleCloseWizard}
        parcelId={defaultParcelId}
        parcelName={defaultParcelName}
        onSuccess={handleAnalysisSuccess}
      />
    </Box>
  );
};

export default ParcelDetails;
