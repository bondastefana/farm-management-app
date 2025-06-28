import React, { useState } from 'react';
import { t } from 'i18next';
import {
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { useLoading } from '../contexts/LoadingContext';
import useAlert from '../hooks/useAlert';
import { addAnimal } from '../services/farmService';
import { COW, HORSE } from '../services/constants'

const initialState = {
  animalId: '',
  birthDate: '',
  gender: '',
  treatment: '',
  observation: '',
  species: '',
}

const AddAnimalForm = ({ refetchAllAnimals }) => {
  const { setLoading } = useLoading();
  const { showAlert, AlertComponent } = useAlert();
  const [formData, setFormData] = useState(initialState);

  const handleChange = (field) => (event) => {
    console.log('handleChange', field, event.target.value);
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAnimal = async () => {
    if (!formData.species) {
      showAlert(t('species') + ' ' + t('is_required'), 'error');
      return;
    }
    if (!formData.animalId) {
      showAlert(t('nr_crt') + ' ' + t('is_required'), 'error');
      return;
    }
    if (!formData.birthDate) {
      showAlert(t('birth_date') + ' ' + t('is_required'), 'error');
      return;
    }
    // Validate date
    const birthDateTimestamp = new Date(formData.birthDate).getTime();
    if (isNaN(birthDateTimestamp)) {
      showAlert(t('birth_date') + ' ' + t('is_required'), 'error');
      return;
    }
    if (!formData.gender) {
      showAlert(t('gender') + ' ' + t('is_required'), 'error');
      return;
    }
    if (!formData.treatment) {
      showAlert(t('treatment') + ' ' + t('is_required'), 'error');
      return;
    }
    if (!formData.observation) {
      showAlert(t('observations') + ' ' + t('is_required'), 'error');
      return;
    }
    console.log('formData', formData);
    const speciesKey = formData.species; // now always 'cow' or 'horse'
    const dataToSave = {
      animalId: formData.animalId,
      birthDate: birthDateTimestamp, // always a valid timestamp
      gender: formData.gender,
      treatment: formData.treatment,
      observation: formData.observation,
      species: speciesKey,
    };

    setLoading(true);
    try {
      const isAnimalSaved = await addAnimal(dataToSave, speciesKey);
      if (isAnimalSaved) {
        await refetchAllAnimals();
        setLoading(false);
        showAlert(t('animal_save_success'), 'success');
        setFormData(initialState);
        const tableElement = document.getElementById(speciesKey);
        if (tableElement) tableElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        setLoading(false);
        showAlert(t('animal_save_error'), 'error');
      }
    } catch (e) {
      setLoading(false);
      showAlert(t('animal_save_error'), 'error');
    }
  };

  const generateSpecies = () => {
    return [
      { key: 'cow', label: t(COW) },
      { key: 'horse', label: t(HORSE) }
    ].map(({ key, label }) => (
      <MenuItem value={key} key={key}>{label}</MenuItem>
    ));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          {t('add_animal')}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label={t('species')}
              fullWidth
              value={formData.species}
              onChange={handleChange('species')}
              InputLabelProps={{ shrink: true }}
              required
            >
              {generateSpecies()}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label={t('nr_crt')}
              fullWidth
              value={formData.animalId}
              onChange={handleChange('animalId')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label={t('birth_date')}
              type="date"
              fullWidth
              value={formData.birthDate}
              onChange={handleChange('birthDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label={t('gender')}
              fullWidth
              value={formData.gender}
              onChange={handleChange('gender')}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>

          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label={t('treatment')}
              fullWidth
              value={formData.treatment}
              multiline
              rows={5}
              onChange={handleChange('treatment')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label={t('observations')}
              fullWidth
              multiline
              rows={5}
              value={formData.observation}
              onChange={handleChange('observation')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSaveAnimal} sx={{ mt: 2 }}>
            {t('save')}
          </Button>
        </Box>
      </Paper>
      {AlertComponent}
    </Box>
  );
};

export default React.memo(AddAnimalForm);