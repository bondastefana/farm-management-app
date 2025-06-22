import { useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const useAlert = (duration = 6000) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const showAlert = useCallback((msg, type = 'success') => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  }, []);

  const closeAlert = () => {
    setOpen(false);
  };

  const AlertComponent = (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={closeAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={closeAlert}
        severity={severity}
        sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );

  return { showAlert, AlertComponent };
};

export default useAlert;