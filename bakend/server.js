const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transport';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// ==================== MICROSERVICES URLs ====================
const MICROSERVICES = {
  DRIVER: 'http://192.168.0.109:3001',
  PASSENGER: 'http://192.168.0.109:5001',
  GATEWAY: 'http://192.168.0.109:3005'
};

// ==================== SCHEMAS ====================

// User Schema (Transporter, Driver, Passenger)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String, // transporter, driver, passenger
  phone: String,
  company: String,
  license: String,
  address: String,
  status: { type: String, default: 'active' },
  registrationDate: { type: Date, default: Date.now },
  // Driver specific fields
  van: String,
  capacity: Number,
   availableTimeSlots: [String],
  experience: String,
  vehicle: String,
  status:{ type: String, default: 'pending' },
  // Passenger specific fields
  pickupPoint: String,
  destination: String,
  selectedTimeSlot: String,
  preferredTimeSlot: String,
  // Additional fields
  country: String,
  city: String,
  zone: String,
  profileImage: String,
  isVerified: { type: Boolean, default: false },
  lastLogin: Date,
  emergencyContact: String,
  dateOfBirth: String
});

const User = mongoose.model('User', userSchema);

// Poll Schema
const pollSchema = new mongoose.Schema({
  title: String,
  timeSlots: [String],
  closesAt: String,
  closingDate: Date,
  createdAt: { type: Date, default: Date.now },
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Poll = mongoose.model('Poll', pollSchema);

// Route Schema
const routeSchema = new mongoose.Schema({
  name: String,
  stops: [String],
  destination: String,
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timeSlot: String,
  distance: String,
  duration: String,
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const Route = mongoose.model('Route', routeSchema);

// Trip Schema
const tripSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  status: String, // En Route, Completed, Paused
  currentStop: String,
  currentLocation: {
    latitude: Number,
    longitude: Number
  },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  speed: Number,
  eta: String,
  completedStops: [String],
  createdAt: { type: Date, default: Date.now }
});

const Trip = mongoose.model('Trip', tripSchema);

// Payment Schema
const paymentSchema = new mongoose.Schema({
  type: String, // driver, passenger
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  mode: String,
  status: String, // Sent, Pending, Paid, Failed
  month: String,
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  byName: String,
  status: { type: String, default: 'Open' }, // Open, Resolved
  replies: [{
    by: String,
    text: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// Notification Schema
const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  icon: String,
  color: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

// Join Request Schema
const joinRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  type: String, // driver, passenger
  // Driver specific
  vehicle: String,
  capacity: Number,
  experience: String,
  license: String,
  availableTimeSlots: [String],
  // Passenger specific
  location: String,
  pickupPoint: String,
  destination: String,
  preferredTimeSlot: String,
  status: { type: String, default: 'pending' }, // pending, accepted, rejected
  createdAt: { type: Date, default: Date.now }
});

const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema);

// Alert Schema
const alertSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['urgent', 'warning', 'success', 'info'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['travel', 'payment', 'ride', 'system', 'driver', 'route'],
    default: 'system'
  },
  icon: {
    type: String,
    default: 'notifications'
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  read: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

const Alert = mongoose.model('Alert', alertSchema);

// Ride History Schema
const rideHistorySchema = new mongoose.Schema({
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  route: { type: String, required: true },
  driver: { type: String, required: true },
  vehicle: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  actualTime: { type: String, required: true },
  delay: { type: String },
  status: { type: String, enum: ['completed', 'cancelled', 'missed'], default: 'completed' },
  rating: { type: Number, min: 1, max: 5 },
  missed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const RideHistory = mongoose.model('RideHistory', rideHistorySchema);

// Availability Schema
const availabilitySchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, default: 'available' },
  confirmed: { type: Boolean, default: false }
}, { timestamps: true });

const Availability = mongoose.model('Availability', availabilitySchema);

// Transporter Approval Schema
const transporterApprovalSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    
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
    ref: 'User'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewNotes: String
});

const TransporterApproval = mongoose.model('TransporterApproval', transporterApprovalSchema);

// ==================== AUTHENTICATION MIDDLEWARE ====================

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// General Auth Middleware
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
    const user = await User.findById(decoded.userId || decoded.driverId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// Driver-specific Auth Middleware
const driverAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const driver = await User.findById(decoded.driverId).select('-password');
    
    if (!driver || driver.role !== 'driver') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid driver token' 
      });
    }

    req.driver = driver;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// Passenger-specific Auth Middleware
const passengerAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const passenger = await User.findById(decoded.userId).select('-password');
    
    if (!passenger || passenger.role !== 'passenger') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid passenger token' 
      });
    }

    req.passenger = passenger;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// ==================== HELPER FUNCTIONS ====================

// Generate JWT Token
const generateToken = (userId, type = 'user') => {
  const payload = type === 'driver' ? { driverId: userId } : { userId };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
};

// Generate Reset Token
const generateResetToken = (userId) => {
  return `reset_token_${userId}_${Date.now()}`;
};

// Verify Reset Token
const verifyResetToken = (token) => {
  const parts = token.split('_');
  return parts[2];
};

// Format Time Helper
const formatTime = (date) => {
  const now = new Date();
  const alertDate = new Date(date);
  const diffInHours = (now - alertDate) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return alertDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return `${Math.floor(diffInHours / 24)} days ago`;
  }
};

