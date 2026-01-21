import React from "react";
import {
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  LinearProgress,
  Chip,
  Alert,
  Collapse,
  IconButton
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AgricultureIcon from '@mui/icons-material/Agriculture';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchLocationConditions, getCropRecommendations } from "../services/farmService";

const CropRecommendations = () => {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [expanded, setExpanded] = React.useState({});

  const loadRecommendations = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const locationData = await fetchLocationConditions();

      if (!locationData) {
        setError(t('cropRecommendations.noData', 'No location conditions available. Please fetch location data first.'));
        setLoading(false);
        return;
      }

      const cropRecs = getCropRecommendations(locationData);
      setRecommendations(cropRecs);
    } catch (err) {
      console.error('Error loading crop recommendations:', err);
      setError(t('cropRecommendations.error', 'Error loading recommendations.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  React.useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  // Toggle expand/collapse for a crop
  const handleToggleExpand = (cropId) => {
    setExpanded(prev => ({
      ...prev,
      [cropId]: !prev[cropId]
    }));
  };

  // Get suitability level and color
  const getSuitabilityLevel = (score) => {
    if (score >= 80) return { level: 'excellent', color: '#4caf50', icon: <CheckCircleIcon /> };
    if (score >= 65) return { level: 'good', color: '#8bc34a', icon: <CheckCircleIcon /> };
    if (score >= 50) return { level: 'moderate', color: '#ff9800', icon: <WarningIcon /> };
    return { level: 'low', color: '#f44336', icon: <InfoIcon /> };
  };

  // Get explanation level color and icon
  const getExplanationColor = (level) => {
    if (level === 'excellent') return '#4caf50';
    if (level === 'good') return '#8bc34a';
    if (level === 'moderate') return '#ff9800';
    if (level === 'acceptable') return '#ffa726';
    return '#f44336';
  };

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
            {t('cropRecommendations.title', 'Crop Recommendations')}
          </Typography>
          <Box component="span" sx={{ fontSize: 22 }} role="img" aria-label="crops">
            🌾
          </Box>
        </Box>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Typography variant="body2">{t('loading', 'Loading...')}</Typography>
        </Box>
      )}

      {/* Error state */}
      {error && !loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Recommendations list */}
      {!loading && !error && recommendations.length > 0 && (
        <>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t('cropRecommendations.subtitle', 'Best agricultural crops for your location:')}
          </Typography>
          <List sx={{ p: 0 }}>
            {recommendations.map((rec) => {
              const suitability = getSuitabilityLevel(rec.suitability);
              const isExpanded = expanded[rec.cropId] || false;
              return (
                <ListItem
                  key={rec.cropId}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    mb: 1.5,
                    p: 1.5,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AgricultureIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {t(`cropRecommendations.crops.${rec.cropId}`, rec.name)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Chip
                        label={`${rec.suitability}%`}
                        size="small"
                        icon={suitability.icon}
                        sx={{
                          bgcolor: suitability.color,
                          color: 'white',
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleToggleExpand(rec.cropId)}
                        sx={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }}
                      >
                        <ExpandMoreIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={rec.suitability}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: suitability.color,
                        borderRadius: 1
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    {t(`cropRecommendations.suitability.${suitability.level}`, suitability.level)}
                  </Typography>

                  {/* Expandable Explanations */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
                        {t('cropRecommendations.scoreBreakdown', 'Score Breakdown')}:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {rec.explanations?.map((expl) => (
                          <Box
                            key={expl.param}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 1,
                              px: 1,
                              py: 0.5,
                              borderRadius: 0.5,
                              bgcolor: 'action.hover'
                            }}
                          >
                            <Typography variant="caption" sx={{ flex: 1 }}>
                              {t(`cropRecommendations.params.${expl.param}`, expl.param)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 600,
                                color: getExplanationColor(expl.level)
                              }}
                            >
                              {t(`cropRecommendations.levels.${expl.level}`, expl.level)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                minWidth: 35,
                                textAlign: 'right',
                                color: 'text.secondary'
                              }}
                            >
                              {expl.score}/100
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Collapse>
                </ListItem>
              );
            })}
          </List>
        </>
      )}

      {/* Empty state */}
      {!loading && !error && recommendations.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('cropRecommendations.noRecommendations', 'No recommendations available.')}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default React.memo(CropRecommendations);
