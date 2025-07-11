import React from "react";
import { useTranslation } from "react-i18next";
import {
  Typography,
  ListItem,
  IconButton,
  Paper,
  Box,
  Divider,
  Tooltip
} from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';
import AddIcon from '@mui/icons-material/Add';
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
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    const newNote = {
      content: content,
      date: new Date(Date.now()),
      userName: authUser.username || ''
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

  // Get logged-in username
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  const loggedInUsername = authUser.username || '';
  // Filter notes for logged-in user only
  const userNotes = notes?.filter(note => note.userName === loggedInUsername);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          pt: 0,
          pb: 3,
          px: 2,
          maxHeight: 300,
          minHeight: 300,
          overflow: 'auto',
          pr: 'calc(24px / 2)', // half default padding if scrollbar is visible
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            pb: 1,
            backgroundColor: 'inherit',
          }}  >
          <Box component="span" sx={{ fontSize: 22, mr: 1 }} role="img" aria-label="note">📝</Box>
          <Typography
            align="center"
            variant="h4"
            mr={1}
          >
            {t('notes')}
          </Typography>
          <IconButton onClick={handleAddNote} >
            <AddIcon />
          </IconButton>
        </Box>
        {userNotes?.map((note, index) => {
          return (
            <span key={index}>
              <ListItem
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 0,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                      display: 'block',
                    }}
                  >
                    {getFormattedDate(note.date.seconds)}
                  </Typography>
                  <Tooltip title={note.content} placement="top" arrow>
                    <Typography
                      variant="body1"
                      noWrap
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        display: 'block',
                      }}
                    >
                      {note.content}
                    </Typography>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexShrink: 0 }}>
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
              <Divider sx={{ width: '100%' }} />
            </span >
          )
        })}
      </Paper >
      {!!deletedNote && (<DeleteNoteModal
        open={!!deletedNote}
        note={deletedNote}
        onClose={handleDeleteClosed}
        onConfirm={handleDeleteConfirm}
        title={t('delete')}
        description={t('deleteNoteModalDescription')}
      />)}
      {!!editedNote && (<EditNoteModal
        open={!!editedNote}
        note={editedNote}
        onClose={handleEditClosed}
        onSave={handleEditConfirm}
      />)}
      {!!addedNote && (<AddNoteModal
        open={!!addedNote}
        note={addedNote}
        onClose={handleAddNoteClosed}
        onSave={handleAddNoteSave}
      />)}

      {AlertComponent}
    </>
  );
};

export default React.memo(Notes);
