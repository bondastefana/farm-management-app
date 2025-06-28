import React, { useEffect, useState } from "react";
import { Typography, Paper, Grid, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import { formatDate } from '../services/farmService';
import { WEATHER_API_KEY, GOOGLE_API_KEY } from '../services/constants';
import WeatherCard from './WeatherCard';

const Weather = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation(); // 't' is the translation function

  // Fetch weather data from OpenWeatherMap
  const fetchWeatherData = React.useCallback(async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        setError("Unable to fetch weather data.");
      }
    } catch (error) {
      console.error("Weather API Error:", error);
      setError("Error fetching weather data.");
    }
  }, []);

  // Fetch 5-day forecast
  const fetchWeatherForecast = React.useCallback(async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === "200") {
        setForecastData(data);
      } else {
        setError("Unable to fetch forecast data.");
      }
    } catch (error) {
      console.error("Forecast API Error:", error);
      setError("Error fetching forecast data.");
    }
  }, []);

  // Get city name from lat/lng using Google Maps API
  const getCityFromLatLng = React.useCallback(async (lat, lon) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_API_KEY}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.results.length > 0) {
        const cityName = data.results[0].address_components.find((comp) =>
          comp.types.includes("locality")
        )?.long_name;
        return cityName;
      }
    } catch (err) {
      console.error("Error fetching city name:", err);
    }
    return null;
  }, []);

  // Use location prop to load weather + city
  useEffect(() => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude);
      fetchWeatherForecast(location.latitude, location.longitude);
      getCityFromLatLng(location.latitude, location.longitude).then(setCity);
    }
  }, [fetchWeatherData, fetchWeatherForecast, getCityFromLatLng, location]);

  // Group forecast data by date
  const groupForecastByDate = React.useCallback((forecastList) => {
    const groupedData = [];
    let lastDate = null;

    forecastList.forEach((forecast) => {
      const date = formatDate(forecast.dt);
      if (date !== lastDate) {
        groupedData.push(forecast);
        lastDate = date;
      }
    });

    return groupedData;
  }, []);

  if (error) return <Typography>{error}</Typography>;

  const groupedForecast = forecastData ? groupForecastByDate(forecastData.list) : [];

  return (
    <Paper
      elevation={3}
      sx={{
        pt: 0,
        pb: 3,
        px: 2,
        minHeight: 500,
        maxHeight: 500,
        overflowY: 'auto',
      }}>
      <Typography align="center" variant="h4" mb={2}>
        <Box component="span" sx={{ fontSize: 22, mr: 1, verticalAlign: 'middle', display: 'inline-block' }} role="img" aria-label="weather">🌍</Box>
        {t('weather')} {city}
      </Typography>
      {/* Current Weather */}
      {weatherData ? (
        <Grid container
          spacing={3}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}>
          <Grid item xs={3}>
            <WeatherCard weatherData={weatherData} />
          </Grid>
          {groupedForecast.slice(0, 5).map((forecast, index) => (
            <Grid item xs={12} md={6} key={index}>
              <WeatherCard weatherData={weatherData} forecast={forecast} />
            </Grid>
          ))}
        </Grid>

      ) : (
        <Typography variant="body1">{t('loadingData')}</Typography>
      )}
    </Paper>
  );
};

export default React.memo(Weather);
