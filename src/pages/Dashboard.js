import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import db from "../firebase/firebaseConfig"; // Firebase setup
import { doc, getDoc } from "firebase/firestore"; // Firestore functions

import Weather from "../components/Weather";
import Notes from '../components/Notes';
import Employees from '../components/Employees';
import FarmInfo from "../components/FarmInfo"
import TasksInfo from '../components/TasksInfo';
import { useLoading } from '../contexts/LoadingContext';

import { fetchNotes, fetchEmployees, fetchTasks } from '../services/farmService';

const Dashboard = () => {
  const [location, setLocation] = useState(null);
  const { setLoading } = useLoading();
  const [farmInfo, setFarmInfo] = useState({
    name: "",
    location: "",
    size: "",
    owner: "",
    established: "",
    description: "",
  });
  const [notes, setNotes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  const fetchFarmInfo = React.useCallback(async () => {
    const docRef = doc(db, "dashboard", "farmInfo");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFarmInfo(docSnap.data());
    }
  }, []);

  // Fetch notes from Firestore
  const fetchNotesInfo = React.useCallback(async () => {
    const notesDetail = await fetchNotes();
    const sortedNotes = notesDetail.sort((a, b) => b.date.seconds - a.date.seconds)
    setNotes(sortedNotes);
  }, [])

  const fetchEmployeesInfo = React.useCallback(async () => {
    const employeeDetail = await fetchEmployees();
    const sortedEmployees = employeeDetail.sort((a, b) => b.employmentDate.seconds - a.employmentDate.seconds)
    setEmployees(sortedEmployees);
  }, [])

  const fetchTasksInfo = React.useCallback(async () => {
    const tasksDetail = await fetchTasks();
    const sortedTasks = tasksDetail.sort((a, b) => b.date.seconds - a.date.seconds)
    setTasks(sortedTasks);
  }, [])

  const fetchAllData = React.useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all([
        fetchFarmInfo(),
        fetchNotesInfo(),
        fetchEmployeesInfo(),
        fetchTasksInfo(),
      ]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [fetchEmployeesInfo, fetchFarmInfo, fetchNotesInfo, fetchTasksInfo, setLoading])

  useEffect(() => {
    // Fetch user's location for weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }

    fetchAllData();
  }, [fetchAllData, fetchEmployeesInfo, fetchFarmInfo, fetchNotesInfo]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Notes notes={notes} fetchNotesInfo={fetchNotesInfo} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Employees employees={employees} fetchNotesInfo={fetchEmployeesInfo} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FarmInfo farmInfo={farmInfo} employeesNumber={employees?.length} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TasksInfo tasks={tasks} fetchTasksInfo={fetchTasksInfo} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Weather location={location} />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
