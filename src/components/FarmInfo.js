import React from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";

const FarmInfo = ({ farmInfo }) => {
  const { name, location, size, owner, established, description, employeesNumber } = farmInfo;
  const { t } = useTranslation(); // 't' is the translation function
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {name}
        </Typography>
        <Typography variant="body2">
          <strong>{t('location')}: </strong> {location}
        </Typography>
        <Typography variant="body2">
          <strong>{t('size')}: </strong> {size}
        </Typography>
        <Typography variant="body2" >
          <strong>{t('owner')}: </strong> {owner}
        </Typography>
        <Typography variant="body2" >
          <strong>{t('establishment')}: </strong> {established}
        </Typography>
        <Typography variant="body2" >
          <strong>{t('employeesNumber')}: </strong> {employeesNumber}
        </Typography>
        <Typography variant="body2" >
          <strong>{t('description')}: </strong> {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default FarmInfo;