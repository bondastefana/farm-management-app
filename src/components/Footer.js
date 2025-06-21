import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const routes = [
  { path: "/", label: "Dashboard" },
  { path: "/animals", label: "Animals" },
  { path: "/tasks", label: "Tasks" },
  { path: "/stocks", label: "Stocks" },
  { path: "/reports", label: "Reports" },
];

const firstCol = routes.slice(0, 3);
const secondCol = routes.slice(3);

const Footer = () => (
  <Box
    component="footer"
    sx={{
      width: '100%',
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      py: 3,
      px: 6, // extra left/right padding
      mt: 4,
      boxShadow: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start', // move content to the left
      borderTop: '1px solid #eee',
      // Removed position: 'fixed', left, bottom, zIndex
    }}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        mb: 1,
      }}
    >
      <Box>
        {firstCol.map(route => (
          <Link
            key={route.path}
            component={RouterLink}
            to={route.path}
            underline="hover"
            color="inherit"
            sx={{
              display: 'block',
              fontSize: '1.1rem',
              mb: 1,
              fontWeight: 500,
              letterSpacing: 0.5,
              transition: 'color 0.2s',
              '&:hover': { color: 'secondary.light' },
            }}
          >
            {route.label}
          </Link>
        ))}
      </Box>
      <Box>
        {secondCol.map(route => (
          <Link
            key={route.path}
            component={RouterLink}
            to={route.path}
            underline="hover"
            color="inherit"
            sx={{
              display: 'block',
              fontSize: '1.1rem',
              mb: 1,
              fontWeight: 500,
              letterSpacing: 0.5,
              transition: 'color 0.2s',
              '&:hover': { color: 'secondary.light' },
            }}
          >
            {route.label}
          </Link>
        ))}
      </Box>
    </Box>
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Typography variant="caption" color="inherit" sx={{ mt: 2 }}>
        &copy; {new Date().getFullYear()} Farm Manager
      </Typography>
    </Box>
  </Box>
);

export default Footer;
