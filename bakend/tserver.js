const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const http = require('http');
const socketIo = require('socket.io');

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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transport_system';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// ==================== SCHEMAS & MODELS ====================

// User Schema (for all roles)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['transporter', 'driver', 'passenger'] },
  phone: { type: String },
  status: { type: String, default: 'pending' }, // pending, active, inactive
  profileImage: { type: String },
  registrationDate: { type: Date, default: Date.now },
  
  // Transporter specific fields
  company: { type: String },
  license: { type: String },
  address: { type: String },
  
  // Driver specific fields
  vehicleType: { type: String },
  vehicleNumber: { type: String },
  capacity: { type: Number, default: 8 },
  experience: { type: String },
  licenseNumber: { type: String },
  
  // Passenger specific fields
  pickupPoint: { type: String },
  destination: { type: String },
  selectedTimeSlot: { type: String }
});

// Poll Schema
const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  timeSlots: [{ type: String }],
  closesAt: { type: String },
  closingDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Route Schema
const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stops: [{ type: String }],
  destination: { type: String, default: 'Gulberg Greens' },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timeSlot: { type: String },
  distance: { type: String },
  duration: { type: String },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// Trip Schema (Live Tracking)
const tripSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  status: { type: String, default: 'scheduled' }, // scheduled, in-progress, completed
  currentStop: { type: String },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  speed: { type: Number, default: 0 },
  eta: { type: String },
  completedStops: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
  type: { type: String, required: true }, // driver, passenger
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  mode: { type: String, default: 'Cash' },
  status: { type: String, default: 'pending' }, // pending, sent, paid
  month: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  byName: { type: String, required: true },
  status: { type: String, default: 'Open' }, // Open, Resolved
  replies: [{
    by: { type: String, default: 'Admin' },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // info, success, warning, error
  read: { type: Boolean, default: false },
  relatedEntity: { type: String }, // route, payment, support, etc.
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Poll = mongoose.model('Poll', pollSchema);
const Route = mongoose.model('Route', routeSchema);
const Trip = mongoose.model('Trip', tripSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);
const Notification = mongoose.model('Notification', notificationSchema);

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
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
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

// Role-based Middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
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

// Register User (All roles)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, company, license, address, vehicleType, vehicleNumber, capacity, experience, licenseNumber, pickupPoint, destination } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      status: 'pending', // Needs transporter approval
      ...(role === 'transporter' && { company, license, address }),
      ...(role === 'driver' && { vehicleType, vehicleNumber, capacity, experience, licenseNumber }),
      ...(role === 'passenger' && { pickupPoint, destination })
    });

    await user.save();

    // Create notification for transporter
    if (role === 'driver' || role === 'passenger') {
      const transporter = await User.findOne({ role: 'transporter' });
      if (transporter) {
        const notification = new Notification({
          userId: transporter._id,
          title: `New ${role} Registration`,
          message: `${name} has registered as a ${role} and is waiting for approval.`,
          type: 'info',
          relatedEntity: 'user',
          relatedId: user._id
        });
        await notification.save();
        
        // Emit socket event for real-time notification
        io.emit('newRegistration', { 
          userId: transporter._id.toString(),
          message: `New ${role} registration: ${name}` 
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Waiting for transporter approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
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

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if user is approved
    if (user.status !== 'active' && user.role !== 'transporter') {
      return res.status(400).json({ 
        success: false, 
        message: 'Your account is pending approval from transporter' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        profileImage: user.profileImage,
        ...(user.role === 'transporter' && { 
          company: user.company, 
          license: user.license, 
          address: user.address 
        }),
        ...(user.role === 'driver' && { 
          vehicleType: user.vehicleType,
          vehicleNumber: user.vehicleNumber,
          capacity: user.capacity,
          experience: user.experience,
          licenseNumber: user.licenseNumber
        }),
        ...(user.role === 'passenger' && { 
          pickupPoint: user.pickupPoint,
          destination: user.destination,
          selectedTimeSlot: user.selectedTimeSlot
        })
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

// Get User Profile
app.get('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Update User Profile
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.password; // Don't update password directly
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during profile update' 
    });
  }
});

// ==================== TRANSPORTER SPECIFIC APIs ====================

// Get Pending Approvals
app.get('/api/transporter/pending-approvals', authMiddleware, requireRole(['transporter']), async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      status: 'pending',
      role: { $in: ['driver', 'passenger'] }
    }).select('-password');

    res.json({
      success: true,
      pendingUsers
    });
  } catch (error) {
    console.error('Pending approvals error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching pending approvals' 
    });
  }
});

