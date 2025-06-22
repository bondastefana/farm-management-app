import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, MenuItem } from '@mui/material';
import { addFoodStock } from '../services/farmService';
import { useFoodTypes } from './FoodStockTables';
import { useTranslation } from 'react-i18next';

export default function AddFoodStockForm({ onAdd }) {
  const { t } = useTranslation();
  const foodTypes = useFoodTypes();
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    lastModifiedDate: '',
    observation: '',
    type: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.quantity || !form.lastModifiedDate || !form.type) {
      setError(t('foodStock.error.requiredFields'));
      return;
    }
    setSaving(true);
    const newStock = {
      ...form,
      quantity: Number(form.quantity),
      lastModifiedDate: new Date(form.lastModifiedDate),
    };
    const result = await addFoodStock(newStock);
    setSaving(false);
    if (result) {
      setForm({ name: '', quantity: '', lastModifiedDate: '', observation: '', type: '' });
      if (onAdd) onAdd();
    } else {
      setError(t('foodStock.error.addFailed'));
    }
  };

  return (
    <Paper sx={{ mb: 4, p: { xs: 2, sm: 4 }, maxWidth: 700, mx: 'auto', boxShadow: 6, borderRadius: 3 }} elevation={6}>
      <Typography variant="h5" mb={2} sx={{ textAlign: 'center', letterSpacing: 1 }}>
        {t('foodStock.addTitle')}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' }, minWidth: 0, flexGrow: 1 }}>
            <TextField
              label={t('foodStock.name')}
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{ sx: { borderRadius: 2, background: '#fff' } }}
              sx={{ mb: { xs: 2, sm: 0 } }}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' }, minWidth: 0, flexGrow: 1 }}>
            <TextField
              label={t('foodStock.quantity')}
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{ sx: { borderRadius: 2, background: '#fff' }, min: 0 }}
              sx={{ mb: { xs: 2, sm: 0 } }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' }, minWidth: 0, flexGrow: 1 }}>
            <TextField
              label={t('foodStock.lastModified')}
              name="lastModifiedDate"
              type="date"
              value={form.lastModifiedDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              variant="outlined"
              InputProps={{ sx: { borderRadius: 2, background: '#fff' } }}
              sx={{ mb: { xs: 2, sm: 0 } }}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' }, minWidth: 0, flexGrow: 1 }}>
            <TextField
              select
              label={t('foodStock.type')}
              name="type"
              value={form.type}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{ sx: { borderRadius: 2, background: '#fff' } }}
              sx={{ mb: { xs: 2, sm: 0 } }}
            >
              {foodTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>{type.label} {type.emoji}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            label={t('foodStock.observation')}
            name="observation"
            value={form.observation}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
            variant="outlined"
            InputProps={{ sx: { borderRadius: 2, background: '#fff' } }}
          />
        </Box>
        {error && <Typography color="error" mt={2} sx={{ textAlign: 'center' }}>{error}</Typography>}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button type="submit" variant="contained" color="primary" disabled={saving} size="large" sx={{ px: 5, borderRadius: 2, fontWeight: 600, boxShadow: 2 }}>
            {saving ? t('common.saving') : t('foodStock.addButton')}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
