import React, { useState } from "react";
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import CircularProgress from '@mui/material/CircularProgress';
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import Tasks from "./pages/Tasks";
import Stocks from "./pages/Stocks";
import Reports from "./pages/Reports";
import NotFound from './pages/NotFound';
import { CssBaseline, Box } from "@mui/material";

import Navbar from './components/Navbar'
import Footer from './components/Footer';

function App() {
  const [navOpen, setNavOpen] = useState(false);
  const { loading } = useLoading();

  const handleNavToggle = () => {
    setNavOpen(!navOpen);
  };

  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar handleNavClick={handleNavToggle} />
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1300,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        )}
        <Sidebar navOpen={navOpen} handleNavToggle={handleNavToggle} />
        <Box component="main" sx={{ width: '100%', marginTop: '64px', flex: 1 }} p={2}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}
export default function WrappedApp() {
  return (
    <LoadingProvider>
      <App />
    </LoadingProvider>
  );
}
