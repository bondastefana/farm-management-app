import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';

import AnimalsTable from "../components/AnimalsTable"
import AddAnimalForm from "../components/AddAnimalForm";
import { Grid } from "@mui/material";
import { useLoading } from '../contexts/LoadingContext';
import { fetchCows, fetchHorses } from '../services/farmService';
import { COW, HORSE } from '../services/constants';
import { useIsAdmin } from '../contexts/IsAdminContext';

const Livestock = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const isAdmin = useIsAdmin();
  const [cows, setCows] = useState([]);
  const [horses, setHorses] = useState([]);

  const fetchCowsInfo = useCallback(async () => {
    const cowsDetails = await fetchCows();
    setCows(cowsDetails);
  }, [])

  const fetchHorsesInfo = useCallback(async () => {
    const horsesDetails = await fetchHorses();
    setHorses(horsesDetails);
  }, [])

  const fetchAllAnimals = React.useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all([
        fetchCowsInfo(),
        fetchHorsesInfo(),

      ]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [setLoading, fetchCowsInfo, fetchHorsesInfo])


  useEffect(() => {
    fetchAllAnimals();
  }, [fetchAllAnimals])

  return (
    <Grid container spacing={2}>
      {isAdmin && <AddAnimalForm refetchAllAnimals={fetchAllAnimals} />}
      <AnimalsTable animals={horses} type={t('horses')} id={t('horse')} refetchAllAnimals={fetchAllAnimals} />
      <AnimalsTable animals={cows} type={t('cows')} id={t('cow')} refetchAllAnimals={fetchAllAnimals} />
    </Grid>

  )
}

export default Livestock;
