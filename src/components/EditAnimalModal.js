import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  TextField,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { calculateAge, translateAgeString } from '../services/utils';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const EditAnimalModal = ({ open, onClose, onSave, row }) => {
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
      <DialogTitle sx={{ textAlign: 'center' }}>Edit Animal Info</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafafa', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="ID"
            value={animalId}
            onChange={e => setAnimalId(e.target.value)}
            fullWidth
            disabled
          />
          <DatePicker
            label="Birth Date"
            value={birthDate}
            onChange={setBirthDate}
            format="YYYY-MM-DD"
            slotProps={{ textField: { fullWidth: true } }}
          />
          <TextField
            label="Age"
            value={ageValue}
            fullWidth
            disabled
          />
          <TextField
            select
            label="Gender"
            value={gender}
            onChange={e => setGender(e.target.value)}
            fullWidth
          >
            {GENDER_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value} selected={gender === option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Treatment"
            value={treatment}
            onChange={e => setTreatment(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="Observation"
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
          Close
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog >
  );
};

export default EditAnimalModal;
