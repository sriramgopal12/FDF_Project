import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserType, logout } from "../services/authService";
import * as appointmentService from "../services/appointmentService";

// Then use the functions as:
// appointmentService.getDoctorAppointments(...)
// appointmentService.updateAppointment(...)

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState({
    name: localStorage.getItem("doctorName") || "Doctor",
    id: localStorage.getItem("doctorId") || "2" // Default to test doctor ID if not set
  });
  const [selectedTab, setSelectedTab] = useState("appointments");
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this to force refresh
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    // Check if user is logged in as doctor
    const userType = getUserType();
    
    if (userType !== "doctor") {
      console.log("Not authenticated as doctor, redirecting to login");
      navigate("/doctor-login");
      return;
    }
    
    // Load doctor's appointments
    loadAppointments();
    
    // Set up automatic refresh every 15 seconds (more frequent for testing)
    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing appointments...");
      setRefreshTrigger(prev => prev + 1);
    }, 15000);
    
    return () => clearInterval(refreshInterval); // Clean up interval on component unmount
    
  }, [navigate, refreshTrigger]); // Add refreshTrigger to dependencies

  const loadAppointments = async () => {
    try {
      console.log("Loading appointments for doctor with ID:", doctorInfo.id);
      setLoading(true);
      
      // Get appointments from localStorage directly
      const appointmentsString = localStorage.getItem('healthcare_appointments');
      console.log("Raw localStorage 'healthcare_appointments' content:", appointmentsString);
      
      let allAppointments = [];
      
      if (appointmentsString) {
        try {
          allAppointments = JSON.parse(appointmentsString);
          console.log("Successfully parsed appointments from localStorage:", allAppointments);
        } catch (e) {
          console.error("Error parsing appointments from localStorage:", e);
          setDebugInfo({
            error: "Failed to parse appointments from localStorage",
            rawData: appointmentsString
          });
        }
      } else {
        console.log("No appointments found in localStorage");
      }
      
      // Log all appointments for debugging
      console.log("All appointments in localStorage:", allAppointments);
      
      // Convert doctorId to string to ensure comparison works
      const docId = String(doctorInfo.id);
      console.log("Doctor ID for filtering (as string):", docId);
      
      // Filter appointments for this doctor without using mock data
      const doctorAppointments = allAppointments.filter(apt => {
        // Convert both IDs to strings for reliable comparison
        const aptDoctorId = String(apt.doctorId);
        const match = aptDoctorId === docId;
        console.log(`Comparing appointment doctorId: ${aptDoctorId} with current doctor: ${docId} - Match: ${match}`);
        return match;
      });
      
      console.log("Retrieved doctor appointments:", doctorAppointments);
      
      setAppointments(doctorAppointments);
      setLoading(false);
      
      // Update debug info
      setDebugInfo({
        totalAppointments: allAppointments.length,
        doctorAppointments: doctorAppointments.length,
        doctorId: docId
      });
      
    } catch (error) {
      console.error("Error loading appointments:", error);
      setLoading(false);
      setDebugInfo({
        error: error.message,
        stack: error.stack
      });
    }
  };

  // Filter appointments for different sections  
  const todaysAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today && apt.status === "scheduled";
  });

  const upcomingAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date > today && apt.status === "scheduled";
  });

  // Handle appointment status changes
  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    try {
      console.log(`Changing appointment ${appointmentId} status to ${newStatus}`);
      
      // Get current appointments from localStorage
      const appointmentsString = localStorage.getItem('healthcare_appointments');
      let allAppointments = [];
      
      if (appointmentsString) {
        allAppointments = JSON.parse(appointmentsString);
        
        // Find and update the appointment
        const appointmentIndex = allAppointments.findIndex(apt => apt.id === appointmentId);
        
        if (appointmentIndex !== -1) {
          allAppointments[appointmentIndex].status = newStatus;
          
          // Save back to localStorage
          localStorage.setItem('healthcare_appointments', JSON.stringify(allAppointments));
          
          // Refresh appointments in the UI
          loadAppointments();
        }
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };
  
  const handleLogout = () => {
    // Use the logout function from authService
    logout();
    navigate("/doctor-login");
  };

  // Force refresh appointments
  const handleRefresh = () => {
    loadAppointments();
  };

  // Clear all appointments (for testing purposes)
  const handleClearAllAppointments = () => {
    if (window.confirm("Are you sure you want to clear all appointments? This cannot be undone.")) {
      localStorage.setItem('healthcare_appointments', JSON.stringify([]));
      loadAppointments();
    }
  };

  // Add debug test appointment
  const addTestAppointment = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const testAppointment = {
        id: `debug-${Date.now()}`,
        patientId: "debug-patient",
        patientName: "Debug Patient",
        doctorId: doctorInfo.id, // Use current doctor ID
        doctorName: `Dr. ${doctorInfo.name}`,
        date: today,
        time: "15:45",
        reason: "Debug appointment",
        status: "scheduled",
        createdAt: new Date().toISOString()
      };
      
      // Get current appointments
      const appointmentsString = localStorage.getItem('healthcare_appointments');
      const appointments = appointmentsString ? JSON.parse(appointmentsString) : [];
      
      // Add test appointment
      appointments.push(testAppointment);
      
      // Save back to localStorage
      localStorage.setItem('healthcare_appointments', JSON.stringify(appointments));
      
      alert("Test appointment added for today. Refreshing...");
      loadAppointments();
    } catch (error) {
      alert("Error adding test appointment: " + error.message);
      console.error("Error adding test appointment:", error);
    }
  };

  // View raw localStorage data
  const viewLocalStorageData = () => {
    const appointmentsString = localStorage.getItem('healthcare_appointments');
    if (appointmentsString) {
      alert("Data available in localStorage. Check console for details.");
      console.log("Raw localStorage data:", appointmentsString);
      try {
        const parsed = JSON.parse(appointmentsString);
        console.table(parsed);
      } catch (e) {
        console.error("Failed to parse data:", e);
      }
    } else {
      alert("No appointment data found in localStorage");
    }
  };

  if (loading) {
    return <div className="loading">Loading doctor dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <div className="user-info">
          <span>Welcome, Dr. {doctorInfo.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${selectedTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setSelectedTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={`nav-tab ${selectedTab === 'patients' ? 'active' : ''}`}
          onClick={() => setSelectedTab('patients')}
        >
          Patient Records
        </button>
        <button 
          className={`nav-tab ${selectedTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setSelectedTab('schedule')}
        >
          Schedule
        </button>
        <button 
          className="refresh-btn"
          onClick={handleRefresh}
          title="Refresh appointments"
        >
          🔄 Refresh
        </button>
      </nav>
      
      <div className="dashboard-content">
        {selectedTab === 'appointments' && (
          <div className="appointments-section">
            <div className="dashboard-card">
              <h2>Today's Appointments</h2>
              {todaysAppointments.length > 0 ? (
                <div className="appointment-list">
                  {todaysAppointments.map(appointment => (
                    <div key={appointment.id} className="appointment-item">
                      <div className="appointment-details">
                        <h3>{appointment.patientName}</h3>
                        <p><strong>Time:</strong> {appointment.time}</p>
                        <p><strong>Reason:</strong> {appointment.reason}</p>
                        <p className="debug-id"><small>ID: {appointment.id}</small></p>
                      </div>
                      <div className="appointment-actions">
                        <button 
                          className="action-btn complete-btn"
                          onClick={() => handleAppointmentStatusChange(appointment.id, "completed")}
                        >
                          Complete
                        </button>
                        <button 
                          className="action-btn cancel-btn"
                          onClick={() => handleAppointmentStatusChange(appointment.id, "cancelled")}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data-message">No appointments scheduled for today.</p>
              )}
            </div>
            
            <div className="dashboard-card">
              <h2>Upcoming Appointments</h2>
              {upcomingAppointments.length > 0 ? (
                <div className="appointment-list">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="appointment-item">
                      <div className="appointment-details">
                        <h3>{appointment.patientName}</h3>
                        <p><strong>Date:</strong> {appointment.date}</p>
                        <p><strong>Time:</strong> {appointment.time}</p>
                        <p><strong>Reason:</strong> {appointment.reason}</p>
                        <p className="debug-id"><small>ID: {appointment.id}</small></p>
                      </div>
                      <div className="appointment-status">
                        <span className="status-badge">{appointment.status}</span>
                        <div className="appointment-actions">
                          <button 
                            className="action-btn cancel-btn"
                            onClick={() => handleAppointmentStatusChange(appointment.id, "cancelled")}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data-message">No upcoming appointments scheduled.</p>
              )}
            </div>
            
            <div className="dashboard-card">
              <h2>Appointment History</h2>
              {appointments.filter(apt => apt.status === "completed" || apt.status === "cancelled").length > 0 ? (
                <div className="appointment-list history-list">
                  {appointments
                    .filter(apt => apt.status === "completed" || apt.status === "cancelled")
                    .map(appointment => (
                      <div key={appointment.id} className="appointment-item history-item">
                        <div className="appointment-details">
                          <h3>{appointment.patientName}</h3>
                          <p><strong>Date:</strong> {appointment.date}</p>
                          <p><strong>Time:</strong> {appointment.time}</p>
                          <p><strong>Reason:</strong> {appointment.reason}</p>
                          <p className="debug-id"><small>ID: {appointment.id}</small></p>
                        </div>
                        <div className="appointment-status">
                          <span className={`status-badge ${appointment.status}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="no-data-message">No completed or cancelled appointments yet.</p>
              )}
            </div>
            
            {/* Developer tools section - always show during development */}
            <div className="dashboard-card developer-card">
              <h2>Developer Tools</h2>
              <div className="debug-info">
                <p><strong>Doctor ID:</strong> {doctorInfo.id}</p>
                <p><strong>Total Appointments:</strong> {debugInfo?.totalAppointments || 0}</p>
                <p><strong>Doctor's Appointments:</strong> {debugInfo?.doctorAppointments || 0}</p>
              </div>
              <div className="debug-buttons">
                <button 
                  className="action-btn debug-btn"
                  onClick={viewLocalStorageData}
                >
                  View Raw Storage Data
                </button>
                <button 
                  className="action-btn debug-btn"
                  onClick={addTestAppointment}
                  style={{background: '#2980b9'}}
                >
                  Add Test Appointment
                </button>
                <button 
                  className="action-btn danger-btn"
                  onClick={handleClearAllAppointments}
                >
                  Clear All Appointments
                </button>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'patients' && (
          <div className="patients-section">
            <div className="dashboard-card">
              <h2>Patient Records</h2>
              <p>Access and manage patient records here.</p>
              <button className="action-btn">View All Patients</button>
            </div>
          </div>
        )}
        
        {selectedTab === 'schedule' && (
          <div className="schedule-section">
            <div className="dashboard-card">
              <h2>Your Schedule</h2>
              <p>Manage your available hours and working days.</p>
              <button className="action-btn">Update Availability</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e1e1e1;
        }
        
        .dashboard-header h1 {
          color: #2c3e50;
          margin: 0;
        }
        
        .user-info {
          display: flex;
          align-items: center;
        }
        
        .user-info span {
          margin-right: 1rem;
          font-weight: 500;
        }
        
        .logout-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }
        
        .logout-btn:hover {
          background: #c0392b;
        }
        
        .dashboard-nav {
          display: flex;
          margin-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }
        
        .nav-tab {
          background: none;
          border: none;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: #7f8c8d;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 3px solid transparent;
        }
        
        .nav-tab:hover {
          color: #3498db;
        }
        
        .nav-tab.active {
          color: #3498db;
          border-bottom: 3px solid #3498db;
        }
        
        .dashboard-content {
          margin-top: 2rem;
        }
        
        .appointments-section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .dashboard-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .dashboard-card h2 {
          color: #3498db;
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.75rem;
        }
        
        .appointment-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .appointment-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1rem;
          border-radius: 6px;
          background-color: #f9f9f9;
          border-left: 4px solid #3498db;
        }
        
        .appointment-details h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: #2c3e50;
        }
        
        .appointment-details p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
          color: #7f8c8d;
        }
        
        .appointment-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .action-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s;
          font-size: 0.9rem;
        }
        
        .action-btn:hover {
          background: #2980b9;
        }
        
        .complete-btn {
          background: #2ecc71;
        }
        
        .complete-btn:hover {
          background: #27ae60;
        }
        
        .cancel-btn {
          background: #e74c3c;
        }
        
        .cancel-btn:hover {
          background: #c0392b;
        }
        
        .danger-btn {
          background: #e74c3c;
          margin-top: 1rem;
          width: 100%;
        }
        
        .danger-btn:hover {
          background: #c0392b;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
          background-color: #3498db;
          color: white;
          margin-bottom: 0.5rem;
        }
        
        .status-badge.completed {
          background-color: #2ecc71;
        }
        
        .status-badge.cancelled {
          background-color: #e74c3c;
        }
        
        .no-data-message {
          color: #7f8c8d;
          text-align: center;
          font-style: italic;
          padding: 1rem 0;
        }
        
        .history-list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .history-item {
          border-left-color: #95a5a6;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2rem;
          color: #3498db;
        }
        
        .refresh-btn {
          margin-left: auto;
          background: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .refresh-btn:hover {
          background: #2980b9;
        }
        
        .developer-card {
          background-color: #f8f9fa;
          border: 1px dashed #95a5a6;
        }
        
        .developer-card h2 {
          color: #7f8c8d;
        }
        
        .debug-info {
          background: #eee;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .debug-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        
        .debug-buttons .action-btn {
          margin: 0;
        }
        
        .debug-buttons .danger-btn {
          grid-column: span 2;
          margin-top: 0.75rem;
        }
        
        .debug-btn {
          background: #8e44ad;
        }
        
        .debug-btn:hover {
          background: #7d3c98;
        }
        
        .debug-id {
          color: #95a5a6;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;