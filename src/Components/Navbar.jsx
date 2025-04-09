import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="astounding-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <span>Healthcare</span>
            <span className="accent">System</span>
          </Link>
        </div>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
        
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              <span className="nav-link-text">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>
              <span className="nav-link-text">Login</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/doctor-login" className="nav-link" onClick={() => setIsOpen(false)}>
              <span className="nav-link-text">Doctor Login</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link" onClick={() => setIsOpen(false)}>
              <span className="nav-link-text">Signup</span>
            </Link>
          </li>
        </ul>
      </div>
      
      <style jsx>{`
        .astounding-navbar {
          background: #2c3e50;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.2rem;
          position: sticky;
          top: 0;
          z-index: 999;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          padding: 0 24px;
        }
        
        .navbar-logo {
          justify-self: start;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        
        .navbar-logo a {
          text-decoration: none;
          display: flex;
        }
        
        .navbar-logo span {
          color: #fff;
          font-size: 1.8rem;
          font-weight: 700;
        }
        
        .navbar-logo .accent {
          color: #3498db;
          margin-left: 8px;
        }
        
        .nav-menu {
          display: flex;
          align-items: center;
          list-style: none;
          text-align: center;
          margin: 0;
          padding: 0;
        }
        
        .nav-item {
          height: 70px;
        }
        
        .nav-link {
          color: #fff;
          display: flex;
          align-items: center;
          text-decoration: none;
          padding: 0 1rem;
          height: 100%;
          font-size: 1.1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          color: #3498db;
        }
        
        .menu-icon {
          display: none;
          color: white;
          font-size: 1.8rem;
          cursor: pointer;
        }
        
        @media screen and (max-width: 960px) {
          .nav-menu {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: auto;
            position: absolute;
            top: 70px;
            left: -100%;
            opacity: 0;
            transition: all 0.5s ease;
            background: #2c3e50;
          }
          
          .nav-menu.active {
            left: 0;
            opacity: 1;
            z-index: 1;
          }
          
          .nav-item {
            height: 60px;
            width: 100%;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .nav-link {
            text-align: center;
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 1.5rem;
          }
          
          .menu-icon {
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(-100%, 60%);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;