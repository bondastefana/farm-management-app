import React from 'react';
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { getDayName, formatDate, getWeatherIcon } from '../services/farmService';

const descriptionMap = {
  "clear sky": "weatherDescriptions.clear_sky",
  "few clouds": "weatherDescriptions.few_clouds",
  "scattered clouds": "weatherDescriptions.scattered_clouds",
  "broken clouds": "weatherDescriptions.broken_clouds",
  "shower rain": "weatherDescriptions.shower_rain",
  "rain": "weatherDescriptions.rain",
  "thunderstorm": "weatherDescriptions.thunderstorm",
  "snow": "weatherDescriptions.snow",
  "mist": "weatherDescriptions.mist"
};


const WeatherCard = ({ weatherData, forecast = null }) => {
  const { t } = useTranslation();
  const data = forecast ?? weatherData;

  const descriptionKey = descriptionMap[data.weather[0].description?.toLowerCase()];
  const translatedDescription = descriptionKey ? t(descriptionKey) : data.weather[0].description;

  return (
    <Card sx={{ backgroundColor: '#fff' }}>
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
          {t('weatherToday')}:  <b>{translatedDescription}</b>
        </Typography>
        <Typography variant="body2">
          {t('humidity')}: <b>{data.main.humidity}%</b>
        </Typography>
        <Typography variant="body2">
          {t('windSpeed')}: <b>{data.wind.speed} m/s</b>
        </Typography>
      </CardContent>
    </Card>
  )
};

export default React.memo(WeatherCard);
