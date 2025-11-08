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
  status: { type: String, default: 'active' }, // active, inactive, suspended
  registrationDate: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

// Availability Schema
const availabilitySchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, default: 'available' }, // available, unavailable
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
  status: { type: String, default: 'scheduled' }, // scheduled, in-progress, completed, cancelled
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
  status: { type: String, default: 'pending' }, // pending, picked-up, completed
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
  status: { type: String, default: 'upcoming' }, // upcoming, in-progress, completed, cancelled
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
  month: { type: String, required: true }, // Format: "October 2025"
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, transferred, failed
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
  category: { type: String, required: true }, // Payment Issue, Route Issue, Technical Issue, Other
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending' }, // pending, in-progress, resolved
  priority: { type: String, default: 'medium' }, // low, medium, high, urgent
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
  type: { type: String, default: 'info' }, // info, success, warning, error
  read: { type: Boolean, default: false },
  relatedEntity: { type: String }, // route, payment, support, etc.
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
  heading: { type: Number }, // Direction in degrees
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
    fileSize: 5 * 1024 * 1024 // 5MB limit
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

// ==================== AVAILABILITY APIs ====================

// Set Availability
app.post('/api/availability', authMiddleware, async (req, res) => {
  try {
    const { date, startTime, endTime, status } = req.body;
    const driverId = req.driver._id;

    // Check if availability already exists for this date
    const existingAvailability = await Availability.findOne({ 
      driverId, 
      date: new Date(date) 
    });

    if (existingAvailability) {
      // Update existing availability
      existingAvailability.startTime = startTime;
      existingAvailability.endTime = endTime;
      existingAvailability.status = status;
      existingAvailability.confirmed = true;
      
      await existingAvailability.save();
    } else {
      // Create new availability
      const availability = new Availability({
        driverId,
        date: new Date(date),
        startTime,
        endTime,
        status,
        confirmed: true
      });
      
      await availability.save();
    }

    // Create notification
    const notification = new Notification({
      driverId,
      title: 'Availability Confirmed',
      message: `Your availability for ${moment(date).format('DD MMM YYYY')} (${startTime} - ${endTime}) has been confirmed.`,
      type: 'success'
    });
    await notification.save();

    res.json({
      success: true,
      message: 'Availability set successfully'
    });

  } catch (error) {
    console.error('Availability set error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error setting availability' 
    });
  }
});

// Get Availability
app.get('/api/availability', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;
    const { date } = req.query;

    let query = { driverId };
    if (date) {
      query.date = new Date(date);
    }

    const availability = await Availability.find(query)
      .sort({ date: -1 })
      .limit(30); // Last 30 days

    res.json({
      success: true,
      availability
    });

  } catch (error) {
    console.error('Availability fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching availability' 
    });
  }
});

// ==================== ROUTES APIs ====================

// Get Assigned Routes
app.get('/api/routes', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;
    const { status, date } = req.query;

    let query = { driverId };
    if (status) query.status = status;
    if (date) query.date = new Date(date);

    const routes = await Route.find(query)
      .sort({ date: -1 })
      .populate('driverId', 'name phone vehicleNumber');

    // Get stops for each route
    const routesWithStops = await Promise.all(
      routes.map(async (route) => {
        const stops = await RouteStop.find({ routeId: route._id }).sort({ stopNumber: 1 });
        return {
          ...route.toObject(),
          stops
        };
      })
    );

    res.json({
      success: true,
      routes: routesWithStops
    });

  } catch (error) {
    console.error('Routes fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching routes' 
    });
  }
});

// Get Route Details
app.get('/api/routes/:routeId', authMiddleware, async (req, res) => {
  try {
    const { routeId } = req.params;
    const driverId = req.driver._id;

    const route = await Route.findOne({ _id: routeId, driverId })
      .populate('driverId', 'name phone vehicleNumber');

    if (!route) {
      return res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
      });
    }

    const stops = await RouteStop.find({ routeId }).sort({ stopNumber: 1 });

    res.json({
      success: true,
      route: {
        ...route.toObject(),
        stops
      }
    });

  } catch (error) {
    console.error('Route details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching route details' 
    });
  }
});

