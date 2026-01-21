import React, { useEffect, useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import LocationConditions from '../components/LocationConditions';
import CropRecommendations from '../components/CropRecommendations';

const ParcelDetails = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Fetch user's location for the location-based features
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

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
      <Grid container spacing={2}>
        {/* Location Conditions - Full Width on Small, Half on Medium+ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <LocationConditions location={location} />
        </Grid>

        {/* Crop Recommendations - Full Width on Small, Half on Medium+ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CropRecommendations />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParcelDetails;
