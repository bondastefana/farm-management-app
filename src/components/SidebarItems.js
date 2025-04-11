import React from "react";
import { List, ListItem, ListItemText, ListItemIcon, } from "@mui/material";
import { Dashboard, Pets, Task, Storage, Assessment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SidebarItems = ({ handleRouteChange }) => {
  const { t } = useTranslation();

  return (
    <List>
      {[
        { text: t('dashboard'), icon: <Dashboard />, path: "/" },
        { text: t('livestock'), icon: <Pets />, path: "/livestock" },
        { text: t('tasks'), icon: <Task />, path: "/tasks" },
        { text: t('resources'), icon: <Storage />, path: "/resources" },
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

export default SidebarItems;
