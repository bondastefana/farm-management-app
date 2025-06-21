import React from "react";
import { Drawer, Divider, Avatar, Button, Box, Typography, IconButton, Grid } from "@mui/material";

import { useTheme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import SidebarItems from './SidebarItems';


const Sidebar = ({ navOpen, handleNavToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile
  const { t } = useTranslation(); // 't' is the translation function


  const user = {
    name: "John Doe",
    avatar: "https://via.placeholder.com/50", // Replace with actual profile image URL
  };

  const handleLogout = () => {
    // alert("Logging out...");
  };

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
      variant={isMobile && "temporary"} // Temporary for mobile, permanent for desktop
      open={navOpen}
      onClose={handleNavToggle}
    >
      {drawerContent}
      <Box display="flex" justifyContent="flex-end" flexDirection="column">
        <Divider variant="middle" />
        <Box display="flex" alignItems="center" flexDirection="column" p={2}>
          <Avatar src={user.avatar} />
          <Typography variant="subtitle1">{user.name}</Typography>
          <Button variant="contained" color="error" size="small" onClick={handleLogout}>
            {t('logOut')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
