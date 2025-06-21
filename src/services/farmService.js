import {
  WbSunny,
  Cloud,
  Thunderstorm,
  AcUnit,
  NightsStay,
  FilterDrama,
  CloudySnowing
} from "@mui/icons-material";

import { doc, getDoc, setDoc, addDoc, collection, getDocs, deleteDoc, updateDoc, listCollections } from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import i18n from '../i18n';
import { COW_RO } from './constants';

export const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const notesCollectionRef = collection(db, 'notes');
const usersCollectionRef = collection(db, 'users');
const cowsCollectionRef = collection(db, 'livestock', 'animalsInfo', 'cow');
const horseCollectionRef = collection(db, 'livestock', 'animalsInfo', 'horse');

export const getDayName = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = daysOfWeek[date.getDay()].toLocaleLowerCase();
  return i18n.t(day);
};

export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

export const getWeatherIcon = (condition) => {
  switch (condition) {
    case "Clear":
      return <WbSunny />;
    case "Clouds":
      return <Cloud />;
    case "Rain":
    case "Drizzle":
      return <CloudySnowing />;
    case "Thunderstorm":
      return <Thunderstorm />;
    case "Snow":
      return <AcUnit />;
    case "Mist":
    case "Smoke":
    case "Haze":
    case "Dust":
    case "Fog":
    case "Sand":
    case "Ash":
    case "Squall":
    case "Tornado":
      return <FilterDrama />;
    case "Night":
      return <NightsStay />;
    default:
      return <WbSunny />;
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
  }
  const collectionToAdd = species === COW_RO ? cowsCollectionRef : horseCollectionRef;
  try {
    await addDoc(collectionToAdd, newAnimal);
    return true;
  } catch (error) {
    console.error("Error adding note:", error);
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