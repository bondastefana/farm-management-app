import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { fetchCows, fetchHorses, fetchFoodStock } from '../services/farmService';
import { calculateAge } from '../services/utils';
import { emojiMap } from '../components/AnimalsTable';
import { useFoodTypes } from '../components/FoodStockTables';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#E74C3C'];

function getGenderData(animals) {
  const genderCounts = animals.reduce((acc, animal) => {
    acc[animal.gender] = (acc[animal.gender] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(genderCounts).map(([key, value]) => ({ name: key, value }));
}

function getAgeGroupData(animals) {
  const groups = { '0-2': 0, '3-5': 0, '6-10': 0, '10+': 0 };
  animals.forEach(animal => {
    // calculateAge expects a unix timestamp in seconds
    let birthDate = animal.birthDate;
    let birthTimestampSec;
    if (typeof birthDate === 'object' && birthDate && birthDate.seconds) {
      birthTimestampSec = birthDate.seconds;
    } else if (typeof birthDate === 'string' || typeof birthDate === 'number') {
      birthTimestampSec = Math.floor(new Date(birthDate).getTime() / 1000);
    } else {
      birthTimestampSec = Math.floor(Date.now() / 1000); // fallback
    }
    // calculateAge returns a string like '2 years 3 months' or '1 year'
    const ageString = calculateAge(birthTimestampSec);
    // Extract years as a number
    const yearsMatch = ageString.match(/(\d+)\s*year/);
    const years = yearsMatch ? parseInt(yearsMatch[1], 10) : 0;
    if (years <= 2) groups['0-2']++;
    else if (years <= 5) groups['3-5']++;
    else if (years <= 10) groups['6-10']++;
    else groups['10+']++;
  });
  return Object.entries(groups).map(([key, value]) => ({ name: key, value }));
}

const PieSection = ({ title, data, emoji }) => (
  <Paper sx={{ p: 2, mb: 2, height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <Typography variant="h6" sx={{ mb: 2 }}>{title} {emoji && <span style={{ marginLeft: 8, fontSize: 28 }}>{emoji}</span>}</Typography>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  </Paper>
);

const TinyBarChart = ({ data, title, emoji }) => (
  <Paper sx={{ p: 2, mb: 2, height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 320, maxWidth: 400 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>{title} {emoji && <span style={{ marginLeft: 8, fontSize: 22 }}>{emoji}</span>}</Typography>
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="quantity" fill="#0088FE" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

const Reports = () => {
  const { t } = useTranslation();
  const [cows, setCows] = useState([]);
  const [horses, setHorses] = useState([]);
  const [foodStock, setFoodStock] = useState([]);
  const foodTypes = useFoodTypes();

  const fetchAll = useCallback(async () => {
    const [cowsData, horsesData, foodStockData] = await Promise.all([
      fetchCows(),
      fetchHorses(),
      fetchFoodStock()
    ]);
    setCows(cowsData);
    setHorses(horsesData);
    setFoodStock(foodStockData);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Group food stock by type
  const foodStockByType = React.useMemo(() => {
    const grouped = {};
    foodTypes.forEach(type => { grouped[type.id] = []; });
    if (foodStock && Array.isArray(foodStock)) {
      foodStock.forEach(item => {
        if (item.type && grouped[item.type]) grouped[item.type].push(item);
      });
    }
    return grouped;
  }, [foodStock, foodTypes]);

  // Prepare bar chart data for each type
  const foodStockCharts = foodTypes.map(type => {
    const items = foodStockByType[type.id] || [];
    const chartData = items.map(item => ({ name: item.name, quantity: item.quantity }));
    return (
      <TinyBarChart
        key={type.id}
        data={chartData}
        title={`${type.label} (${t('kg')})`}
        emoji={type.emoji}
      />
    );
  });

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>{t('reports_dashboard')}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        <Box sx={{ flex: '1 1 50%', minWidth: 340, maxWidth: 500 }}>
          <PieSection title={t('cows_gender_distribution')} data={getGenderData(cows)} emoji={emojiMap['Cows']} />
        </Box>
        <Box sx={{ flex: '1 1 50%', minWidth: 340, maxWidth: 500 }}>
          <PieSection title={t('horses_gender_distribution')} data={getGenderData(horses)} emoji={emojiMap['Horses']} />
        </Box>
        <Box sx={{ flex: '1 1 50%', minWidth: 340, maxWidth: 500 }}>
          <PieSection title={t('cows_age_groups')} data={getAgeGroupData(cows)} emoji={emojiMap['Cows']} />
        </Box>
        <Box sx={{ flex: '1 1 50%', minWidth: 340, maxWidth: 500 }}>
          <PieSection title={t('horses_age_groups')} data={getAgeGroupData(horses)} emoji={emojiMap['Horses']} />
        </Box>
      </Box>
      <Typography variant="h5" sx={{ mt: 5, mb: 2, textAlign: 'center' }}>{t('foodStock.pageTitle')}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {foodStockCharts}
      </Box>
    </Box>
  );
};

export default Reports;
