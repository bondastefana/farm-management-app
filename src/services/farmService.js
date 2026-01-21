import {
  WbSunny,
  Cloud,
  Thunderstorm,
  AcUnit,
  NightsStay,
  FilterDrama,
  CloudySnowing
} from "@mui/icons-material";

import { addDoc, collection, getDocs, deleteDoc, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import i18n from '../i18n';

export const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const notesCollectionRef = collection(db, 'notes');
const tasksCollectionRef = collection(db, 'tasks');
const usersCollectionRef = collection(db, 'users');
const cowsCollectionRef = collection(db, 'livestock', 'animalsInfo', 'cow');
const horseCollectionRef = collection(db, 'livestock', 'animalsInfo', 'horse');
const authCollectionRef = collection(db, 'authentication');
const foodStockCollectionRef = collection(db, 'foodstock');
const consumptionRatesCollectionRef = collection(db, 'consumptionRates');
const productionPlansCollectionRef = collection(db, 'productionPlans');

export const getDayName = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = daysOfWeek[date.getDay()].toLocaleLowerCase();
  return i18n.t(day);
};

export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('ro-RO', {});
};

export const getWeatherIcon = (condition, size = 'large') => {
  let iconProps = { fontSize: size };
  let style = {};
  switch (condition) {
    case "Clear":
      style = { fill: '#FFD600' }; // yellow
      return <WbSunny {...iconProps} style={style} />;
    case "Clouds":
      style = { fill: '#90A4AE' }; // blue-grey
      return <Cloud {...iconProps} style={style} />;
    case "Rain":
    case "Drizzle":
      style = { fill: '#2196F3' }; // blue
      return <CloudySnowing {...iconProps} style={style} />;
    case "Thunderstorm":
      style = { fill: '#673AB7' }; // deep purple
      return <Thunderstorm {...iconProps} style={style} />;
    case "Snow":
      style = { fill: '#B3E5FC' }; // light blue
      return <AcUnit {...iconProps} style={style} />;
    case "Mist":
    case "Smoke":
    case "Haze":
    case "Dust":
    case "Fog":
    case "Sand":
    case "Ash":
    case "Squall":
    case "Tornado":
      style = { fill: '#B0BEC5' }; // grey
      return <FilterDrama {...iconProps} style={style} />;
    case "Night":
      style = { fill: '#263238' }; // dark blue-grey
      return <NightsStay {...iconProps} style={style} />;
    default:
      style = { fill: '#FFD600' };
      return <WbSunny {...iconProps} style={style} />;
  }
};

export const fetchEmployees = async () => {
  try {
    const snapshot = await getDocs(usersCollectionRef);
    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return employees;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

export const fetchCows = async () => {
  try {
    const snapshot = await getDocs(cowsCollectionRef);
    const cows = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      species: 'cow',
    }));
    return cows;
  } catch (error) {
    console.error("Error fetching livestock:", error);
    return [];
  }
};

export const fetchHorses = async () => {
  try {
    const snapshot = await getDocs(horseCollectionRef);
    const horse = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      species: 'horse',
    }));
    return horse;
  } catch (error) {
    console.error("Error fetching livestock:", error);
    return [];
  }
};

// Fetch all animals from all species collections
// Returns an object with species as keys and arrays of animals as values
//
// TO ADD A NEW SPECIES:
// 1. Create a collection reference at the top of this file:
//    const sheepCollectionRef = collection(db, 'livestock', 'animalsInfo', 'sheep');
// 2. Add it to the speciesCollections array below:
//    { name: 'sheep', ref: sheepCollectionRef }
// 3. Add translation keys for the species name in i18n.js (e.g., 'sheep', 'sheeps')
// 4. The Needed Stock page will automatically detect and display the new species!
export const fetchAllAnimalsBySpecies = async () => {
  try {
    // List of known species collections - easily extensible for new species
    const speciesCollections = [
      { name: 'cow', ref: cowsCollectionRef },
      { name: 'horse', ref: horseCollectionRef },
      // Add more species here as they are added to the database
      // e.g., { name: 'sheep', ref: sheepCollectionRef },
    ];

    const animalsBySpecies = {};

    for (const { name, ref } of speciesCollections) {
      try {
        const snapshot = await getDocs(ref);
        const animals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          species: name,
        }));
        if (animals.length > 0) {
          animalsBySpecies[name] = animals;
        }
      } catch (error) {
        console.error(`Error fetching ${name}:`, error);
        // Continue with other species even if one fails
      }
    }

    return animalsBySpecies;
  } catch (error) {
    console.error("Error fetching all animals:", error);
    return {};
  }
};

export const addAnimal = async ({ animalId, birthDate, gender, observation, treatment, species }) => {
  const newAnimal = {
    animalId,
    birthDate,
    gender,
    observation,
    treatment,
  };
  let collectionToAdd;
  if (species === 'cow') {
    collectionToAdd = cowsCollectionRef;
  } else if (species === 'horse') {
    collectionToAdd = horseCollectionRef;
  } else {
    console.error('Unknown species for addAnimal:', species);
    return false;
  }
  try {
    await addDoc(collectionToAdd, newAnimal);
    return true;
  } catch (error) {
    console.error('Error adding animal:', error);
    return false;
  }
};


