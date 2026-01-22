import {
  WbSunny,
  Cloud,
  Thunderstorm,
  AcUnit,
  NightsStay,
  FilterDrama,
  CloudySnowing
} from "@mui/icons-material";

import { addDoc, collection, getDocs, deleteDoc, updateDoc, doc, setDoc, getDoc, query, where, orderBy, limit as firestoreLimit, serverTimestamp } from "firebase/firestore";
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
const feedingPeriodsDocRef = doc(db, 'settings', 'feedingPeriods');

// Parcels and Soil Analysis Collections
const parcelsCollectionRef = collection(db, 'parcels');
const soilAnalysesCollectionRef = collection(db, 'soilAnalyses');

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

// --- Farm Location (for Weather & Location Conditions) ---

// Default fallback location (Romania - Florești, Cluj)
const DEFAULT_LOCATION = {
  latitude: 46.7489,
  longitude: 23.4953,
  name: "Florești, Cluj, Romania",
  source: "default"
};

// Fetch saved farm location from Firebase
export const fetchFarmLocation = async () => {
  try {
    const docRef = doc(db, 'settings', 'farmLocation');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching farm location:", error);
    return null;
  }
};

// Save farm location to Firebase
export const saveFarmLocation = async (latitude, longitude, name = null, source = "manual") => {
  try {
    const docRef = doc(db, 'settings', 'farmLocation');
    const locationData = {
      latitude,
      longitude,
      name: name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      source, // 'geolocation', 'manual', or 'default'
      lastUpdated: new Date()
    };
    await setDoc(docRef, locationData);
    return locationData;
  } catch (error) {
    console.error("Error saving farm location:", error);
    return null;
  }
};

// Get farm location with fallback logic
// Priority: 1. Saved location from Firebase, 2. Browser geolocation (one-time), 3. Default location
export const getFarmLocation = async () => {
  // First, try to get saved location from Firebase
  const savedLocation = await fetchFarmLocation();
  if (savedLocation) {
    console.log("Using saved farm location from database");
    return savedLocation;
  }

  // If no saved location, try browser geolocation (one-time setup)
  if (navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      console.log("Using browser geolocation for first-time setup");

      // Save this location for future use
      const savedData = await saveFarmLocation(latitude, longitude, null, "geolocation");
      return savedData || { latitude, longitude, source: "geolocation" };
    } catch (error) {
      console.warn("Geolocation not available or denied:", error.message);
    }
  }

  // Fallback to default location
  console.log("Using default fallback location");
  // Optionally save the default location
  await saveFarmLocation(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.name, "default");
  return DEFAULT_LOCATION;
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

    scores.cropRotation = calculateCropRotationScore(
      previousCropId,
      crop,
      cropId
    );

    // Weighted average calculation
    // Redistributed waterAvailability weight (0.08) to precipitation (+0.05) and temperature (+0.03)
    const weights = {
      temperature: 0.23,      // +0.03 (was 0.20)
      precipitation: 0.20,    // +0.05 (was 0.15)
      frostDays: 0.12,
      pH: 0.12,
      soilType: 0.12,
      nitrogen: 0.10,
      elevation: 0.08,
      cropRotation: 0.03
    };

    // Calculate weighted average
    const totalScore = Object.entries(scores).reduce((sum, [param, score]) => {
      return sum + (score * weights[param]);
    }, 0);

    const finalScore = totalScore;

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
      suitability: Math.round(finalScore),
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

// Feeding Periods Management
// Default feeding periods (days per year for each food type)
export const getDefaultFeedingPeriods = () => ({
  concentrates: 300,  // Fed most of the year
  fiber: 365,         // Fed year-round
  greenFodder: 180,   // Seasonal - growing season
  succulents: 120,    // Seasonal - limited availability
});

