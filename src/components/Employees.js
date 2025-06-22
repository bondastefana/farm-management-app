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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useLoading } from '../contexts/LoadingContext';
import { getFormattedDate } from '../services/utils';
import { updateEmployee, deleteEmployee } from '../services/farmService';

import EmployeesInfoModal from './EmployeesInfoModal';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import DeleteEmployeeModal from './DeleteEmployeeModal';
import useAlert from '../hooks/useAlert';
import { useIsAdmin } from '../contexts/IsAdminContext';

const Notes = ({ employees = [], fetchNotesInfo }) => {
  const { t } = useTranslation(); // 't' is the translation function
  const [viewEmployee, setViewEmployee] = React.useState(null);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editEmployee, setEditEmployee] = React.useState(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteEmployeeModalOpen, setDeleteEmployeeModalOpen] = React.useState(false);
  const [employeeToDelete, setEmployeeToDelete] = React.useState(null);
  const { setLoading } = useLoading();
  const { showAlert, AlertComponent } = useAlert();
  const isAdmin = useIsAdmin();

  const handleAddEmployee = React.useCallback(() => {
    setAddModalOpen(true);
  }, [])
  const handleAddEmployeeClosed = React.useCallback(() => {
    setAddModalOpen(false);
  }, [])
  const handleAddEmployeeSuccess = React.useCallback(() => {
    setAddModalOpen(false);
    if (fetchNotesInfo) fetchNotesInfo();
  }, [fetchNotesInfo])

  const handleViewEmployee = React.useCallback((employee) => {
    setViewEmployee(employee)
  }, [])

  const handleEditEmployee = React.useCallback((employee) => {
    setEditEmployee(employee);
    setEditModalOpen(true);
  }, []);
  const handleEditEmployeeClosed = React.useCallback(() => {
    setEditModalOpen(false);
    setEditEmployee(null);
  }, []);
  const handleEditEmployeeSubmit = React.useCallback(async (updatedEmployee) => {
    if (!updatedEmployee || !updatedEmployee.userName) return;
    setLoading(true);
    try {
      await updateEmployee(updatedEmployee.userName, {
        firstName: updatedEmployee.firstName,
        lastName: updatedEmployee.lastName,
        isAdmin: updatedEmployee.isAdmin,
        password: updatedEmployee.password,
        role: updatedEmployee.role
      });
      // Update localStorage if editing current user
      const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
      if (authUser && authUser.username === updatedEmployee.userName) {
        localStorage.setItem('authUser', JSON.stringify({
          ...authUser,
          firstName: updatedEmployee.firstName,
          lastName: updatedEmployee.lastName,
          role: updatedEmployee.role
        }));
      }
      showAlert(t('employeeUpdateSuccess'), 'success');
    } catch (err) {
      showAlert(t('employeeUpdateError'), 'error');
    }
    setLoading(false);
    if (fetchNotesInfo) fetchNotesInfo();
  }, [fetchNotesInfo, setLoading, showAlert, t]);

  const handleDeleteEmployee = React.useCallback((employee) => {
    setEmployeeToDelete(employee);
    setDeleteEmployeeModalOpen(true);
  }, []);
  const handleDeleteEmployeeClosed = React.useCallback(() => {
    setDeleteEmployeeModalOpen(false);
    setEmployeeToDelete(null);
  }, []);
  const handleDeleteEmployeeSubmit = React.useCallback(async (employee) => {
    if (!employee || !employee.userName) return;
    setLoading(true);
    const result = await deleteEmployee(employee.userName);
    setLoading(false);
    setDeleteEmployeeModalOpen(false);
    setEmployeeToDelete(null);
    if (result) {
      showAlert(t('employeeUpdateSuccess'), 'success');
    } else {
      showAlert(t('employeeUpdateError'), 'error');
    }
    if (fetchNotesInfo) fetchNotesInfo();
  }, [fetchNotesInfo, setLoading, showAlert, t]);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          maxHeight: 300,
          minHeight: 300,
          overflow: 'auto',
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
          }}  >
          <Typography
            align="center"
            variant="h4"
            mr={1}
          >
            {t('employees')}
          </Typography>
          {isAdmin && (
            <IconButton onClick={handleAddEmployee} >
              <AddIcon />
            </IconButton>
          )}
        </Box>
        {employees?.map((employee, index) => {
          const employeeFullName = `${employee.firstName} ${employee.lastName}`;
          const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
          const isCurrentUser = authUser && authUser.username === employee.userName;
          return (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  },
                }}
                onClick={() => handleViewEmployee(employee)}
                secondaryAction={
                  isAdmin && (
                    <Box>
                      <IconButton edge="end" aria-label="edit" onClick={e => { e.stopPropagation(); handleEditEmployee(employee); }}>
                        <EditIcon />
                      </IconButton>
                      {!isCurrentUser && (
                        <IconButton edge="end" aria-label="delete" color="error" onClick={e => { e.stopPropagation(); handleDeleteEmployee(employee); }}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  )
                }
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
                    secondary={`${t('role')}: ${employee.role || '-'}`}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
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
            </React.Fragment>
          )
        })}
      </Paper >
      {!!viewEmployee && (
        <EmployeesInfoModal
          employee={viewEmployee}
          open={!!viewEmployee}
          setViewEmployee={setViewEmployee}
        />)}
      <AddEmployeeModal
        open={addModalOpen}
        onClose={handleAddEmployeeClosed}
        onSuccess={handleAddEmployeeSuccess}
      />
      <EditEmployeeModal
        open={editModalOpen}
        onClose={handleEditEmployeeClosed}
        employee={editEmployee}
        onSubmit={handleEditEmployeeSubmit}
      />
      <DeleteEmployeeModal
        open={deleteEmployeeModalOpen}
        onClose={handleDeleteEmployeeClosed}
        employee={employeeToDelete}
        onSubmit={handleDeleteEmployeeSubmit}
        loading={false}
      />
      {AlertComponent}
    </>
  );
};

export default Notes;
