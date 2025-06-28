import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const routes = [
    { path: "/", label: t('dashboard') },
    { path: "/animals", label: t('animals') },
    { path: "/stocks", label: t('stocks') },
    { path: "/reports", label: t('reports') },
  ];

  const firstCol = routes.slice(0, 2);
  const secondCol = routes.slice(2, 4);

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: 3,
        px: 6,
        mt: 4,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTop: '1px solid #eee',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 6,
          mb: 1,
          justifyContent: 'center',
          width: '100%',
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
                textAlign: 'center',
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
                textAlign: 'center',
              }}
            >
              {route.label}
            </Link>
          ))}
        </Box>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Link
          href="https://food.ec.europa.eu/animals/animal-welfare_en"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          color="inherit"
          sx={{ fontSize: '1rem', fontWeight: 500, letterSpacing: 0.5, textAlign: 'center' }}
        >
          {t('footer.animalWelfare')}
        </Link>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Typography variant="caption" color="inherit" sx={{ mt: 2 }}>
          &copy; {new Date().getFullYear()} Farm Manager
        </Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, gap: 2 }}>
        <a href="https://www.usamvcluj.ro/" target="_blank" rel="noopener noreferrer">
          <img src={process.env.PUBLIC_URL + '/usamv.gif'} alt="USAMV" style={{ height: 65, width: 'auto', marginRight: 8 }} />
        </a>
        <a href="https://fzb.usamvcluj.ro/" target="_blank" rel="noopener noreferrer">
          <img src={process.env.PUBLIC_URL + '/zootehnie.png'} alt="Zootehnie" style={{ height: 65, width: 'auto' }} />
        </a>
      </Box>
    </Box>
  );
};

export default Footer;