export const fetchNotes = async () => {
  try {
    const snapshot = await getDocs(notesCollectionRef);
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

export const fetchTasks = async () => {
  try {
    const snapshot = await getDocs(tasksCollectionRef);
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// Add a new note
export const addNote = async (note) => {
  try {
    await addDoc(notesCollectionRef, note);
    return true;
  } catch (error) {
    console.error("Error adding note:", error);
    return false;
  }
};

export const updateNote = async (noteId, updatedData) => {
  try {
    const noteDoc = doc(db, "notes", noteId);
    await updateDoc(noteDoc, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating note:", error);
    return false;
  }
};


// Delete a note
export const deleteNote = async (noteId) => {
  try {
    const noteDoc = doc(db, "notes", noteId);
    await deleteDoc(noteDoc);
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
};

export const saveNote = async (note) => {
  try {
    await setDoc(doc(db, "dashboard", "notes"), { content: note });
  } catch (error) {
    console.error("Error saving note:", error);
  }
};

export const addTask = async (task) => {
  try {
    await addDoc(tasksCollectionRef, task);
    return true;
  } catch (error) {
    console.error("Error adding task:", error);
    return false;
  }
};

export const updateTask = async (taskId, updatedData) => {
  try {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating task:", error);
    return false;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const taskDoc = doc(db, "tasks", taskId);
    await deleteDoc(taskDoc);
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};

export const authenticateUser = async (username, password) => {
  try {
    const snapshot = await getDocs(authCollectionRef);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const user = users.find(u => (u.userName === username) && u.password === password);
    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authUser', JSON.stringify({ id: user.id, username: user.userName, firstName: user.firstName, lastName: user.lastName }));
      return true;
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authUser');
      return false;
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authUser');
    return false;
  }
};

export const updateEmployee = async (userName, updatedData) => {
  try {
    // Update in authentication collection
    const authSnapshot = await getDocs(authCollectionRef);
    const authDoc = authSnapshot.docs.find(doc => doc.data().userName === userName);
    if (authDoc) {
      await updateDoc(doc(db, 'authentication', authDoc.id), updatedData);
    }
    // Update in users collection
    const usersSnapshot = await getDocs(usersCollectionRef);
    const userDoc = usersSnapshot.docs.find(doc => doc.data().userName === userName);
    if (userDoc) {
      await updateDoc(doc(db, 'users', userDoc.id), updatedData);
    }
    return true;
  } catch (error) {
    console.error('Error updating employee:', error);
    return false;
  }
};

export const deleteEmployee = async (userName) => {
  try {
    // Delete from authentication collection
    const authSnapshot = await getDocs(authCollectionRef);
    const authDoc = authSnapshot.docs.find(doc => doc.data().userName === userName);
    if (authDoc) {
      await deleteDoc(doc(db, 'authentication', authDoc.id));
    }
    // Delete from users collection
    const usersSnapshot = await getDocs(usersCollectionRef);
    const userDoc = usersSnapshot.docs.find(doc => doc.data().userName === userName);
    if (userDoc) {
      await deleteDoc(doc(db, 'users', userDoc.id));
    }
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    return false;
  }
};

export const updateAnimal = async (species, animalId, updatedData) => {
  let collectionRef;
  if (species === 'cow') {
    collectionRef = cowsCollectionRef;
  } else if (species === 'horse') {
    collectionRef = horseCollectionRef;
  } else {
    console.error('Unknown species for updateAnimal:', species);
    return false;
  }
  try {
    const snapshot = await getDocs(collectionRef);
    const docToUpdate = snapshot.docs.find(doc => doc.data().animalId === animalId);
    if (!docToUpdate) return false;
    await updateDoc(doc(db, docToUpdate.ref.path), updatedData);
    return true;
  } catch (error) {
    console.error('Error updating animal:', error);
    return false;
  }
};

export const deleteAnimal = async (species, animalId) => {
  let collectionRef;
  if (species === 'cow') {
    collectionRef = cowsCollectionRef;
  } else if (species === 'horse') {
    collectionRef = horseCollectionRef;
  } else {
    console.error('Unknown species for deleteAnimal:', species);
    return false;
  }
  try {
    const snapshot = await getDocs(collectionRef);
    const docToDelete = snapshot.docs.find(doc => doc.data().animalId === animalId);
    if (!docToDelete) return false;
    await deleteDoc(doc(db, docToDelete.ref.path));
    return true;
  } catch (error) {
    console.error('Error deleting animal:', error);
    return false;
  }
};

// --- Food Stock ---
export const fetchFoodStock = async () => {
  try {
    const snapshot = await getDocs(foodStockCollectionRef);
    const foodStocks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return foodStocks;
  } catch (error) {
    console.error('Error fetching food stock:', error);
    return [];
  }
};

export const updateFoodStock = async (docId, updatedData) => {
  try {
    const foodDoc = doc(db, 'foodstock', docId);
    await updateDoc(foodDoc, updatedData);
    return true;
  } catch (error) {
    console.error('Error updating food stock:', error);
    return false;
  }
};

export const addFoodStock = async (data) => {
  try {
    await addDoc(foodStockCollectionRef, data);
    return true;
  } catch (error) {
    console.error('Error adding food stock:', error);
    return false;
  }
};

// --- Location Conditions ---

// Fetch location conditions from Firebase
export const fetchLocationConditions = async () => {
  try {
    const docRef = doc(db, 'locationConditions', 'farmLocationData');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching location conditions:", error);
    return null;
  }
};

// Save location conditions (full document or merge)
export const saveLocationConditions = async (data) => {
  try {
    const docRef = doc(db, 'locationConditions', 'farmLocationData');
    await setDoc(docRef, {
      ...data,
      lastUpdated: new Date()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving location conditions:", error);
    return false;
  }
};

// Update specific field (for manual overrides)
export const updateLocationConditionField = async (fieldPath, fieldData) => {
  try {
    const docRef = doc(db, 'locationConditions', 'farmLocationData');
    const updateData = {
      [fieldPath]: fieldData,
      lastUpdated: new Date()
    };
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating location condition field:", error);
    return false;
  }
};

// Helper: Calculate average from array
const calculateAverage = (arr) => {
  const validValues = arr.filter(v => v !== null && v !== undefined && !isNaN(v));
  if (validValues.length === 0) return null;
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / validValues.length).toFixed(1));
};

// Helper: Calculate annual average precipitation
const calculateAnnualAverage = (precipArray) => {
  if (!precipArray || precipArray.length === 0) return null;
  const total = precipArray.reduce((sum, val) => sum + (val || 0), 0);
  const years = precipArray.length / 365;
  return Math.round(total / years);
};

// Helper: Calculate frost days per year
const calculateFrostDays = (tempArray) => {
  if (!tempArray || tempArray.length === 0) return null;
  const frostDays = tempArray.filter(temp => temp !== null && temp < 0).length;
  const years = tempArray.length / 365;
  return Math.round(frostDays / years);
};

// Helper: Classify single soil type from percentages
const classifySoilType = (clay, sand, silt) => {
  // USDA soil texture classification (more comprehensive)
  if (clay >= 40) {
    if (sand >= 45) return "Sandy Clay";
    if (silt >= 40) return "Silty Clay";
    return "Clay";
  }
  if (sand >= 85 && clay < 10) return "Sand";
  if (silt >= 80 && clay < 12) return "Silt";
  if (silt >= 50 && clay >= 12 && clay < 27) return "Silty Clay Loam";
  if (clay >= 27 && clay < 40) {
    if (sand >= 20 && sand < 45) return "Clay Loam";
    if (sand >= 45) return "Sandy Clay Loam";
    return "Silty Clay Loam";
  }
  if (clay >= 7 && clay < 27) {
    if (sand >= 52) return "Sandy Loam";
    if (silt >= 28 && silt < 50) return "Loam";
    if (silt >= 50) return "Silt Loam";
  }
  if (sand >= 70 && clay < 7) {
    if (sand >= 85) return "Sand";
    return "Loamy Sand";
  }
  return "Loam";
};

// Helper: Determine all soil types from multiple depths
const determineSoilType = (properties) => {
  try {
    const clayLayer = properties.layers.find(l => l.name === 'clay');
    const sandLayer = properties.layers.find(l => l.name === 'sand');
    const siltLayer = properties.layers.find(l => l.name === 'silt');

    if (!clayLayer || !sandLayer || !siltLayer) return "Unknown";

    const soilTypes = new Set();
    const maxDepths = Math.min(
      clayLayer.depths?.length || 0,
      sandLayer.depths?.length || 0,
      siltLayer.depths?.length || 0
    );

    // Analyze soil at different depths
    for (let i = 0; i < maxDepths && i < 3; i++) { // Check first 3 depth layers
      const clay = clayLayer.depths[i]?.values?.mean || 0;
      const sand = sandLayer.depths[i]?.values?.mean || 0;
      const silt = siltLayer.depths[i]?.values?.mean || 0;

      if (clay > 0 || sand > 0 || silt > 0) {
        const soilType = classifySoilType(clay, sand, silt);
        soilTypes.add(soilType);
      }
    }

    // Return comma-separated unique soil types
    return soilTypes.size > 0 ? Array.from(soilTypes).join(", ") : "Loam";
  } catch (error) {
    console.error("Error determining soil type:", error);
    return "Unknown";
  }
};

// Helper: Calculate water retention from soil properties
const calculateWaterRetention = (properties) => {
  try {
    const clayLayer = properties.layers.find(l => l.name === 'clay');
    const sandLayer = properties.layers.find(l => l.name === 'sand');

    const clay = clayLayer?.depths?.[0]?.values?.mean || 0;
    const sand = sandLayer?.depths?.[0]?.values?.mean || 0;

    // Simplified water retention estimate
    // Clay retains more water, sand retains less
    const retention = 40 - (sand * 0.3) + (clay * 0.2);
    return Math.max(10, Math.min(40, Math.round(retention)));
  } catch (error) {
    console.error("Error calculating water retention:", error);
    return null;
  }
};

// Fetch all external API data
export const fetchExternalLocationData = async (latitude, longitude) => {
  const results = {
    climate: null,
    soil: null,
    altitude: null,
    errors: []
  };

  // Fetch climate data from Open-Meteo
  try {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear - 5}-01-01`;
    const endDate = `${currentYear - 1}-12-31`;

    const climateUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum&timezone=auto`;
    const climateResponse = await fetch(climateUrl);
    const climateData = await climateResponse.json();

    if (climateData.daily) {
      results.climate = {
        temperature: {
          value: calculateAverage(climateData.daily.temperature_2m_mean),
          unit: "°C",
          source: "auto",
          lastModified: new Date()
        },
        precipitation: {
          value: calculateAnnualAverage(climateData.daily.precipitation_sum),
          unit: "mm/year",
          source: "auto",
          lastModified: new Date()
        },
        frostDays: {
          value: calculateFrostDays(climateData.daily.temperature_2m_mean),
          unit: "days/year",
          source: "auto",
          lastModified: new Date()
        }
      };
    }
  } catch (error) {
    console.error("Error fetching climate data:", error);
    results.errors.push("climate");
  }

  // Fetch soil data from SoilGrids (including nitrogen)
  try {
    const soilUrl = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${longitude}&lat=${latitude}&property=phh2o&property=clay&property=sand&property=silt&property=nitrogen&depth=0-5cm&value=mean`;
    const soilResponse = await fetch(soilUrl);
    const soilData = await soilResponse.json();

    console.log("SoilGrids API response:", soilData);

    if (soilData.properties && soilData.properties.layers) {
      const phLayer = soilData.properties.layers.find(l => l.name === 'phh2o');
      const phValue = phLayer?.depths?.[0]?.values?.mean;

      // Get nitrogen data (in cg/kg, convert to g/kg)
      const nitrogenLayer = soilData.properties.layers.find(l => l.name === 'nitrogen');
      const nitrogenValue = nitrogenLayer?.depths?.[0]?.values?.mean;

      console.log("pH layer found:", phLayer);
      console.log("pH value (raw):", phValue);
      console.log("Nitrogen layer found:", nitrogenLayer);
      console.log("Nitrogen value (raw):", nitrogenValue);

      results.soil = {
        pH: {
          value: phValue ? parseFloat((phValue / 10).toFixed(1)) : null,
          unit: "",
          source: "auto",
          lastModified: new Date()
        },
        soilType: {
          value: determineSoilType(soilData.properties),
          unit: "",
          source: "auto",
          lastModified: new Date()
        },
        waterRetention: {
          value: calculateWaterRetention(soilData.properties),
          unit: "%",
          source: "auto",
          lastModified: new Date()
        },
        nitrogen: {
          value: nitrogenValue ? parseFloat((nitrogenValue / 100).toFixed(1)) : null,
          unit: "g/kg",
          source: "auto",
          lastModified: new Date()
        }
      };
    } else {
      console.error("SoilGrids API unexpected structure:", soilData);
    }
  } catch (error) {
    console.error("Error fetching soil data:", error);
    results.errors.push("soil");
  }

  // Fetch altitude data from Open-Elevation
  try {
    const altitudeUrl = `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`;
    const altitudeResponse = await fetch(altitudeUrl);
    const altitudeData = await altitudeResponse.json();

    if (altitudeData.results && altitudeData.results.length > 0) {
      results.altitude = {
        elevation: {
          value: altitudeData.results[0].elevation,
          unit: "m",
          source: "auto",
          lastModified: new Date()
        }
      };
    }
  } catch (error) {
    console.error("Error fetching altitude data:", error);
    results.errors.push("altitude");
  }

  // Calculate water availability from precipitation and soil water retention
  if (results.climate?.precipitation?.value && results.soil?.waterRetention?.value) {
    const precipitation = results.climate.precipitation.value;
    const retention = results.soil.waterRetention.value;

    // Water availability index (0-100) based on precipitation and soil retention
    // Formula: considers both annual precipitation and soil's ability to retain water
    const baseAvailability = Math.min(100, (precipitation / 10)); // Scale precipitation (1000mm = 100)
    const retentionBonus = (retention / 100) * 15; // Up to 15 bonus points from retention
    const waterAvailability = Math.min(100, Math.round(baseAvailability + retentionBonus));

    results.waterAvailability = {
      value: waterAvailability,
      unit: "index",
      source: "auto",
      lastModified: new Date(),
      description: "Calculated from precipitation and soil water retention"
    };
  }

  return results;
};

// --- Crop Recommendations ---

// Crop database with research-based optimal growing conditions
// Data sources: FAO, USDA, European Commission Agricultural Research,
// Romanian National Institute for Research and Development in Soil Science
const cropDatabase = {
  corn: {
    name: "Corn",
    // Source: FAO crop requirements, optimal for grain corn (Zea mays)
    optimalTemp: { min: 16, max: 32, ideal: 24 },
    optimalPrecipitation: { min: 500, max: 900, ideal: 700 },
    optimalFrostDays: { max: 25 },  // Very frost-sensitive
    optimalPH: { min: 5.5, max: 7.8, ideal: 6.5 },
    suitableSoilTypes: ["Loam", "Clay Loam", "Sandy Loam", "Silt Loam", "Sandy Clay Loam"],
    optimalElevation: { max: 1800 },
    optimalNitrogen: { min: 1.0, max: 5.0, ideal: 2.5 },  // g/kg soil nitrogen
    optimalWaterAvailability: { min: 50, max: 90, ideal: 70 },  // Water availability index
    unsuitableAfterCrops: ["corn"],  // Avoid corn-after-corn
    benefitsAfterCrops: ["soybean", "clover", "alfalfa"]  // Benefits from nitrogen-fixing crops
  },
  wheat: {
    name: "Wheat",
    // Source: CIMMYT, FAO - Winter wheat (Triticum aestivum)
    optimalTemp: { min: 10, max: 24, ideal: 17 },
    optimalPrecipitation: { min: 375, max: 875, ideal: 550 },
    optimalFrostDays: { max: 90 },  // Cold-tolerant, requires vernalization
    optimalPH: { min: 6.0, max: 7.5, ideal: 6.8 },
    suitableSoilTypes: ["Loam", "Clay Loam", "Silt Loam", "Silty Clay Loam"],
    optimalElevation: { max: 2500 },
    optimalNitrogen: { min: 1.2, max: 4.0, ideal: 2.2 },
    optimalWaterAvailability: { min: 40, max: 85, ideal: 55 },
    unsuitableAfterCrops: ["wheat", "barley"],
    benefitsAfterCrops: ["clover", "alfalfa", "soybean"]
  },
  barley: {
    name: "Barley",
    // Source: FAO, ICARDA - Spring/Winter barley (Hordeum vulgare)
    optimalTemp: { min: 8, max: 22, ideal: 15 },
    optimalPrecipitation: { min: 300, max: 700, ideal: 475 },
    optimalFrostDays: { max: 100 },  // Very cold-tolerant
    optimalPH: { min: 6.0, max: 8.5, ideal: 7.5 },
    suitableSoilTypes: ["Loam", "Clay Loam", "Sandy Loam", "Silt Loam", "Sandy Clay Loam"],
    optimalElevation: { max: 3000 },
    optimalNitrogen: { min: 1.0, max: 3.5, ideal: 2.0 },
    optimalWaterAvailability: { min: 30, max: 70, ideal: 48 },
    unsuitableAfterCrops: ["barley", "wheat"],
    benefitsAfterCrops: ["clover", "alfalfa"]
  },
  potato: {
    name: "Potato",
    // Source: International Potato Center (CIP), FAO
    optimalTemp: { min: 10, max: 24, ideal: 18 },
    optimalPrecipitation: { min: 500, max: 750, ideal: 625 },
    optimalFrostDays: { max: 30 },  // Frost-sensitive tubers
    optimalPH: { min: 4.5, max: 6.5, ideal: 5.5 },  // Prefers acidic soil
    suitableSoilTypes: ["Sandy Loam", "Loam", "Silt Loam", "Loamy Sand"],
    optimalElevation: { max: 2500 },
    optimalNitrogen: { min: 1.5, max: 4.5, ideal: 2.8 },
    optimalWaterAvailability: { min: 50, max: 75, ideal: 63 },
    unsuitableAfterCrops: ["potato", "sugar_beet"],
    benefitsAfterCrops: ["clover", "wheat"]
  },
  sunflower: {
    name: "Sunflower",
    // Source: FAO, USDA - Oil sunflower (Helianthus annuus)
    optimalTemp: { min: 18, max: 32, ideal: 25 },
    optimalPrecipitation: { min: 400, max: 650, ideal: 525 },
    optimalFrostDays: { max: 15 },  // Frost-sensitive
    optimalPH: { min: 6.0, max: 7.5, ideal: 6.5 },
    suitableSoilTypes: ["Loam", "Clay Loam", "Sandy Loam", "Silt Loam", "Sandy Clay Loam"],
    optimalElevation: { max: 1800 },
    optimalNitrogen: { min: 1.0, max: 3.5, ideal: 2.0 },
    optimalWaterAvailability: { min: 40, max: 65, ideal: 53 },
    unsuitableAfterCrops: ["sunflower"],
    benefitsAfterCrops: ["wheat", "corn"]
  },
  soybean: {
    name: "Soybean",
    // Source: USDA, FAO - Glycine max (nitrogen-fixing crop)
    optimalTemp: { min: 20, max: 30, ideal: 25 },
    optimalPrecipitation: { min: 500, max: 1000, ideal: 750 },
    optimalFrostDays: { max: 10 },  // Very frost-sensitive
    optimalPH: { min: 6.0, max: 7.0, ideal: 6.5 },
    suitableSoilTypes: ["Loam", "Clay Loam", "Silt Loam", "Silty Clay Loam"],
    optimalElevation: { max: 1500 },
    optimalNitrogen: { min: 0.8, max: 3.0, ideal: 1.5 },  // Lower requirement (nitrogen-fixing)
    optimalWaterAvailability: { min: 50, max: 100, ideal: 75 },
    unsuitableAfterCrops: ["soybean", "alfalfa", "clover"],
    benefitsAfterCrops: ["corn", "wheat"]
  },
  oats: {
    name: "Oats",
    // Source: FAO, USDA - Avena sativa
    optimalTemp: { min: 7, max: 21, ideal: 13 },
    optimalPrecipitation: { min: 400, max: 800, ideal: 600 },
    optimalFrostDays: { max: 120 },  // Very cold-tolerant
    optimalPH: { min: 5.0, max: 7.0, ideal: 6.0 },  // Tolerates acidic soils
    suitableSoilTypes: ["Loam", "Clay Loam", "Sandy Loam", "Silt Loam", "Sandy Clay Loam"],
    optimalElevation: { max: 2800 },
    optimalNitrogen: { min: 1.0, max: 3.5, ideal: 2.0 },
    optimalWaterAvailability: { min: 40, max: 80, ideal: 60 },
    unsuitableAfterCrops: ["oats"],
    benefitsAfterCrops: ["clover", "alfalfa"]
  },
  rapeseed: {
    name: "Rapeseed",
    // Source: FAO, European Commission - Brassica napus (winter rapeseed)
    optimalTemp: { min: 12, max: 24, ideal: 18 },
    optimalPrecipitation: { min: 400, max: 750, ideal: 575 },
    optimalFrostDays: { max: 70 },  // Requires cold period for vernalization
    optimalPH: { min: 5.5, max: 8.0, ideal: 6.5 },
    suitableSoilTypes: ["Loam", "Clay Loam", "Silt Loam", "Silty Clay Loam"],
    optimalElevation: { max: 2000 },
    optimalNitrogen: { min: 1.5, max: 5.0, ideal: 3.0 },
    optimalWaterAvailability: { min: 40, max: 75, ideal: 58 },
    unsuitableAfterCrops: ["rapeseed", "sunflower"],
    benefitsAfterCrops: ["wheat", "barley"]
  },
  alfalfa: {
    name: "Alfalfa",
    // Source: FAO, USDA - Medicago sativa (nitrogen-fixing perennial forage)
    optimalTemp: { min: 15, max: 30, ideal: 22 },
    optimalPrecipitation: { min: 400, max: 900, ideal: 650 },
    optimalFrostDays: { max: 60 },  // Moderately cold-tolerant when established
    optimalPH: { min: 6.5, max: 8.0, ideal: 7.2 },  // Prefers neutral to alkaline
    suitableSoilTypes: ["Loam", "Clay Loam", "Sandy Loam", "Silt Loam"],
    optimalElevation: { max: 2200 },
    optimalNitrogen: { min: 0.8, max: 3.0, ideal: 1.5 },  // Lower requirement (nitrogen-fixing)
    optimalWaterAvailability: { min: 40, max: 90, ideal: 65 },
    unsuitableAfterCrops: ["alfalfa", "clover"],
    benefitsAfterCrops: ["corn", "wheat", "potato"]
  },
  sugar_beet: {
    name: "Sugar Beet",
    // Source: FAO, European Commission - Beta vulgaris
    optimalTemp: { min: 12, max: 26, ideal: 19 },
    optimalPrecipitation: { min: 450, max: 700, ideal: 575 },
    optimalFrostDays: { max: 40 },  // Moderately frost-tolerant
    optimalPH: { min: 6.5, max: 8.0, ideal: 7.2 },  // Prefers neutral to alkaline
    suitableSoilTypes: ["Loam", "Clay Loam", "Silt Loam", "Silty Clay Loam"],
    optimalElevation: { max: 1600 },
    optimalNitrogen: { min: 1.5, max: 4.5, ideal: 2.8 },
    optimalWaterAvailability: { min: 45, max: 70, ideal: 58 },
    unsuitableAfterCrops: ["sugar_beet", "potato"],
    benefitsAfterCrops: ["wheat", "barley"]
  },
  rye: {
    name: "Rye",
    // Source: FAO - Secale cereale (winter rye)
    optimalTemp: { min: 5, max: 20, ideal: 12 },
    optimalPrecipitation: { min: 300, max: 700, ideal: 500 },
    optimalFrostDays: { max: 140 },  // Extremely cold-tolerant
    optimalPH: { min: 5.0, max: 7.0, ideal: 6.0 },  // Tolerates poor, acidic soils
    suitableSoilTypes: ["Loam", "Sandy Loam", "Loamy Sand", "Clay Loam"],
    optimalElevation: { max: 3000 },
    optimalNitrogen: { min: 0.8, max: 3.0, ideal: 1.5 },  // Tolerates low nitrogen
    optimalWaterAvailability: { min: 30, max: 70, ideal: 50 },
    unsuitableAfterCrops: ["rye"],
    benefitsAfterCrops: ["clover", "potato"]
  },
  clover: {
    name: "Clover",
    // Source: FAO - Trifolium pratense (red clover, nitrogen-fixing)
    optimalTemp: { min: 10, max: 25, ideal: 18 },
    optimalPrecipitation: { min: 500, max: 1000, ideal: 750 },
    optimalFrostDays: { max: 80 },  // Cold-tolerant
    optimalPH: { min: 6.0, max: 7.5, ideal: 6.8 },
    suitableSoilTypes: ["Loam", "Clay Loam", "Silt Loam", "Silty Clay Loam"],
    optimalElevation: { max: 2400 },
    optimalNitrogen: { min: 0.5, max: 2.5, ideal: 1.2 },  // Lowest requirement (nitrogen-fixing)
    optimalWaterAvailability: { min: 50, max: 100, ideal: 75 },
    unsuitableAfterCrops: ["clover", "alfalfa"],
    benefitsAfterCrops: ["corn", "wheat", "potato", "rapeseed"]
  }
};

// Calculate suitability score for a specific parameter
const calculateParameterScore = (value, optimal) => {
  if (value === null || value === undefined) return 50; // Neutral if unknown

  // For parameters with min/max/ideal
  if (optimal.ideal !== undefined) {
    if (value === optimal.ideal) return 100;

    if (value < optimal.ideal) {
      // Between min and ideal
      if (optimal.min !== undefined && value >= optimal.min) {
        return 70 + ((value - optimal.min) / (optimal.ideal - optimal.min)) * 30;
      }
      // Below min
      if (optimal.min !== undefined && value < optimal.min) {
        const deviation = optimal.min - value;
        return Math.max(0, 70 - deviation * 5);
      }
    } else {
      // Between ideal and max
      if (optimal.max !== undefined && value <= optimal.max) {
        return 70 + ((optimal.max - value) / (optimal.max - optimal.ideal)) * 30;
      }
      // Above max
      if (optimal.max !== undefined && value > optimal.max) {
        const deviation = value - optimal.max;
        return Math.max(0, 70 - deviation * 5);
      }
    }
    return 70;
  }

  // For parameters with only max (like frost days)
  if (optimal.max !== undefined && optimal.min === undefined) {
    if (value <= optimal.max) return 100;
    const deviation = value - optimal.max;
    return Math.max(0, 100 - deviation * 2);
  }

  // For parameters with only min
  if (optimal.min !== undefined && optimal.max === undefined) {
    if (value >= optimal.min) return 100;
    const deviation = optimal.min - value;
    return Math.max(0, 100 - deviation * 2);
  }

  return 50;
};

// Calculate soil type compatibility
const calculateSoilTypeScore = (soilTypes, suitableSoilTypes) => {
  if (!soilTypes) return 50;

  // Handle multiple soil types (comma-separated)
  const locationSoilTypes = typeof soilTypes === 'string'
    ? soilTypes.split(',').map(s => s.trim())
    : [soilTypes];

  // Check if any location soil type matches suitable types
  const matches = locationSoilTypes.filter(type =>
    suitableSoilTypes.some(suitable =>
      type.toLowerCase().includes(suitable.toLowerCase()) ||
      suitable.toLowerCase().includes(type.toLowerCase())
    )
  );

  if (matches.length === 0) return 40;
  if (matches.length === locationSoilTypes.length) return 100;
  return 70 + (matches.length / locationSoilTypes.length) * 30;
};

// Calculate crop rotation score
const calculateCropRotationScore = (previousCropId, crop, cropId) => {
  if (!previousCropId) return 50; // Neutral if no previous crop data

  // Check if current crop is unsuitable after previous crop
  if (crop.unsuitableAfterCrops && crop.unsuitableAfterCrops.includes(previousCropId)) {
    return 20; // Heavy penalty for poor rotation
  }

  // Check if current crop benefits from previous crop
  if (crop.benefitsAfterCrops && crop.benefitsAfterCrops.includes(previousCropId)) {
    return 100; // Bonus for good rotation
  }

  // Check if previous crop was same as current (monoculture)
  if (previousCropId === cropId) {
    return 30; // Penalty for monoculture
  }

  return 70; // Neutral rotation
};

// Generate farmer-friendly explanation for a score
const getScoreExplanation = (score, paramName) => {
  if (score >= 90) return { level: 'excellent', key: 'excellent' };
  if (score >= 75) return { level: 'good', key: 'good' };
  if (score >= 60) return { level: 'moderate', key: 'moderate' };
  if (score >= 40) return { level: 'acceptable', key: 'acceptable' };
  return { level: 'low', key: 'low' };
};

// Main crop recommendation function
export const getCropRecommendations = (locationConditions) => {
  if (!locationConditions) return [];

  const recommendations = [];
  const previousCropId = locationConditions.previousCrop?.cropId;

  Object.entries(cropDatabase).forEach(([cropId, crop]) => {
    const scores = {
      temperature: 0,
      precipitation: 0,
      frostDays: 0,
      pH: 0,
      soilType: 0,
      elevation: 0,
      nitrogen: 0,
      waterAvailability: 0,
      cropRotation: 0
    };

    // Calculate individual parameter scores
    scores.temperature = calculateParameterScore(
      locationConditions.climate?.temperature?.value,
      crop.optimalTemp
    );

    scores.precipitation = calculateParameterScore(
      locationConditions.climate?.precipitation?.value,
      crop.optimalPrecipitation
    );

    scores.frostDays = calculateParameterScore(
      locationConditions.climate?.frostDays?.value,
      crop.optimalFrostDays
    );

    scores.pH = calculateParameterScore(
      locationConditions.soil?.pH?.value,
      crop.optimalPH
    );

    scores.soilType = calculateSoilTypeScore(
      locationConditions.soil?.soilType?.value,
      crop.suitableSoilTypes
    );

    scores.elevation = calculateParameterScore(
      locationConditions.altitude?.elevation?.value,
      crop.optimalElevation
    );

    scores.nitrogen = calculateParameterScore(
      locationConditions.soil?.nitrogen?.value,
      crop.optimalNitrogen
    );

    scores.waterAvailability = calculateParameterScore(
      locationConditions.waterAvailability?.value,
      crop.optimalWaterAvailability
    );

    scores.cropRotation = calculateCropRotationScore(
      previousCropId,
      crop,
      cropId
    );

    // Weight the scores (adjusted to include new parameters)
    const weights = {
      temperature: 0.20,      // Climate is critical
      precipitation: 0.15,    // Water from rain
      frostDays: 0.12,        // Cold tolerance
      pH: 0.12,               // Soil chemistry
      soilType: 0.12,         // Soil structure
      elevation: 0.08,        // Altitude effects
      nitrogen: 0.10,         // Soil fertility
      waterAvailability: 0.08, // Overall water
      cropRotation: 0.03      // Rotation bonus/penalty
    };

    // Calculate weighted average
    const totalScore = Object.entries(scores).reduce((sum, [param, score]) => {
      return sum + (score * weights[param]);
    }, 0);

    // Generate explanations for each parameter
    const explanations = [];

    // Temperature
    const tempExpl = getScoreExplanation(scores.temperature, 'temperature');
    explanations.push({ param: 'temperature', level: tempExpl.key, score: Math.round(scores.temperature) });

    // Precipitation
    const precipExpl = getScoreExplanation(scores.precipitation, 'precipitation');
    explanations.push({ param: 'precipitation', level: precipExpl.key, score: Math.round(scores.precipitation) });

    // Frost Days
    const frostExpl = getScoreExplanation(scores.frostDays, 'frostDays');
    explanations.push({ param: 'frostDays', level: frostExpl.key, score: Math.round(scores.frostDays) });

    // pH
    const phExpl = getScoreExplanation(scores.pH, 'pH');
    explanations.push({ param: 'pH', level: phExpl.key, score: Math.round(scores.pH) });

    // Soil Type
    const soilExpl = getScoreExplanation(scores.soilType, 'soilType');
    explanations.push({ param: 'soilType', level: soilExpl.key, score: Math.round(scores.soilType) });

    // Nitrogen
    const nitrogenExpl = getScoreExplanation(scores.nitrogen, 'nitrogen');
    explanations.push({ param: 'nitrogen', level: nitrogenExpl.key, score: Math.round(scores.nitrogen) });

    // Water Availability
    const waterExpl = getScoreExplanation(scores.waterAvailability, 'waterAvailability');
    explanations.push({ param: 'waterAvailability', level: waterExpl.key, score: Math.round(scores.waterAvailability) });

    // Elevation
    const elevExpl = getScoreExplanation(scores.elevation, 'elevation');
    explanations.push({ param: 'elevation', level: elevExpl.key, score: Math.round(scores.elevation) });

    // Crop Rotation
    if (previousCropId) {
      const rotExpl = getScoreExplanation(scores.cropRotation, 'cropRotation');
      explanations.push({ param: 'cropRotation', level: rotExpl.key, score: Math.round(scores.cropRotation) });
    }

    recommendations.push({
      cropId,
      name: crop.name,
      suitability: Math.round(totalScore),
      scores,
      explanations,
      rotationNote: previousCropId ? (
        crop.benefitsAfterCrops?.includes(previousCropId) ? 'excellent_rotation' :
          crop.unsuitableAfterCrops?.includes(previousCropId) ? 'poor_rotation' :
            previousCropId === cropId ? 'monoculture' : 'neutral_rotation'
      ) : null
    });
  });

  // Sort by suitability (highest first) and return top 10
  return recommendations
    .sort((a, b) => b.suitability - a.suitability)
    .slice(0, 10);
};

// Production Plans Management
export const fetchProductionPlans = async () => {
  try {
    const snapshot = await getDocs(productionPlansCollectionRef);
    const plans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return plans;
  } catch (error) {
    console.error("Error fetching production plans:", error);
    return [];
  }
};

export const addProductionPlan = async (planData) => {
  try {
    await addDoc(productionPlansCollectionRef, planData);
    return true;
  } catch (error) {
    console.error("Error adding production plan:", error);
    return false;
  }
};

export const updateProductionPlan = async (planId, updatedData) => {
  try {
    const planDoc = doc(db, "productionPlans", planId);
    await updateDoc(planDoc, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating production plan:", error);
    return false;
  }
};

export const deleteProductionPlan = async (planId) => {
  try {
    const planDoc = doc(db, "productionPlans", planId);
    await deleteDoc(planDoc);
    return true;
  } catch (error) {
    console.error("Error deleting production plan:", error);
    return false;
  }
};

// Consumption Rates Management
// NO DEFAULT VALUES - Farmers must set their own consumption rates
// based on their specific animals (breed, age, weight, production level, season)
//
// Rates are stored as kg/day per animal
// Annual consumption is calculated as: (kg/day per animal) × 365 × number of animals
//
// This function creates empty consumption rates for any species
export const getEmptyConsumptionRates = () => ({
  concentrates: 0, // kg/day per animal - SET YOUR OWN VALUE
  fiber: 0, // kg/day per animal - SET YOUR OWN VALUE
  greenFodder: 0, // kg/day per animal - SET YOUR OWN VALUE
  succulents: 0, // kg/day per animal - SET YOUR OWN VALUE
});

export const fetchConsumptionRates = async (speciesList = []) => {
  try {
    const snapshot = await getDocs(consumptionRatesCollectionRef);
    const rates = {};

    // Get saved rates from Firestore
    snapshot.docs.forEach((doc) => {
      rates[doc.id] = doc.data();
    });

    // Ensure all species in speciesList have rates (create empty if missing)
    speciesList.forEach(species => {
      if (!rates[species]) {
        rates[species] = getEmptyConsumptionRates();
      }
    });

    return rates;
  } catch (error) {
    console.error("Error fetching consumption rates:", error);
    // Return empty rates for all species in the list
    const emptyRates = {};
    speciesList.forEach(species => {
      emptyRates[species] = getEmptyConsumptionRates();
    });
    return emptyRates;
  }
};

export const updateConsumptionRate = async (species, foodType, value) => {
  try {
    const rateDoc = doc(db, "consumptionRates", species);
    const docSnap = await getDoc(rateDoc);

    if (docSnap.exists()) {
      await updateDoc(rateDoc, {
        [foodType]: value
      });
    } else {
      // Create new document with empty values, then set the specific field
      const emptyRates = getEmptyConsumptionRates();
      await setDoc(rateDoc, {
        ...emptyRates,
        [foodType]: value
      });
    }
    return true;
  } catch (error) {
    console.error("Error updating consumption rate:", error);
    return false;
  }
};

export const resetConsumptionRates = async (species) => {
  try {
    const rateDoc = doc(db, "consumptionRates", species);
    await setDoc(rateDoc, getEmptyConsumptionRates());
    return true;
  } catch (error) {
    console.error("Error resetting consumption rates:", error);
    return false;
  }
};

export const calculateNeededStock = async () => {
  try {
    // Fetch all animals grouped by species
    const animalsBySpecies = await fetchAllAnimalsBySpecies();

    // Get list of species that have animals
    const speciesList = Object.keys(animalsBySpecies);

    if (speciesList.length === 0) {
      // No animals in the system
      return {
        neededStock: {
          concentrates: 0,
          fiber: 0,
          greenFodder: 0,
          succulents: 0,
          total: 0
        },
        animalCounts: {},
        rates: {},
        speciesList: []
      };
    }

    // Fetch consumption rates for all species
    const rates = await fetchConsumptionRates(speciesList);

    // Calculate animal counts per species
    const animalCounts = {};
    speciesList.forEach(species => {
      animalCounts[species] = animalsBySpecies[species].length;
    });

    // Calculate needed stock by food type across all species
    // Formula: (kg/day per animal) × 365 days × number of animals
    const foodTypes = ['concentrates', 'fiber', 'greenFodder', 'succulents'];
    const neededStock = {};

    foodTypes.forEach(foodType => {
      let total = 0;
      speciesList.forEach(species => {
        const speciesRate = rates[species]?.[foodType] || 0;
        const count = animalCounts[species];
        total += (count * speciesRate * 365);
      });
      neededStock[foodType] = total;
    });

    neededStock.total = Object.values(neededStock).reduce((sum, val) => sum + val, 0);

    return {
      neededStock,
      animalCounts,
      rates,
      speciesList
    };
  } catch (error) {
    console.error("Error calculating needed stock:", error);
    return null;
  }
};