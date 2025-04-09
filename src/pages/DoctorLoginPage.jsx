import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginDoctor } from "../services/authService";

const DoctorLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "doctor@example.com",  // Pre-fill with correct email
    password: "password",          // Pre-fill with correct password
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Directly set authentication data for doctor
      localStorage.setItem("authToken", "direct-access-token-" + Date.now());
      localStorage.setItem("doctorId", "2");
      localStorage.setItem("doctorName", "Test Doctor");
      localStorage.setItem("userType", "doctor");

      console.log("Doctor login successful, redirecting to dashboard");

      // Navigate to doctor dashboard with slight delay to ensure state updates
      setTimeout(() => {
        navigate("/doctor-dashboard");
      }, 100);

    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const guaranteedAccess = () => {
    // Set all required authentication data
    localStorage.setItem("authToken", "emergency-token-" + Date.now());
    localStorage.setItem("doctorId", "2");
    localStorage.setItem("doctorName", "Emergency Doctor");
    localStorage.setItem("userType", "doctor");

    // Log success and navigate
    console.log("Emergency access granted, redirecting to doctor dashboard");
    navigate("/doctor-dashboard");
  };

  // Add sample appointments for testing
  const addTestAppointments = () => {
    // Create sample appointments directly in localStorage
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const sampleAppointments = [
      {
        id: "debug-" + Date.now(),
        patientId: "1",
        patientName: "Debug Patient",
        doctorId: "2", // Test doctor ID
        doctorName: "Dr. Test Doctor",
        date: today,
        time: "15:30",
        reason: "Debug appointment",
        status: "scheduled",
        createdAt: new Date().toISOString()
      }
    ];

    // Get existing appointments or initialize empty array
    const existingAppts = JSON.parse(localStorage.getItem('healthcare_appointments') || '[]');

    // Add new appointments
    const updatedAppts = [...existingAppts, ...sampleAppointments];

    // Save to localStorage
    localStorage.setItem('healthcare_appointments', JSON.stringify(updatedAppts));

    alert(`Added test appointment for today (${today}). Check your dashboard.`);
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1>Doctor Login</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="debug-section">
            <p>Developer Options:</p>
            <div className="debug-buttons">
              <button
                type="button"
                onClick={guaranteedAccess}
                className="emergency-btn"
              >
                Emergency Access
              </button>
              <button
                type="button"
                onClick={addTestAppointments}
                className="debug-btn"
              >
                Add Test Appointments
              </button>
            </div>
          </div>
        </form>

        <div className="login-footer">
          <p>
            Are you a patient? <Link to="/login">Login as Patient</Link>
          </p>
          <p>
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f5f9fc;
        }
        
        .login-form-container {
          background-color: white;
          padding: 2.5rem;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 450px;
        }
        
        .login-form-container h1 {
          color: #3498db;
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 2rem;
        }
        
        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border-radius: 5px;
          text-align: center;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c3e50;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
        
        .login-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }
        
        .login-btn:hover {
          background: linear-gradient(135deg, #2980b9, #3498db);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .login-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .login-footer {
          margin-top: 1.5rem;
          text-align: center;
          color: #7f8c8d;
        }
        
        .login-footer a {
          color: #3498db;
          text-decoration: none;
          font-weight: 600;
        }
        
        .login-footer a:hover {
          text-decoration: underline;
        }
        
        .debug-section {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px dashed #ddd;
        }
        
        .debug-section p {
          color: #7f8c8d;
          text-align: center;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }
        
        .debug-buttons {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        
        .emergency-btn, .debug-btn {
          flex: 1;
          padding: 0.6rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          color: white;
          transition: all 0.3s;
        }
        
        .emergency-btn {
          background-color: #e74c3c;
        }
        
        .emergency-btn:hover {
          background-color: #c0392b;
        }
        
        .debug-btn {
          background-color: #8e44ad;
        }
        
        .debug-btn:hover {
          background-color: #7d3c98;
        }
      `}</style>
    </div>
  );
};

export default DoctorLoginPage;