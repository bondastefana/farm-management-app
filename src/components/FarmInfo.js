import React from "react";
import { Typography, Paper, CardContent, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

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
        <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', mb: 0.3 }}>
          <strong>{t('location')}: </strong> {location} <span role="img" aria-label="location">📍</span>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', mb: 0.3 }}>
          <strong>{t('size')}: </strong> {size}+ <span role="img" aria-label="size">📏</span>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', mb: 0.3 }}>
          <strong>{t('owner')}: </strong> {owner} <span role="img" aria-label="owner">👤</span>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', mb: 0.3 }}>
          <strong>{t('establishment')}: </strong> {established} <span role="img" aria-label="established">🏛️</span>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', mb: 0.3 }}>
          <strong>{t('employeesNumber')}: </strong> {employeesNumber} <span role="img" aria-label="employees">🧑‍🌾</span>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', color: '#4b5563', mb: 0.3 }}>
          <strong>{t('description')}: </strong> {description} <span role="img" aria-label="desc">✨</span>
        </Typography>
      </CardContent>
    </Paper>
  )
}

export default FarmInfo;