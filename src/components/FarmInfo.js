import React from "react";
import { Typography, Paper, CardContent, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StraightenIcon from '@mui/icons-material/Straighten';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const FarmInfo = ({ farmInfo = {} }) => {
  const { name, location, size, owner, established, description, employeesNumber } = farmInfo;
  const { t } = useTranslation(); // 't' is the translation function
  return (
    <Paper
      sx={{
        p: 2,
        maxHeight: 300,
        minHeight: 300,
        overflow: 'auto',
        pr: 'calc(24px / 2)',
        display: 'flex',
        flexDirection: 'column',
        pt: 0,
        pb: 3,
        px: 2,
      }}
      elevation={3}
    >
      <CardContent sx={{ p: 0, height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
            position: 'sticky',
            top: 0,
            zIndex: 99,
            pb: 1,
            backgroundColor: 'inherit',
          }}
        >
          <Typography
            align="center"
            variant="h4"
            mr={1}
          >
            {name}
          </Typography>
          <Box component="span" sx={{ fontSize: 22, ml: 1 }} role="img" aria-label="farm">🌾</Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon sx={{ fontSize: 20, mr: 1, color: '#4b5563' }} /> <strong>{t('location')}:</strong>&nbsp;{location}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', display: 'flex', alignItems: 'center' }}>
            <StraightenIcon sx={{ fontSize: 20, mr: 1, color: '#4b5563' }} /> <strong>{t('size')}:</strong>&nbsp;{size}+
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: 20, mr: 1, color: '#4b5563' }} /> <strong>{t('owner')}:</strong>&nbsp;{owner}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', display: 'flex', alignItems: 'center' }}>
            <AccountBalanceIcon sx={{ fontSize: 20, mr: 1, color: '#4b5563' }} /> <strong>{t('establishment')}:</strong>&nbsp;{established}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', display: 'flex', alignItems: 'center' }}>
            <AgricultureIcon sx={{ fontSize: 20, mr: 1, color: '#4b5563' }} /> <strong>{t('employeesNumber')}:</strong>&nbsp;{employeesNumber}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', display: 'flex', alignItems: 'flex-start' }}>
            <InfoOutlinedIcon sx={{ fontSize: 20, mr: 1, color: '#4b5563', mt: '2px' }} />
            <Box component="span" sx={{ display: 'inline', ml: 0, wordBreak: 'break-word' }}>
              <strong>{t('description')}:</strong>&nbsp;{description}
            </Box>
          </Typography>
        </Box>
      </CardContent>
    </Paper>
  )
}

export default FarmInfo;