// Start Route
app.post('/api/routes/:routeId/start', authMiddleware, async (req, res) => {
  try {
    const { routeId } = req.params;
    const driverId = req.driver._id;

    const route = await Route.findOne({ _id: routeId, driverId });
    if (!route) {
      return res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
      });
    }

    // Update route status
    route.status = 'in-progress';
    await route.save();

    // Create live tracking entry
    const firstStop = await RouteStop.findOne({ routeId }).sort({ stopNumber: 1 });
    if (firstStop) {
      const liveTracking = new LiveTracking({
        driverId,
        routeId,
        currentLocation: firstStop.coordinate,
        currentStop: 0,
        speed: 0
      });
      await liveTracking.save();
    }

    // Create notification
    const notification = new Notification({
      driverId,
      title: 'Route Started',
      message: `You have started the route: ${route.routeName}. GPS tracking is now active.`,
      type: 'success',
      relatedEntity: 'route',
      relatedId: routeId
    });
    await notification.save();

    // Emit socket event for real-time updates
    io.emit('routeStarted', { routeId, driverId, startTime: new Date() });

    res.json({
      success: true,
      message: 'Route started successfully'
    });

  } catch (error) {
    console.error('Start route error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error starting route' 
    });
  }
});

// End Route
app.post('/api/routes/:routeId/end', authMiddleware, async (req, res) => {
  try {
    const { routeId } = req.params;
    const driverId = req.driver._id;

    const route = await Route.findOne({ _id: routeId, driverId });
    if (!route) {
      return res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
      });
    }

    // Check if all stops are completed
    const pendingStops = await RouteStop.countDocuments({ 
      routeId, 
      status: { $in: ['pending', 'picked-up'] } 
    });

    if (pendingStops > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot end route with pending stops' 
      });
    }

    // Update route status
    route.status = 'completed';
    await route.save();

    // Remove live tracking
    await LiveTracking.deleteOne({ routeId });

    // Create trip record
    const trip = new Trip({
      driverId,
      routeId,
      tripId: `TRIP${Date.now()}`,
      date: route.date,
      route: route.routeName,
      startPoint: route.startPoint,
      destination: route.destination,
      status: 'completed',
      startTime: route.pickupTime,
      endTime: moment().format('HH:mm A'),
      duration: 'Calculating...',
      distance: route.totalDistance,
      fare: 0, // Calculate based on stops
      passengers: route.totalStops,
      vehicle: `${route.vehicleType} - ${route.vehicleNumber}`
    });
    await trip.save();

    // Create notification
    const notification = new Notification({
      driverId,
      title: 'Route Completed',
      message: `You have successfully completed the route: ${route.routeName}.`,
      type: 'success',
      relatedEntity: 'route',
      relatedId: routeId
    });
    await notification.save();

    // Emit socket event
    io.emit('routeEnded', { routeId, driverId, endTime: new Date() });

    res.json({
      success: true,
      message: 'Route ended successfully'
    });

  } catch (error) {
    console.error('End route error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error ending route' 
    });
  }
});

