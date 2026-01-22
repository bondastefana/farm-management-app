import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton,
  Paper,
  Alert,
  Divider
} from '@mui/material';
import { useTranslation } from "react-i18next";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ScienceIcon from '@mui/icons-material/Science';
import {
  createSoilAnalysis,
  addMultipleSoilSamples
} from "../services/farmService";

const SoilAnalysisWizard = ({ open, onClose, parcelId, parcelName, onSuccess }) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1: Analysis Information
  const [analysisData, setAnalysisData] = useState({
    date: dayjs(),
    notes: '',
    laboratoryName: ''
  });

  // Step 2: Soil Samples
  const [samples, setSamples] = useState([
    {
      id: Date.now(),
      sampleNumber: 1,
      depth: 30,
      pH: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      organicMatter: ''
    }
  ]);

  const steps = [
    t('soilAnalysisWizard.step1', 'Analysis Information'),
    t('soilAnalysisWizard.step2', 'Add Soil Samples')
  ];

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate step 1
      if (!analysisData.date) {
        setError(t('soilAnalysisWizard.errors.dateRequired', 'Date is required'));
        return;
      }
      setError(null);
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    setError(null);
    setActiveStep(0);
  };

  const handleAddSample = () => {
    const newSample = {
      id: Date.now(),
      sampleNumber: samples.length + 1,
      depth: 30,
      pH: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      organicMatter: ''
    };
    setSamples([...samples, newSample]);
  };

  const handleRemoveSample = (id) => {
    if (samples.length > 1) {
      const updatedSamples = samples.filter(s => s.id !== id);
      // Renumber samples
      const renumbered = updatedSamples.map((s, index) => ({
        ...s,
        sampleNumber: index + 1
      }));
      setSamples(renumbered);
    }
  };

  const handleSampleChange = (id, field, value) => {
    setSamples(samples.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const validateSamples = () => {
    for (const sample of samples) {
      if (!sample.pH || !sample.nitrogen || !sample.phosphorus ||
          !sample.potassium || !sample.organicMatter) {
        return false;
      }
      // Validate ranges
      if (sample.pH < 0 || sample.pH > 14) return false;
      if (sample.nitrogen < 0 || sample.phosphorus < 0 || sample.potassium < 0 || sample.organicMatter < 0) return false;
    }
    return true;
  };

  const handleSave = async () => {
    console.log('handleSave called');
    setError(null);

    // Validate samples
    console.log('Validating samples:', samples);
    if (!validateSamples()) {
      console.log('Validation failed');
      setError(t('soilAnalysisWizard.errors.invalidSamples', 'Please fill all required fields with valid values'));
      return;
    }

    console.log('Validation passed, starting save...');
    setLoading(true);

    try {
      console.log('Creating soil analysis with:', {
        parcelId,
        date: analysisData.date.toDate(),
        notes: analysisData.notes
      });

      // Step 1: Create the soil analysis
      const analysisId = await createSoilAnalysis(
        parcelId,
        analysisData.date.toDate(),
        analysisData.notes
      );

      console.log('Analysis created with ID:', analysisId);

      // Step 2: Add all samples
      const samplesData = samples.map(s => ({
        sampleNumber: s.sampleNumber,
        depth: Number(s.depth),
        pH: Number(s.pH),
        nitrogen: Number(s.nitrogen),
        phosphorus: Number(s.phosphorus),
        potassium: Number(s.potassium),
        organicMatter: Number(s.organicMatter)
      }));

      console.log('Adding samples:', samplesData);
      const samplesResult = await addMultipleSoilSamples(analysisId, samplesData);

      if (!samplesResult.success) {
        throw new Error(samplesResult.error || 'Failed to add samples');
      }

      console.log('Samples added successfully');

      // Success
      setLoading(false);
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess(analysisId);
      }
      console.log('Closing modal');
      handleClose();
    } catch (err) {
      console.error('Error creating soil analysis:', err);
      console.error('Error details:', err.message, err.code);
      setError(t('soilAnalysisWizard.errors.saveFailed', 'Failed to save soil analysis. Please try again.') + ` (${err.message})`);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setError(null);
    setAnalysisData({
      date: dayjs(),
      notes: '',
      laboratoryName: ''
    });
    setSamples([
      {
        id: Date.now(),
        sampleNumber: 1,
        depth: 30,
        pH: '',
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        organicMatter: ''
      }
    ]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <ScienceIcon />
          <Typography variant="h6">
            {t('soilAnalysisWizard.title', 'New Soil Analysis')}
          </Typography>
        </Box>
        {parcelName && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('soilAnalysisWizard.parcel', 'Parcel')}: {parcelName}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Step 1: Analysis Information */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {t('soilAnalysisWizard.analysisInfo', 'Analysis Information')}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={t('soilAnalysisWizard.date', 'Analysis Date')}
                      value={analysisData.date}
                      onChange={(newValue) => setAnalysisData({ ...analysisData, date: newValue })}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('soilAnalysisWizard.laboratoryName', 'Laboratory Name')}
                    value={analysisData.laboratoryName}
                    onChange={(e) => setAnalysisData({ ...analysisData, laboratoryName: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label={t('soilAnalysisWizard.notes', 'Notes')}
                    value={analysisData.notes}
                    onChange={(e) => setAnalysisData({ ...analysisData, notes: e.target.value })}
                    placeholder={t('soilAnalysisWizard.notesPlaceholder', 'Add any additional notes about this analysis...')}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Step 2: Add Samples */}
          {activeStep === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  {t('soilAnalysisWizard.soilSamples', 'Soil Samples')} ({samples.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddSample}
                  size="small"
                >
                  {t('soilAnalysisWizard.addSample', 'Add Sample')}
                </Button>
              </Box>

              {/* Samples List */}
              <Box sx={{ maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
                {samples.map((sample, index) => (
                  <Paper
                    key={sample.id}
                    elevation={2}
                    sx={{ p: 2, mb: 2, position: 'relative' }}
                  >
                    {/* Delete Button */}
                    {samples.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveSample(sample.id)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}

                    <Typography variant="subtitle1" gutterBottom color="primary" fontWeight="bold">
                      {t('soilAnalysisWizard.sampleNumber', 'Sample')} #{sample.sampleNumber}
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      {/* Depth */}
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label={t('soilAnalysisWizard.depth', 'Depth (cm)')}
                          value={sample.depth}
                          onChange={(e) => handleSampleChange(sample.id, 'depth', e.target.value)}
                          required
                          inputProps={{ min: 0, max: 200 }}
                        />
                      </Grid>

                      {/* pH */}
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label={t('soilAnalysisWizard.pH', 'pH')}
                          value={sample.pH}
                          onChange={(e) => handleSampleChange(sample.id, 'pH', e.target.value)}
                          required
                          inputProps={{ min: 0, max: 14, step: 0.1 }}
                        />
                      </Grid>

                      {/* Nitrogen */}
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label={t('soilAnalysisWizard.nitrogen', 'N (g/kg)')}
                          value={sample.nitrogen}
                          onChange={(e) => handleSampleChange(sample.id, 'nitrogen', e.target.value)}
                          required
                          inputProps={{ min: 0, step: 0.1 }}
                        />
                      </Grid>

                      {/* Phosphorus */}
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label={t('soilAnalysisWizard.phosphorus', 'P (mg/kg)')}
                          value={sample.phosphorus}
                          onChange={(e) => handleSampleChange(sample.id, 'phosphorus', e.target.value)}
                          required
                          inputProps={{ min: 0, step: 1 }}
                        />
                      </Grid>

                      {/* Potassium */}
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label={t('soilAnalysisWizard.potassium', 'K (mg/kg)')}
                          value={sample.potassium}
                          onChange={(e) => handleSampleChange(sample.id, 'potassium', e.target.value)}
                          required
                          inputProps={{ min: 0, step: 1 }}
                        />
                      </Grid>

                      {/* Organic Matter */}
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label={t('soilAnalysisWizard.organicMatter', 'OM (%)')}
                          value={sample.organicMatter}
                          onChange={(e) => handleSampleChange(sample.id, 'organicMatter', e.target.value)}
                          required
                          inputProps={{ min: 0, max: 100, step: 0.1 }}
                        />
                      </Grid>
                    </Grid>

                    {index < samples.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          {t('soilAnalysisWizard.cancel', 'Cancel')}
        </Button>

        {activeStep === 1 && (
          <Button onClick={handleBack} disabled={loading}>
            {t('soilAnalysisWizard.back', 'Back')}
          </Button>
        )}

        {activeStep === 0 && (
          <Button onClick={handleNext} variant="contained">
            {t('soilAnalysisWizard.next', 'Next')}
          </Button>
        )}

        {activeStep === 1 && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
          >
            {loading
              ? t('soilAnalysisWizard.saving', 'Saving...')
              : t('soilAnalysisWizard.save', 'Save Analysis')
            }
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SoilAnalysisWizard;
