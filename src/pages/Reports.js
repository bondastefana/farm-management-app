import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { fetchCows, fetchHorses, fetchFoodStock, fetchAllSoilAnalyses, calculateSoilAnalysisStatistics } from '../services/farmService';
import { calculateAge } from '../services/utils';
import { emojiMap } from '../components/AnimalsTable';
import { useFoodTypes } from '../components/FoodStockTables';

// Chart colors aligned with Natural Farm theme (Beautiful Olive palette)
const COLORS = [
  '#748E63',  // Primary Olive Green (earthy & beautiful)
  '#795548',  // Secondary Brown
  '#FFC107',  // Accent Golden
  '#2196F3',  // Info Blue
  '#9FB892',  // Light Olive Green
  '#FF9800',  // Warning Orange
];

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
        <Bar dataKey="quantity" fill="#748E63" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

const SoilAnalysisTrendChart = ({ data, title, dataKey, unit, color, emoji }) => (
  <Paper sx={{ p: 3, mb: 2, height: 380 }}>
    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
      {title} {emoji && <span style={{ marginLeft: 8, fontSize: 24 }}>{emoji}</span>}
    </Typography>
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis
          label={{ value: unit, angle: -90, position: 'insideLeft' }}
          domain={['dataMin - 0.5', 'dataMax + 0.5']}
        />
        <Tooltip
          formatter={(value) => [`${value} ${unit}`, title]}
          labelStyle={{ fontWeight: 'bold' }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          dot={{ fill: color, r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);

const MultiNutrientChart = ({ data, title, emoji }) => (
  <Paper sx={{ p: 3, mb: 2, height: 400 }}>
    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
      {title} {emoji && <span style={{ marginLeft: 8, fontSize: 24 }}>{emoji}</span>}
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis
          label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="nitrogen"
          name="N (g/kg)"
          stroke="#748E63"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="phosphorus"
          name="P (mg/kg)"
          stroke="#FFC107"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="potassium"
          name="K (mg/kg)"
          stroke="#2196F3"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);

const Reports = () => {
  const { t } = useTranslation();
  const [cows, setCows] = useState([]);
  const [horses, setHorses] = useState([]);
  const [foodStock, setFoodStock] = useState([]);
  const [soilAnalysesTrends, setSoilAnalysesTrends] = useState([]);
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

  const fetchSoilAnalysesTrends = useCallback(async () => {
    try {
      const analyses = await fetchAllSoilAnalyses();

      // Get statistics for each analysis and format for charts
      const trendsData = await Promise.all(
        analyses.map(async (analysis) => {
          const stats = await calculateSoilAnalysisStatistics(analysis.id);

          // Format date
          let dateStr = 'N/A';
          const date = analysis.date || analysis.analysisDate;
          if (date?.toDate) {
            dateStr = date.toDate().toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
          } else if (date instanceof Date) {
            dateStr = date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
          } else if (date?.seconds) {
            dateStr = new Date(date.seconds * 1000).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
          }

          return {
            id: analysis.id,
            date: dateStr,
            dateObj: date?.toDate ? date.toDate() : (date instanceof Date ? date : new Date(date?.seconds * 1000)),
            pH: stats?.averages?.pH || 0,
            nitrogen: stats?.averages?.nitrogen || 0,
            phosphorus: stats?.averages?.phosphorus || 0,
            potassium: stats?.averages?.potassium || 0
          };
        })
      );

      // Sort by date (oldest to newest for trend visualization)
      trendsData.sort((a, b) => a.dateObj - b.dateObj);

      setSoilAnalysesTrends(trendsData);
    } catch (error) {
      console.error('Error fetching soil analyses trends:', error);
      setSoilAnalysesTrends([]);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    fetchSoilAnalysesTrends();
  }, [fetchAll, fetchSoilAnalysesTrends]);

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

      {/* Livestock Charts */}
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

      {/* Food Stock Charts */}
      <Typography variant="h5" sx={{ mt: 5, mb: 2, textAlign: 'center' }}>{t('foodStock.pageTitle')}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {foodStockCharts}
      </Box>

      {/* Soil Analysis Trends */}
      {soilAnalysesTrends.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 5, mb: 3, textAlign: 'center' }}>
            {t('soilAnalysisReports.soilAnalysisTrends', 'Soil Analysis Trends')} 🧪
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
            {/* pH Trend */}
            <Box sx={{ flex: '1 1 100%', minWidth: 340, maxWidth: 900 }}>
              <SoilAnalysisTrendChart
                data={soilAnalysesTrends}
                title={t('soilAnalysisReports.phTrend', 'pH Level Over Time')}
                dataKey="pH"
                unit="pH"
                color="#9C27B0"
                emoji="⚗️"
              />
            </Box>

            {/* Multi-nutrient comparison */}
            <Box sx={{ flex: '1 1 100%', minWidth: 340, maxWidth: 900 }}>
              <MultiNutrientChart
                data={soilAnalysesTrends}
                title={t('soilAnalysisReports.nutrientsTrend', 'Nutrients (N, P, K) Over Time')}
                emoji="🌱"
              />
            </Box>
          </Box>

          {/* Individual Nutrient Charts */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mt: 3 }}>
            {/* Nitrogen Trend */}
            <Box sx={{ flex: '1 1 45%', minWidth: 340, maxWidth: 600 }}>
              <SoilAnalysisTrendChart
                data={soilAnalysesTrends}
                title={t('soilAnalysisReports.nitrogenTrend', 'Nitrogen (N) Trend')}
                dataKey="nitrogen"
                unit="g/kg"
                color="#748E63"
                emoji="🌿"
              />
            </Box>

            {/* Phosphorus Trend */}
            <Box sx={{ flex: '1 1 45%', minWidth: 340, maxWidth: 600 }}>
              <SoilAnalysisTrendChart
                data={soilAnalysesTrends}
                title={t('soilAnalysisReports.phosphorusTrend', 'Phosphorus (P) Trend')}
                dataKey="phosphorus"
                unit="mg/kg"
                color="#FFC107"
                emoji="💛"
              />
            </Box>

            {/* Potassium Trend */}
            <Box sx={{ flex: '1 1 45%', minWidth: 340, maxWidth: 600 }}>
              <SoilAnalysisTrendChart
                data={soilAnalysesTrends}
                title={t('soilAnalysisReports.potassiumTrend', 'Potassium (K) Trend')}
                dataKey="potassium"
                unit="mg/kg"
                color="#2196F3"
                emoji="💙"
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Reports;
