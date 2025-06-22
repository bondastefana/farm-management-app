import React, { useState } from "react";
import './index.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import Login from "./pages/Login";

function AppContent() {
  const [navOpen, setNavOpen] = useState(false);
  const { loading } = useLoading();
  const location = useLocation();

  const handleNavToggle = () => {
    setNavOpen(!navOpen);
  };

  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {!isLoginPage && <Navbar handleNavClick={handleNavToggle} />}
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
        {!isLoginPage && <Sidebar navOpen={navOpen} handleNavToggle={handleNavToggle} />}
        <Box component="main" sx={{ width: '100%', marginTop: !isLoginPage ? '64px' : 0, flex: 1 }} p={isLoginPage ? 0 : 2}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
          </Routes>
        </Box>
        {!isLoginPage && <Footer />}
      </Box>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
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