// Format Date Helper
const formatDate = (date) => {
  const alertDate = new Date(date);
  const now = new Date();
  
  if (alertDate.toDateString() === now.toDateString()) {
    return 'Today';
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (alertDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return alertDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// ==================== CROSS-SERVICE COMMUNICATION APIs ====================

// ✅ Create Poll with Broadcast to All Passengers
app.post('/api/polls-with-broadcast', async (req, res) => {
  try {
    const { title, timeSlots, closesAt, closingDate } = req.body;
    
    // Create poll in database
    const newPoll = new Poll({
      title,
      timeSlots,
      closesAt,
      closingDate: new Date(closingDate)
    });
    
    await newPoll.save();

    // Broadcast to all passengers via Gateway
    try {
      await axios.post(`${MICROSERVICES.GATEWAY}/api/polls/broadcast`, {
        pollId: newPoll._id,
        title,
        message: `New poll: ${title}. Please select your preferred time slots.`
      });
    } catch (broadcastError) {
      console.error('Broadcast error:', broadcastError.message);
    }

    res.json({ 
      success: true, 
      poll: newPoll,
      message: 'Poll created and broadcasted to all passengers'
    });
  } catch (error) {
    console.error('Create poll error:', error);
    res.status(500).json({ message: 'Error creating poll' });
  }
});

// ✅ Assign Driver with Notifications to Driver and Passengers
app.put('/api/routes/:routeId/assign-with-notify', async (req, res) => {
  try {
    const { routeId } = req.params;
    const { driverId, timeSlot, passengerIds } = req.body;
    
    const route = await Route.findByIdAndUpdate(
      routeId,
      { 
        assignedDriver: driverId,
        timeSlot,
        passengers: passengerIds 
      },
      { new: true }
    ).populate('assignedDriver').populate('passengers');

    // Send notifications via Gateway
    try {
      await axios.post(`${MICROSERVICES.GATEWAY}/api/driver-assigned/notify`, {
        routeId,
        driverId,
        passengerIds,
        timeSlot
      });
    } catch (notifyError) {
      console.error('Notification error:', notifyError.message);
    }

    // Create a trip for this assignment
    const newTrip = new Trip({
      driverId,
      routeId,
      status: 'En Route',
      currentStop: route.stops[0],
      currentLocation: { latitude: 33.6844, longitude: 73.0479 },
      passengers: passengerIds,
      speed: 40,
      eta: '30 min',
      completedStops: []
    });
    
    await newTrip.save();
    
    res.json({ 
      success: true, 
      route,
      message: 'Driver assigned and notifications sent'
    });
  } catch (error) {
    console.error('Assign driver error:', error);
    res.status(500).json({ message: 'Error assigning driver' });
  }
});

// ✅ Send Emergency Alert to All Users
app.post('/api/emergency-alert', async (req, res) => {
  try {
    const { title, message, type, target } = req.body;

    try {
      await axios.post(`${MICROSERVICES.GATEWAY}/api/emergency/broadcast`, {
        title,
        message,
        type,
        target
      });
    } catch (broadcastError) {
      console.error('Emergency broadcast error:', broadcastError.message);
    }

    res.json({
      success: true,
      message: `Emergency alert sent to ${target}`
    });
  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({ message: 'Error sending emergency alert' });
  }
});

// ✅ Send Notification to Specific Passenger
app.post('/api/notifications/send-to-passenger', async (req, res) => {
  try {
    const { passengerId, title, message, type, category } = req.body;

    try {
      await axios.post(`${MICROSERVICES.GATEWAY}/api/notifications/send-to-passenger`, {
        passengerId,
        title,
        message,
        type,
        category
      });
    } catch (notifyError) {
      console.error('Send notification error:', notifyError.message);
    }

    res.json({
      success: true,
      message: 'Notification sent to passenger'
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
});

// ✅ Send Notification to Specific Driver
app.post('/api/notifications/send-to-driver', async (req, res) => {
  try {
    const { driverId, title, message, type } = req.body;

    try {
      await axios.post(`${MICROSERVICES.GATEWAY}/api/notifications/send-to-driver`, {
        driverId,
        title,
        message,
        type
      });
    } catch (notifyError) {
      console.error('Send driver notification error:', notifyError.message);
    }

    res.json({
      success: true,
      message: 'Notification sent to driver'
    });
  } catch (error) {
    console.error('Send driver notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification to driver' });
  }
});

// ✅ Unified Notification System
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { to, title, message, type, category, metadata } = req.body;

    try {
      await axios.post(`${MICROSERVICES.GATEWAY}/api/notifications/send`, {
        to,
        title,
        message,
        type,
        category,
        metadata
      });
    } catch (notifyError) {
      console.error('Unified notification error:', notifyError.message);
    }

    res.json({
      success: true,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    console.error('Unified notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
});

// ✅ Trip Status Update Notifications
app.post('/api/trip-status/update', async (req, res) => {
  try {
    const { routeId, status, message, passengerIds } = req.body;

    try {
      await axios.post(`${MICROSERVICES.GATEWAY}/api/trip-status/update`, {
        routeId,
        status,
        message,
        passengerIds
      });
    } catch (notifyError) {
      console.error('Trip status update error:', notifyError.message);
    }

    res.json({
      success: true,
      message: `Trip status update sent to ${passengerIds.length} passengers`
    });
  } catch (error) {
    console.error('Trip status update error:', error);
    res.status(500).json({ success: false, message: 'Failed to send trip status' });
  }
});

// ✅ Live Location Broadcast
app.post('/api/live-tracking/broadcast', async (req, res) => {
  try {
    const { routeId, driverId, location, speed, estimatedArrival } = req.body;

    try {
      await axios.post(`${MICROSERVICES.GATEWAY}/api/live-tracking/broadcast`, {
        routeId,
        driverId,
        location,
        speed,
        estimatedArrival
      });
    } catch (broadcastError) {
      console.error('Live tracking broadcast error:', broadcastError.message);
    }

    res.json({
      success: true,
      message: 'Location broadcasted to passengers'
    });
  } catch (error) {
    console.error('Live tracking error:', error);
    res.status(500).json({ success: false, message: 'Failed to broadcast location' });
  }
});

// ==================== TRANSPORTER APIs ====================

// ✅ Transporter Login API
app.post('/api/transporter/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required." 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format. Please enter a valid email address." 
      });
    }

    
const transporter = await User.findOne({ 
      email: email.toLowerCase(), 
      role: 'transporter'  // ✅ صرف transporter
    });
    if (!transporter) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password. Please try again." 
      });
    }

    if (password !== transporter.password) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password. Please try again." 
      });
    }

    const token = generateToken(transporter._id);

    res.json({
      success: true,
      message: "Login successful!",
      token: token,
      transporter: {
        id: transporter._id,
        name: transporter.name,
        email: transporter.email,
        phone: transporter.phone,
        company: transporter.company,
        license: transporter.license,
        address: transporter.address,
        registrationDate: transporter.registrationDate
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later." 
    });
  }
});

// ✅ Transporter Registration API
app.post('/api/transporter/register', async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      phone,
      country,
      city,
      zone,
      email,
      password,
      confirmPassword,
      profileImage
    } = req.body;

    if (!fullName || !companyName || !phone || !country || !city || !zone || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required." 
      });
    }

    const nameRegex = /^[A-Za-z ]{2,50}$/;
    if (!nameRegex.test(fullName)) {
      return res.status(400).json({ 
        success: false, 
        message: "Full name must be 2-50 characters long and contain only letters and spaces." 
      });
    }

    const phoneRegex = /^[0-9+]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid phone number (10-15 digits)." 
      });
    }

    const textRegex = /^[A-Za-z0-9, ]{1,100}$/;
    if (!textRegex.test(country) || !textRegex.test(city) || !textRegex.test(zone)) {
      return res.status(400).json({ 
        success: false, 
        message: "Country, city, and zone must be 1-100 characters long and may only contain letters, digits, commas and spaces." 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format. Please enter a valid email address." 
      });
    }

    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be 8-16 characters and contain an uppercase letter, a digit, and a special character." 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match." 
      });
    }

    const existingTransporter = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'transporter' 
    });

    if (existingTransporter) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already registered. Please use a different email or login." 
      });
    }

    const address = `${zone}, ${city}, ${country}`;

    const newTransporter = new User({
      name: fullName,
      email: email.toLowerCase(),
      password: password,
      role: 'transporter',
      phone: phone,
      company: companyName,
      license: `TRANS${Date.now()}`,
      address: address,
      country: country,
      city: city,
      zone: zone,
      profileImage: profileImage,
      registrationDate: new Date(),
      status: 'active'
    });

    await newTransporter.save();

    const token = generateToken(newTransporter._id);

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token: token,
      transporter: {
        id: newTransporter._id,
        name: newTransporter.name,
        email: newTransporter.email,
        phone: newTransporter.phone,
        company: newTransporter.company,
        license: newTransporter.license,
        address: newTransporter.address,
        registrationDate: newTransporter.registrationDate,
        profileImage: newTransporter.profileImage
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed. Please try again." 
    });
  }
});

