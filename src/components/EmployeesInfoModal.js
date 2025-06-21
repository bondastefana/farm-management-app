import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Box, ListItem, ListItemText, ListItemIcon, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { getFormattedDate } from '../services/utils';

const EmployeesInfoModal = ({ employee = {}, open, setViewEmployee }) => {
  const [isOpen, setOpen] = useState(open);
  const { t } = useTranslation(); // 't' is the translation function

  const handleClose = () => {
    setViewEmployee(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{t('employeeDetails')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountCircleIcon sx={{ fontSize: 60 }} />
          <Box>
            <Typography variant="h6">{`${employee.firstName} ${employee.lastName}`}</Typography>
            <Typography variant="body1">{t('role')}: {employee.role}</Typography>
            <Typography variant="body1">{t('employmentDate')}: {getFormattedDate(employee?.employmentDate?.seconds, false)}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeesInfoModal;
