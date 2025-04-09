import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DoctorLoginPage from "./pages/DoctorLoginPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import AppointmentPage from "./pages/AppointmentPage";
import ErrorBoundary from "./Components/ErrorBoundary";

// Import services
import { initializeTestUsers } from './services/authService';
import { initializeSampleAppointments } from './services/appointmentService';

const App = () => {
  useEffect(() => {
    // Initialize test users and sample appointments on app startup
    initializeTestUsers();
    initializeSampleAppointments();
    
    console.log("App initialized with test data");
  }, []);
  
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/doctor-login" element={<DoctorLoginPage />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;