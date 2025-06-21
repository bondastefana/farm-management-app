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
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useLoading } from '../contexts/LoadingContext';
import { deleteNote, updateNote, addNote } from "../services/farmService";
import { getFormattedDate } from '../services/utils';
import DeleteNoteModal from './DeleteNoteModal';
import EditNoteModal from './EditNoteModal';
import AddNoteModal from './AddNoteModal';

import useAlert from '../hooks/useAlert';


const Notes = ({ notes = [], fetchNotesInfo }) => {
  const { t } = useTranslation(); // 't' is the translation function
  const [deletedNote, setDeletedNote] = React.useState(null);
  const [editedNote, setEditedNote] = React.useState(null);
  const [addedNote, setAddedNote] = React.useState(false);
  const { setLoading } = useLoading();
  const { showAlert, AlertComponent } = useAlert();

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
      showAlert('Notita a fost stearsa cu succes');
    }
  }, [fetchNotesInfo, setLoading, showAlert])

  // NEW
  const handleAddNote = React.useCallback(async (note) => {
    setAddedNote(true);
  }, [])
  const handleAddNoteClosed = React.useCallback(() => {
    setAddedNote(null);
  }, [])
  const handleAddNoteSave = React.useCallback(async (content) => {
    setLoading(true);
    const newNote = {
      content: content,
      date: new Date(Date.now()),
      userId: "admin"
    }
    const isNoteSaved = await addNote(newNote);
    if (isNoteSaved) {
      setAddedNote(false);
      await fetchNotesInfo();
      setLoading(false);
      showAlert('Notita a fost salvata cu succes');
    }
  }, [fetchNotesInfo, setLoading, showAlert])

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
      showAlert('Notita a fost editata cu succes');
    }
  }, [editedNote, fetchNotesInfo, setLoading, showAlert])


  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          maxHeight: 300,
          minHeight: 300,
          overflow: 'auto',
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}  >
          <Typography
            align="center"
            variant="h4"
            mr={1}
          >
            {t('notes')}
          </Typography>
          <IconButton onClick={handleAddNote} >
            <PlaylistAddIcon />
          </IconButton>
        </Box>
        {notes?.map((note, index) => {
          return (
            <span key={index}>
              <ListItem>
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
                    secondary={(getFormattedDate(note.date.seconds))}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%'
                  }}>
                  <IconButton
                    sx={{ marginRight: 1 }}
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditNote(note)}>
                    <ModeIcon />
                  </IconButton>
                  <IconButton
                    sx={{ marginRight: 1 }}
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteNote(note)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
              <Divider variant="middle" />
            </span>
          )
        })}
      </Paper >
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
      <AddNoteModal
        open={!!addedNote}
        note={addedNote}
        onClose={handleAddNoteClosed}
        onSave={handleAddNoteSave}
      />

      {AlertComponent}
    </>
  );
};

export default Notes;
