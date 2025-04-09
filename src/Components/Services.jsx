import React from "react";

const Services = () => {
  return (
    <section id="services" className="services-section">
      <h2>Our Services</h2>
      <div className="services-list">
        <div className="service-item">
          <h3>Appointment Booking</h3>
          <p>Book appointments with doctors easily.</p>
        </div>
        <div className="service-item">
          <h3>Virtual Consultations</h3>
          <p>Consult with doctors online from the comfort of your home.</p>
        </div>
        <div className="service-item">
          <h3>Patient Records</h3>
          <p>Access and manage your health records securely.</p>
        </div>
      </div>
    </section>
  );
};

export default Services;