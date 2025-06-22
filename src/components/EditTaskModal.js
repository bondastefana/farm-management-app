import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import { fetchEmployees } from '../services/farmService';
import { useLoading } from '../contexts/LoadingContext';
import { useTranslation } from 'react-i18next';
import { useIsAdmin } from '../contexts/IsAdminContext';

const EditTaskModal = ({ open, onClose, onSave, task }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [assignee, setAssignee] = useState(task?.assignee || "");
  const [completed, setCompleted] = useState(!!task?.completed);
  const [date, setDate] = useState(task?.date ? dayjs.unix(task.date.seconds).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
  const [employees, setEmployees] = useState([]);
  const { loading, setLoading } = useLoading();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (open) {
      fetchEmployees().then(setEmployees);
      setTitle(task?.title || "");
      setDescription(task?.description || "");
      setAssignee(task?.assignee || "");
      setCompleted(!!task?.completed);
      setDate(task?.date ? dayjs.unix(task.date.seconds).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    }
  }, [open, task]);

  const handleSave = useCallback(async () => {
    if (!title || !description || !assignee || !date) return;
    setLoading(true);
    await onSave({
      ...task,
      title,
      description,
      assignee, // userName only
      completed,
      date: { seconds: Math.floor(new Date(date).getTime() / 1000) },
    });
    setLoading(false);
  }, [title, description, assignee, date, completed, setLoading, onSave, task]);

  const handleClose = useCallback(() => {
    setLoading(false);
    onClose();
  }, [setLoading, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('edit')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label={t('title')}
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            required
            disabled={!isAdmin || loading}
          />
          <TextField
            label={t('description_task')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            required
            disabled={!isAdmin || loading}
          />
          <FormControl fullWidth required disabled={!isAdmin || loading}>
            <InputLabel id="assignee-label">{t('assignee_task')}</InputLabel>
            <Select
              labelId="assignee-label"
              value={assignee}
              label={t('assignee_task')}
              onChange={e => setAssignee(e.target.value)}
            >
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.userName}>
                  {emp.firstName} {emp.lastName} ({emp.userName})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('date')}
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            disabled={!isAdmin || loading}
          />
          <FormControlLabel
            control={<Checkbox checked={completed} onChange={e => setCompleted(e.target.checked)} disabled={loading} />}
            label={t('completed_task')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="contained" disabled={loading}>{t('cancel_task')}</Button>
        <Box sx={{ position: 'relative' }}>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>{t('save')}</Button>
        </Box>
      </DialogActions>
      {loading && (
        <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />
      )}
    </Dialog>
  );
};

export default EditTaskModal;