// ✅ AUTH APIs
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (user) {
      res.json({
        success: true,
        token: 'dummy-jwt-token',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, company, license, address } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const newUser = new User({
      name,
      email,
      password,
      role,
      phone,
      company,
      license,
      address
    });
    
    await newUser.save();
    
    res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// ✅ PROFILE APIs
app.get('/api/profile', async (req, res) => {
  try {
    const user = await User.findOne({ role: 'transporter' });
    
    if (user) {
      res.json({
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        registrationDate: user.registrationDate,
        address: user.address,
        profileImage: user.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      });
    } else {
      const defaultTransporter = new User({
        name: 'Transport Company',
        email: 'admin@transport.com',
        password: 'admin123',
        role: 'transporter',
        phone: '+1234567890',
        company: 'City Transport Ltd',
        address: '123 Main Street, City',
        profileImage: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      });
      await defaultTransporter.save();

      res.json({
        name: defaultTransporter.name,
        email: defaultTransporter.email,
        phone: defaultTransporter.phone,
        company: defaultTransporter.company,
        registrationDate: defaultTransporter.registrationDate,
        address: defaultTransporter.address,
        profileImage: defaultTransporter.profileImage
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    const profileData = req.body;
    await User.findOneAndUpdate({ role: 'transporter' }, profileData);
    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// ✅ DASHBOARD STATS API
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const activeDrivers = await User.countDocuments({ role: 'driver', status: 'active' });
    const totalPassengers = await User.countDocuments({ role: 'passenger' });
    const completedTrips = await Trip.countDocuments({ status: 'Completed' });
    const ongoingTrips = await Trip.countDocuments({ status: 'En Route' });
    const complaints = await Complaint.countDocuments({ status: 'Open' });
    
    const driverPayments = await Payment.aggregate([
      { $match: { type: 'driver', status: 'Sent' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const pendingPayments = await Payment.aggregate([
      { $match: { type: 'driver', status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const paymentsReceived = driverPayments.length > 0 ? driverPayments[0].total : 0;
    const paymentsPending = pendingPayments.length > 0 ? pendingPayments[0].total : 0;
    
    res.json({
      activeDrivers,
      totalPassengers,
      completedTrips,
      ongoingTrips,
      complaints,
      paymentsReceived,
      paymentsPending
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// ✅ POLL APIs
app.get('/api/polls', async (req, res) => {
  try {
    const polls = await Poll.find().populate('responses');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching polls' });
  }
});

app.post('/api/polls', async (req, res) => {
  try {
    const { title, timeSlots, closesAt, closingDate } = req.body;
    const newPoll = new Poll({
      title,
      timeSlots,
      closesAt,
      closingDate: new Date(closingDate)
    });
    
    await newPoll.save();
    res.json({ success: true, poll: newPoll });
  } catch (error) {
    res.status(500).json({ message: 'Error creating poll' });
  }
});

// ✅ DRIVER APIs
app.get('/api/drivers', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers' });
  }
});

// ✅ PASSENGER APIs
app.get('/api/passengers', async (req, res) => {
  try {
    const passengers = await User.find({ role: 'passenger' });
    res.json(passengers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching passengers' });
  }
});

// ✅ ROUTES APIs
app.get('/api/routes', async (req, res) => {
  try {
    const routes = await Route.find()
      .populate('assignedDriver')
      .populate('passengers');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes' });
  }
});

app.post('/api/routes', async (req, res) => {
  try {
    const routeData = req.body;
    const newRoute = new Route(routeData);
    await newRoute.save();
    
    const populatedRoute = await Route.findById(newRoute._id)
      .populate('assignedDriver')
      .populate('passengers');
    
    res.json(populatedRoute);
  } catch (error) {
    console.error('Route creation error:', error);
    res.status(500).json({ message: 'Error creating route' });
  }
});

app.put('/api/routes/:routeId/assign', async (req, res) => {
  try {
    const { routeId } = req.params;
    const { driverId, timeSlot, passengerIds } = req.body;
    
    const route = await Route.findByIdAndUpdate(
      routeId,
      { 
        assignedDriver: driverId,
        timeSlot,
        passengers: passengerIds 
      },
      { new: true }
    ).populate('assignedDriver').populate('passengers');
    
    const newTrip = new Trip({
      driverId,
      routeId,
      status: 'En Route',
      currentStop: route.stops[0],
      currentLocation: { latitude: 33.6844, longitude: 73.0479 },
      passengers: passengerIds,
      speed: 40,
      eta: '30 min',
      completedStops: []
    });
    
    await newTrip.save();
    
    res.json({ success: true, route });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning driver' });
  }
});

// ✅ DELETE Route API
app.delete('/api/routes/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;
    
    console.log('Deleting route:', routeId);
    
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
      });
    }

    await Route.findByIdAndDelete(routeId);
    await Trip.deleteMany({ routeId });
    
    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting route' 
    });
  }
});

// ✅ UPDATE Route API
app.put('/api/routes/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;
    const routeData = req.body;
    
    console.log('Updating route:', routeId, routeData);
    
    const route = await Route.findByIdAndUpdate(
      routeId,
      routeData,
      { new: true }
    ).populate('assignedDriver').populate('passengers');
    
    if (!route) {
      return res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Route updated successfully',
      route
    });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating route' 
    });
  }
});

// ✅ JOIN REQUESTS APIs
app.get('/api/join-requests', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const requests = await JoinRequest.find(query);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

app.post('/api/join-requests', async (req, res) => {
  try {
    const requestData = req.body;
    const newRequest = new JoinRequest(requestData);
    await newRequest.save();
    res.json({ success: true, request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request' });
  }
});

app.put('/api/join-requests/:requestId/accept', async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await JoinRequest.findByIdAndUpdate(
      requestId,
      { status: 'accepted' },
      { new: true }
    );
    
    const newUser = new User({
      name: request.name,
      email: request.email,
      phone: request.phone,
      role: request.type,
      ...(request.type === 'driver' && {
        vehicle: request.vehicle,
        capacity: request.capacity,
        experience: request.experience,
        license: request.license,
        availableTimeSlots: request.availableTimeSlots
      }),
      ...(request.type === 'passenger' && {
        pickupPoint: request.pickupPoint,
        destination: request.destination,
        preferredTimeSlot: request.preferredTimeSlot
      })
    });
    
    await newUser.save();
    
    res.json({ success: true, request, user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting request' });
  }
});

app.put('/api/join-requests/:requestId/reject', async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await JoinRequest.findByIdAndUpdate(
      requestId,
      { status: 'rejected' },
      { new: true }
    );
    
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request' });
  }
});

// ✅ PAYMENT APIs
app.get('/api/payments', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const payments = await Payment.find(query)
      .populate('driverId')
      .populate('passengerId');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const paymentData = req.body;
    const newPayment = new Payment(paymentData);
    await newPayment.save();
    
    const populatedPayment = await Payment.findById(newPayment._id)
      .populate('driverId')
      .populate('passengerId');
    
    res.json({ success: true, payment: populatedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment' });
  }
});

// ✅ COMPLAINT APIs
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});

app.post('/api/complaints/:complaintId/reply', async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { text } = req.body;
    
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { $push: { replies: { by: 'Admin', text } } },
      { new: true }
    );
    
    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error replying to complaint' });
  }
});

app.put('/api/complaints/:complaintId/resolve', async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status: 'Resolved' },
      { new: true }
    );
    
    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error resolving complaint' });
  }
});

// ✅ NOTIFICATION APIs
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

