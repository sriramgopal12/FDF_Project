import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors, createAppointment, getUserAppointments } from "../services/appointmentService";

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAppointments, setUserAppointments] = useState([]);
  // Add the missing success state declaration
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch doctors and user's appointments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedDoctors = await getDoctors();
        setDoctors(fetchedDoctors);

        // Get current user's appointments
        const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
        if (userId) {
          const appointments = await getUserAppointments(userId);
          setUserAppointments(appointments);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({ text: "Failed to load data. Please try again.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate time slots when date changes
  useEffect(() => {
    if (formData.date && formData.doctorId) {
      // Get doctor's available time slots for the selected date
      // This would normally come from the backend
      generateTimeSlots(formData.date, formData.doctorId);
    }
  }, [formData.date, formData.doctorId]);

  const generateTimeSlots = (date, doctorId) => {
    // In a real application, you would fetch available slots from the backend
    // This is a simplified example
    const slots = [];
    const selectedDoctor = doctors.find(doc => doc.id === doctorId);

    if (selectedDoctor) {
      // Basic hours: 9 AM to 5 PM
      for (let hour = 9; hour < 17; hour++) {
        const timeString = `${hour}:00`;
        const isAvailable = !selectedDoctor.bookedSlots?.some(
          slot => slot.date === date && slot.time === timeString
        );

        if (isAvailable) {
          slots.push(timeString);
        }
      }
    }

    setTimeSlots(slots);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Update the handleSubmit function in AppointmentPage.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.doctorId || !formData.date || !formData.time || !formData.reason) {
        setMessage({ text: "Please fill in all required fields", type: "error" });
        setLoading(false);
        return;
      }

      // Get patient info from localStorage
      const userString = localStorage.getItem("user");
      let patientId = "guest-patient";
      let patientName = "Guest Patient";

      if (userString) {
        try {
          const user = JSON.parse(userString);
          patientId = user.id || patientId;
          patientName = user.name || patientName;
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      // Get doctor name from selected doctor
      const selectedDoctor = doctors.find(doc => doc.id === formData.doctorId);
      const doctorName = selectedDoctor ? `Dr. ${selectedDoctor.name}` : "Unknown Doctor";

      // Debug - before creating appointment
      console.log("Before creating appointment - all current appointments:",
        JSON.parse(localStorage.getItem('healthcare_appointments') || '[]'));

      // Create the appointment
      const appointmentData = {
        patientId,
        patientName,
        doctorId: formData.doctorId,
        doctorName,
        date: formData.date,
        time: formData.time,
        reason: formData.reason
      };

      console.log("Creating appointment with data:", appointmentData);
      const newAppointment = await createAppointment(appointmentData);

      // Debug - after creating appointment
      console.log("After creating appointment - all appointments:",
        JSON.parse(localStorage.getItem('healthcare_appointments') || '[]'));

      // Show success message
      setMessage({
        text: "Appointment scheduled successfully!",
        type: "success"
      });
      setSuccess(true);

      // Update the user's appointments list
      setUserAppointments(prev => [...prev, newAppointment]);

      // Reset the form
      setFormData({
        doctorId: "",
        date: "",
        time: "",
        reason: "",
      });

      // Redirect after a delay
      setTimeout(() => {
        navigate("/appointment");
      }, 2000);

    } catch (error) {
      console.error("Error creating appointment:", error);
      setMessage({
        text: `Failed to schedule appointment. ${error.message || "Please try again."}`,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get appropriate CSS class for appointment status
  const getStatusClass = (status) => {
    if (!status) return "status-pending";

    switch (status.toLowerCase()) {
      case "pending": return "status-pending";
      case "accepted": return "status-accepted";
      case "rejected": return "status-rejected";
      case "completed": return "status-completed";
      case "scheduled": return "status-accepted";
      case "cancelled": return "status-rejected";
      default: return "status-pending";
    }
  };

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h1>Book Your Appointment</h1>
        <p>Schedule a consultation with our healthcare professionals</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ text: "", type: "" })} className="close-btn">×</button>
        </div>
      )}

      <div className="appointment-content">
        <div className="booking-form-container">
          <h2>Request New Appointment</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="doctorId">Select Doctor</label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a Doctor --</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Appointment Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Preferred Time</label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                disabled={!formData.date || !formData.doctorId}
                required
              >
                <option value="">-- Select Time Slot --</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
                {/* Add fallback time slots if none are generated */}
                {timeSlots.length === 0 && formData.date && formData.doctorId && [
                  "9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
                ].map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {(!formData.date || !formData.doctorId) &&
                <small>Please select a doctor and date first</small>}
              {formData.date && formData.doctorId && timeSlots.length === 0 &&
                <small>Using default time slots for this date</small>}
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason for Visit</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Briefly describe your symptoms or reason for appointment"
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || success}
            >
              {loading ? "Processing..." : "Request Appointment"}
            </button>
          </form>
        </div>

        <div className="appointments-list-container">
          <h2>Your Appointments</h2>
          {userAppointments.length === 0 ? (
            <p className="no-appointments">You have no appointments scheduled.</p>
          ) : (
            <div className="appointments-list">
              {userAppointments.map(appointment => {
                const doctor = doctors.find(doc => doc.id === appointment.doctorId);
                return (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-details">
                      <h3>{appointment.doctorName || (doctor ? `Dr. ${doctor.name}` : "Unknown Doctor")}</h3>
                      <p className="specialization">{doctor?.specialization || "Specialist"}</p>
                      <div className="appointment-info">
                        <p><span>Date:</span> {appointment.date}</p>
                        <p><span>Time:</span> {appointment.time}</p>
                        <p><span>Reason:</span> {appointment.reason}</p>
                      </div>
                    </div>
                    <div className="appointment-status">
                      <span className={getStatusClass(appointment.status)}>
                        {appointment.status
                          ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
                          : "Pending"}
                      </span>
                      {(appointment.status === "pending" || appointment.status === "scheduled") && (
                        <button
                          className="action-btn cancel-btn"
                          onClick={() => {/* Implement cancel functionality */ }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .appointment-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          color: #333;
        }
        
        .appointment-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .appointment-header h1 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .appointment-header p {
          font-size: 1.1rem;
          color: #7f8c8d;
        }
        
        .appointment-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .appointment-content {
            grid-template-columns: 1fr;
          }
        }
        
        .booking-form-container,
        .appointments-list-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          padding: 2rem;
        }
        
        .booking-form-container h2,
        .appointments-list-container h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #2c3e50;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 0.75rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #34495e;
        }
        
        .form-group select,
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-group select:focus,
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #3498db;
          outline: none;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
        
        .form-group small {
          display: block;
          color: #7f8c8d;
          margin-top: 0.5rem;
          font-size: 0.85rem;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          margin-top: 1rem;
        }
        
        .submit-btn:hover {
          background: linear-gradient(135deg, #2980b9, #3498db);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .submit-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .message {
          padding: 1rem;
          border-radius: 5px;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        
        .appointments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .appointment-card {
          display: flex;
          justify-content: space-between;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .appointment-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        }
        
        .appointment-details {
          flex: 1;
        }
        
        .appointment-details h3 {
          font-size: 1.2rem;
          margin: 0 0 0.3rem 0;
          color: #2c3e50;
        }
        
        .specialization {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        
        .appointment-info p {
          margin: 0.5rem 0;
          font-size: 0.95rem;
        }
        
        .appointment-info span {
          font-weight: 600;
          color: #34495e;
        }
        
        .appointment-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          min-width: 120px;
        }
        
        .status-pending,
        .status-accepted,
        .status-rejected,
        .status-completed {
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: center;
        }
        
        .status-pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status-accepted {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        
        .status-rejected {
          background-color: #f8d7da;
          color: #842029;
        }
        
        .status-completed {
          background-color: #cff4fc;
          color: #055160;
        }
        
        .action-btn {
          background: white;
          border: 1px solid #ddd;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 1rem;
        }
        
        .action-btn:hover {
          background: #f8f9fa;
          border-color: #bbb;
        }
        
        .cancel-btn {
          color: #e74c3c;
          border-color: #e74c3c;
        }
        
        .cancel-btn:hover {
          background: #fdeeee;
        }
        
        .no-appointments {
          color: #7f8c8d;
          text-align: center;
          padding: 2rem;
          border: 2px dashed #ecf0f1;
          border-radius: 8px;
        }
        
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
          font-size: 1.2rem;
          color: #7f8c8d;
        }
      `}</style>
    </div>
  );
};

export default AppointmentPage;