// Approve/Reject User
app.put('/api/transporter/users/:userId/status', authMiddleware, requireRole(['transporter']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // 'active' or 'rejected'

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Create notification for the user
    const notification = new Notification({
      userId: user._id,
      title: `Account ${status === 'active' ? 'Approved' : 'Rejected'}`,
      message: status === 'active' 
        ? 'Your account has been approved. You can now login and use the app.'
        : 'Your account registration has been rejected. Please contact support for more information.',
      type: status === 'active' ? 'success' : 'error'
    });
    await notification.save();

    // Emit socket event
    io.emit('userStatusUpdate', { 
      userId: user._id.toString(),
      status: status,
      message: `Your account has been ${status}`
    });

    res.json({
      success: true,
      message: `User ${status} successfully`,
      user
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating user status' 
    });
  }
});

// Get Dashboard Stats
app.get('/api/transporter/dashboard/stats', authMiddleware, requireRole(['transporter']), async (req, res) => {
  try {
    const activeDrivers = await User.countDocuments({ role: 'driver', status: 'active' });
    const totalPassengers = await User.countDocuments({ role: 'passenger', status: 'active' });
    const completedTrips = await Trip.countDocuments({ status: 'completed' });
    const ongoingTrips = await Trip.countDocuments({ status: 'in-progress' });
    const complaints = await Complaint.countDocuments({ status: 'Open' });
    
    // Calculate payments
    const driverPayments = await Payment.aggregate([
      { $match: { type: 'driver', status: 'sent' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const pendingPayments = await Payment.aggregate([
      { $match: { type: 'driver', status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const paymentsReceived = driverPayments.length > 0 ? driverPayments[0].total : 0;
    const paymentsPending = pendingPayments.length > 0 ? pendingPayments[0].total : 0;
    
    res.json({
      success: true,
      stats: {
        activeDrivers,
        totalPassengers,
        completedTrips,
        ongoingTrips,
        complaints,
        paymentsReceived,
        paymentsPending
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard stats' 
    });
  }
});

// ==================== POLL APIs ====================

// Create Poll
app.post('/api/polls', authMiddleware, requireRole(['transporter']), async (req, res) => {
  try {
    const { title, timeSlots, closesAt, closingDate } = req.body;

    const poll = new Poll({
      title,
      timeSlots,
      closesAt,
      closingDate: new Date(closingDate)
    });

    await poll.save();

    // Create notifications for all active passengers
    const passengers = await User.find({ role: 'passenger', status: 'active' });
    
    const notifications = passengers.map(passenger => ({
      userId: passenger._id,
      title: 'New Travel Poll Available',
      message: `A new poll "${title}" has been created. Please respond with your preferred time slots.`,
      type: 'info',
      relatedEntity: 'poll',
      relatedId: poll._id
    }));

    await Notification.insertMany(notifications);

    // Emit socket event for real-time updates
    io.emit('newPoll', { 
      message: `New poll created: ${title}`,
      pollId: poll._id.toString()
    });

    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      poll
    });
  } catch (error) {
    console.error('Create poll error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating poll' 
    });
  }
});

// Get Polls
app.get('/api/polls', authMiddleware, async (req, res) => {
  try {
    const polls = await Poll.find().populate('responses');
    res.json({
      success: true,
      polls
    });
  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching polls' 
    });
  }
});

// Respond to Poll (Passenger)
app.post('/api/polls/:pollId/respond', authMiddleware, requireRole(['passenger']), async (req, res) => {
  try {
    const { pollId } = req.params;
    const { selectedTimeSlot } = req.body;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ 
        success: false, 
        message: 'Poll not found' 
      });
    }

    // Update passenger's selected time slot
    await User.findByIdAndUpdate(req.user._id, {
      selectedTimeSlot
    });

    // Add to poll responses if not already responded
    if (!poll.responses.includes(req.user._id)) {
      poll.responses.push(req.user._id);
      await poll.save();
    }

    res.json({
      success: true,
      message: 'Poll response submitted successfully'
    });
  } catch (error) {
    console.error('Poll response error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting poll response' 
    });
  }
});

// ==================== ROUTE APIs ====================

