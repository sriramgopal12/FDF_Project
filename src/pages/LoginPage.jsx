import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await login(formData.email, formData.password);
      console.log("Login response:", response);

      if (response.success) {
        const { user } = response.data;
        console.log("User data:", user);
        const role = user.role;
        console.log("User role:", role);
        
        // Store user role for routing
        localStorage.setItem("userType", role);
        
        // Redirect based on user role
        if (role === 'patient') {
          navigate('/appointment');
          console.log("Redirecting to appointment page");
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
          console.log("Redirecting to admin dashboard");
        } else {
          navigate('/');
          console.log("Redirecting to home");
        }
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUseTestAccount = () => {
    setFormData({
      email: "patient@example.com",
      password: "password"
    });
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1>Welcome Back</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@mail.com"
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
              placeholder="••••••••"
            />
          </div>
          
          <div className="info-box form-group">
            <p>For testing use:</p>
            <ul>
              <li>Patient: patient@example.com / password</li>
            </ul>
            <button type="button" onClick={handleUseTestAccount} className="test-account-btn">
              Use Test Account
            </button>
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
          <p>
            Doctor? <a href="/doctor-login">Login here</a>
          </p>
          <p className="back-link">
            <a href="/">← Back to Home</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }
        
        .login-form-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          width: 100%;
          max-width: 450px;
        }
        
        .login-form-container h1 {
          text-align: center;
          margin-bottom: 2rem;
          color: #2c3e50;
        }
        
        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 5px;
          margin-bottom: 1.5rem;
          text-align: center;
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
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus {
          border-color: #3498db;
          outline: none;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
        
        .info-box {
          background-color: #e8f4f8;
          padding: 0.75rem 1rem;
          border-radius: 5px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        
        .info-box p {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
          color: #2980b9;
        }
        
        .info-box ul {
          margin: 0;
          padding-left: 1.25rem;
        }
        
        .info-box li {
          margin-bottom: 0.25rem;
        }
        
        .test-account-btn {
          background: #2980b9;
          color: white;
          border: none;
          padding: 0.5rem;
          margin-top: 0.5rem;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.8rem;
        }
        
        .login-btn {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          border: none;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
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
          text-align: center;
          margin-top: 2rem;
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
        
        .back-link {
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        
        .back-link a {
          color: #7f8c8d;
          display: inline-flex;
          align-items: center;
          transition: color 0.3s;
        }
        
        .back-link a:hover {
          color: #3498db;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;