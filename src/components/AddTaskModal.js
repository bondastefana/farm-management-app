import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import { fetchEmployees } from '../services/farmService';
import { useLoading } from '../contexts/LoadingContext';
import useAlert from '../hooks/useAlert';
import { t } from 'i18next';

const AddTaskModal = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [completed, setCompleted] = useState(false);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [employees, setEmployees] = useState([]);
  const { loading, setLoading } = useLoading();
  const { showAlert, AlertComponent } = useAlert();

  useEffect(() => {
    if (open) {
      fetchEmployees().then(setEmployees);
    }
  }, [open]);

  const handleSave = useCallback(async () => {
    if (!title || !description || !assignee || !date) return;
    setLoading(true);
    await onSave({
      title,
      description,
      assignee, // userName only
      completed,
      date: { seconds: Math.floor(new Date(date).getTime() / 1000) },
    });
    setTitle("");
    setDescription("");
    setAssignee("");
    setCompleted(false);
    setDate(dayjs().format('YYYY-MM-DD'));
    setLoading(false);
    showAlert(t('add_task_success'), 'success');
  }, [title, description, assignee, date, completed, setLoading, onSave, showAlert]);

  const handleClose = useCallback(() => {
    setTitle("");
    setDescription("");
    setAssignee("");
    setCompleted(false);
    setDate(dayjs().format('YYYY-MM-DD'));
    setLoading(false);
    onClose();
  }, [setLoading, onClose]);

  const isFormValid = title && description && assignee && date;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('add_new_task')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label={t('title')}
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />
          <TextField
            label={t('description')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            required
            disabled={loading}
          />
          <FormControl fullWidth required disabled={loading}>
            <InputLabel id="assignee-label">{t('assignee')}</InputLabel>
            <Select
              labelId="assignee-label"
              value={assignee}
              label={t('assignee')}
              onChange={e => setAssignee(e.target.value)}
            >
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.userName}>
                  {emp.userName} ({emp.firstName} {emp.lastName})
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
            disabled={loading}
          />
          <FormControlLabel
            control={<Checkbox checked={completed} onChange={e => setCompleted(e.target.checked)} disabled={loading} />}
            label={t('completed')}
          />
        </Box>
        {AlertComponent}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="contained" disabled={loading}>{t('cancel')}</Button>
        <Box sx={{ position: 'relative' }}>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={loading || !isFormValid}>{t('add_task')}</Button>
          {loading && (
            <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(AddTaskModal);
