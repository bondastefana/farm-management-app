import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const { t } = useTranslation();
  const handleToggleComplete = React.useCallback(() => {
    onUpdate(task.id, { ...task, completed: !task.completed });
  }, [task, onUpdate]);

  return (
    <Card sx={{ padding: 2 }}>
      <CardContent>
        <Typography variant="h6">{task.name}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            {task.completed ? 'Completed' : 'Pending'}
          </Typography>
          <Button variant="contained" onClick={handleToggleComplete}>
            {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
          </Button>
        </Box>

        <Button variant="outlined" sx={{ marginTop: 1, color: 'error.main', borderColor: 'error.main' }} onClick={() => onDelete(task.id)}>
          {t('delete')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default React.memo(TaskCard);