app.put('/api/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});

// ✅ TRIP APIs (Live Tracking)
app.get('/api/trips', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) query.status = status;
    
    const trips = await Trip.find(query)
      .populate('driverId')
      .populate('routeId')
      .populate('passengers');
    
    res.json({ 
      success: true, 
      trips 
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching trips' 
    });
  }
});

app.put('/api/trips/:tripId/location', async (req, res) => {
  try {
    const { tripId } = req.params;
    const locationData = req.body;
    
    const trip = await Trip.findByIdAndUpdate(
      tripId,
      { currentLocation: locationData },
      { new: true }
    ).populate('driverId').populate('routeId').populate('passengers');
    
    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location' });
  }
});

// ✅ AUTO ASSIGNMENT API
app.post('/api/auto-assign', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver', status: 'active' });
    const passengers = await User.find({ role: 'passenger', status: 'active' });
    
    const assignments = drivers.map((driver, index) => {
      const assignedPassengers = passengers.slice(index * 3, (index + 1) * 3);
      return {
        driver,
        passengers: assignedPassengers,
        targetCapacity: driver.capacity || 8,
        totalDistance: (Math.random() * 20 + 5).toFixed(1),
        estimatedTime: (Math.random() * 30 + 15).toFixed(0),
        efficiencyScore: (Math.random() * 30 + 70).toFixed(0),
        utilization: Math.min(100, Math.round((assignedPassengers.length / (driver.capacity || 8)) * 100)),
        status: 'pending'
      };
    });
    
    const unassigned = passengers.slice(drivers.length * 3);
    
    res.json({
      assignments,
      unassigned
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating auto assignments' });
  }
});

// ✅ GET Users by Role and Status
app.get('/api/users', async (req, res) => {
  try {
    const { role, status } = req.query;
    let query = {};
    
    if (role) query.role = role;
    if (status) query.status = status;
    
    const users = await User.find(query);
    res.json({ 
      success: true, 
      users 
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users' 
    });
  }
});

// ✅ Email Service Endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    console.log('📧 Email would be sent to:', to);
    console.log('📧 Subject:', subject);
    console.log('📧 Message:', message);
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully (simulated)' 
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email' 
    });
  }
});

// ==================== PASSENGER APIs ====================