// Create Route
app.post('/api/routes', authMiddleware, requireRole(['transporter']), async (req, res) => {
  try {
    const { name, stops, destination, assignedDriver, timeSlot, distance, duration, passengers } = req.body;

    const route = new Route({
      name,
      stops,
      destination: destination || 'Gulberg Greens',
      assignedDriver,
      timeSlot,
      distance,
      duration,
      passengers
    });

    await route.save();

    // Create trip for this route
    const trip = new Trip({
      driverId: assignedDriver,
      routeId: route._id,
      status: 'scheduled',
      currentStop: stops[0] || 'Starting Point',
      currentLocation: { latitude: 33.6844, longitude: 73.0479 }, // Default location
      passengers: passengers || [],
      speed: 0,
      eta: 'Calculating...'
    });
    await trip.save();

    // Create notification for driver
    if (assignedDriver) {
      const notification = new Notification({
        userId: assignedDriver,
        title: 'New Route Assigned',
        message: `You have been assigned to route: ${name}`,
        type: 'info',
        relatedEntity: 'route',
        relatedId: route._id
      });
      await notification.save();

      io.emit('newRoute', { 
        userId: assignedDriver.toString(),
        message: `New route assigned: ${name}` 
      });
    }

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      route: await route.populate(['assignedDriver', 'passengers'])
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating route' 
    });
  }
});

// Get Routes
app.get('/api/routes', authMiddleware, async (req, res) => {
  try {
    const routes = await Route.find()
      .populate('assignedDriver')
      .populate('passengers');
    
    res.json({
      success: true,
      routes
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching routes' 
    });
  }
});

// ==================== TRIP & LIVE TRACKING APIs ====================

// Get Trips
app.get('/api/trips', authMiddleware, async (req, res) => {
  try {
    let trips;
    
    if (req.user.role === 'driver') {
      trips = await Trip.find({ driverId: req.user._id })
        .populate('routeId')
        .populate('passengers');
    } else {
      trips = await Trip.find()
        .populate('routeId')
        .populate('driverId')
        .populate('passengers');
    }

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

// Update Trip Location (Live Tracking)
app.put('/api/trips/:tripId/location', authMiddleware, requireRole(['driver']), async (req, res) => {
  try {
    const { tripId } = req.params;
    const { latitude, longitude, currentStop, speed, eta } = req.body;

    const trip = await Trip.findByIdAndUpdate(
      tripId,
      {
        currentLocation: { latitude, longitude },
        ...(currentStop && { currentStop }),
        ...(speed && { speed }),
        ...(eta && { eta })
      },
      { new: true }
    ).populate('routeId').populate('passengers');

    if (!trip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trip not found' 
      });
    }

    // Emit real-time location update
    io.emit('locationUpdate', {
      tripId: trip._id.toString(),
      location: { latitude, longitude },
      currentStop,
      speed,
      eta,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Location updated successfully',
      trip
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating location' 
    });
  }
});

// Start Trip
app.post('/api/trips/:tripId/start', authMiddleware, requireRole(['driver']), async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findByIdAndUpdate(
      tripId,
      { status: 'in-progress' },
      { new: true }
    ).populate('routeId').populate('passengers');

    if (!trip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trip not found' 
      });
    }

    // Notify passengers
    const notifications = trip.passengers.map(passenger => ({
      userId: passenger._id,
      title: 'Trip Started',
      message: `Your trip has started. Driver is on the way.`,
      type: 'info',
      relatedEntity: 'trip',
      relatedId: trip._id
    }));

    await Notification.insertMany(notifications);

    io.emit('tripStarted', { 
      tripId: trip._id.toString(),
      message: 'Trip has started' 
    });

    res.json({
      success: true,
      message: 'Trip started successfully',
      trip
    });
  } catch (error) {
    console.error('Start trip error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error starting trip' 
    });
  }
});

// Complete Trip
app.post('/api/trips/:tripId/complete', authMiddleware, requireRole(['driver']), async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findByIdAndUpdate(
      tripId,
      { status: 'completed' },
      { new: true }
    ).populate('routeId').populate('passengers');

    if (!trip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trip not found' 
      });
    }

    // Notify passengers
    const notifications = trip.passengers.map(passenger => ({
      userId: passenger._id,
      title: 'Trip Completed',
      message: `Your trip has been completed successfully.`,
      type: 'success',
      relatedEntity: 'trip',
      relatedId: trip._id
    }));

    await Notification.insertMany(notifications);

    io.emit('tripCompleted', { 
      tripId: trip._id.toString(),
      message: 'Trip completed successfully' 
    });

    res.json({
      success: true,
      message: 'Trip completed successfully',
      trip
    });
  } catch (error) {
    console.error('Complete trip error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error completing trip' 
    });
  }
});

