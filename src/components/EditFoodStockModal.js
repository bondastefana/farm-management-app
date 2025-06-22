import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFoodTypes } from './FoodStockTables';
import { updateFoodStock } from '../services/farmService';
import { Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import useAlert from '../hooks/useAlert';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 520,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function EditFoodStockModal({ open, onClose, row, onSave }) {
  const { t } = useTranslation();
  const foodTypes = useFoodTypes();
  const [form, setForm] = useState(row || {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { showAlert, AlertComponent } = useAlert();

  React.useEffect(() => {
    setForm(row || {});
  }, [row]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    setForm((prev) => ({ ...prev, lastModifiedDate: e.target.value }));
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      let lastModifiedDate = form.lastModifiedDate;
      // Use the same logic as AddFoodStockForm: convert to Firestore Timestamp
      if (typeof lastModifiedDate === 'string') {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (lastModifiedDate && dateRegex.test(lastModifiedDate)) {
          // Use new Date(lastModifiedDate) for UTC midnight
          const jsDate = new Date(lastModifiedDate);
          if (isNaN(jsDate.getTime())) {
            setError(t('foodStock.error.invalidDate'));
            setSaving(false);
            return;
          }
          lastModifiedDate = Timestamp.fromDate(jsDate);
        } else {
          setError(t('foodStock.error.invalidDateFormat'));
          setSaving(false);
          return;
        }
      } else if (lastModifiedDate && lastModifiedDate.seconds) {
        // Already a Firestore Timestamp
        lastModifiedDate = Timestamp.fromMillis(lastModifiedDate.seconds * 1000);
      } else if (!lastModifiedDate) {
        setError(t('foodStock.error.dateRequired'));
        setSaving(false);
        return;
      }
      const updatedData = {
        ...form,
        quantity: Number(form.quantity),
        lastModifiedDate,
      };
      await updateFoodStock(form.id, updatedData);
      setSaving(false);
      showAlert(t('foodStock.success.edit'), 'success');
      if (onSave) onSave(form.id, updatedData);
      onClose();
    } catch (err) {
      setError(t('foodStock.error.saveFailed'));
      setSaving(false);
    }
  };

  const foodType = foodTypes.find(t => t.id === form.type);
  const emoji = foodType ? foodType.emoji : '';

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ ...style, bgcolor: (theme) => theme.palette.paper?.main || '#f5efe1' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {t('foodStock.editTitle')}{emoji && <span style={{ fontSize: 28, marginLeft: 8 }}>{emoji}</span>}
            </Typography>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </Box>
          <TextField
            label={t('foodStock.name')}
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label={t('foodStock.quantity')}
            name="quantity"
            type="number"
            value={form.quantity || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label={t('foodStock.lastModified')}
            name="lastModifiedDate"
            type="date"
            value={
              form.lastModifiedDate
                ? (typeof form.lastModifiedDate === 'string'
                  ? form.lastModifiedDate
                  : (form.lastModifiedDate.seconds
                    ? new Date(form.lastModifiedDate.seconds * 1000).toISOString().slice(0, 10)
                    : ''))
                : ''
            }
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label={t('foodStock.observation')}
            name="observation"
            value={form.observation || ''}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            select
            label={t('foodStock.type')}
            name="type"
            value={form.type || ''}
            onChange={handleChange}
            fullWidth
          >
            {foodTypes.map(type => (
              <MenuItem key={type.id} value={type.id}>{type.label} {type.emoji}</MenuItem>
            ))}
          </TextField>
          {error && <Typography color="error" mt={2}>{error}</Typography>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={onClose} color="secondary" variant="contained" disabled={saving}>{t('common.cancel')}</Button>
            <Button onClick={handleSave} color="primary" variant="contained" disabled={saving}>{saving ? t('common.saving') : t('common.save')}</Button>
          </Box>
        </Box>
      </Modal>
      {AlertComponent}
    </>
  );
}