export const fetchFeedingPeriods = async () => {
  try {
    const docSnap = await getDoc(feedingPeriodsDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    // Return defaults if not set
    return getDefaultFeedingPeriods();
  } catch (error) {
    console.error("Error fetching feeding periods:", error);
    return getDefaultFeedingPeriods();
  }
};

export const updateFeedingPeriod = async (foodType, days) => {
  try {
    const currentPeriods = await fetchFeedingPeriods();
    await setDoc(feedingPeriodsDocRef, {
      ...currentPeriods,
      [foodType]: days
    });
    return true;
  } catch (error) {
    console.error("Error updating feeding period:", error);
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
        feedingPeriods: getDefaultFeedingPeriods(),
        speciesList: []
      };
    }

    // Fetch consumption rates for all species
    const rates = await fetchConsumptionRates(speciesList);

    // Fetch feeding periods (days per year for each food type)
    const feedingPeriods = await fetchFeedingPeriods();

    // Calculate animal counts per species
    const animalCounts = {};
    speciesList.forEach(species => {
      animalCounts[species] = animalsBySpecies[species].length;
    });

    // Calculate needed stock
    // Formula per species: TotalForSpecies = SUM over food types (dailyRate × numberOfAnimals × daysPerYear)
    // Then sum all species together
    const foodTypes = ['concentrates', 'fiber', 'greenFodder', 'succulents'];

    // Calculate per species first
    const neededStockBySpecies = {};
    speciesList.forEach(species => {
      let speciesTotal = 0;
      const speciesByFoodType = {};

      foodTypes.forEach(foodType => {
        const dailyRate = rates[species]?.[foodType] || 0;
        const count = animalCounts[species];
        const daysPerYear = feedingPeriods[foodType] || 365;

        // Calculate for this species and food type
        const amount = dailyRate * count * daysPerYear;
        speciesByFoodType[foodType] = amount;
        speciesTotal += amount;
      });

      neededStockBySpecies[species] = {
        byFoodType: speciesByFoodType,
        total: speciesTotal
      };
    });

    // Now sum across all species to get totals by food type
    const neededStock = {};
    foodTypes.forEach(foodType => {
      let total = 0;
      speciesList.forEach(species => {
        total += neededStockBySpecies[species].byFoodType[foodType];
      });
      neededStock[foodType] = total;
    });

    // Grand total = sum of all food types across all species
    neededStock.total = Object.values(neededStock).reduce((sum, val) => sum + val, 0);

    return {
      neededStock,
      neededStockBySpecies,
      animalCounts,
      rates,
      feedingPeriods,
      speciesList
    };
  } catch (error) {
    console.error("Error calculating needed stock:", error);
    return null;
  }
};

// ============================================================================
// PARCELS & SOIL ANALYSIS MANAGEMENT (Append-Only Historical Data)
// ============================================================================
//
// DATA MODEL:
// -----------
// parcels/
//   {parcelId}/                           - Root collection of farm parcels
//     name: string                        - Parcel name/identifier
//     area: number                        - Area in hectares
//     location: { lat, lng }              - GPS coordinates
//     description: string                 - Optional description
//     cropType: string                    - Current or planned crop
//     isActive: boolean                   - Active/archived status
//     createdAt: Timestamp                - Creation timestamp
//     createdBy: string                   - User who created
//
// soilAnalyses/
//   {analysisId}/                         - Root collection of soil analyses
//     parcelId: string                    - Reference to parcel
//     parcelName: string                  - Denormalized for easy display
//     date: Timestamp                     - Date analysis was performed
//     status: string                      - 'pending', 'completed', 'archived'
//     laboratoryName: string              - Lab that performed analysis
//     notes: string                       - Additional notes
//     createdAt: Timestamp                - Record creation timestamp
//     createdBy: string                   - User who created
//
//     samples/ (subcollection)            - Soil samples for this analysis
//       {sampleId}/
//         sampleNumber: number            - Sample identifier (1, 2, 3...)
//         location: { lat, lng }          - GPS coordinates of probe
//         depth: number                   - Depth in cm
//         pH: number                      - pH value
//         nitrogen: number                - Nitrogen content (g/kg)
//         phosphorus: number              - Phosphorus content (mg/kg)
//         potassium: number               - Potassium content (mg/kg)
//         organicMatter: number           - Organic matter (%)
//         soilType: string                - Soil type classification
//         notes: string                   - Sample-specific notes
//         createdAt: Timestamp            - Creation timestamp
//
// RULES:
// ------
// - Append-only: Never update or delete parcels/analyses/samples
// - To "update" a parcel: create new version or use isActive flag
// - Historical data preserved for auditing and trend analysis
// - Samples are always linked to an analysis (subcollection)
// ============================================================================

// --- PARCELS ---

// Fetch all parcels
export const fetchParcels = async () => {
  try {
    const snapshot = await getDocs(parcelsCollectionRef);
    const parcels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return parcels.sort((a, b) => {
      // Sort by active status first, then by creation date
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    });
  } catch (error) {
    console.error("Error fetching parcels:", error);
    return [];
  }
};

