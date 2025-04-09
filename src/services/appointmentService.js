// This service handles API calls related to appointments
// In a real app, these functions would make actual API calls

// Sample doctors data (in a real app, this would come from the API)
const mockDoctors = [
  { 
    id: "1", 
    name: "John Smith", 
    specialization: "Cardiologist",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    bookedSlots: [] 
  },
  { 
    id: "2", 
    name: "Sarah Johnson", 
    specialization: "Dermatologist",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    bookedSlots: [] 
  },
  { 
    id: "3", 
    name: "Michael Brown", 
    specialization: "Neurologist",
    avatar: "https://randomuser.me/api/portraits/men/81.jpg",
    bookedSlots: [] 
  },
  { 
    id: "4", 
    name: "Emily Davis", 
    specialization: "Pediatrician",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    bookedSlots: [] 
  },
];

// Sample appointments (in a real app, this would be in a database)
let mockAppointments = [
  {
    id: "a1",
    patientId: "p1",
    doctorId: "1",
    date: "2023-06-15",
    time: "10:00",
    reason: "Annual checkup",
    status: "completed",
    createdAt: "2023-06-01T10:30:00Z"
  },
  {
    id: "a2",
    patientId: "p1",
    doctorId: "2",
    date: "2023-07-20",
    time: "14:30",
    reason: "Skin consultation",
    status: "accepted",
    createdAt: "2023-07-10T09:15:00Z"
  }
];

// Get all doctors
export const getDoctors = async () => {
  // In a real app: return fetch('/api/doctors').then(res => res.json())
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDoctors);
    }, 800); // Simulate network delay
  });
};

// Get appointments for a specific user
export const getUserAppointments = async (userId) => {
  // In a real app: return fetch(`/api/appointments?userId=${userId}`).then(res => res.json())
  return new Promise((resolve) => {
    setTimeout(() => {
      const userAppointments = mockAppointments.filter(app => app.patientId === userId);
      resolve(userAppointments);
    }, 800);
  });
};

// Get appointments for a specific doctor
// Get appointments for a specific doctor - FIXED VERSION
export const getDoctorAppointments = async (doctorId) => {
  try {
    console.log("Getting appointments for doctor ID:", doctorId);
    console.log("Current mockAppointments:", mockAppointments);
    
    // Return appointments from the mockAppointments array that match doctorId
    const doctorAppointments = mockAppointments.filter(appointment => 
      appointment.doctorId === doctorId
    );
    
    console.log("Filtered doctor appointments:", doctorAppointments);
    return doctorAppointments;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return [];
  }
};

// Create a new appointment
// Create a new appointment
export const createAppointment = async (appointmentData) => {
  console.log("createAppointment called with data:", appointmentData);
  
  // In a real app: 
  // return fetch('/api/appointments', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(appointmentData)
  // }).then(res => res.json())
  
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const newAppointment = {
          ...appointmentData,
          id: `a${mockAppointments.length + 1}`,
          status: "scheduled", // Ensure status is set
          createdAt: new Date().toISOString() // Set creation timestamp
        };
        
        console.log("Creating new appointment:", newAppointment);
        
        // Add to mock appointments array
        mockAppointments.push(newAppointment);
        
        // Update doctor's booked slots
        const doctorIndex = mockDoctors.findIndex(doc => doc.id === appointmentData.doctorId);
        if (doctorIndex !== -1) {
          mockDoctors[doctorIndex].bookedSlots.push({
            date: appointmentData.date,
            time: appointmentData.time
          });
        }
        
        console.log("Appointment added successfully. All appointments:", mockAppointments);
        resolve(newAppointment);
      }, 500);
    } catch (error) {
      console.error("Error in createAppointment:", error);
      reject(error);
    }
  });
};
// Update appointment status
export const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    // In a real app, make an API call to your backend
    // For demonstration, we'll simulate the response
    
    console.log(`Appointment ${appointmentId} status updated to ${newStatus}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return success
    return { success: true };
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

// Cancel an appointment
export const cancelAppointment = async (appointmentId) => {
  // In a real app:
  // return fetch(`/api/appointments/${appointmentId}`, {
  //   method: 'DELETE'
  // }).then(res => res.json())
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const appointment = mockAppointments.find(app => app.id === appointmentId);
      
      if (appointment) {
        // Remove the appointment
        mockAppointments = mockAppointments.filter(app => app.id !== appointmentId);
        
        // Remove from doctor's booked slots
        const doctorIndex = mockDoctors.findIndex(doc => doc.id === appointment.doctorId);
        if (doctorIndex !== -1) {
          mockDoctors[doctorIndex].bookedSlots = mockDoctors[doctorIndex].bookedSlots.filter(
            slot => !(slot.date === appointment.date && slot.time === appointment.time)
          );
        }
        
        resolve({ success: true });
      } else {
        resolve({ success: false, message: "Appointment not found" });
      }
    }, 800);
  });
};
// Update an appointment (synchronous version for direct usage)
export const updateAppointment = (appointmentId, updatedData) => {
  try {
    // Find the appointment to update
    const appointmentIndex = mockAppointments.findIndex(app => app.id === appointmentId);
    
    if (appointmentIndex !== -1) {
      // Update the appointment with new data
      mockAppointments[appointmentIndex] = {
        ...mockAppointments[appointmentIndex],
        ...updatedData
      };
      
      console.log(`Appointment ${appointmentId} updated:`, mockAppointments[appointmentIndex]);
      
      // Return the updated appointment
      return mockAppointments[appointmentIndex];
    } else {
      console.error(`Appointment with ID ${appointmentId} not found`);
      return null;
    }
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Initialize sample appointments for the test doctor
export const initializeSampleAppointments = () => {
  const today = new Date().toISOString().split('T')[0]; // Today's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];
  
  // Add test appointments for doctor with ID "2" (your test doctor)
  mockAppointments = [
    ...mockAppointments,
    {
      id: "test1",
      patientId: "patient1",
      patientName: "Test Patient",
      doctorId: "2", // Test doctor ID
      date: today,
      time: "11:00",
      reason: "COVID-19 vaccination",
      status: "scheduled",
      createdAt: new Date().toISOString()
    },
    {
      id: "test2",
      patientId: "patient1", 
      patientName: "Test Patient",
      doctorId: "2", // Test doctor ID
      date: tomorrowDate,
      time: "14:00",
      reason: "Follow-up appointment",
      status: "scheduled",
      createdAt: new Date().toISOString()
    }
  ];
  
  console.log("Sample appointments initialized:", mockAppointments);
};

// Call this function to ensure test appointments exist
initializeSampleAppointments();


// Emergency function to create a test appointment without async/await issues
export const createEmergencyTestAppointment = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const testAppointment = {
    id: `emergency-${Date.now()}`,
    patientId: "emergency-patient",
    patientName: "Emergency Test Patient",
    doctorId: "2", // Your test doctor ID
    doctorName: "Dr. Sarah Johnson", // Your test doctor name
    date: today,
    time: "15:30",
    reason: "Emergency test appointment",
    status: "scheduled",
    createdAt: new Date().toISOString()
  };
  
  // Add directly to mockAppointments array
  mockAppointments.push(testAppointment);
  console.log("Emergency test appointment created:", testAppointment);
  return testAppointment;
};
