// Mock authentication service using localStorage only

// Helper function to get users from localStorage
export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// Helper function to save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Register a new user
export const register = async (name, email, password, role) => {
  try {
    // Get existing users
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return {
        success: false,
        message: "Email already in use. Please use a different email."
      };
    }
    
    // Create new user object
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, you would hash passwords
      role: role || "patient"
    };
    
    // Add new user to the list
    users.push(newUser);
    
    // Save updated user list
    saveUsers(users);
    
    return {
      success: true,
      data: { user: { ...newUser, password: undefined } }
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Registration failed. Please try again."
    };
  }
};

// Login user
export const login = async (email, password) => {
  try {
    // Get users from localStorage
    const users = getUsers();
    console.log("All users:", users);
    console.log("Attempting login with:", email, password);
    
    // Find user with matching email and password
    const user = users.find(
      user => user.email === email && user.password === password && user.role !== "doctor"
    );
    
    console.log("Found user:", user);
    
    if (!user) {
      return {
        success: false,
        message: "Invalid email or password"
      };
    }
    
    // Create a mock token
    const token = `mock-token-${Date.now()}`;
    
    // Store user data in localStorage
    localStorage.setItem("userToken", token);
    localStorage.setItem("authToken", token);
    localStorage.setItem("userType", user.role);
    localStorage.setItem("user", JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }));
    
    console.log("Login successful for:", user.name, "with role:", user.role);
    
    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Login failed. Please try again."
    };
  }
};

// Doctor Login - specialized login endpoint for doctors
export const loginDoctor = async (email, password) => {
  try {
    // Get users from localStorage
    const users = getUsers();
    console.log("All users for doctor login:", users);
    console.log("Attempting doctor login with:", email, password);
    
    // Find doctor with matching email and password
    const doctor = users.find(
      user => user.email === email && 
      user.password === password && 
      user.role === "doctor"
    );
    
    console.log("Found doctor:", doctor);
    
    if (!doctor) {
      console.log("Doctor login failed: No matching doctor account found");
      return {
        success: false,
        message: "Invalid doctor credentials"
      };
    }
    
    // Create a mock token
    const token = `mock-doctor-token-${Date.now()}`;
    
    // Store doctor data in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("doctorId", doctor.id);
    localStorage.setItem("doctorName", doctor.name);
    localStorage.setItem("userType", "doctor");
    
    // Debugging
    console.log("Doctor authentication successful:", {
      id: doctor.id,
      name: doctor.name,
      role: doctor.role,
      userType: localStorage.getItem("userType")
    });
    
    return {
      success: true,  // Explicit success flag
      id: doctor.id,
      name: doctor.name,
      token: token,
      role: doctor.role
    };
  } catch (error) {
    console.error("Doctor login error:", error);
    return {
      success: false,
      message: "Doctor login failed. Please try again."
    };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
  localStorage.removeItem("doctorId");
  localStorage.removeItem("doctorName");
  localStorage.removeItem("userType");
  localStorage.removeItem("authToken");
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem("userToken") !== null || 
         localStorage.getItem("authToken") !== null;
};

// Get user type (patient, doctor, admin)
export const getUserType = () => {
  return localStorage.getItem("userType");
};

// Add a helper function to initialize some test users (optional)
export const initializeTestUsers = () => {
  // Force clear users for development/testing purposes
  localStorage.removeItem('users');
  
  const existingUsers = getUsers();
  console.log("Existing users before initialization:", existingUsers);
  
  // Always initialize the test users for this demo
  const testUsers = [
    {
      id: "1",
      name: "Test Patient",
      email: "patient@example.com",
      password: "password",
      role: "patient"
    },
    {
      id: "2",
      name: "Test Doctor",
      email: "doctor@example.com",
      password: "password",
      role: "doctor"
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@example.com",
      password: "password",
      role: "admin"
    }
  ];
  
  saveUsers(testUsers);
  console.log("Test users initialized:", testUsers);
  
  // Verify users were saved correctly
  const savedUsers = getUsers();
  console.log("Users after initialization:", savedUsers);
};
// Add this code near the top of your authService.js file, just after imports
// This ensures the test users exist immediately
const ensureTestUsers = () => {
  // Force clear users for development/testing purposes
  localStorage.removeItem('users');
  
  // Create test users array
  const testUsers = [
    {
      id: "1",
      name: "Test Patient",
      email: "patient@example.com",
      password: "password",
      role: "patient"
    },
    {
      id: "2",
      name: "Test Doctor",
      email: "doctor@example.com",
      password: "password",
      role: "doctor"
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@example.com",
      password: "password",
      role: "admin"
    }
  ];
  
  // Save users to localStorage
  localStorage.setItem('users', JSON.stringify(testUsers));
  console.log("Test users forced initialization:", testUsers);
  return testUsers;
};

// Run this immediately to ensure users exist
ensureTestUsers();