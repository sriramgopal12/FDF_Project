import React from "react";
import "./Footer.css"; 

const Footer = () => {
  return (
    <footer className="apple-style-footer">
      <div className="footer-container">
        <nav className="footer-directory">
          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li><a href="#">Primary Care</a></li>
              <li><a href="#">Specialist Care</a></li>
              <li><a href="#">Emergency Services</a></li>
              <li><a href="#">Telehealth</a></li>
              <li><a href="#">Preventive Care</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Patient Resources</h3>
            <ul>
              <li><a href="#">Find a Doctor</a></li>
              <li><a href="#">Patient Portal</a></li>
              <li><a href="#">Insurance Information</a></li>
              <li><a href="#">Medical Records</a></li>
              <li><a href="#">Billing & Payments</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>About Us</h3>
            <ul>
              <li><a href="#">Our Mission</a></li>
              <li><a href="#">Leadership Team</a></li>
              <li><a href="#">Locations</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">News & Events</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Appointment Help</a></li>
              <li><a href="#">Technical Support</a></li>
              <li><a href="#">Feedback</a></li>
            </ul>
          </div>
        </nav>
        
        <section className="footer-legal">
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Accessibility</a>
            <a href="#">Patient Rights</a>
            <a href="#">HIPAA Notice</a>
          </div>
          
          <div className="footer-locale">
            <a href="#">United States</a>
          </div>
        </section>
        
        <section className="footer-copyright">
          <p>Copyright © {new Date().getFullYear()} Healthcare System. All rights reserved.</p>
        </section>
      </div>
    </footer>
  );
};

export default Footer;