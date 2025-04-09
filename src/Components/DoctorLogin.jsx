import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Doctor login attempt:", formData);

    try {
      // Implement API call for doctor authentication
      // Mock successful authentication for demonstration
      const isAuthenticated = true; // Replace with actual authentication logic

      if (isAuthenticated) {
        // Store doctor authentication state in localStorage or context
        localStorage.setItem('doctorAuthenticated', 'true');

        // Redirect to doctor dashboard
        navigate('/doctor-dashboard');
      } else {
        // Handle authentication failure
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="back-link">
          <Link to="/">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>
        <h2>Doctor Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="login-footer">
          <p>
            Not registered? <Link to="/doctor-signup">Create an account</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        
        .login-form-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 450px;
        }
        
        .back-link {
          margin-bottom: 20px;
        }
        
        .back-link a {
          display: flex;
          align-items: center;
          color: #5b86e5;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        
        .back-link a:hover {
          color: #203a8b;
          text-decoration: underline;
        }
        
        .back-link i {
          margin-right: 8px;
        }
        
        h2 {
          color: #203a8b;
          text-align: center;
          margin-bottom: 30px;
          font-size: 28px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #444;
        }
        
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          transition: border 0.3s ease;
        }
        
        input:focus {
          border-color: #5b86e5;
          outline: none;
        }
        
        .login-button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #203a8b, #6758cd);
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }
        
        .login-button:hover {
          background: linear-gradient(135deg, #152c6c, #5247a3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .login-footer {
          text-align: center;
          margin-top: 25px;
          color: #666;
        }
        
        .login-footer a {
          color: #5b86e5;
          text-decoration: none;
          font-weight: 600;
        }
        
        .login-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default DoctorLogin;
