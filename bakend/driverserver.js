const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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

// ==================== SCHEMAS & MODELS ====================

// Driver Schema
const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  capacity: { type: Number, default: 8 },
  experience: { type: String },
  address: { type: String },
  profileImage: { type: String },
  status: { type: String, default: 'active' },
  registrationDate: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

// Availability Schema
const availabilitySchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, default: 'available' },
  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Route Schema
const routeSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  date: { type: Date, required: true },
  vehicleNumber: { type: String },
  vehicleType: { type: String },
  pickupTime: { type: String },
  estimatedArrival: { type: String },
  totalStops: { type: Number, default: 0 },
  totalDistance: { type: String },
  estimatedDuration: { type: String },
  startPoint: { type: String },
  destination: { type: String },
  status: { type: String, default: 'scheduled' },
  assignedDate: { type: Date, default: Date.now }
});

// Route Stop Schema
const routeStopSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  stopNumber: { type: Number, required: true },
  name: { type: String, required: true },
  passengerName: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  phone: { type: String },
  coordinate: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  status: { type: String, default: 'pending' },
  pickupTime: { type: String },
  dropoffTime: { type: String },
  actualArrival: { type: String },
  notes: { type: String }
});

// Trip Schema
const tripSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  tripId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  route: { type: String, required: true },
  startPoint: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, default: 'upcoming' },
  startTime: { type: String },
  endTime: { type: String },
  duration: { type: String },
  distance: { type: String },
  fare: { type: Number, default: 0 },
  passengers: { type: Number, default: 0 },
  rating: { type: Number, min: 1, max: 5 },
  vehicle: { type: String },
  cancellationReason: { type: String }
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  transferDate: { type: Date },
  trips: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  transactionId: { type: String },
  paymentMethod: { type: String, default: 'Easypaisa' },
  createdAt: { type: Date, default: Date.now }
});

// Support Ticket Schema
const supportTicketSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  category: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending' },
  priority: { type: String, default: 'medium' },
  attachment: { type: String },
  createdDate: { type: Date, default: Date.now },
  resolvedDate: { type: Date },
  replies: [{
    repliedBy: { type: String, default: 'Support Team' },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    attachment: { type: String }
  }]
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false },
  relatedEntity: { type: String },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now }
});

// Live Tracking Schema
const liveTrackingSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  currentLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  currentStop: { type: Number, default: 0 },
  speed: { type: Number, default: 0 },
  heading: { type: Number },
  timestamp: { type: Date, default: Date.now },
  batteryLevel: { type: Number },
  networkStrength: { type: String }
});

// Models
const Driver = mongoose.model('Driver', driverSchema);
const Availability = mongoose.model('Availability', availabilitySchema);
const Route = mongoose.model('Route', routeSchema);
const RouteStop = mongoose.model('RouteStop', routeStopSchema);
const Trip = mongoose.model('Trip', tripSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const LiveTracking = mongoose.model('LiveTracking', liveTrackingSchema);

// ==================== MIDDLEWARE ====================

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.driver = await Driver.findById(decoded.driverId).select('-password');
    
    if (!req.driver) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid' 
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

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// ==================== AUTHENTICATION APIs ====================

// Driver Registration
app.post('/api/drivers/register', async (req, res) => {
  try {
    const { name, email, password, phone, licenseNumber, vehicleType, vehicleNumber, capacity, experience, address } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { licenseNumber }, { vehicleNumber }] 
    });

    if (existingDriver) {
      return res.status(400).json({ 
        success: false, 
        message: 'Driver with this email, license or vehicle already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new driver
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
      address
    });

    await driver.save();

    // Create token
    const token = jwt.sign(
      { driverId: driver._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Create welcome notification
    const welcomeNotification = new Notification({
      driverId: driver._id,
      title: 'Welcome to Driver Dashboard',
      message: 'Your account has been created successfully. Please complete your profile and set your availability.',
      type: 'success'
    });
    await welcomeNotification.save();

    res.status(201).json({
      success: true,
      message: 'Driver registered successfully',
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        licenseNumber: driver.licenseNumber,
        vehicleType: driver.vehicleType,
        vehicleNumber: driver.vehicleNumber,
        capacity: driver.capacity,
        experience: driver.experience,
        address: driver.address,
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

// Driver Login
app.post('/api/drivers/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find driver
    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    driver.lastLogin = new Date();
    await driver.save();

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
        vehicleNumber: driver.vehicleNumber,
        capacity: driver.capacity,
        experience: driver.experience,
        address: driver.address,
        status: driver.status,
        profileImage: driver.profileImage
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

// Get Driver Profile
app.get('/api/drivers/profile', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      driver: req.driver
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Update Driver Profile
app.put('/api/drivers/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, experience, address } = req.body;
    
    const driver = await Driver.findByIdAndUpdate(
      req.driver._id,
      { 
        name, 
        phone, 
        experience, 
        address 
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      driver
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during profile update' 
    });
  }
});

// Update Profile Picture
app.put('/api/drivers/profile-picture', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const driver = await Driver.findByIdAndUpdate(
      req.driver._id,
      { profileImage: imageUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      driver
    });
  } catch (error) {
    console.error('Profile picture update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during profile picture update' 
    });
  }
});

// ==================== DASHBOARD APIs ====================

// Get Dashboard Stats
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;

    // Get completed trips count
    const completedTrips = await Trip.countDocuments({ 
      driverId, 
      status: 'completed' 
    });

    // Get active trips count
    const activeTrips = await Trip.countDocuments({ 
      driverId, 
      status: 'in-progress' 
    });

    // Get pending trips count
    const pendingTrips = await Trip.countDocuments({ 
      driverId, 
      status: 'upcoming' 
    });

    // Get monthly earnings
    const currentMonth = moment().format('MMMM YYYY');
    const monthlyPayment = await Payment.findOne({ 
      driverId, 
      month: currentMonth 
    });

    const monthlyEarnings = monthlyPayment ? monthlyPayment.amount : 0;

    // Get today's route
    const today = moment().startOf('day');
    const todaysRoute = await Route.findOne({ 
      driverId, 
      date: { 
        $gte: today.toDate(), 
        $lt: moment(today).endOf('day').toDate() 
      } 
    });

    res.json({
      success: true,
      stats: {
        completedTrips,
        activeTrips,
        pendingTrips,
        monthlyEarnings
      },
      todaysRoute: todaysRoute || null
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard stats' 
    });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Driver Dashboard Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});