import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from "react-i18next";

const AddNoteModal = ({ open, onClose, note, onSave }) => {
  const [addNote, setAddNote] = useState("");
  const { t } = useTranslation();

  React.useEffect(() => {
    if (note) {
      setAddNote(note.content || "");
    }
  }, [note]);

  const handleSave = () => {
    onSave(addNote);
    onClose();
  };

  const handleNoteChange = (e) => {
    setAddNote(e.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{t('addNoteModalTitle')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {t('addNoteModalDescription')}
        </Typography>
        <TextField
          autoFocus
          fullWidth
          multiline
          rows={4}
          value={addNote}
          onChange={handleNoteChange}
          variant="contained"
          label={t('addNoteModalContent')}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} color="inherit">
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );

};

export default AddNoteModal;