// ✅ Passenger Login
app.post('/api/passenger/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Find passenger
    const passenger = await User.findOne({ email: email.toLowerCase(), role: 'passenger' });
    
    if (!passenger) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (password !== passenger.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    passenger.lastLogin = new Date();
    await passenger.save();

    // Generate token
    const token = generateToken(passenger._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      passenger: {
        id: passenger._id,
        email: passenger.email,
        name: passenger.name,
        phone: passenger.phone,
        isVerified: passenger.isVerified
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

// ✅ Passenger Registration
app.post('/api/passenger/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, emergencyContact, dateOfBirth } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if passenger already exists
    const existingPassenger = await User.findOne({ email: email.toLowerCase(), role: 'passenger' });
    
    if (existingPassenger) {
      return res.status(409).json({
        success: false,
        message: 'Passenger with this email already exists'
      });
    }

    // Create new passenger
    const passenger = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'passenger',
      phone,
      address,
      emergencyContact,
      dateOfBirth,
      isVerified: false
    });

    await passenger.save();

    // Generate token
    const token = generateToken(passenger._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      passenger: {
        id: passenger._id,
        email: passenger.email,
        name: passenger.name,
        phone: passenger.phone,
        isVerified: passenger.isVerified
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

// ✅ Get Passenger Profile
app.get('/api/passenger/profile', passengerAuthMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      passenger: req.passenger
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// ✅ Update Passenger Profile
app.put('/api/passenger/profile', passengerAuthMiddleware, async (req, res) => {
  try {
    const { name, phone, address, emergencyContact, dateOfBirth } = req.body;
    
    const updatedPassenger = await User.findByIdAndUpdate(
      req.passenger._id,
      { name, phone, address, emergencyContact, dateOfBirth },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      passenger: updatedPassenger
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// ✅ Get Alerts for Passenger
app.get('/api/passenger/alerts', passengerAuthMiddleware, async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    let query = { passengerId: req.passenger._id };
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get counts for different alert types
    const totalAlerts = await Alert.countDocuments({ passengerId: req.passenger._id });
    const unreadCount = await Alert.countDocuments({ 
      passengerId: req.passenger._id, 
      read: false 
    });
    const actionRequiredCount = await Alert.countDocuments({ 
      passengerId: req.passenger._id, 
      actionRequired: true,
      read: false 
    });

    res.json({
      success: true,
      alerts: alerts.map(alert => ({
        id: alert._id,
        title: alert.title,
        message: alert.message,
        type: alert.type,
        category: alert.category,
        icon: alert.icon,
        actionRequired: alert.actionRequired,
        read: alert.read,
        time: formatTime(alert.createdAt),
        date: formatDate(alert.createdAt),
        metadata: alert.metadata
      })),
      counts: {
        total: totalAlerts,
        unread: unreadCount,
        actionRequired: actionRequiredCount
      }
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts'
    });
  }
});

// ✅ Mark Alert as Read
app.put('/api/passenger/alerts/:alertId/read', passengerAuthMiddleware, async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, passengerId: req.passenger._id },
      { read: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert marked as read',
      alert
    });

  } catch (error) {
    console.error('Mark alert read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating alert'
    });
  }
});

// ✅ Mark All Alerts as Read
app.put('/api/passenger/alerts/mark-all-read', passengerAuthMiddleware, async (req, res) => {
  try {
    await Alert.updateMany(
      { passengerId: req.passenger._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All alerts marked as read'
    });

  } catch (error) {
    console.error('Mark all alerts read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating alerts'
    });
  }
});

// ✅ Get Passenger Ride History
app.get('/api/passenger/ride-history', passengerAuthMiddleware, async (req, res) => {
  try {
    const passengerId = req.passenger._id;

    // Verify passenger exists
    const passenger = await User.findById(passengerId);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    // Get ride history
    const rideHistory = await RideHistory.find({ passengerId })
      .sort({ date: -1 });

    // Transform data for frontend
    const formattedRides = rideHistory.map(ride => ({
      id: ride._id,
      date: ride.date.toISOString().split('T')[0],
      time: ride.time,
      route: ride.route,
      driver: ride.driver,
      vehicle: ride.vehicle,
      scheduledTime: ride.scheduledTime,
      actualTime: ride.actualTime,
      delay: ride.delay,
      status: ride.status,
      rating: ride.rating,
      missed: ride.missed
    }));

    res.json({
      success: true,
      rides: formattedRides
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// ✅ Create New Ride
app.post('/api/passenger/book-ride', passengerAuthMiddleware, async (req, res) => {
  try {
    const passengerId = req.passenger._id;
    const { pickupLocation, dropoffLocation, scheduledTime } = req.body;

    const ride = new RideHistory({
      passengerId,
      date: new Date(),
      time: new Date().toLocaleTimeString(),
      route: `${pickupLocation} → ${dropoffLocation}`,
      driver: 'Driver not assigned',
      vehicle: 'Vehicle not assigned',
      scheduledTime: scheduledTime,
      actualTime: 'N/A',
      status: 'scheduled'
    });

    await ride.save();

    res.status(201).json({
      success: true,
      message: 'Ride booked successfully',
      ride: {
        id: ride._id,
        pickupLocation: pickupLocation,
        dropoffLocation: dropoffLocation,
        scheduledTime: scheduledTime,
        status: ride.status
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// ✅ Add Rating to Ride
app.post('/api/passenger/rate-ride/:rideId', passengerAuthMiddleware, async (req, res) => {
  try {
    const { rideId } = req.params;
    const { rating, feedback } = req.body;
    const passengerId = req.passenger._id;

    const ride = await RideHistory.findOne({ _id: rideId, passengerId });
    if (!ride) {
      return res.status(404).json({ 
        success: false,
        message: 'Ride not found' 
      });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({ 
        success: false,
        message: 'Can only rate completed rides' 
      });
    }

    ride.rating = rating;
    if (feedback) ride.feedback = feedback;

    await ride.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      ride: {
        id: ride._id,
        rating: ride.rating,
        feedback: ride.feedback
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// ✅ Get Ride Statistics
app.get('/api/passenger/ride-stats', passengerAuthMiddleware, async (req, res) => {
  try {
    const passengerId = req.passenger._id;

    const totalRides = await RideHistory.countDocuments({ passengerId });
    const completedRides = await RideHistory.countDocuments({ 
      passengerId, 
      status: 'completed' 
    });
    const missedRides = await RideHistory.countDocuments({ 
      passengerId, 
      status: { $in: ['missed', 'cancelled'] } 
    });

    const averageRating = await RideHistory.aggregate([
      { $match: { passengerId: passengerId, rating: { $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      totalRides,
      completedRides,
      missedRides,
      averageRating: averageRating.length > 0 ? Math.round(averageRating[0].avgRating * 10) / 10 : 0
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// ==================== DRIVER APIs ====================

// ✅ Driver Registration API
// ✅ Updated Driver Registration API - Goes to Join Requests first
app.post('/api/driver/register', async (req, res) => {
  try {
    const { 
      name, email, password, phone, licenseNumber, 
      vehicleType, vehicleNumber, capacity, experience, address 
    } = req.body;

    // Check if driver already exists in Users or Join Requests
    const existingUser = await User.findOne({ 
      $or: [{ email }, { licenseNumber }] 
    });

    const existingRequest = await JoinRequest.findOne({ 
      $or: [{ email }, { licenseNumber }] 
    });

    if (existingUser || existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'Driver already exists or request is pending' 
      });
    }

    // Create join request instead of direct user
    const joinRequest = new JoinRequest({
      name,
      email,
      phone,
      type: 'driver',
      vehicle: vehicleType,
      capacity: parseInt(capacity) || 8,
      experience,
      license: licenseNumber,
      availableTimeSlots: ['07:00 AM', '07:30 AM', '08:00 AM'], // Default slots
      status: 'pending',
      // Additional driver-specific fields
      licenseNumber: licenseNumber,
      vehicleType: vehicleType,
      vehicleNumber: vehicleNumber,
      address: address
    });

    await joinRequest.save();

    // Also create transporter approval request for tracking
    const approvalRequest = new TransporterApproval({
      driverName: name,
      driverEmail: email,
      driverPhone: phone,
      licenseNumber: licenseNumber,
      vehicleType: vehicleType,
      vehicleNumber: vehicleNumber,
      capacity: capacity,
      experience: experience,
      address: address,
      status: 'pending',
      submittedAt: new Date()
    });

    await approvalRequest.save();

    res.status(201).json({
      success: true,
      message: 'Driver registration submitted successfully. Waiting for transporter approval.',
      requestId: joinRequest._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});app.post('/api/transporter/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required." 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format. Please enter a valid email address." 
      });
    }

    const transporter = await User.findOne({ 
      email: email.toLowerCase(), 
      role: 'transporter' 
    });

    if (!transporter) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password. Please try again." 
      });
    }

    if (password !== transporter.password) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password. Please try again." 
      });
    }

    const token = generateToken(transporter._id);

    res.json({
      success: true,
      message: "Login successful!",
      token: token,
      transporter: {
        id: transporter._id,
        name: transporter.name,
        email: transporter.email,
        phone: transporter.phone,
        company: transporter.company,
        license: transporter.license,
        address: transporter.address,
        registrationDate: transporter.registrationDate
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later." 
    });
  }
});

// ✅ Transporter Registration API
app.post('/api/transporter/register', async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      phone,
      country,
      city,
      zone,
      email,
      password,
      confirmPassword,
      profileImage
    } = req.body;

    if (!fullName || !companyName || !phone || !country || !city || !zone || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required." 
      });
    }

    const nameRegex = /^[A-Za-z ]{2,50}$/;
    if (!nameRegex.test(fullName)) {
      return res.status(400).json({ 
        success: false, 
        message: "Full name must be 2-50 characters long and contain only letters and spaces." 
      });
    }

    const phoneRegex = /^[0-9+]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid phone number (10-15 digits)." 
      });
    }

    const textRegex = /^[A-Za-z0-9, ]{1,100}$/;
    if (!textRegex.test(country) || !textRegex.test(city) || !textRegex.test(zone)) {
      return res.status(400).json({ 
        success: false, 
        message: "Country, city, and zone must be 1-100 characters long and may only contain letters, digits, commas and spaces." 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format. Please enter a valid email address." 
      });
    }

    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be 8-16 characters and contain an uppercase letter, a digit, and a special character." 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match." 
      });
    }

    const existingTransporter = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'transporter' 
    });

    if (existingTransporter) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already registered. Please use a different email or login." 
      });
    }

    const address = `${zone}, ${city}, ${country}`;

    const newTransporter = new User({
      name: fullName,
      email: email.toLowerCase(),
      password: password,
      role: 'transporter',
      phone: phone,
      company: companyName,
      license: `TRANS${Date.now()}`,
      address: address,
      country: country,
      city: city,
      zone: zone,
      profileImage: profileImage,
      registrationDate: new Date(),
      status: 'active'
    });

    await newTransporter.save();

    const token = generateToken(newTransporter._id);

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token: token,
      transporter: {
        id: newTransporter._id,
        name: newTransporter.name,
        email: newTransporter.email,
        phone: newTransporter.phone,
        company: newTransporter.company,
        license: newTransporter.license,
        address: newTransporter.address,
        registrationDate: newTransporter.registrationDate,
        profileImage: newTransporter.profileImage
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed. Please try again." 
    });
  }
});

