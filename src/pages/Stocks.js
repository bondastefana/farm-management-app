import React, { useEffect, useState, useCallback } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { Inventory, Calculate, CalendarMonth } from "@mui/icons-material";
import { fetchFoodStock } from '../services/farmService';
import AddFoodStockForm from '../components/AddFoodStockForm';
import { useLoading } from '../contexts/LoadingContext';
import FoodStockTables from '../components/FoodStockTables';
import NeededStock from '../components/NeededStock';
import ProductionPlan from '../components/ProductionPlan';
import { useTranslation } from 'react-i18next';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stock-tabpanel-${index}`}
      aria-labelledby={`stock-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `stock-tab-${index}`,
    'aria-controls': `stock-tabpanel-${index}`,
  };
}

export default function Stocks() {
  const { t } = useTranslation();
  const [foodStock, setFoodStock] = useState([]);
  const { setLoading } = useLoading();
  const [tabValue, setTabValue] = useState(0);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    const stocks = await fetchFoodStock();
    setFoodStock(stocks);
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{
      p: { xs: 1, sm: 2, md: 4 },
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw'
    }}>
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: 'clamp(1.25rem, 4vw, 2rem)' }}>
          {t('foodStock.pageTitle')}
        </h2>
      </Box>

      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: { xs: 56, sm: 64 },
              fontSize: { xs: '0.7rem', sm: '0.875rem' },
              fontWeight: 500,
              textTransform: 'none',
              py: { xs: 1, sm: 2 },
              px: { xs: 1, sm: 2 },
              minWidth: { xs: 'auto', sm: 120 },
            },
            '& .MuiTab-iconWrapper': {
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
            },
            '& .MuiTabs-indicator': {
              height: 3,
            }
          }}
        >
          <Tab
            icon={<Inventory />}
            iconPosition="start"
            label={t('foodStock.tabs.currentStock')}
            {...a11yProps(0)}
          />
          <Tab
            icon={<Calculate />}
            iconPosition="start"
            label={t('foodStock.tabs.neededStock')}
            {...a11yProps(1)}
          />
          <Tab
            icon={<CalendarMonth />}
            iconPosition="start"
            label={t('foodStock.tabs.productionPlan')}
            {...a11yProps(2)}
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: { xs: 1, sm: 2 }, pb: 2 }}>
            <AddFoodStockForm onAdd={fetchStock} />
            <FoodStockTables foodStock={foodStock} fetchStock={fetchStock} />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: { xs: 1, sm: 2 }, pb: 2 }}>
            <NeededStock />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: { xs: 1, sm: 2 }, pb: 2 }}>
            <ProductionPlan />
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}
