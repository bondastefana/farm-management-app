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

const ShowAnimalModal = ({ open, onClose, row }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Animal Details</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafafa' }}>
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
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowAnimalModal;
