import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DeleteEmployeeModal = ({ open, onClose, employee, onSubmit, loading }) => {
  const { t } = useTranslation();
  if (!employee) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{t('deleteEmployee')}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2, textAlign: 'center' }}>
          {t('deleteEmployeeConfirm') || t('Are you sure you want to delete this employee?')}
        </Typography>
        <Box sx={{
          borderLeft: (theme) => `4px solid ${employee.isAdmin ? theme.palette.error.main : theme.palette.info.main}`,
          pl: 2,
          mb: 2,
          bgcolor: 'background.default',
          borderRadius: 1,
          py: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <WarningAmberIcon sx={{ color: 'warning.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{employee.firstName} {employee.lastName}</Typography>
            <Chip label={employee.isAdmin ? t('isAdmin') : (employee.role)} size="small" color={employee.isAdmin ? 'warning' : 'default'} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('userName')}: <b>{employee.userName}</b></Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('role')}: <b>{employee.role || '-'}</b></Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('isAdmin')}: <b>{employee.isAdmin ? t('yes') : t('no')}</b></Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} color="inherit" variant="contained" disabled={loading}>{t('cancel')}</Button>
        <Button onClick={() => onSubmit(employee)} color="error" variant="contained" disabled={loading}>{t('delete')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(DeleteEmployeeModal);
