import React from "react";
import { useTranslation } from "react-i18next";
import {
  Typography,
  ListItem,
  IconButton,
  Paper,
  ListItemText,
  Box,
  Divider,
  ListItemIcon
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useLoading } from '../contexts/LoadingContext';
import { getFormattedDate } from '../services/utils';

import EmployeesInfoModal from './EmployeesInfoModal';

const Notes = ({ employees = [], fetchNotesInfo }) => {
  const { t } = useTranslation(); // 't' is the translation function
  const [deletedNote, setDeletedNote] = React.useState(null);
  const [editedNote, setEditedNote] = React.useState(null);
  const [addedNote, setAddedNote] = React.useState(false);
  const [viewEmployee, setViewEmployee] = React.useState(null);
  const { setLoading } = useLoading();

  // NEW
  const handleAddEmployee = React.useCallback(async (employee) => {
    setAddedNote(true);
  }, [])
  const handleAddEmployeeClosed = React.useCallback(() => {
    setAddedNote(null);
  }, [])

  const handleViewEmployee = React.useCallback((employee) => {
    setViewEmployee(employee)
  }, [])

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
            {t('employees')}
          </Typography>
          <IconButton onClick={handleAddEmployee} >
            <PlaylistAddIcon />
          </IconButton>
        </Box>
        {employees?.map((employee, index) => {
          const employeeFullName = `${employee.firstName} ${employee.lastName}`
          return (
            <>
              <ListItem
                key={index}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  },
                }}
                onClick={() => handleViewEmployee(employee)}
              >
                <ListItemIcon>
                  <AccountCircleIcon sx={{ fontSize: 40 }} />
                </ListItemIcon>
                <Box>

                  <ListItemText
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    primary={employeeFullName}
                  />
                  <ListItemText
                    secondary={`${t('employmentDate')}: ${getFormattedDate(employee.employmentDate.seconds, false)}`}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                </Box>
              </ListItem>
              <Divider variant="middle" />
            </>
          )
        })}
      </Paper >
      {!!viewEmployee && (
        <EmployeesInfoModal
          employee={viewEmployee}
          open={!!viewEmployee}
          setViewEmployee={setViewEmployee}
        />)}
    </>
  );
};

export default Notes;
