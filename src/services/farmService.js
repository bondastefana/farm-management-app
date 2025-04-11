import {
  WbSunny,
  Cloud,
  Thunderstorm,
  AcUnit,
  Grain,
  NightsStay,
  FilterDrama,
} from "@mui/icons-material";
import { doc, getDoc, setDoc, addDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import i18n from '../i18n';


export const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


const notesCollectionRef = collection(db, 'notes');

export const getDayName = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = daysOfWeek[date.getDay()].toLocaleLowerCase();
  return i18n.t(day);
};

// Helper function to format the date
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
      return <Grain />;
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

export const fetchNotes = async () => {
  const tasksCollectionRef = collection(db, 'notes');
  try {
    const snapshot = await getDocs(tasksCollectionRef);
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
  } catch (error) {
    console.error("Error adding note:", error);
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