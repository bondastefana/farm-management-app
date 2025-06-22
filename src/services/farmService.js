import {
  WbSunny,
  Cloud,
  Thunderstorm,
  AcUnit,
  NightsStay,
  FilterDrama,
  CloudySnowing
} from "@mui/icons-material";

import { addDoc, collection, getDocs, deleteDoc, updateDoc, doc, setDoc } from "firebase/firestore";
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

export const getDayName = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = daysOfWeek[date.getDay()].toLocaleLowerCase();
  return i18n.t(day);
};

export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString();
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