// Fetch a single parcel by ID
export const fetchParcelById = async (parcelId) => {
  try {
    const docRef = doc(db, 'parcels', parcelId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching parcel:", error);
    return null;
  }
};

// Add a new parcel (append-only)
export const addParcel = async (parcelData) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    const newParcel = {
      ...parcelData,
      isActive: true,
      createdAt: new Date(),
      createdBy: currentUser.username || 'unknown'
    };
    const docRef = await addDoc(parcelsCollectionRef, newParcel);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding parcel:", error);
    return { success: false, error: error.message };
  }
};

// "Archive" a parcel (append-only: just mark as inactive)
export const archiveParcel = async (parcelId) => {
  try {
    const parcelDoc = doc(db, 'parcels', parcelId);
    await updateDoc(parcelDoc, {
      isActive: false,
      archivedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error archiving parcel:", error);
    return { success: false, error: error.message };
  }
};

// Reactivate a parcel
export const reactivateParcel = async (parcelId) => {
  try {
    const parcelDoc = doc(db, 'parcels', parcelId);
    await updateDoc(parcelDoc, {
      isActive: true,
      reactivatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error reactivating parcel:", error);
    return { success: false, error: error.message };
  }
};

// --- SOIL ANALYSES ---

// Fetch all soil analyses for a parcel (historical, ordered by date)
export const fetchSoilAnalysesByParcel = async (parcelId) => {
  try {
    console.log('Fetching soil analyses for parcelId:', parcelId);

    // Try with orderBy first (requires index)
    try {
      const q = query(
        soilAnalysesCollectionRef,
        where('parcelId', '==', parcelId),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      console.log('Query with orderBy executed, found', snapshot.docs.length, 'analyses');
      const analyses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Mapped analyses:', analyses);
      return analyses;
    } catch (indexError) {
      // If index doesn't exist, fetch without orderBy and sort in memory
      if (indexError.code === 'failed-precondition') {
        console.warn('Index not found, falling back to in-memory sort');
        const q = query(
          soilAnalysesCollectionRef,
          where('parcelId', '==', parcelId)
        );
        const snapshot = await getDocs(q);
        console.log('Query without orderBy executed, found', snapshot.docs.length, 'analyses');
        const analyses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort in memory
        analyses.sort((a, b) => {
          const dateA = a.date?.toDate?.() || a.date || new Date(0);
          const dateB = b.date?.toDate?.() || b.date || new Date(0);
          return dateB - dateA;
        });
        console.log('Sorted analyses:', analyses);
        return analyses;
      }
      throw indexError;
    }
  } catch (error) {
    console.error("Error fetching soil analyses:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    return [];
  }
};

// Fetch all soil analyses (all parcels)
export const fetchAllSoilAnalyses = async () => {
  try {
    const q = query(soilAnalysesCollectionRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const analyses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return analyses;
  } catch (error) {
    console.error("Error fetching all soil analyses:", error);
    return [];
  }
};

// Fetch latest soil analysis for a parcel
export const fetchLatestSoilAnalysis = async (parcelId) => {
  try {
    const q = query(
      soilAnalysesCollectionRef,
      where('parcelId', '==', parcelId),
      where('status', '==', 'completed'),
      orderBy('date', 'desc'),
      firestoreLimit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching latest soil analysis:", error);
    return null;
  }
};

// Add a new soil analysis (simplified - returns analysisId directly)
export const createSoilAnalysis = async (parcelId, date, notes = "") => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    const analysisData = {
      parcelId: parcelId,
      date: date,
      notes: notes || '',
      status: 'completed',
      createdAt: new Date(),
      createdBy: currentUser.username || 'unknown'
    };

    console.log("Creating soil analysis with data:", analysisData);
    const docRef = await addDoc(soilAnalysesCollectionRef, analysisData);

    console.log("Soil analysis created successfully with ID:", docRef.id);
    console.log("Saved status field:", analysisData.status);
    return docRef.id;
  } catch (error) {
    console.error("Error creating soil analysis:", error);
    throw error;
  }
};

// Add a new soil analysis (full version with all fields)
export const addSoilAnalysis = async (analysisData) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    const newAnalysis = {
      ...analysisData,
      status: analysisData.status || 'pending',
      createdAt: serverTimestamp(),
      createdBy: currentUser.username || 'unknown'
    };
    const docRef = await addDoc(soilAnalysesCollectionRef, newAnalysis);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding soil analysis:", error);
    return { success: false, error: error.message };
  }
};

// Update soil analysis status (only allow status changes, not data modification)
export const updateSoilAnalysisStatus = async (analysisId, status) => {
  try {
    const analysisDoc = doc(db, 'soilAnalyses', analysisId);
    await updateDoc(analysisDoc, {
      status,
      statusUpdatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating soil analysis status:", error);
    return { success: false, error: error.message };
  }
};

// --- SOIL SAMPLES ---

// Fetch all samples for a soil analysis
export const fetchSoilSamples = async (analysisId) => {
  try {
    const samplesCollectionRef = collection(db, 'soilAnalyses', analysisId, 'samples');
    const snapshot = await getDocs(samplesCollectionRef);
    const samples = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return samples.sort((a, b) => (a.sampleNumber || 0) - (b.sampleNumber || 0));
  } catch (error) {
    console.error("Error fetching soil samples:", error);
    return [];
  }
};

// Add a soil sample to an analysis (append-only)
export const addSoilSample = async (analysisId, sampleData) => {
  try {
    const samplesCollectionRef = collection(db, 'soilAnalyses', analysisId, 'samples');
    const newSample = {
      ...sampleData,
      createdAt: new Date()
    };
    const docRef = await addDoc(samplesCollectionRef, newSample);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding soil sample:", error);
    return { success: false, error: error.message };
  }
};

// Add multiple soil samples at once
export const addMultipleSoilSamples = async (analysisId, samplesData) => {
  try {
    console.log('Adding', samplesData.length, 'samples to analysis:', analysisId);
    const samplesCollectionRef = collection(db, 'soilAnalyses', analysisId, 'samples');

    for (const sampleData of samplesData) {
      const newSample = {
        ...sampleData,
        createdAt: new Date()
      };
      await addDoc(samplesCollectionRef, newSample);
      console.log('Added sample:', sampleData.sampleNumber);
    }

    console.log('All samples added successfully');
    return { success: true };
  } catch (error) {
    console.error("Error adding multiple soil samples:", error);
    return { success: false, error: error.message };
  }
};

// Calculate average values from all samples in an analysis
export const calculateSoilAnalysisAverages = async (analysisId) => {
  try {
    const samples = await fetchSoilSamples(analysisId);

    if (samples.length === 0) {
      return null;
    }

    const validSamples = samples.filter(s => s.pH !== null && s.pH !== undefined);

    const averages = {
      pH: 0,
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      organicMatter: 0,
      sampleCount: samples.length
    };

    const fields = ['pH', 'nitrogen', 'phosphorus', 'potassium', 'organicMatter'];

    fields.forEach(field => {
      const validValues = samples
        .map(s => s[field])
        .filter(v => v !== null && v !== undefined && !isNaN(v));

      if (validValues.length > 0) {
        const sum = validValues.reduce((acc, val) => acc + val, 0);
        averages[field] = parseFloat((sum / validValues.length).toFixed(2));
      }
    });

    return averages;
  } catch (error) {
    console.error("Error calculating soil analysis averages:", error);
    return null;
  }
};

// Calculate detailed statistics (averages, min, max) for a soil analysis
export const calculateSoilAnalysisStatistics = async (analysisId) => {
  try {
    const samples = await fetchSoilSamples(analysisId);

    if (samples.length === 0) {
      return null;
    }

    const fields = ['pH', 'nitrogen', 'phosphorus', 'potassium', 'organicMatter'];
    const statistics = {
      sampleCount: samples.length,
      averages: {},
      min: {},
      max: {}
    };

    fields.forEach(field => {
      const validValues = samples
        .map(s => s[field])
        .filter(v => v !== null && v !== undefined && !isNaN(v));

      if (validValues.length > 0) {
        const sum = validValues.reduce((acc, val) => acc + val, 0);
        const avg = sum / validValues.length;
        const min = Math.min(...validValues);
        const max = Math.max(...validValues);

        statistics.averages[field] = parseFloat(avg.toFixed(2));
        statistics.min[field] = parseFloat(min.toFixed(2));
        statistics.max[field] = parseFloat(max.toFixed(2));
      } else {
        statistics.averages[field] = 0;
        statistics.min[field] = 0;
        statistics.max[field] = 0;
      }
    });

    return statistics;
  } catch (error) {
    console.error("Error calculating soil analysis statistics:", error);
    return null;
  }
};