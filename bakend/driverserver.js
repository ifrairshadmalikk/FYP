// server.js - درست ورژن
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/driver_dashboard';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// ==================== SCHEMAS ====================

// Driver Schema
const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  status: { type: String, default: 'active' }
}, { timestamps: true });

// Availability Schema
const availabilitySchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, default: 'available' },
  confirmed: { type: Boolean, default: false }
}, { timestamps: true });

// Models
const Driver = mongoose.model('Driver', driverSchema);
const Availability = mongoose.model('Availability', availabilitySchema);

// ==================== MIDDLEWARE ====================

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.driver = await Driver.findById(decoded.driverId).select('-password');
    
    if (!req.driver) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// ==================== APIs ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Driver Server is running perfectly',
    timestamp: new Date().toISOString()
  });
});

// Driver Registration API (Updated)
app.post('/api/drivers/register', async (req, res) => {
  try {
    const { 
      name, email, password, phone, licenseNumber, 
      vehicleType, vehicleNumber, capacity, experience, address 
    } = req.body;

    // Check if driver exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { licenseNumber }] 
    });

    if (existingDriver) {
      return res.status(400).json({ 
        success: false, 
        message: 'Driver already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create driver with pending status
    const driver = new Driver({
      name,
      email,
      password: hashedPassword,
      phone,
      licenseNumber,
      vehicleType,
      vehicleNumber,
      capacity,
      experience,
      address,
      status: 'pending', // pending, approved, rejected
      approvedBy: null,
      approvalDate: null
    });

    await driver.save();

    // Create transporter approval request
    const approvalRequest = new TransporterApproval({
      driverId: driver._id,
      driverName: name,
      driverEmail: email,
      driverPhone: phone,
      licenseNumber: licenseNumber,
      vehicleType: vehicleType,
      vehicleNumber: vehicleNumber,
      status: 'pending',
      submittedAt: new Date()
    });

    await approvalRequest.save();

    // Send notification to transporters (you can implement email/notification service here)
    await notifyTransporters(approvalRequest);

    res.status(201).json({
      success: true,
      message: 'Driver registered successfully. Waiting for transporter approval.',
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        licenseNumber: driver.licenseNumber,
        vehicleType: driver.vehicleType,
        vehicleNumber: driver.vehicleNumber,
        status: driver.status
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Notify transporters function
async function notifyTransporters(approvalRequest) {
  try {
    // Get all active transporters
    const transporters = await Transporter.find({ status: 'active' });
    
    // Create notifications for each transporter
    const notifications = transporters.map(transporter => ({
      transporterId: transporter._id,
      type: 'driver_approval_request',
      title: 'New Driver Registration Request',
      message: `Driver ${approvalRequest.driverName} has submitted registration request.`,
      data: {
        approvalRequestId: approvalRequest._id,
        driverId: approvalRequest.driverId
      },
      isRead: false,
      createdAt: new Date()
    }));

    await Notification.insertMany(notifications);
    
    // Here you can also send email notifications
    console.log(`Notified ${transporters.length} transporters about new driver registration`);
  } catch (error) {
    console.error('Error notifying transporters:', error);
  }
}

// Driver Login
app.post('/api/drivers/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Create token
    const token = jwt.sign(
      { driverId: driver._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        licenseNumber: driver.licenseNumber,
        vehicleType: driver.vehicleType,
        vehicleNumber: driver.vehicleNumber
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Set Availability - SIMPLIFIED VERSION
app.post('/api/availability', authMiddleware, async (req, res) => {
  try {
    const { date, startTime, endTime, status } = req.body;
    const driverId = req.driver._id;

    console.log('📝 Setting availability for driver:', driverId);
    console.log('📅 Date:', date);
    console.log('⏰ Time:', startTime, '-', endTime);
    console.log('🔔 Status:', status);

    // Check if availability exists
    const existingAvailability = await Availability.findOne({ 
      driverId, 
      date: new Date(date) 
    });

    let availability;

    if (existingAvailability) {
      // Update existing
      existingAvailability.startTime = startTime;
      existingAvailability.endTime = endTime;
      existingAvailability.status = status;
      existingAvailability.confirmed = true;
      availability = await existingAvailability.save();
    } else {
      // Create new
      availability = new Availability({
        driverId,
        date: new Date(date),
        startTime,
        endTime,
        status,
        confirmed: true
      });
      await availability.save();
    }

    console.log('✅ Availability saved successfully:', availability);

    res.json({
      success: true,
      message: 'Availability set successfully',
      availability
    });

  } catch (error) {
    console.error('❌ Availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error setting availability: ' + error.message 
    });
  }
});

// Get Availability History
app.get('/api/availability', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;
    
    const availabilityHistory = await Availability.find({ driverId })
      .sort({ date: -1 })
      .limit(10);

    res.json({
      success: true,
      availability: availabilityHistory
    });

  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching availability' 
    });
  }
});

// Get Dashboard Stats
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;
    
    // Get today's date for route assignment
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sample stats - in real app, calculate from actual data
    const stats = {
      completedTrips: 12,
      activeTrips: 1,
      pendingTrips: 3,
      monthlyEarnings: 45000
    };

    // Sample today's route
    const todaysRoute = {
      routeName: "Morning School Route",
      startPoint: "Gulshan-e-Iqbal",
      destination: "Bahria University",
      pickupTime: "07:30 AM",
      totalDistance: "15 km",
      estimatedDuration: "45 mins",
      vehicleType: "Hiace",
      vehicleNumber: "ABC-123"
    };

    res.json({
      success: true,
      stats,
      todaysRoute
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard stats' 
    });
  }
});
// Notification Schema
const notificationSchema = new mongoose.Schema({
  transporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transporter',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const transporterApprovalSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  driverEmail: {
    type: String,
    required: true
  },
  driverPhone: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  capacity: String,
  experience: String,
  address: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transporter'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewNotes: String
})

