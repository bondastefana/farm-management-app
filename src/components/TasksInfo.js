import React, { useState, useCallback } from "react";
import { Paper, Typography, List, ListItem, ListItemText, Box, Chip, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import DeleteTaskModal from './DeleteTaskModal';
import { addTask, updateTask, deleteTask, fetchTasks, formatDate } from '../services/farmService';
import EditIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from "react-i18next";
import { useIsAdmin } from '../contexts/IsAdminContext';
import useAlert from '../hooks/useAlert';

const TasksInfo = ({ tasks, fetchTasksInfo }) => {
  const { t } = useTranslation();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const isAdmin = useIsAdmin();
  const [allTasks, setAllTasks] = useState([]);
  const { showAlert, AlertComponent } = useAlert();

  // Always sync allTasks with tasks prop on mount and when tasks changes
  React.useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    setAllTasks(isAdmin ? (tasks || []) : (tasks || [])
      .filter(t => t.assignee === authUser.username)
      .sort((a, b) => b.date.seconds - a.date.seconds));
  }, [tasks, isAdmin, allTasks]);

  // Poll for new tasks every 30 seconds
  React.useEffect(() => {
    let mounted = true;
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    const poll = async () => {
      const newTasks = await fetchTasks();
      const filteredNewTasks = isAdmin ? newTasks : newTasks
        .filter(t => t.assignee === authUser.username)
        .sort((a, b) => b.date.seconds - a.date.seconds);
      if (mounted) setAllTasks(filteredNewTasks);
    };
    poll(); // initial fetch
    const intervalId = setInterval(poll, 30000);
    return () => { mounted = false; clearInterval(intervalId); };
  }, [isAdmin]);

  const handleAddTask = useCallback(async (task) => {
    await addTask(task);
    setAddModalOpen(false);
    showAlert(t('add_task_success'), 'success');
    if (fetchTasksInfo) fetchTasksInfo();
  }, [fetchTasksInfo, showAlert, t]);

  const handleEditTask = useCallback(async (updatedTask) => {
    await updateTask(updatedTask.id, updatedTask);
    setEditModalOpen(false);
    setTaskToEdit(null);
    showAlert(t('edit_task_success'), 'success');
    if (fetchTasksInfo) fetchTasksInfo();
  }, [fetchTasksInfo, showAlert, t]);

  const handleDeleteTask = useCallback(async (taskId) => {
    await deleteTask(taskId);
    setDeleteModalOpen(false);
    setTaskToDelete(null);
    showAlert(t('delete_task_success'), 'success');
    if (fetchTasksInfo) fetchTasksInfo();
  }, [fetchTasksInfo, showAlert, t]);

  const handleOpenAddModal = useCallback(() => setAddModalOpen(true), []);
  const handleCloseAddModal = useCallback(() => setAddModalOpen(false), []);

  const handleOpenEditModal = useCallback((task) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  }, []);
  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setTaskToEdit(null);
  }, []);

  const handleOpenDeleteModal = useCallback((task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  }, []);
  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  }, []);

  return (
    <>
      <Paper sx={{
        borderRadius: 3,
        boxShadow: 4,
        minHeight: 500,
        maxHeight: 500,
        overflowY: 'auto',
        pt: 0,
        pb: 3,
        px: 2,
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
          }}
        >
          <Box component="span" sx={{ fontSize: 22, mr: 1 }} role="img" aria-label="tasks">✔️</Box>
          <Typography
            align="center"
            variant="h4"
            mr={1}
          >
            {t('tasks_title')}
          </Typography>
          {isAdmin && (
            <IconButton onClick={handleOpenAddModal}>
              <AddIcon />
            </IconButton>
          )}
        </Box>
        <List>
          {allTasks.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
              {t('no_tasks_available')}
            </Typography>
          )}
          {allTasks.map((task) => (
            <ListItem key={task.id} alignItems="center" sx={{ mb: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2, pl: 2 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={task.completed ? t('completed') : t('pending')}
                        size="small"
                        sx={{
                          color: task.completed ? 'success.dark' : 'warning.dark',
                          fontWeight: 600
                        }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {task.title}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                          {t('assignee')}: <b>{task.assignee || 'N/A'}</b>
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                          📌 {formatDate(task.date?.seconds || 0)}
                        </Typography>
                      </Box>
                    </>
                  }
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, ml: 2 }}>
                <IconButton
                  sx={{
                    marginRight: 1,
                  }}
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpenEditModal(task)}
                >
                  <EditIcon />
                </IconButton>
                {isAdmin && (
                  <IconButton
                    sx={{
                      marginRight: 1,
                    }}
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDeleteModal(task)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
        {addModalOpen && (<AddTaskModal open={addModalOpen} onClose={handleCloseAddModal} onSave={handleAddTask} />)}
        {editModalOpen && (<EditTaskModal open={editModalOpen} onClose={handleCloseEditModal} onSave={handleEditTask} task={taskToEdit} />)}
        {deleteModalOpen && (<DeleteTaskModal open={deleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleDeleteTask} task={taskToDelete} />)}
      </Paper>
      {AlertComponent}
    </>
  );
};

export default React.memo(TasksInfo);
