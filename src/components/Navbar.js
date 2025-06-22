import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { IconButton, AppBar, Toolbar, Typography, Menu, MenuItem, Box } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import i18n from '../i18n';

import FlagIcon from 'react-world-flags';

const Navbar = ({ handleNavClick }) => {
  const { t } = useTranslation(); // 't' is the translation function
  const [anchorEl, setAnchorEl] = useState(null); // State for the dropdown menu

  const getInitialLanguage = () => {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (authUser.language) {
      return authUser.language;
    }
    return 'ro'; // Default to Romanian
  };
  const getInitialFlag = () => {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (authUser.language === 'en') return 'GB';
    if (authUser.language === 'ro') return 'RO';
    return 'RO'; // Default to Romanian flag
  };

  const [selectedLanguage, setSelectedLanguage] = useState(getInitialLanguage());
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(getInitialFlag());

  React.useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const handleClick = React.useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLanguageChange = React.useCallback((languageCode, flagCode) => {
    i18n.changeLanguage(languageCode); // Change the language
    setSelectedLanguage(languageCode); // Set the language code (en, ro, etc.)
    setSelectedLanguageCode(flagCode); // Set the flag code (GB, RO, etc.)
    // Save language in localStorage with user info
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    localStorage.setItem('authUser', JSON.stringify({ ...authUser, language: languageCode }));
    handleClose();
  }, [handleClose]);

  const handleNavToggle = React.useCallback(() => {
    handleNavClick();
  }, [handleNavClick])

  return (
    <>
      <AppBar
        position="fixed"
        style={{
          backgroundColor: '#E1C16E',
          borderRadius: 0
        }}>
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={handleNavToggle}
          >
            <MenuIcon sx={{ color: 'secondary.main' }} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <RouterLink
              to="/"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '1.25rem',
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              {t('appTitle')}
            </RouterLink>
          </Box>
          {/* Language Icon with Flag and Initials */}
          <Typography
            variant="bodyBold2"
            style={{
              marginRight: 5,
              marginTop: 3
            }}>
            {selectedLanguage === 'en' ? 'EN' : 'RO'}
          </Typography>
          <IconButton
            onClick={handleClick}
            color="inherit"
            aria-controls="language-menu"
            aria-haspopup="true"
          >
            <FlagIcon
              code={selectedLanguageCode}
              style={{
                width: 20,
                height: 15,
                marginRight: 5
              }} />
          </IconButton>
          {/* Language Dropdown Menu */}
          <Menu
            id="language-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {/* Language Options with Flags only (no EN or RO initials) */}
            <MenuItem
              onClick={() => handleLanguageChange('en', 'GB')}
            >
              <FlagIcon
                code="GB"
                style={{
                  width: 20,
                  height: 15,
                  marginRight: 5
                }} />
              {t('english')}
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageChange('ro', 'RO')}
            >
              <FlagIcon
                code="RO"
                style={{
                  width: 20,
                  height: 15,
                  marginRight: 5
                }} />
              {t('romanian')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Navbar;