import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { calculateAge, translateAgeString } from '../services/utils';
import { useTranslation } from 'react-i18next';

const GENDER_OPTIONS = [
  { value: 'male', label: 'male' },
  { value: 'female', label: 'female' },
];

const EditAnimalModal = ({ open, onClose, onSave, row }) => {
  const { t } = useTranslation();
  const [animalId, setAnimalId] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState('');
  const [treatment, setTreatment] = useState('');
  const [observation, setObservation] = useState('');

  useEffect(() => {
    if (open && row) {
      setAnimalId(row.animalId || '');
      setBirthDate(row.birthDate ? dayjs(row.birthDate) : null);
      // Normalize gender to 'male' or 'female' for dropdown, handling spaces and casing
      let normalizedGender = '';
      if (row.gender) {
        const lower = row.gender.toString().trim().toLowerCase();
        if (lower === 'male' || lower === 'female') {
          normalizedGender = lower;
        }
      }
      setGender(normalizedGender);
      setTreatment(row.treatment || '');
      setObservation(row.observation || '');
    } else if (!open) {
      setGender('');
    }
  }, [open, row]);

  // Calculate age using utils.js functions
  let ageValue = '';
  if (birthDate) {
    // Use the same logic as generateRows: pass a Unix timestamp in seconds
    const unixTimestamp = birthDate.unix();
    const rawAge = calculateAge(unixTimestamp);
    ageValue = translateAgeString(rawAge);
  } else if (row && row.age) {
    ageValue = row.age;
  }

  const handleSave = useCallback(() => {
    onSave({
      ...row,
      animalId,
      birthDate: birthDate ? birthDate.format('YYYY-MM-DD') : '',
      age: ageValue,
      gender,
      treatment,
      observation,
    });
  }, [onSave, row, animalId, birthDate, ageValue, gender, treatment, observation]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{t('edit_animal_modal_title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2, border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('id')}
            value={animalId}
            onChange={e => setAnimalId(e.target.value)}
            fullWidth
            disabled
          />
          <DatePicker
            label={t('birth_date')}
            value={birthDate}
            onChange={setBirthDate}
            format="YYYY-MM-DD"
            slotProps={{ textField: { fullWidth: true } }}
          />
          <TextField
            label={t('age')}
            value={ageValue}
            fullWidth
            disabled
          />
          <TextField
            select
            label={t('gender')}
            value={gender}
            onChange={e => setGender(e.target.value)}
            fullWidth
          >
            {GENDER_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value} selected={gender === option.value}>
                {t(option.value)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('treatment')}
            value={treatment}
            onChange={e => setTreatment(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label={t('observation')}
            value={observation}
            onChange={e => setObservation(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} color="inherit" variant="contained">
          {t('close')}
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog >
  );
};

export default React.memo(EditAnimalModal);
