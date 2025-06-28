import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import { useTranslation } from 'react-i18next';

const DeleteTaskModal = ({ open, onClose, onConfirm, task }) => {
  const { t } = useTranslation();
  if (!task) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{t('delete')}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>{t('deleteNoteModalDescription')}</Typography>
        <Box sx={{
          borderLeft: '4px solid #ccc',
          pl: 2,
          mb: 2,
          bgcolor: 'background.default',
          borderRadius: 1,
          py: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {task.completed ? (
              <AssignmentTurnedInIcon color="success" />
            ) : (
              <AssignmentLateIcon color="warning" />
            )}
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{task.title}</Typography>
            <Chip label={task.completed ? t('completed_task') : t('pending')} size="small" color={task.completed ? 'success' : 'warning'} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{task.description}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {t('assignee_task')}: <b>{task.assignee || 'N/A'}</b>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {t('date')}: {task.date && task.date.seconds ? new Date(task.date.seconds * 1000).toLocaleDateString() : 'N/A'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} color="inherit" variant="contained">{t('cancel_task')}</Button>
        <Button onClick={() => onConfirm(task.id)} color="error" variant="contained">{t('delete')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(DeleteTaskModal);
