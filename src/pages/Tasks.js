// src/pages/Tasks/Tasks.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Card, CardContent, Grid, Typography, Button, Box, TextField, Divider } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { addTask, deleteTask, getTasks, updateTask } from '../services/taskService'; // Corrected imports

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState(getCurrentDate()); // Initialize with current date

  const { t } = useTranslation();

  // Function to get today's date in the correct format for the date input
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2-digit month
    const day = today.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    // Fetch tasks when the component is mounted
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const fetchedTasks = await getTasks(); // Use the getTasks function
    setTasks(fetchedTasks);
  };

  const handleAddTask = async () => {
    if (newTask.trim() !== '' && dueDate) {
      await addTask({
        title: newTask,
        completed: false,
        status: 'Upcoming',
        dueDate: dueDate
      }); // Include the dueDate when adding a task
      setNewTask('');
      setDueDate(getCurrentDate()); // Reset due date to current date
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId); // Use the deleteTask function
    fetchTasks();
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      await updateTask(taskId, {
        completed: !task.completed,
        status: task.completed ? 'Upcoming' : 'Completed'
      }); // Use the updateTask function
      fetchTasks();
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Farm Tasks
      </Typography>

      <Box>
        <TextField
          label={t('newTask')}
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <TextField
          label={t('dueDate')}
          type="date"
          variant="outlined"
          fullWidth
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleAddTask}
          startIcon={<AddCircleOutline />}
        >
          {t('addTask')}
        </Button>
      </Box>

      {/* Task Sections */}
      <Grid container spacing={3}>
        {/* Upcoming Tasks Section */}
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#20392C' }}>
              Upcoming Tasks
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            {tasks.filter(task => task.status === 'Upcoming').map((task) => (
              <Card key={task.id} sx={{ marginBottom: 2, border: '1px solid #20392C' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#20392C' }}>{task.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#20392C' }}>
                    Due: {task.dueDate}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => updateTask(task.id, { status: 'In Progress' }).then(fetchTasks)}
                      sx={{
                        borderColor: '#20392C',
                        color: '#20392C',
                        '&:hover': {
                          borderColor: '#17402A',
                          color: '#17402A',
                        },
                      }}
                    >
                      Start
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleToggleComplete(task.id)}
                      sx={{
                        borderColor: '#20392C',
                        color: '#20392C',
                        '&:hover': {
                          borderColor: '#17402A',
                          color: '#17402A',
                        },
                      }}
                    >
                      {t('done')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteTask(task.id)}
                      sx={{
                        borderColor: '#20392C',
                        color: '#20392C',
                        '&:hover': {
                          borderColor: '#17402A',
                          color: '#17402A',
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
        {/* In Progress Tasks Section */}
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('inProgressTasks')}
            </Typography>
            <Divider />
            {tasks.filter(task => task.status === 'In Progress').map((task) => (
              <Card key={task.id}>
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2">
                    Due: {task.dueDate}
                  </Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleToggleComplete(task.id)}
                    >
                      {t('done')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      {t('delete')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Completed Tasks Section */}
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('completedTasks')}
            </Typography>
            <Divider />
            {tasks.filter(task => task.status === 'Completed').map((task) => (
              <Card key={task.id}>
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2">
                    Due: {task.dueDate}
                  </Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      {t('delete')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Tasks;
