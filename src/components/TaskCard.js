// components/TaskCard.js

import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const handleToggleComplete = () => {
    onUpdate(task.id, { ...task, completed: !task.completed });
  };

  return (
    <Card sx={{ padding: 2 }}>
      <CardContent>
        <Typography variant="h6">{task.name}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            {task.completed ? 'Completed' : 'Pending'}
          </Typography>
          <Button variant="outlined" onClick={handleToggleComplete}>
            {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
          </Button>
        </Box>

        <Button variant="contained" color="error" sx={{ marginTop: 1 }} onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