module.exports = mongoose.model('TransporterApproval', transporterApprovalSchema);

// Get pending approval requests for transporter
app.get('/api/transporter/approval-requests', async (req, res) => {
  try {
    const { transporterId } = req.query;
    
    const approvalRequests = await TransporterApproval.find({ 
      status: 'pending' 
    }).sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: approvalRequests
    });
  } catch (error) {
    console.error('Error fetching approval requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Approve/Reject driver
app.post('/api/transporter/approve-driver', async (req, res) => {
  try {
    const { approvalRequestId, transporterId, action, notes } = req.body;
    
    const approvalRequest = await TransporterApproval.findById(approvalRequestId);
    if (!approvalRequest) {
      return res.status(404).json({ 
        success: false, 
        message: 'Approval request not found' 
      });
    }

    const driver = await Driver.findById(approvalRequest.driverId);
    if (!driver) {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver not found' 
      });
    }

    if (action === 'approve') {
      approvalRequest.status = 'approved';
      driver.status = 'approved';
      driver.approvedBy = transporterId;
      driver.approvalDate = new Date();
    } else {
      approvalRequest.status = 'rejected';
      driver.status = 'rejected';
    }

    approvalRequest.reviewedAt = new Date();
    approvalRequest.approvedBy = transporterId;
    approvalRequest.reviewNotes = notes;

    await Promise.all([
      approvalRequest.save(),
      driver.save()
    ]);

    // Send notification to driver (you can implement this)
    await notifyDriverStatus(driver, action);

    res.json({
      success: true,
      message: `Driver ${action} successfully`
    });

  } catch (error) {
    console.error('Error approving driver:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});// DriverRegistrationScreen.js میں handleSubmit function کو اپ ڈیٹ کریں
const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await authAPI.register(form);
    
    if (response.data.success) {
      Alert.alert(
        "Registration Submitted",
        "Your registration has been submitted successfully! You will be able to login once a transporter approves your account.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("DriverLogin")
          }
        ]
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
    Alert.alert("Registration Error", errorMessage);
  } finally {
    setLoading(false);
  }
};

// ==================== START SERVER ====================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Driver Dashboard Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});