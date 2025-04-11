import React from "react";
import { useTranslation } from "react-i18next";
import {
  Typography,
  ListItem,
  IconButton,
  Paper,
  ListItemText,
  Box,
  Divider
} from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';

import { useLoading } from '../contexts/LoadingContext';
import { deleteNote, updateNote } from "../services/farmService";
import DeleteNoteModal from './DeleteNoteModal';
import EditNoteModal from './EditNoteModal';


const Notes = ({ notes = [], fetchNotesInfo }) => {
  const { t } = useTranslation(); // 't' is the translation function
  const [deletedNote, setDeletedNote] = React.useState(null);
  const [editedNote, setEditedNote] = React.useState(null);
  const { setLoading } = useLoading();

  // DELETE
  const handleDeleteNote = React.useCallback(async (note) => {
    setDeletedNote(note);
  }, [])
  const handleDeleteClosed = React.useCallback(() => {
    setDeletedNote(null);
  }, [])
  const handleDeleteConfirm = React.useCallback(async (noteId) => {
    setLoading(true);
    const isDeleted = await deleteNote(noteId);
    if (isDeleted) {
      setDeletedNote(null);
      await fetchNotesInfo();
      setLoading(false);
    }
  }, [fetchNotesInfo, setLoading])

  // EDIT
  const handleEditNote = React.useCallback(async (note) => {
    setEditedNote(note);
  }, [])
  const handleEditClosed = React.useCallback(() => {
    setEditedNote(null);
  }, [])
  const handleEditConfirm = React.useCallback(async (editedContentNote) => {
    setLoading(true);
    const editedNoteInfo = {
      ...editedNote,
      content: editedContentNote,
    }
    const isEdited = await updateNote(editedNote.id, editedNoteInfo);
    if (isEdited) {
      setEditedNote(null);
      await fetchNotesInfo();
      setLoading(false);
    }
  }, [editedNote, fetchNotesInfo, setLoading])


  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: 3
        }}>
        <Typography align="center" variant="h4">{t('notes')}</Typography>
        {notes?.map((note, index) => {
          const date = new Date(note.date.seconds);
          const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
          return (
            <>
              <ListItem
                key={index}
              >
                <Box>
                  <ListItemText
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    primary={note.content}
                  />
                  <ListItemText
                    secondary={formattedDate}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                  <IconButton sx={{ marginRight: 1 }} edge="end" aria-label="edit" onClick={() => handleEditNote(note)}>
                    <ModeIcon />
                  </IconButton>
                  <IconButton sx={{ marginRight: 1 }} edge="end" aria-label="delete" onClick={() => handleDeleteNote(note)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
              <Divider variant="middle" />
            </>
          )
        })}
      </Paper>
      <DeleteNoteModal
        open={!!deletedNote}
        note={deletedNote}
        onClose={handleDeleteClosed}
        onConfirm={handleDeleteConfirm}
        title={t('delete')}
        description={t('deleteNoteModalDescription')}
      />
      <EditNoteModal
        open={!!editedNote}
        note={editedNote}
        onClose={handleEditClosed}
        onSave={handleEditConfirm}
      />
    </>
  );
};

export default Notes;
