import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import db from "../firebase/firebaseConfig"; // Firebase setup
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { useTranslation } from "react-i18next";

import Weather from "../components/Weather";
import Notes from '../components/Notes';
import { useLoading } from '../contexts/LoadingContext';

import { fetchNotes } from '../services/farmService';

const Dashboard = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const { setLoading } = useLoading();

  // State for farm info and note
  const [farmInfo, setFarmInfo] = useState({
    name: "",
    location: "",
    size: "",
    owner: "",
    established: "",
    description: "",
  });

  const [notes, setNotes] = useState([]);

  // Fetch farm info from Firestore
  const fetchFarmInfo = React.useCallback(async () => {
    setLoading(true);
    const docRef = doc(db, "dashboard", "farmInfo");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFarmInfo(docSnap.data());
    }
    setLoading(false);
  }, [setLoading]);

  // Fetch notes from Firestore
  const fetchNotesInfo = React.useCallback(async () => {
    setLoading(true);
    const notesDetail = await fetchNotes(); // Use the getTasks function
    setNotes(notesDetail);
    setLoading(false)
  }, [setLoading])


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

    fetchFarmInfo();
    fetchNotesInfo();
  }, [fetchFarmInfo, fetchNotesInfo]);



  return (
    <Grid container spacing={2}>
      {/* <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
          >
            <Typography variant="h5">
              Farm Info
            </Typography>


            {loading ? (
              <CircularProgress />
            ) : (

              <FarmInfo farmInfo={farmInfo} />
            )
            }
          </Paper>
        </Grid> */}

      {/* Notes
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
          >
            <Typography variant="h5" >
              Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={6}
              variant="outlined"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button
              onClick={saveNote}
              variant="contained"
            >
              {t('save')}
            </Button>
          </Paper>
        </Grid>
      </Grid> */}

      {/* Weather  */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Notes notes={notes} fetchNotesInfo={fetchNotesInfo} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Notes notes={notes} fetchNotesInfo={fetchNotesInfo} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Notes notes={notes} fetchNotesInfo={fetchNotesInfo} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Weather location={location} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Weather location={location} />
      </Grid>
    </Grid>

  );
};

export default Dashboard;
