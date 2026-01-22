import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Button
} from '@mui/material';
import { useTranslation } from "react-i18next";
import ScienceIcon from '@mui/icons-material/Science';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BiotechIcon from '@mui/icons-material/Biotech';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import {
  fetchSoilAnalysesByParcel,
  fetchSoilSamples,
  calculateSoilAnalysisStatistics
} from "../services/farmService";

const SoilAnalysisList = ({ parcelId, parcelName, onAnalysisClick, onAddNew, refreshTrigger }) => {
  const { t } = useTranslation();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalyses = async () => {
      if (!parcelId) {
        setAnalyses([]);
        setLoading(false);
        return;
      }

      console.log('Loading analyses for parcel:', parcelId);
      setLoading(true);
      setError(null);

      try {
        // Fetch all analyses for this parcel
        const analysesData = await fetchSoilAnalysesByParcel(parcelId);
        console.log('Fetched analyses:', analysesData);

        // Fetch statistics for each analysis
        const analysesWithStats = await Promise.all(
          analysesData.map(async (analysis) => {
            const statistics = await calculateSoilAnalysisStatistics(analysis.id);
            return {
              ...analysis,
              sampleCount: statistics?.sampleCount || 0,
              statistics: statistics
            };
          })
        );

        console.log('Analyses with stats:', analysesWithStats);

        // Log status for each analysis
        analysesWithStats.forEach((a, idx) => {
          console.log(`Analysis ${idx + 1} - ID: ${a.id}, Status: "${a.status}", Has status: ${!!a.status}`);
        });

        setAnalyses(analysesWithStats);
      } catch (err) {
        console.error('Error loading soil analyses:', err);
        setError(t('soilAnalysisList.loadError', 'Failed to load soil analyses'));
      } finally {
        setLoading(false);
      }
    };

    loadAnalyses();
  }, [parcelId, refreshTrigger, t]);

  const handleAnalysisClick = (analysis) => {
    if (onAnalysisClick) {
      onAnalysisClick(analysis);
    }
  };

  const getPhInterpretation = (pH) => {
    if (pH < 5.5) {
      return {
        label: t('soilAnalysisList.phLevels.stronglyAcidic', 'Strongly Acidic'),
        color: '#d32f2f' // Red
      };
    } else if (pH < 6.9) {
      return {
        label: t('soilAnalysisList.phLevels.acidic', 'Acidic'),
        color: '#f57c00' // Orange
      };
    } else if (pH <= 7.1) {
      return {
        label: t('soilAnalysisList.phLevels.neutral', 'Neutral'),
        color: '#388e3c' // Green
      };
    } else if (pH <= 8.5) {
      return {
        label: t('soilAnalysisList.phLevels.alkaline', 'Alkaline'),
        color: '#1976d2' // Blue
      };
    } else {
      return {
        label: t('soilAnalysisList.phLevels.stronglyAlkaline', 'Strongly Alkaline'),
        color: '#7b1fa2' // Purple
      };
    }
  };

  const formatAnalysisDate = (date) => {
    if (!date) return t('soilAnalysisList.noDate', 'No date');

    console.log('Formatting date:', date, 'Type:', typeof date, 'Constructor:', date?.constructor?.name);

    let dateObj;

    // Handle Firebase Timestamp
    if (date?.toDate && typeof date.toDate === 'function') {
      console.log('Using Timestamp.toDate()');
      dateObj = date.toDate();
    }
    // Handle Firestore Timestamp object (seconds + nanoseconds)
    else if (date?.seconds) {
      console.log('Using seconds property:', date.seconds);
      dateObj = new Date(date.seconds * 1000);
    }
    // Handle regular Date object
    else if (date instanceof Date) {
      console.log('Already a Date object');
      dateObj = date;
    }
    // Handle string date
    else if (typeof date === 'string') {
      console.log('Parsing string date');
      dateObj = new Date(date);
    }
    // Handle Unix timestamp (number)
    else if (typeof date === 'number') {
      console.log('Parsing numeric timestamp');
      // If it looks like seconds (less than year 2100 in milliseconds)
      if (date < 10000000000) {
        dateObj = new Date(date * 1000);
      } else {
        dateObj = new Date(date);
      }
    }
    else {
      console.log('Unknown date format');
      return t('soilAnalysisList.noDate', 'No date');
    }

    // Format the date
    const formatted = dateObj.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    console.log('Formatted date:', formatted);
    return formatted;
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {t('soilAnalysisList.loading', 'Loading soil analyses...')}
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  if (analyses.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <ScienceIcon color="primary" />
            <Typography variant="h6">
              {t('soilAnalysisList.title', 'Soil Analysis History')}
            </Typography>
          </Box>
          {onAddNew && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onAddNew}
            >
              {t('soilAnalysisList.newAnalysis', 'New Analysis')}
            </Button>
          )}
        </Box>

        <Box textAlign="center" py={4}>
          <ScienceIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('soilAnalysisList.noAnalyses', 'No Soil Analyses Yet')}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {t('soilAnalysisList.createFirst', 'Click "New Analysis" to create your first analysis.')}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <ScienceIcon color="primary" />
          <Typography variant="h6">
            {t('soilAnalysisList.title', 'Soil Analysis History')}
          </Typography>
          <Chip
            label={analyses.length}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        </Box>
        {onAddNew && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddNew}
          >
            {t('soilAnalysisList.newAnalysis', 'New Analysis')}
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {analyses.map((analysis, index) => (
          <Grid item xs={12} sm={6} md={4} key={analysis.id}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardActionArea
                onClick={() => handleAnalysisClick(analysis)}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  {/* Header with index */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('soilAnalysisList.analysisNumber', 'Analysis')} #{analyses.length - index}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Date */}
                  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.primary" fontWeight="500">
                      {formatAnalysisDate(analysis.date || analysis.analysisDate)}
                    </Typography>
                  </Box>

                  {/* Sample Count */}
                  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <BiotechIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {analysis.sampleCount} {analysis.sampleCount === 1
                        ? t('soilAnalysisList.sample', 'sample')
                        : t('soilAnalysisList.samples', 'samples')
                      }
                    </Typography>
                  </Box>

                  {/* Notes preview */}
                  {analysis.notes && (
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      <DescriptionIcon fontSize="small" color="action" sx={{ mt: 0.2 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {analysis.notes}
                      </Typography>
                    </Box>
                  )}

                  {/* Laboratory name */}
                  {analysis.laboratoryName && (
                    <Box mt={1.5}>
                      <Chip
                        label={analysis.laboratoryName}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                  )}

                  {/* Statistics Summary */}
                  {analysis.statistics && analysis.sampleCount > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box>
                        <Typography variant="subtitle2" color="primary" display="block" gutterBottom fontWeight="600" sx={{ mb: 1.5 }}>
                          {t('soilAnalysisList.analysisResults', 'Analysis Results')}
                        </Typography>

                        {/* pH - Special display with interpretation */}
                        <Box sx={{
                          bgcolor: 'action.hover',
                          borderRadius: 2,
                          p: 1.5,
                          mb: 1.5,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Typography variant="body2" fontWeight="600" color="text.primary">
                              pH
                            </Typography>
                            <Chip
                              label={getPhInterpretation(analysis.statistics.averages.pH).label}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                height: '20px',
                                bgcolor: getPhInterpretation(analysis.statistics.averages.pH).color,
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                          <Typography variant="h6" fontWeight="700" color="text.primary">
                            {analysis.statistics.averages.pH}
                          </Typography>
                        </Box>

                        {/* Nutrients Grid */}
                        <Grid container spacing={1.5}>
                          {/* Nitrogen */}
                          <Grid item xs={12}>
                            <Box sx={{
                              bgcolor: 'action.hover',
                              borderRadius: 2,
                              p: 1.5,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}>
                              <Typography variant="body2" color="text.secondary" display="block" gutterBottom>
                                {t('soilAnalysisList.nitrogen', 'Nitrogen (N)')}
                              </Typography>
                              <Box display="flex" alignItems="baseline" gap={1}>
                                <Typography variant="h6" fontWeight="700" color="text.primary">
                                  {analysis.statistics.averages.nitrogen}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  g/kg
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Phosphorus */}
                          <Grid item xs={6}>
                            <Box sx={{
                              bgcolor: 'action.hover',
                              borderRadius: 2,
                              p: 1.5,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}>
                              <Typography variant="body2" color="text.secondary" display="block" gutterBottom>
                                {t('soilAnalysisList.phosphorus', 'Phosphorus (P)')}
                              </Typography>
                              <Box display="flex" alignItems="baseline" gap={0.5}>
                                <Typography variant="h6" fontWeight="700" color="text.primary">
                                  {analysis.statistics.averages.phosphorus}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  mg/kg
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Potassium */}
                          <Grid item xs={6}>
                            <Box sx={{
                              bgcolor: 'action.hover',
                              borderRadius: 2,
                              p: 1.5,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}>
                              <Typography variant="body2" color="text.secondary" display="block" gutterBottom>
                                {t('soilAnalysisList.potassium', 'Potassium (K)')}
                              </Typography>
                              <Box display="flex" alignItems="baseline" gap={0.5}>
                                <Typography variant="h6" fontWeight="700" color="text.primary">
                                  {analysis.statistics.averages.potassium}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  mg/kg
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SoilAnalysisList;