// ✅ AUTH APIs
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (user) {
      res.json({
        success: true,
        token: 'dummy-jwt-token',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, company, license, address } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const newUser = new User({
      name,
      email,
      password,
      role,
      phone,
      company,
      license,
      address
    });
    
    await newUser.save();
    
    res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// ✅ PROFILE APIs
app.get('/api/profile', async (req, res) => {
  try {
    const user = await User.findOne({ role: 'transporter' });
    
    if (user) {
      res.json({
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        registrationDate: user.registrationDate,
        address: user.address,
        profileImage: user.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      });
    } else {
      const defaultTransporter = new User({
        name: 'Transport Company',
        email: 'admin@transport.com',
        password: 'admin123',
        role: 'transporter',
        phone: '+1234567890',
        company: 'City Transport Ltd',
        address: '123 Main Street, City',
        profileImage: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      });
      await defaultTransporter.save();

      res.json({
        name: defaultTransporter.name,
        email: defaultTransporter.email,
        phone: defaultTransporter.phone,
        company: defaultTransporter.company,
        registrationDate: defaultTransporter.registrationDate,
        address: defaultTransporter.address,
        profileImage: defaultTransporter.profileImage
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    const profileData = req.body;
    await User.findOneAndUpdate({ role: 'transporter' }, profileData);
    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// ✅ DASHBOARD STATS API
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const activeDrivers = await User.countDocuments({ role: 'driver', status: 'active' });
    const totalPassengers = await User.countDocuments({ role: 'passenger' });
    const completedTrips = await Trip.countDocuments({ status: 'Completed' });
    const ongoingTrips = await Trip.countDocuments({ status: 'En Route' });
    const complaints = await Complaint.countDocuments({ status: 'Open' });
    
    const driverPayments = await Payment.aggregate([
      { $match: { type: 'driver', status: 'Sent' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const pendingPayments = await Payment.aggregate([
      { $match: { type: 'driver', status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const paymentsReceived = driverPayments.length > 0 ? driverPayments[0].total : 0;
    const paymentsPending = pendingPayments.length > 0 ? pendingPayments[0].total : 0;
    
    res.json({
      activeDrivers,
      totalPassengers,
      completedTrips,
      ongoingTrips,
      complaints,
      paymentsReceived,
      paymentsPending
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// ✅ POLL APIs
app.get('/api/polls', async (req, res) => {
  try {
    const polls = await Poll.find().populate('responses');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching polls' });
  }
});

app.post('/api/polls', async (req, res) => {
  try {
    const { title, timeSlots, closesAt, closingDate } = req.body;
    const newPoll = new Poll({
      title,
      timeSlots,
      closesAt,
      closingDate: new Date(closingDate)
    });
    
    await newPoll.save();
    res.json({ success: true, poll: newPoll });
  } catch (error) {
    res.status(500).json({ message: 'Error creating poll' });
  }
});
// ✅ Get All Driver Join Requests for Transporter
app.get('/api/transporter/driver-requests', async (req, res) => {
  try {
    const driverRequests = await JoinRequest.find({ 
      type: 'driver',
      status: 'pending' 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: driverRequests,
      count: driverRequests.length
    });
  } catch (error) {
    console.error('Error fetching driver requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});
// ✅ CORRECTED Driver Approval API
app.post('/api/transporter/approve-driver-request', async (req, res) => {
  try {
    const { requestId, transporterId, notes } = req.body;
    
    console.log('🚗 Approving driver request:', requestId);
    
    // 1. JoinRequest سے ڈیٹا fetch کریں
    const joinRequest = await JoinRequest.findById(requestId);
    if (!joinRequest) {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver request not found' 
      });
    }

    console.log('📋 Found request:', joinRequest.name, joinRequest.email);

    // 2. چیک کریں اگر user پہلے سے exists ہے
    const existingUser = await User.findOne({ email: joinRequest.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists in system' 
      });
    }

    // 3. Temporary password generate کریں
    const tempPassword = joinRequest.password || `driver${Math.random().toString(36).slice(-8)}`;
    
    // 4. ✅ نیا user CREATE کریں Users collection میں
    const newDriver = new User({
      name: joinRequest.name,
      email: joinRequest.email,
      password: tempPassword,
      role: 'driver',
      phone: joinRequest.phone,
      vehicle: joinRequest.vehicleType || joinRequest.vehicle,
      vehicleNumber: joinRequest.vehicleNumber,
      capacity: joinRequest.capacity || 8,
      experience: joinRequest.experience || 'Not specified',
      license: joinRequest.licenseNumber || joinRequest.license,
      availableTimeSlots: joinRequest.availableTimeSlots || ['07:00 AM', '07:30 AM', '08:00 AM'],
      address: joinRequest.address || 'Not specified',
      status: 'approved',
      isVerified: true,
      registrationDate: new Date()
    });

    // 5. MongoDB میں SAVE کریں
    await newDriver.save();
    
    console.log('✅ NEW DRIVER ADDED TO USERS COLLECTION:', {
      id: newDriver._id,
      name: newDriver.name,
      email: newDriver.email,
      status: newDriver.status
    });

    // 6. JoinRequest کی status update کریں
    joinRequest.status = 'accepted';
    await joinRequest.save();

    // 7. Transporter approval record update کریں (اگر transporterId موجود ہو)
    if (transporterId) {
      await TransporterApproval.findOneAndUpdate(
        { driverEmail: joinRequest.email },
        { 
          status: 'approved',
          reviewedAt: new Date(),
          approvedBy: transporterId,
          reviewNotes: notes
        },
        { upsert: true }
      );
    }

    // 8. Response بھیجیں
    res.json({
      success: true,
      message: 'Driver approved and added to system successfully!',
      driver: {
        id: newDriver._id,
        name: newDriver.name,
        email: newDriver.email,
        status: newDriver.status,
        tempPassword: tempPassword
      }
    });

  } catch (error) {
    console.error('❌ Approval error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
});
  
// ✅ Get All Approved Drivers from Users Collection
app.get('/api/transporter/approved-drivers', async (req, res) => {
  try {
    const approvedDrivers = await User.find({ 
      role: 'driver', 
      status: 'accepted ' 
    }).sort({ registrationDate: -1 });

    console.log('📊 Approved drivers in Users collection:', approvedDrivers.length);

    res.json({
      success: true,
      data: approvedDrivers,
      count: approvedDrivers.length
    });
  } catch (error) {
    console.error('Error fetching approved drivers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ✅ Quick API to fix driver status
app.put('/api/fix-driver-status/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    
    const driver = await User.findByIdAndUpdate(
      driverId,
      { 
        status: 'approved',
        isVerified: true 
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver status updated to approved',
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        status: driver.status
      }
    });

  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
// ✅ QUICK FIX: Update existing driver status to 'approved'
app.put('/api/fix-driver-status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const driver = await User.findOneAndUpdate(
      { email: email, role: 'driver' },
      { 
        status: 'accepted',
        isVerified: true 
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver status updated to approved',
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        status: driver.status
      }
    });

  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
// ✅ Reject Driver Request
app.post('/api/transporter/reject-driver-request', async (req, res) => {
  try {
    const { requestId, transporterId, notes } = req.body;
    
    const joinRequest = await JoinRequest.findById(requestId);
    if (!joinRequest) {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver request not found' 
      });
    }

    // Update join request status
    joinRequest.status = 'rejected';
    await joinRequest.save();

    // Update transporter approval record
    await TransporterApproval.findOneAndUpdate(
      { driverEmail: joinRequest.email },
      { 
        status: 'rejected',
        reviewedAt: new Date(),
        approvedBy: transporterId,
        reviewNotes: notes
      }
    );

    // Send rejection email
    await sendDriverRejectionEmail(joinRequest.email, joinRequest.name, notes);

    res.json({
      success: true,
      message: 'Driver request rejected'
    });

  } catch (error) {
    console.error('Error rejecting driver request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ✅ CORRECTED Driver Login API
app.post('/api/driver/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for email:', email);

    // ✅ STEP 1: Find Driver in Users Collection with CORRECT field
    const driver = await User.findOne({ 
      email: email.toLowerCase().trim(), 
      role: 'driver'  // ✅ FIXED: Changed from 'type' to 'role'
    });
    
    if (!driver) {
      console.log('❌ Driver not found in Users collection:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    console.log('✅ Driver found:', driver.name, 'Status:', driver.status);

    // ✅ STEP 2: Check if Driver is Approved (FIXED status check)
    if (driver.status !== 'approved' && driver.status !== 'accepted') {
      console.log('❌ Driver not approved yet. Status:', driver.status);
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending approval from transporter. Please wait for approval.' 
      });
    }

    console.log('✅ Driver is approved, checking password...');

    // ✅ STEP 3: Password Check
    if (password !== driver.password) {
      console.log('❌ Password mismatch for:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    console.log('✅ Password matched, login successful');

    // ✅ STEP 4: Update Last Login
    driver.lastLogin = new Date();
    await driver.save();

    // ✅ STEP 5: Create Token
    const token = generateToken(driver._id, 'driver');

    // ✅ STEP 6: Success Response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        licenseNumber: driver.license,
        vehicleType: driver.vehicle,
        vehicleNumber: driver.vehicleNumber,
        status: driver.status,
        capacity: driver.capacity,
        experience: driver.experience,
        availableTimeSlots: driver.availableTimeSlots
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// ✅ Set Driver Availability
app.post('/api/driver/availability', driverAuthMiddleware, async (req, res) => {
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

// ✅ Get Driver Availability History
app.get('/api/driver/availability', driverAuthMiddleware, async (req, res) => {
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

// ✅ Get Driver Dashboard Stats
app.get('/api/driver/dashboard/stats', driverAuthMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;
    
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

// ✅ Get Pending Approval Requests for Transporter
app.get('/api/transporter/approval-requests', async (req, res) => {
  try {
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


  //  CORRECTED Approve Driver API
app.post('/api/transporter/approve-driver', async (req, res) => {
  try {
    const { requestId, transporterId, notes } = req.body;
    
    console.log('🚗 Approving driver request:', requestId);
    
    // 1. JoinRequest سے ڈیٹا fetch کریں
    const joinRequest = await JoinRequest.findById(requestId);
    if (!joinRequest) {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver request not found' 
      });
    }

    console.log('📋 Found request:', joinRequest.name, joinRequest.email);

    // 2. چیک کریں اگر user پہلے سے exists ہے
    const existingUser = await User.findOne({ email: joinRequest.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists in system' 
      });
    }

    // 3. Temporary password generate کریں
    const tempPassword = `driver${Math.random().toString(36).slice(-8)}`;
    
    // 4. ✅ نیا user CREATE کریں Users collection میں - STATUS = 'approved'
    const newDriver = new User({
      name: joinRequest.name,
      email: joinRequest.email,
      password: tempPassword,
      role: 'driver',
      phone: joinRequest.phone,
      vehicle: joinRequest.vehicleType || joinRequest.vehicle,
      vehicleNumber: joinRequest.vehicleNumber,
      capacity: joinRequest.capacity || 8,
      experience: joinRequest.experience || 'Not specified',
      license: joinRequest.licenseNumber || joinRequest.license,
      availableTimeSlots: joinRequest.availableTimeSlots || ['07:00 AM', '07:30 AM', '08:00 AM'],
      address: joinRequest.address || 'Not specified',
      status: 'approved', // ✅ MUST BE 'approved' NOT 'pending'
      isVerified: true,
      registrationDate: new Date()
    });

    // 5. MongoDB میں SAVE کریں
    await newDriver.save();
    
    console.log('✅ NEW DRIVER ADDED TO USERS COLLECTION:', {
      id: newDriver._id,
      name: newDriver.name,
      email: newDriver.email,
      status: newDriver.status // ✅ Should be 'approved'
    });

    // 6. JoinRequest کی status update کریں
    joinRequest.status = 'accepted';
    await joinRequest.save();

    // 7. Response بھیجیں
    res.json({
      success: true,
      message: 'Driver approved and added to system successfully!',
      driver: {
        id: newDriver._id,
        name: newDriver.name,
        email: newDriver.email,
        status: newDriver.status, // ✅ This should be 'approved'
        tempPassword: tempPassword
      }
    });

  } catch (error) {
    console.error('❌ Approval error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
});
// Helper function to send approval email
const sendDriverApprovalEmail = async (email, name) => {
  try {
    const emailData = {
      to: email,
      subject: '🎉 Your Driver Account Has Been Approved!',
      message: `
        Dear ${name},
        
        Congratulations! Your driver account has been approved by the transporter.
        
        You can now login to the Driver App and start accepting rides.
        
        Login Details:
        - Email: ${email}
        - Use the password you set during registration
        
        Thank you for joining our transport service!
        
        Best regards,
        Transport Team
      `
    };   
   await axios.post(`${MICROSERVICES.GATEWAY}/api/send-email`, emailData);
    console.log(`✅ Rejection email sent to ${email}`);
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }
};
// ✅ Check Driver Approval Status
app.get('/api/driver/status/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const driver = await User.findOne({ email, role: 'driver' });
    
    if (!driver) {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver not found' 
      });
    }

    res.json({
      success: true,
      status: driver.status,
      message: getStatusMessage(driver.status)
    });

  } catch (error) {
    console.error('Error checking driver status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Helper function for status messages
const getStatusMessage = (status) => {
  const messages = {
    'pending': 'Your account is pending approval from transporter.',
    'approved': 'Your account is approved and active.',
    'rejected': 'Your account has been rejected. Please contact support.',
    'suspended': 'Your account is temporarily suspended.'
  };
  return messages[status] || 'Unknown status';
};
// ✅ Get Driver Approval Request Details
app.get('/api/transporter/driver-request/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;

    const approvalRequest = await TransporterApproval.findById(requestId);
    
    if (!approvalRequest) {
      return res.status(404).json({ 
        success: false, 
        message: 'Approval request not found' 
      });
    }

    const driver = await User.findById(approvalRequest.driverId);

    res.json({
      success: true,
      request: approvalRequest,
      driver: driver ? {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        status: driver.status
      } : null
    });

  } catch (error) {
    console.error('Error fetching request details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});
// ✅ Get All Drivers with Status
app.get('/api/transporter/all-drivers', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('-password');
    
    // Group by status
    const pending = drivers.filter(d => d.status === 'pending');
    const approved = drivers.filter(d => d.status === 'approved');
    const rejected = drivers.filter(d => d.status === 'rejected');

    res.json({
      success: true,
      drivers: {
        pending,
        approved,
        rejected
      },
      counts: {
        total: drivers.length,
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length
      }
    });

  } catch (error) {
    console.error('Error fetching all drivers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});
// ✅ Update Driver Status (For transporter)
app.put('/api/transporter/driver/:driverId/status', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { status, notes } = req.body;

    const driver = await User.findById(driverId);
    
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver not found' 
      });
    }

    const oldStatus = driver.status;
    driver.status = status;
    await driver.save();

    // Update approval request if exists
    await TransporterApproval.findOneAndUpdate(
      { driverId },
      { 
        status: status === 'approved' ? 'approved' : 'rejected',
        reviewedAt: new Date(),
        reviewNotes: notes
      }
    );

    // Send status update notification
    await sendDriverStatusUpdateEmail(driver.email, driver.name, oldStatus, status, notes);

    res.json({
      success: true,
      message: `Driver status updated to ${status}`,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        status: driver.status
      }
    });

  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});// ✅ Check Driver Dashboard Access
app.get('/api/driver/check-access', driverAuthMiddleware, async (req, res) => {
  try {
    const driver = req.driver;

    if (driver.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Your account is not approved yet.',
        hasAccess: false,
        status: driver.status
      });
    }

    res.json({
      success: true,
      message: 'Access granted',
      hasAccess: true,
      status: driver.status,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email
      }
    });

  } catch (error) {
    console.error('Error checking driver access:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});
// ==================== ENHANCED EXISTING APIs WITH NOTIFICATIONS ====================

// ✅ Enhanced: Create Route with Notifications
app.post('/api/routes-with-notify', async (req, res) => {
  try {
    const routeData = req.body;
    const newRoute = new Route(routeData);
    await newRoute.save();
    
    // Populate the response
    const populatedRoute = await Route.findById(newRoute._id)
      .populate('assignedDriver')
      .populate('passengers');

    // Notify assigned driver if exists
    if (routeData.assignedDriver) {
      try {
        await axios.post(`${MICROSERVICES.GATEWAY}/api/notifications/send-to-driver`, {
          driverId: routeData.assignedDriver,
          title: '🆕 New Route Assigned',
          message: `You have been assigned to route: ${routeData.name}`,
          type: 'info'
        });
      } catch (notifyError) {
        console.error('Driver notification error:', notifyError.message);
      }
    }
    
    res.json({
      ...populatedRoute.toObject(),
      message: 'Route created successfully with notifications'
    });
  } catch (error) {
    console.error('Route creation error:', error);
    res.status(500).json({ message: 'Error creating route' });
  }
});

// ✅ Enhanced: Accept Join Request with Notifications
app.put('/api/join-requests/:requestId/accept-with-notify', async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await JoinRequest.findByIdAndUpdate(
      requestId,
      { status: 'accepted' },
      { new: true }
    );
    
    // Create user from accepted request
    const newUser = new User({
      name: request.name,
      email: request.email,
      phone: request.phone,
      role: request.type,
      ...(request.type === 'driver' && {
        vehicle: request.vehicle,
        capacity: request.capacity,
        experience: request.experience,
        license: request.license,
        availableTimeSlots: request.availableTimeSlots
      }),
      ...(request.type === 'passenger' && {
        pickupPoint: request.pickupPoint,
        destination: request.destination,
        preferredTimeSlot: request.preferredTimeSlot
      })
    });
    
    await newUser.save();

    // Send notification to the new user
    try {
      await axios.post(`${MICROSERVICES.GATEWAY}/api/notifications/send`, {
        to: {
          role: request.type,
          id: newUser._id
        },
        title: '✅ Registration Approved',
        message: `Your ${request.type} registration has been approved! Welcome to our transport service.`,
        type: 'success',
        category: 'system'
      });
    } catch (notifyError) {
      console.error('Approval notification error:', notifyError.message);
    }

    res.json({ 
      success: true, 
      request, 
      user: newUser,
      message: 'Request accepted and user notified'
    });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Error accepting request' });
  }
});

// ✅ Enhanced: Auto Assignment with Notifications
app.post('/api/auto-assign-with-notify', async (req, res) => {
  try {
    // Get available drivers and passengers
    const drivers = await User.find({ role: 'driver', status: 'active' });
    const passengers = await User.find({ role: 'passenger', status: 'active' });
    
    // Simple auto-assignment logic
    const assignments = drivers.map((driver, index) => {
      const assignedPassengers = passengers.slice(index * 3, (index + 1) * 3);
      return {
        driver,
        passengers: assignedPassengers,
        targetCapacity: driver.capacity || 8,
        totalDistance: (Math.random() * 20 + 5).toFixed(1),
        estimatedTime: (Math.random() * 30 + 15).toFixed(0),
        efficiencyScore: (Math.random() * 30 + 70).toFixed(0),
        utilization: Math.min(100, Math.round((assignedPassengers.length / (driver.capacity || 8)) * 100)),
        status: 'pending'
      };
    });
    
    const unassigned = passengers.slice(drivers.length * 3);

    // Send notifications for assignments
    try {
      for (const assignment of assignments) {
        // Notify driver
        await axios.post(`${MICROSERVICES.GATEWAY}/api/notifications/send-to-driver`, {
          driverId: assignment.driver._id,
          title: '🤖 AI Route Assignment',
          message: `You have been assigned ${assignment.passengers.length} passengers via AI auto-assignment.`,
          type: 'info'
        });

        // Notify passengers
        for (const passenger of assignment.passengers) {
          await axios.post(`${MICROSERVICES.GATEWAY}/api/notifications/send-to-passenger`, {
            passengerId: passenger._id,
            title: '🚗 Ride Assigned',
            message: `You have been assigned to driver ${assignment.driver.name} via AI optimization.`,
            type: 'success',
            category: 'ride'
          });
        }
      }
    } catch (notifyError) {
      console.error('Assignment notifications error:', notifyError.message);
    }
    
    res.json({
      assignments,
      unassigned,
      message: 'Auto assignment completed with notifications'
    });
  } catch (error) {
    console.error('Auto assignment error:', error);
    res.status(500).json({ message: 'Error generating auto assignments' });
  }
});

// ==================== SAMPLE DATA APIs ====================

// ✅ Add some sample data
app.post('/api/seed-data', async (req, res) => {
  try {
    const sampleDrivers = [
      {
        name: 'Ahmed Khan',
        email: 'ahmed@driver.com',
        password: 'driver123',
        role: 'driver',
        phone: '+923001234567',
        van: 'Van 1',
        capacity: 8,
        availableTimeSlots: ['07:00 AM', '07:30 AM', '08:00 AM'],
        experience: '5 years',
        vehicle: 'Toyota Hiace',
        license: 'DRV123456'
      },
      {
        name: 'Usman Ali',
        email: 'usman@driver.com',
        password: 'driver123',
        role: 'driver',
        phone: '+923001234568',
        van: 'Van 2',
        capacity: 8,
        availableTimeSlots: ['07:00 AM', '08:00 AM'],
        experience: '3 years',
        vehicle: 'Toyota Hiace',
        license: 'DRV123457'
      }
    ];
    
    const samplePassengers = [
      {
        name: 'Sara Ahmed',
        email: 'sara@passenger.com',
        password: 'pass123',
        role: 'passenger',
        phone: '+923001234569',
        pickupPoint: 'Chaklala Bus Stop',
        destination: 'Gulberg Greens',
        selectedTimeSlot: '07:00 AM',
        status: 'Confirmed'
      },
      {
        name: 'Ali Raza',
        email: 'ali@passenger.com',
        password: 'pass123',
        role: 'passenger',
        phone: '+923001234570',
        pickupPoint: 'Scheme 3',
        destination: 'Gulberg Greens',
        selectedTimeSlot: '07:30 AM',
        status: 'Confirmed'
      }
    ];
    
    await User.deleteMany({ role: { $in: ['driver', 'passenger'] } });
    await User.insertMany([...sampleDrivers, ...samplePassengers]);
    
    res.json({ success: true, message: 'Sample data created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating sample data' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Unified Transport Server is running with all APIs',
    timestamp: new Date().toISOString(),
    services: {
      gateway: MICROSERVICES.GATEWAY,
      driver: MICROSERVICES.DRIVER,
      passenger: MICROSERVICES.PASSENGER
    }
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Unified Transport Server running on http://localhost:${PORT}`);
  console.log(`📊 All APIs available at http://localhost:${PORT}/api`);
  console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);
});