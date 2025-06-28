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
import { Timestamp } from 'firebase/firestore';
import { addDoc, collection } from 'firebase/firestore';
import db from '../firebase/firebaseConfig';
import useAlert from '../hooks/useAlert';
import { useLoading } from '../contexts/LoadingContext';

const AddEmployeeModal = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { showAlert, AlertComponent } = useAlert();
  const { setLoading } = useLoading();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    isAdmin: false,
    userName: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');

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
    showAlert(t('loading'), 'info');
    try {
      // Add to authentication collection
      const authRef = collection(db, 'authentication');
      const usersRef = collection(db, 'users');
      const authData = {
        firstName: form.firstName,
        lastName: form.lastName,
        isAdmin: form.isAdmin,
        userName: form.userName,
        password: form.password,
        role: form.role
      };
      const userData = {
        ...authData,
        employmentDate: Timestamp.now()
      };
      await addDoc(authRef, authData);
      await addDoc(usersRef, userData);
      showAlert(t('employeeAddSuccess'), 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(t('errorAddingEmployee') || 'Error adding employee');
      showAlert(t('employeeAddError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.firstName && form.lastName && form.role && form.userName && form.password;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" textAlign="center">
          {t('addEmployee')}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ py: 2 }}>
          <TextField
            label={t('firstName')}
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label={t('lastName')}
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.isAdmin}
                onChange={handleChange}
                name="isAdmin"
              />
            }
            label={t('isAdmin')}
          />
          <TextField
            label={t('role')}
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label={t('userName')}
            name="userName"
            value={form.userName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label={t('password')}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
          />
          {error && <Box color="error.main">{error}</Box>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!isFormValid}>
          {t('submit')}
        </Button>
      </DialogActions>
      {AlertComponent}
    </Dialog>
  );
};

export default AddEmployeeModal;
