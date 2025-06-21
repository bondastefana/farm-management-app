import React from "react";
import { Typography, Card, CardContent, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const FarmInfo = ({ farmInfo = [], fetchFarmInfo }) => {
  const { name, location, size, owner, established, description, employeesNumber } = farmInfo;
  const { t } = useTranslation(); // 't' is the translation function
  return (
    <Card
      sx={{
        p: 3,
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
        </Box>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          <strong>{t('location')}: </strong> {location}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          <strong>{t('size')}: </strong> {size}+
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          <strong>{t('owner')}: </strong> {owner}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          <strong>{t('establishment')}: </strong> {established}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          <strong>{t('employeesNumber')}: </strong> {employeesNumber}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          <strong>{t('description')}: </strong> {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default FarmInfo;