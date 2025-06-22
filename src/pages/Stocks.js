import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { fetchFoodStock } from '../services/farmService';
import AddFoodStockForm from '../components/AddFoodStockForm';
import { useLoading } from '../contexts/LoadingContext';
import FoodStockTables from '../components/FoodStockTables';
import { useTranslation } from 'react-i18next';

export default function Stocks() {
  const { t } = useTranslation();
  const [foodStock, setFoodStock] = useState([]);
  const { setLoading } = useLoading();

  const fetchStock = useCallback(async () => {
    setLoading(true);
    const stocks = await fetchFoodStock();
    setFoodStock(stocks);
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  return (
    <Box sx={{ p: 4, width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
      <Box sx={{ mb: 4 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{t('foodStock.pageTitle')}</h2>
      </Box>
      <AddFoodStockForm onAdd={fetchStock} />
      <FoodStockTables foodStock={foodStock} fetchStock={fetchStock} />
    </Box>
  );
}
