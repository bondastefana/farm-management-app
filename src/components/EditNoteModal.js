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

const EditNoteModal = ({ open, onClose, note, onSave }) => {
  const [editedNote, setEditedNote] = useState("");
  const { t } = useTranslation();

  React.useEffect(() => {
    if (note) {
      setEditedNote(note.content || "");
    }
  }, [note]);

  const handleSave = () => {
    onSave(editedNote);
    onClose();
  };

  const handleChange = (e) => {
    setEditedNote(e.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{t('editNoteModalTitle')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {t('editNoteModalDescription')}
        </Typography>
        <TextField
          autoFocus
          fullWidth
          multiline
          rows={4}
          value={editedNote}
          onChange={handleChange}
          variant="outlined"
          label={t("noteContentModalLabel")}
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

export default React.memo(EditNoteModal);