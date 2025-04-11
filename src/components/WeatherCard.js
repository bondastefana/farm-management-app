import React from 'react';
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { getDayName, formatDate, getWeatherIcon } from '../services/farmService';

const WeatherCard = ({ weatherData, forecast = null }) => {
  const { t } = useTranslation();
  const data = forecast ?? weatherData;

  return (
    <Card>
      <CardContent>
        {forecast ?
          (<Typography variant="body1" align="center" sx={{ fontWeight: 'bold' }}>
            {getDayName(forecast.dt)} - {formatDate(forecast.dt)}
          </Typography>) :
          (<Typography variant="body1" align="center" sx={{ fontWeight: 'bold' }}>
            {t('currentWeather')}
          </Typography>)
        }
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          {getWeatherIcon(data.weather[0].main)}
          <Typography variant="body1" ml={1}>
            {Math.round(data.main.temp)}°C
          </Typography>
        </Box>
        <Typography variant="body2">
          Weather: {data.weather[0].description}
        </Typography>
        <Typography variant="body2">
          {t('humidity')}: {data.main.humidity}%
        </Typography>
        <Typography variant="body2">
          {t('windSpeed')}: {data.wind.speed} m/s
        </Typography>
      </CardContent>
    </Card>
  )
};

export default WeatherCard;