// Update Stop Status
app.put('/api/routes/:routeId/stops/:stopId/status', authMiddleware, async (req, res) => {
  try {
    const { routeId, stopId } = req.params;
    const { status } = req.body;
    const driverId = req.driver._id;

    // Verify route belongs to driver
    const route = await Route.findOne({ _id: routeId, driverId });
    if (!route) {
      return res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
      });
    }

    const stop = await RouteStop.findOne({ _id: stopId, routeId });
    if (!stop) {
      return res.status(404).json({ 
        success: false, 
        message: 'Stop not found' 
      });
    }

    const currentTime = moment().format('HH:mm A');

    // Update stop status and timestamps
    stop.status = status;
    if (status === 'picked-up') {
      stop.pickupTime = currentTime;
      stop.actualArrival = currentTime;
    } else if (status === 'completed') {
      stop.dropoffTime = currentTime;
    }

    await stop.save();

    // Update live tracking current stop
    if (status === 'completed') {
      await LiveTracking.findOneAndUpdate(
        { routeId },
        { $inc: { currentStop: 1 } }
      );
    }

    // Create notification for status change
    const action = status === 'picked-up' ? 'picked up' : 'dropped off';
    const notification = new Notification({
      driverId,
      title: `Passenger ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      message: `${stop.passengerName} has been ${action} at ${stop.name}.`,
      type: 'success',
      relatedEntity: 'route',
      relatedId: routeId
    });
    await notification.save();

    res.json({
      success: true,
      message: `Stop status updated to ${status}`,
      stop
    });

  } catch (error) {
    console.error('Update stop status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating stop status' 
    });
  }
});

// ==================== TRIP HISTORY APIs ====================

// Get Trip History
app.get('/api/trips', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;
    const { status, search, dateFilter } = req.query;

    let query = { driverId };
    
    // Status filter
    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    // Search filter
    if (search) {
      query.$or = [
        { route: { $regex: search, $options: 'i' } },
        { startPoint: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { tripId: { $regex: search, $options: 'i' } }
      ];
    }

    // Date filter
    if (dateFilter && dateFilter !== 'All') {
      const date = moment(dateFilter, 'YYYY-MM');
      query.date = {
        $gte: date.startOf('month').toDate(),
        $lte: date.endOf('month').toDate()
      };
    }

    const trips = await Trip.find(query)
      .sort({ date: -1 })
      .populate('routeId', 'routeName totalStops');

    res.json({
      success: true,
      trips
    });

  } catch (error) {
    console.error('Trips fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching trips' 
    });
  }
});

// Get Trip Details
app.get('/api/trips/:tripId', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;
    const driverId = req.driver._id;

    const trip = await Trip.findOne({ _id: tripId, driverId })
      .populate('routeId')
      .populate('driverId', 'name phone vehicleNumber');

    if (!trip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trip not found' 
      });
    }

    // Get route stops if available
    let stops = [];
    if (trip.routeId) {
      stops = await RouteStop.find({ routeId: trip.routeId._id }).sort({ stopNumber: 1 });
    }

    res.json({
      success: true,
      trip: {
        ...trip.toObject(),
        stops
      }
    });

  } catch (error) {
    console.error('Trip details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching trip details' 
    });
  }
});

// ==================== PAYMENT APIs ====================

// Get Payment History
app.get('/api/payments', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;

    const payments = await Payment.find({ driverId })
      .sort({ createdAt: -1 });

    // Calculate total earned
    const totalEarned = payments.reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      success: true,
      payments,
      totalEarned
    });

  } catch (error) {
    console.error('Payments fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payments' 
    });
  }
});

// Get Payment Details
app.get('/api/payments/:paymentId', authMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const driverId = req.driver._id;

    const payment = await Payment.findOne({ _id: paymentId, driverId });

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Payment details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payment details' 
    });
  }
});

// ==================== SUPPORT TICKET APIs ====================

// Create Support Ticket
app.post('/api/support/tickets', authMiddleware, async (req, res) => {
  try {
    const { category, subject, description, priority } = req.body;
    const driverId = req.driver._id;

    const ticket = new SupportTicket({
      driverId,
      category,
      subject,
      description,
      priority: priority || 'medium'
    });

    await ticket.save();

    // Create notification
    const notification = new Notification({
      driverId,
      title: 'Support Ticket Created',
      message: `Your support request "${subject}" has been submitted successfully. Ticket ID: ${ticket._id}`,
      type: 'info',
      relatedEntity: 'support',
      relatedId: ticket._id
    });
    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      ticket
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating support ticket' 
    });
  }
});

// Get Support Tickets
app.get('/api/support/tickets', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;
    const { status } = req.query;

    let query = { driverId };
    if (status) query.status = status;

    const tickets = await SupportTicket.find(query)
      .sort({ createdDate: -1 });

    res.json({
      success: true,
      tickets
    });

  } catch (error) {
    console.error('Tickets fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching support tickets' 
    });
  }
});

// Get Ticket Details
app.get('/api/support/tickets/:ticketId', authMiddleware, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const driverId = req.driver._id;

    const ticket = await SupportTicket.findOne({ _id: ticketId, driverId });

    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket not found' 
      });
    }

    res.json({
      success: true,
      ticket
    });

  } catch (error) {
    console.error('Ticket details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching ticket details' 
    });
  }
});

// Add Reply to Ticket
app.post('/api/support/tickets/:ticketId/reply', authMiddleware, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;
    const driverId = req.driver._id;

    const ticket = await SupportTicket.findOne({ _id: ticketId, driverId });
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket not found' 
      });
    }

    ticket.replies.push({
      repliedBy: req.driver.name,
      message
    });

    await ticket.save();

    res.json({
      success: true,
      message: 'Reply added successfully',
      ticket
    });

  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding reply' 
    });
  }
});

// ==================== NOTIFICATION APIs ====================

// Get Notifications
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;
    const { unreadOnly } = req.query;

    let query = { driverId };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ timestamp: -1 })
      .limit(50); // Last 50 notifications

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({ 
      driverId, 
      read: false 
    });

    res.json({
      success: true,
      notifications,
      unreadCount
    });

  } catch (error) {
    console.error('Notifications fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching notifications' 
    });
  }
});

// Mark Notification as Read
app.put('/api/notifications/:notificationId/read', authMiddleware, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const driverId = req.driver._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, driverId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error marking notification as read' 
    });
  }
});

// Mark All Notifications as Read
app.put('/api/notifications/read-all', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;

    await Notification.updateMany(
      { driverId, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error marking all notifications as read' 
    });
  }
});

// ==================== LIVE TRACKING APIs ====================

// Update Live Location
app.post('/api/live-tracking/location', authMiddleware, async (req, res) => {
  try {
    const { routeId, latitude, longitude, speed, heading, batteryLevel, networkStrength } = req.body;
    const driverId = req.driver._id;

    // Verify route belongs to driver and is active
    const route = await Route.findOne({ _id: routeId, driverId, status: 'in-progress' });
    if (!route) {
      return res.status(404).json({ 
        success: false, 
        message: 'Active route not found' 
      });
    }

    // Update or create live tracking
    await LiveTracking.findOneAndUpdate(
      { routeId },
      {
        driverId,
        routeId,
        currentLocation: { latitude, longitude },
        speed: speed || 0,
        heading: heading || 0,
        batteryLevel,
        networkStrength,
        timestamp: new Date()
      },
      { upsert: true, new: true }
    );

    // Emit socket event for real-time location update
    io.emit('locationUpdate', {
      driverId: driverId.toString(),
      routeId: routeId.toString(),
      location: { latitude, longitude },
      speed,
      heading,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Location updated successfully'
    });

  } catch (error) {
    console.error('Live location update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating live location' 
    });
  }
});

// Get Live Tracking Data
app.get('/api/live-tracking/:routeId', authMiddleware, async (req, res) => {
  try {
    const { routeId } = req.params;
    const driverId = req.driver._id;

    const tracking = await LiveTracking.findOne({ routeId, driverId });

    if (!tracking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Live tracking data not found' 
      });
    }

    res.json({
      success: true,
      tracking
    });

  } catch (error) {
    console.error('Live tracking fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching live tracking data' 
    });
  }
});

// ==================== SOCKET.IO HANDLERS ====================

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join driver room for real-time updates
  socket.on('joinDriver', (driverId) => {
    socket.join(`driver_${driverId}`);
    console.log(`Driver ${driverId} joined room`);
  });

  // Join route room for route-specific updates
  socket.on('joinRoute', (routeId) => {
    socket.join(`route_${routeId}`);
    console.log(`Client joined route room: ${routeId}`);
  });

  // Handle location updates from driver app
  socket.on('driverLocationUpdate', (data) => {
    const { driverId, routeId, location } = data;
    
    // Broadcast to all clients watching this route
    socket.to(`route_${routeId}`).emit('locationUpdate', {
      driverId,
      location,
      timestamp: new Date()
    });
  });

  // Handle route status updates
  socket.on('routeStatusUpdate', (data) => {
    const { routeId, status } = data;
    
    // Broadcast to route room
    socket.to(`route_${routeId}`).emit('routeStatusChanged', {
      routeId,
      status,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ==================== SEED DATA API ====================

// Seed sample data for testing
app.post('/api/seed-data', authMiddleware, async (req, res) => {
  try {
    const driverId = req.driver._id;

    // Create sample route
    const sampleRoute = new Route({
      driverId,
      routeName: "Morning Pickup Route",
      date: new Date(),
      vehicleNumber: "LEA-4567",
      vehicleType: "Coaster",
      pickupTime: "7:30 AM",
      estimatedArrival: "9:00 AM",
      totalStops: 5,
      totalDistance: "25 km",
      estimatedDuration: "1h 30m",
      startPoint: "DHA Phase 5",
      destination: "Karachi Grammar School",
      status: "scheduled"
    });
    await sampleRoute.save();

    // Create sample stops
    const sampleStops = [
      {
        routeId: sampleRoute._id,
        stopNumber: 1,
        name: "Stop 1 - DHA Phase 5",
        passengerName: "Ali Khan",
        scheduledTime: "7:30 AM",
        phone: "+92 300 1234567",
        coordinate: { latitude: 24.8125, longitude: 67.0611 },
        status: "pending"
      },
      {
        routeId: sampleRoute._id,
        stopNumber: 2,
        name: "Stop 2 - SMCHS",
        passengerName: "Sara Malik",
        scheduledTime: "7:45 AM",
        phone: "+92 301 2345678",
        coordinate: { latitude: 24.8235, longitude: 67.0725 },
        status: "pending"
      },
      {
        routeId: sampleRoute._id,
        stopNumber: 3,
        name: "Stop 3 - Saddar",
        passengerName: "Bilal Ahmed",
        scheduledTime: "8:00 AM",
        phone: "+92 302 3456789",
        coordinate: { latitude: 24.8520, longitude: 67.0180 },
        status: "pending"
      }
    ];
    await RouteStop.insertMany(sampleStops);

    // Create sample payments
    const samplePayments = [
      {
        driverId,
        month: "October 2025",
        amount: 30000,
        status: "transferred",
        transferDate: new Date('2025-10-15'),
        trips: 142,
        totalEarnings: 35000,
        commission: 5000,
        transactionId: "EP2025101512345",
        paymentMethod: "Easypaisa"
      },
      {
        driverId,
        month: "September 2025",
        amount: 28500,
        status: "transferred",
        transferDate: new Date('2025-09-15'),
        trips: 138,
        totalEarnings: 33500,
        commission: 5000,
        transactionId: "EP2025091512234",
        paymentMethod: "Easypaisa"
      }
    ];
    await Payment.insertMany(samplePayments);

    // Create sample notifications
    const sampleNotifications = [
      {
        driverId,
        title: "Day Off Granted",
        message: "The transporter has granted you a day off for tomorrow. Enjoy your rest!",
        type: "info",
        read: false
      },
      {
        driverId,
        title: "Route Assigned for Tomorrow",
        message: "You have been assigned Morning Pickup Route for tomorrow. Please check route details.",
        type: "success",
        read: false
      }
    ];
    await Notification.insertMany(sampleNotifications);

    res.json({
      success: true,
      message: "Sample data seeded successfully"
    });

  } catch (error) {
    console.error('Seed data error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error seeding sample data' 
    });
  }
});

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(error.errors).map(e => e.message)
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
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