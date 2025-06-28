import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { getFormattedDate } from "../services/utils";

const EmployeesInfoModal = ({ employee = {}, open, setViewEmployee }) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setViewEmployee(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        {t("employeeDetails")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AccountCircleIcon sx={{ fontSize: 60 }} />
          <Box>
            <Typography variant="h6">{`${employee.firstName} ${employee.lastName}`}</Typography>
            <Typography variant="body1">
              {t("role")}: {employee.role}
            </Typography>
            <Typography variant="body1">
              {t("employmentDate")}:{" "}
              {getFormattedDate(employee?.employmentDate?.seconds, false)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={handleClose} color="inherit">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(EmployeesInfoModal);
