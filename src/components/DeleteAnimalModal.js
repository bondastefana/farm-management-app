import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider
} from '@mui/material';

const DeleteAnimalModal = ({ open, onClose, onConfirm, row }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to delete this animal?
        </Typography>
        <Box sx={{ p: 2, border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2, bgcolor: 'background.elevated' }}>
          <Typography variant="body2"><strong>ID:</strong> {row?.animalId}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2"><strong>Birth Date:</strong> {row?.birthDate}</Typography>
          <Typography variant="body2"><strong>Age:</strong> {row?.age}</Typography>
          <Typography variant="body2"><strong>Gender:</strong> {row?.gender}</Typography>
          <Typography variant="body2"><strong>Treatment:</strong> {row?.treatment}</Typography>
          <Typography variant="body2"><strong>Observation:</strong> {row?.observation}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} color="inherit">
          No
        </Button>
        <Button onClick={() => onConfirm(row?.id)} color="error" variant="contained">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(DeleteAnimalModal);
