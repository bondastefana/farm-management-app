import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Box
} from '@mui/material';

const EditEmployeeModal = ({ open, onClose, employee, onSubmit }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ ...employee });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setForm({ ...employee });
  }, [employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(t('errorEditingEmployee') || 'Error editing employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" textAlign="center">
          {t('editEmployee')}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ py: 2 }}>
          <TextField
            label={t('firstName')}
            name="firstName"
            value={form.firstName || ''}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label={t('lastName')}
            name="lastName"
            value={form.lastName || ''}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!form.isAdmin}
                onChange={handleChange}
                name="isAdmin"
              />
            }
            label={t('isAdmin')}
          />
          <TextField
            label={t('role')}
            name="role"
            value={form.role || ''}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label={t('userName')}
            name="userName"
            value={form.userName || ''}
            onChange={handleChange}
            fullWidth
            required
            disabled
          />
          <TextField
            label={t('password')}
            name="password"
            type="password"
            value={form.password || ''}
            onChange={handleChange}
            fullWidth
            required
          />
          {error && <Box color="error.main">{error}</Box>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>{t('cancel')}</Button>
        <Button onClick={handleSubmit} disabled={loading} variant="contained" color="primary">
          {t('submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeModal;