// ==================== PAYMENT APIs ====================

// Create Payment
app.post('/api/payments', authMiddleware, requireRole(['transporter']), async (req, res) => {
  try {
    const { type, driverId, passengerId, amount, mode, month } = req.body;

    const payment = new Payment({
      type,
      driverId,
      passengerId,
      amount,
      mode,
      month: month || moment().format('MMMM YYYY'),
      status: 'sent'
    });

    await payment.save();

    // Create notification
    const notificationUserId = type === 'driver' ? driverId : passengerId;
    if (notificationUserId) {
      const notification = new Notification({
        userId: notificationUserId,
        title: 'Payment Sent',
        message: `Payment of PKR ${amount} has been sent via ${mode}.`,
        type: 'success',
        relatedEntity: 'payment',
        relatedId: payment._id
      });
      await notification.save();

      io.emit('paymentSent', { 
        userId: notificationUserId.toString(),
        message: `Payment of PKR ${amount} sent` 
      });
    }

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      payment: await payment.populate(type === 'driver' ? 'driverId' : 'passengerId')
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating payment' 
    });
  }
});

// Get Payments
app.get('/api/payments', authMiddleware, async (req, res) => {
  try {
    let payments;
    
    if (req.user.role === 'driver') {
      payments = await Payment.find({ driverId: req.user._id }).populate('driverId');
    } else if (req.user.role === 'passenger') {
      payments = await Payment.find({ passengerId: req.user._id }).populate('passengerId');
    } else {
      payments = await Payment.find()
        .populate('driverId')
        .populate('passengerId');
    }

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payments' 
    });
  }
});

// ==================== COMPLAINT APIs ====================

// Create Complaint
app.post('/api/complaints', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    const complaint = new Complaint({
      title,
      description,
      byName: req.user.name
    });

    await complaint.save();

    // Notify transporter
    const transporter = await User.findOne({ role: 'transporter' });
    if (transporter) {
      const notification = new Notification({
        userId: transporter._id,
        title: 'New Complaint',
        message: `New complaint received: ${title}`,
        type: 'warning',
        relatedEntity: 'complaint',
        relatedId: complaint._id
      });
      await notification.save();

      io.emit('newComplaint', { 
        userId: transporter._id.toString(),
        message: `New complaint: ${title}` 
      });
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting complaint' 
    });
  }
});

// Get Complaints
app.get('/api/complaints', authMiddleware, async (req, res) => {
  try {
    let complaints;
    
    if (req.user.role === 'transporter') {
      complaints = await Complaint.find();
    } else {
      complaints = await Complaint.find({ byName: req.user.name });
    }

    res.json({
      success: true,
      complaints
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching complaints' 
    });
  }
});

// Reply to Complaint
app.post('/api/complaints/:complaintId/reply', authMiddleware, requireRole(['transporter']), async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { text } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { 
        $push: { 
          replies: { 
            text,
            by: req.user.name
          } 
        } 
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ 
        success: false, 
        message: 'Complaint not found' 
      });
    }

    res.json({
      success: true,
      message: 'Reply added successfully',
      complaint
    });
  } catch (error) {
    console.error('Reply to complaint error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding reply' 
    });
  }
});

// Resolve Complaint
app.put('/api/complaints/:complaintId/resolve', authMiddleware, requireRole(['transporter']), async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status: 'Resolved' },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ 
        success: false, 
        message: 'Complaint not found' 
      });
    }

    res.json({
      success: true,
      message: 'Complaint resolved successfully',
      complaint
    });
  } catch (error) {
    console.error('Resolve complaint error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error resolving complaint' 
    });
  }
});

// ==================== NOTIFICATION APIs ====================

