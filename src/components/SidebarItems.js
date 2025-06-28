import React from "react";
import { List, ListItem, ListItemText, ListItemIcon, } from "@mui/material";
import { Dashboard, Pets, Storage, Assessment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SidebarItems = ({ handleRouteChange }) => {
  const { t } = useTranslation();

  return (
    <List sx={{ width: '100%' }}>
      {[
        { text: t('dashboard'), icon: <Dashboard />, path: "/" },
        { text: t('animals'), icon: <Pets />, path: "/animals" },
        { text: t('stocks'), icon: <Storage />, path: "/stocks" },
        { text: t('reports'), icon: <Assessment />, path: "/reports" },
      ].map((item) => (
        <ListItem
          button
          component={Link}
          to={item.path}
          key={item.text}
          onClick={handleRouteChange} // Close sidebar on mobile
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>);
};

export default React.memo(SidebarItems);
