import React from "react";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Footer from "../Components/Footer";
import "../styles/LandingPage.css"; // Import your CSS file for styling



const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <header className="hero-section">
        <h1>Welcome to Our Healthcare System</h1>
        <p>Book appointments, manage your health, and consult with doctors online.</p>
      </header>
      <div className="marquee-container">
        <div className="marquee">
          <span>
            Cardiology &nbsp; | &nbsp; Neurology &nbsp; | &nbsp; Pediatrics &nbsp; | &nbsp; Orthopedics &nbsp; | &nbsp; Dermatology &nbsp; | &nbsp; Psychiatry &nbsp; | &nbsp; General Medicine
          </span>
        </div>
      </div>
      <Services />
      <Footer />
    </div>
  );
};

export default LandingPage;