import React from "react";
import { Drawer, Divider, Avatar, Button, Box, Typography, IconButton, Grid } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import SidebarItems from './SidebarItems';


const Sidebar = ({ navOpen, handleNavToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  const navigate = useNavigate();

  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  const user = {
    name: authUser.firstName && authUser.lastName ? `${authUser.firstName} ${authUser.lastName}` : (authUser.username || t('user')),
    avatar: authUser.avatar || null,
  };

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authUser');
    navigate('/login');
  }, [navigate]);

  const drawerContent = React.useMemo(() => {
    return (
      <Grid
        container
        direction="column"
        sx={{
          alignItems: "flex-start",
          height: '100%',
        }}
        p={2}
      >
        {/* Sidebar Header (App Title + Expand Button) */}
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 6 }}>
          <Typography variant="h6">{t('appTitle')}</Typography>
          <IconButton onClick={handleNavToggle} sx={{ ml: 2 }}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Box>
        <SidebarItems handleRouteChange={handleNavToggle} />
      </Grid>
    )
  }, [handleNavToggle, t])


  return (
    <Drawer
      variant={isMobile && "temporary"}
      open={navOpen}
      onClose={handleNavToggle}
      ModalProps={isMobile ? { keepMounted: true } : {}}
    >
      {drawerContent}
      <Box display="flex" justifyContent="flex-end" flexDirection="column">
        <Divider variant="middle" />
        <Box display="flex" alignItems="center" flexDirection="column" p={2}>
          {user.avatar ? (
            <Avatar src={user.avatar} />
          ) : (
            <AccountCircleIcon fontSize="large" sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          )}
          <Typography variant="subtitle1">{user.name}</Typography>
          <Button variant="contained" color="error" size="small" onClick={handleLogout}>
            {t('logOut')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default React.memo(Sidebar);
