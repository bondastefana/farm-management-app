import React, { useEffect, useState, useCallback } from "react";
import { t } from 'i18next';
import { Grid, Paper, Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchCows, fetchHorses } from '../services/farmService';
import { calculateAge } from '../services/utils';

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
    const age = calculateAge(animal.birthDate);
    if (age <= 2) groups['0-2']++;
    else if (age <= 5) groups['3-5']++;
    else if (age <= 10) groups['6-10']++;
    else groups['10+']++;
  });
  return Object.entries(groups).map(([key, value]) => ({ name: key, value }));
}

const PieSection = ({ title, data }) => (
  <Paper sx={{ p: 2, mb: 2, height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
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

const Reports = () => {
  const [cows, setCows] = useState([]);
  const [horses, setHorses] = useState([]);

  const fetchAll = useCallback(async () => {
    const [cowsData, horsesData] = await Promise.all([fetchCows(), fetchHorses()]);
    setCows(cowsData);
    setHorses(horsesData);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 3 }}>{t('reports_dashboard')}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PieSection title={t('cows_gender_distribution')} data={getGenderData(cows)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieSection title={t('horses_gender_distribution')} data={getGenderData(horses)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieSection title={t('cows_age_groups')} data={getAgeGroupData(cows)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieSection title={t('horses_age_groups')} data={getAgeGroupData(horses)} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