// Get Notifications
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      read: false 
    });

    res.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
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

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: req.user._id },
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
    await Notification.updateMany(
      { userId: req.user._id, read: false },
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

// ==================== AUTO ASSIGNMENT ALGORITHM ====================

app.post('/api/auto-assign', authMiddleware, requireRole(['transporter']), async (req, res) => {
  try {
    // Get available drivers and confirmed passengers
    const drivers = await User.find({ 
      role: 'driver', 
      status: 'active' 
    });
    
    const passengers = await User.find({ 
      role: 'passenger', 
      status: 'active',
      selectedTimeSlot: { $exists: true, $ne: null }
    });

    const assignments = [];
    const unassigned = [...passengers];

    // Simple assignment algorithm
    drivers.forEach(driver => {
      const driverCapacity = driver.capacity || 8;
      const assignedPassengers = unassigned.splice(0, driverCapacity);
      
      if (assignedPassengers.length > 0) {
        assignments.push({
          driver,
          passengers: assignedPassengers,
          targetCapacity: driverCapacity,
          totalDistance: (Math.random() * 20 + 5).toFixed(1) + ' km',
          estimatedTime: (Math.random() * 30 + 15).toFixed(0) + ' min',
          efficiencyScore: (Math.random() * 30 + 70).toFixed(0),
          utilization: Math.min(100, Math.round((assignedPassengers.length / driverCapacity) * 100)),
          status: 'pending'
        });
      }
    });

    res.json({
      success: true,
      assignments,
      unassigned
    });
  } catch (error) {
    console.error('Auto assign error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating auto assignments' 
    });
  }
});

// ==================== SOCKET.IO HANDLERS ====================

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join user room for personalized updates
  socket.on('joinUser', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room`);
  });

  // Join trip room for live tracking
  socket.on('joinTrip', (tripId) => {
    socket.join(`trip_${tripId}`);
    console.log(`Client joined trip room: ${tripId}`);
  });

  // Handle location updates from driver
  socket.on('driverLocationUpdate', (data) => {
    const { tripId, location } = data;
    
    // Broadcast to all clients watching this trip
    socket.to(`trip_${tripId}`).emit('locationUpdate', {
      tripId,
      location,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ==================== SEED DATA API ====================

app.post('/api/seed-data', async (req, res) => {
  try {
    // Create default transporter
    const existingTransporter = await User.findOne({ role: 'transporter' });
    if (!existingTransporter) {
      const transporter = new User({
        name: 'Transport Company',
        email: 'transporter@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'transporter',
        phone: '+923001234567',
        company: 'City Transport Ltd',
        license: 'TRANS001',
        address: '123 Main Street, City',
        status: 'active'
      });
      await transporter.save();
    }

    // Create sample drivers
    const sampleDrivers = [
      {
        name: 'Ahmed Khan',
        email: 'ahmed@driver.com',
        password: await bcrypt.hash('driver123', 10),
        role: 'driver',
        phone: '+923001234568',
        vehicleType: 'Van',
        vehicleNumber: 'LEA-1234',
        capacity: 8,
        experience: '5 years',
        licenseNumber: 'DRV001',
        status: 'active'
      },
      {
        name: 'Usman Ali',
        email: 'usman@driver.com',
        password: await bcrypt.hash('driver123', 10),
        role: 'driver',
        phone: '+923001234569',
        vehicleType: 'Coaster',
        vehicleNumber: 'LEA-5678',
        capacity: 12,
        experience: '3 years',
        licenseNumber: 'DRV002',
        status: 'active'
      }
    ];

    for (const driverData of sampleDrivers) {
      const existingDriver = await User.findOne({ email: driverData.email });
      if (!existingDriver) {
        await User.create(driverData);
      }
    }

    // Create sample passengers
    const samplePassengers = [
      {
        name: 'Sara Ahmed',
        email: 'sara@passenger.com',
        password: await bcrypt.hash('pass123', 10),
        role: 'passenger',
        phone: '+923001234570',
        pickupPoint: 'Chaklala Bus Stop',
        destination: 'Gulberg Greens',
        selectedTimeSlot: '07:00 AM',
        status: 'active'
      },
      {
        name: 'Ali Raza',
        email: 'ali@passenger.com',
        password: await bcrypt.hash('pass123', 10),
        role: 'passenger',
        phone: '+923001234571',
        pickupPoint: 'Scheme 3',
        destination: 'Gulberg Greens',
        selectedTimeSlot: '07:30 AM',
        status: 'active'
      }
    ];

    for (const passengerData of samplePassengers) {
      const existingPassenger = await User.findOne({ email: passengerData.email });
      if (!existingPassenger) {
        await User.create(passengerData);
      }
    }

    res.json({
      success: true,
      message: 'Sample data seeded successfully'
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Transport System Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});