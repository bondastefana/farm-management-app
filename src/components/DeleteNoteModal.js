import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { t } from 'i18next';

const DeleteNoteModal = ({ open, onClose, onConfirm, title, description, note }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
        <Typography
          sx={{
            fontStyle: 'italic',
            borderLeft: '4px solid #ccc',
            paddingLeft: 2,
            color: 'text.secondary',
          }}
        >
          {note?.content}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} color="inherit">
          {t('cancel')}
        </Button>
        <Button onClick={() => onConfirm(note.id)} color="error" variant="contained">
          {t('delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(DeleteNoteModal);