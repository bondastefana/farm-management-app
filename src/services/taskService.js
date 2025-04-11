// src/services/taskService.js
import db from "../firebase/firebaseConfig"; // Default import
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

const tasksCollectionRef = collection(db, 'tasks');

// Fetch tasks from Firebase
export const getTasks = async () => {
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

// Add a new task
export const addTask = async (task) => {
  try {
    await addDoc(tasksCollectionRef, task);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const taskDoc = doc(db, "tasks", taskId);
    await deleteDoc(taskDoc);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

// Update a task
export const updateTask = async (taskId, updatedData) => {
  try {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, updatedData);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};
