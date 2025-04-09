import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Dr. John Doe",
    specialty: "Cardiologist",
    appointments: []
  });
  
  // Check if doctor is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('doctorAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/doctor-login');
    } else {
      // Fetch doctor data from API
      // This is a placeholder for the actual API call
      // fetchDoctorData();
      
      // Mock data for demonstration
      setDoctorInfo({
        name: "Dr. John Doe",
        specialty: "Cardiologist",
        appointments: [
          { id: 1, patientName: "Alice Smith", date: "2023-06-15", time: "10:00 AM", status: "Confirmed" },
          { id: 2, patientName: "Bob Johnson", date: "2023-06-15", time: "11:30 AM", status: "Pending" },
          { id: 3, patientName: "Carol Williams", date: "2023-06-16", time: "09:15 AM", status: "Confirmed" }
        ]
      });
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('doctorAuthenticated');
    navigate('/doctor-login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="doctor-info">
        <h2>{doctorInfo.name}</h2>
        <p className="specialty">{doctorInfo.specialty}</p>
      </div>
      
      <div className="appointments-section">
        <h3>Upcoming Appointments</h3>
        {doctorInfo.appointments.length === 0 ? (
          <p className="no-appointments">You have no upcoming appointments.</p>
        ) : (
          <div className="appointments-table">
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctorInfo.appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-button view">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .dashboard-header h1 {
          color: #203a8b;
          margin: 0;
        }
        
        .logout-button {
          background: #f44336;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .logout-button:hover {
          background: #d32f2f;
        }
        
        .doctor-info {
          background: linear-gradient(135deg, #203a8b, #6758cd);
          color: white;
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .doctor-info h2 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 24px;
          color: white;
        }
        
        .specialty {
          font-size: 18px;
          opacity: 0.9;
          margin: 0;
        }
        
        .appointments-section {
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          padding: 25px;
        }
        
        .appointments-section h3 {
          color: #203a8b;
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 20px;
        }
        
        .no-appointments {
          text-align: center;
          color: #666;
          padding: 30px 0;
        }
        
        .appointments-table {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        th {
          background-color: #f9f9f9;
          font-weight: 600;
          color: #333;
        }
        
        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .confirmed {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .pending {
          background-color: #fff8e1;
          color: #f57c00;
        }
        
        .cancelled {
          background-color: #ffebee;
          color: #c62828;
        }
        
        .action-button {
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
        }
        
        .action-button.view {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        
        .action-button.view:hover {
          background-color: #bbdefb;
        }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;
