import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Typography } from '@mui/material';


const NotFound = () => {
  const { t } = useTranslation(); // 't' is the translation function
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" >
        {t('pageNotFound')}
      </Typography>
    </Box>
  )
};

export default NotFound;
