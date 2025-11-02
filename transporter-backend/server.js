// server.js - Complete Backend API for Transporter Dashboard
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection with better error handling
mongoose.connect('mongodb://localhost:27017/transporter_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('✅ Connected to MongoDB successfully');
  console.log('📊 Database: transporter_db');
});

db.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// JWT Secret
const JWT_SECRET = 'your_jwt_secret_key_here_change_in_production';

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ==================== SCHEMAS ====================

// Transporter Schema
const transporterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  license: { type: String, required: true },
  address: { type: String },
  registrationDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  profilePicture: String,
}, { timestamps: true });

// Driver Schema
const driverSchema = new mongoose.Schema({
  transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  license: { type: String, required: true },
  experience: String,
  van: String,
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Assigned', 'Offline'], default: 'Available' },
  availableTimeSlots: [String],
  currentLocation: {
    latitude: Number,
    longitude: Number,
  },
  rating: { type: Number, default: 0 },
  completedTrips: { type: Number, default: 0 },
}, { timestamps: true });

// Passenger Schema
const passengerSchema = new mongoose.Schema({
  transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  location: String,
  pickupPoint: String,
  destination: String,
  preferredTimeSlot: String,
  status: { type: String, enum: ['Confirmed', 'Not Confirmed', 'Pending'], default: 'Not Confirmed' },
  selectedTimeSlot: String,
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Expired'], default: 'Pending' },
  amount: Number,
  lastPaymentDate: Date,
  expiryDate: Date,
}, { timestamps: true });

// Route Schema
const routeSchema = new mongoose.Schema({
  transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter', required: true },
  name: { type: String, required: true },
  stops: [String],
  destination: String,
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  timeSlot: String,
  distance: String,
  duration: String,
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Poll Schema - FIXED LOCATION
const pollSchema = new mongoose.Schema({
  transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter', required: true },
  title: { type: String, required: true },
  timeSlots: [String],
  closesAt: String,
  closingDate: Date,
  active: { type: Boolean, default: true },
  responses: [{
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' },
    selectedSlot: String,
    respondedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

// Payment Schema
const paymentSchema = new mongoose.Schema({
  transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter', required: true },
  type: { type: String, enum: ['driver', 'passenger'], required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' },
  amount: { type: Number, required: true },
  mode: { type: String, enum: ['Cash', 'Bank Transfer', 'Online'], default: 'Cash' },
  status: { type: String, enum: ['Sent', 'Confirmed', 'Pending', 'Failed'], default: 'Pending' },
  month: String,
  transactionId: String,
}, { timestamps: true });

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter', required: true },
  by: { type: String, enum: ['Passenger', 'Driver'], required: true },
  byId: { type: mongoose.Schema.Types.ObjectId, required: true },
  byName: String,
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Open', 'Resolved', 'In Progress'], default: 'Open' },
  replies: [{
    text: String,
    by: String,
    date: Date,
    time: String,
  }],
}, { timestamps: true });

// Notification Schema
const notificationSchema = new mongoose.Schema({
  transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter', required: true },
  title: { type: String, required: true },
  message: String,
  icon: String,
  color: String,
  read: { type: Boolean, default: false },
  type: String,
  relatedId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

// Trip Schema (Live Tracking)
const tripSchema = new mongoose.Schema({
  transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' }],
  status: { type: String, enum: ['Scheduled', 'En Route', 'Paused', 'Completed', 'Cancelled'], default: 'Scheduled' },
  currentStop: String,
  completedStops: [String],
  currentLocation: {
    latitude: Number,
    longitude: Number,
  },
  speed: Number,
  eta: String,
  startTime: Date,
  endTime: Date,
  passengersList: [{
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' },
    status: { type: String, enum: ['pending', 'picked', 'current'], default: 'pending' },
    pickupTime: String,
  }],
}, { timestamps: true });

// Join Request Schema
const joinRequestSchema = new mongoose.Schema({
  transporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter', required: true },
  type: { type: String, enum: ['driver', 'passenger'], required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  // Driver specific
  experience: String,
  vehicle: String,
  capacity: Number,
  license: String,
  availableTimeSlots: [String],
  // Passenger specific
  location: String,
  pickupPoint: String,
  destination: String,
  preferredTimeSlot: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

// Models
const Transporter = mongoose.model('Transporter', transporterSchema);
const Driver = mongoose.model('Driver', driverSchema);
const Passenger = mongoose.model('Passenger', passengerSchema);
const Route = mongoose.model('Route', routeSchema);
const Poll = mongoose.model('Poll', pollSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Trip = mongoose.model('Trip', tripSchema);
const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema);

// ==================== MIDDLEWARE ====================

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const transporter = await Transporter.findById(decoded.id);
    
    if (!transporter) throw new Error();
    
    req.transporter = transporter;
    req.transporterId = transporter._id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// ==================== ROUTES ====================

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, company, license, address } = req.body;
    
    const existingTransporter = await Transporter.findOne({ email });
    if (existingTransporter) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const transporter = new Transporter({
      name, email, password: hashedPassword, phone, company, license, address,
    });
    
    await transporter.save();
    
    const token = jwt.sign({ id: transporter._id }, JWT_SECRET);
    res.status(201).json({ transporter: { ...transporter.toObject(), password: undefined }, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const transporter = await Transporter.findOne({ email });
    
    if (!transporter || !(await bcrypt.compare(password, transporter.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: transporter._id }, JWT_SECRET);
    res.json({ transporter: { ...transporter.toObject(), password: undefined }, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PROFILE ROUTES
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    res.json({ ...req.transporter.toObject(), password: undefined });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.email;
    
    Object.keys(updates).forEach(key => req.transporter[key] = updates[key]);
    await req.transporter.save();
    
    res.json({ ...req.transporter.toObject(), password: undefined });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DASHBOARD STATS
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const activeDrivers = await Driver.countDocuments({ 
      transporterId: req.transporterId, 
      status: 'Available' 
    });
    
    const totalPassengers = await Passenger.countDocuments({ 
      transporterId: req.transporterId, 
      status: 'Confirmed' 
    });
    
    const completedTrips = await Trip.countDocuments({ 
      transporterId: req.transporterId, 
      status: 'Completed' 
    });
    
    const ongoingTrips = await Trip.countDocuments({ 
      transporterId: req.transporterId, 
      status: 'En Route' 
    });
    
    const complaints = await Complaint.countDocuments({ 
      transporterId: req.transporterId, 
      status: 'Open' 
    });
    
    const paymentsReceived = await Payment.aggregate([
      { $match: { transporterId: req.transporterId, status: 'Confirmed', type: 'passenger' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    const paymentsPending = await Payment.aggregate([
      { $match: { transporterId: req.transporterId, status: 'Pending', type: 'passenger' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    res.json({
      activeDrivers,
      totalPassengers,
      completedTrips,
      ongoingTrips,
      complaints,
      paymentsReceived: paymentsReceived[0]?.total || 0,
      paymentsPending: paymentsPending[0]?.total || 0,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DRIVER ROUTES
app.get('/api/drivers', authMiddleware, async (req, res) => {
  try {
    const drivers = await Driver.find({ transporterId: req.transporterId });
    res.json(drivers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/drivers', authMiddleware, async (req, res) => {
  try {
    const driver = new Driver({ ...req.body, transporterId: req.transporterId });
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/drivers/:id', authMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findOneAndUpdate(
      { _id: req.params.id, transporterId: req.transporterId },
      req.body,
      { new: true }
    );
    res.json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/drivers/:id', authMiddleware, async (req, res) => {
  try {
    await Driver.findOneAndDelete({ _id: req.params.id, transporterId: req.transporterId });
    res.json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PASSENGER ROUTES
app.get('/api/passengers', authMiddleware, async (req, res) => {
  try {
    const passengers = await Passenger.find({ transporterId: req.transporterId });
    res.json(passengers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/passengers', authMiddleware, async (req, res) => {
  try {
    const passenger = new Passenger({ ...req.body, transporterId: req.transporterId });
    await passenger.save();
    res.status(201).json(passenger);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/passengers/:id', authMiddleware, async (req, res) => {
  try {
    const passenger = await Passenger.findOneAndUpdate(
      { _id: req.params.id, transporterId: req.transporterId },
      req.body,
      { new: true }
    );
    res.json(passenger);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ROUTE ROUTES
app.get('/api/routes', authMiddleware, async (req, res) => {
  try {
    const routes = await Route.find({ transporterId: req.transporterId })
      .populate('assignedDriver')
      .populate('passengers');
    res.json(routes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/routes', authMiddleware, async (req, res) => {
  try {
    const route = new Route({ ...req.body, transporterId: req.transporterId });
    await route.save();
    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/routes/:id/assign', authMiddleware, async (req, res) => {
  try {
    const { driverId, timeSlot, passengerIds } = req.body;
    
    const route = await Route.findOneAndUpdate(
      { _id: req.params.id, transporterId: req.transporterId },
      { assignedDriver: driverId, timeSlot, passengers: passengerIds },
      { new: true }
    ).populate('assignedDriver').populate('passengers');
    
    await Driver.findByIdAndUpdate(driverId, { status: 'Assigned' });
    
    res.json(route);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POLL ROUTES - FIXED VERSION
app.get('/api/polls', authMiddleware, async (req, res) => {
  try {
    console.log('📋 Fetching polls for transporter:', req.transporterId);
    const polls = await Poll.find({ transporterId: req.transporterId });
    console.log('✅ Polls found:', polls.length);
    res.json(polls);
  } catch (error) {
    console.error('❌ Error fetching polls:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/polls', authMiddleware, async (req, res) => {
  try {
    console.log('🎯 Creating new poll with data:', req.body);
    console.log('👤 Transporter ID:', req.transporterId);

    const { title, timeSlots, closesAt, closingDate } = req.body;
    
    // Validation
    if (!title || !timeSlots || !closesAt) {
      return res.status(400).json({ error: 'Title, timeSlots, and closesAt are required' });
    }

    const poll = new Poll({
      transporterId: req.transporterId,
      title,
      timeSlots: Array.isArray(timeSlots) ? timeSlots : [timeSlots],
      closesAt,
      closingDate: closingDate || new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours from now
      active: true
    });

    console.log('📝 Poll object before save:', poll);

    const savedPoll = await poll.save();
    console.log('✅ Poll saved successfully:', savedPoll._id);

    // Create notifications for passengers
    try {
      const passengers = await Passenger.find({ transporterId: req.transporterId });
      console.log('👥 Creating notifications for passengers:', passengers.length);
      
      const notifications = passengers.map(passenger => ({
        transporterId: req.transporterId,
        title: 'New Travel Poll Created',
        message: `A new poll "${title}" has been created. Please respond with your preferred time slot.`,
        icon: 'poll',
        color: '#3498DB',
        type: 'poll',
        relatedId: savedPoll._id,
        read: false
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log('✅ Notifications created:', notifications.length);
      }
    } catch (notificationError) {
      console.error('⚠️ Error creating notifications:', notificationError);
      // Don't fail the poll creation if notifications fail
    }

    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      poll: savedPoll
    });

  } catch (error) {
    console.error('❌ Error creating poll:', error);
    res.status(400).json({ 
      success: false,
      error: error.message,
      details: 'Failed to create poll. Please check the data and try again.'
    });
  }
});

app.post('/api/polls/:id/respond', authMiddleware, async (req, res) => {
  try {
    const { passengerId, selectedSlot } = req.body;
    
    const poll = await Poll.findById(req.params.id);
    poll.responses.push({ passengerId, selectedSlot });
    await poll.save();
    
    await Passenger.findByIdAndUpdate(passengerId, { 
      status: 'Confirmed', 
      selectedTimeSlot: selectedSlot 
    });
    
    res.json(poll);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PAYMENT ROUTES
app.get('/api/payments', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    const query = { transporterId: req.transporterId };
    if (type) query.type = type;
    
    const payments = await Payment.find(query)
      .populate('driverId')
      .populate('passengerId');
    res.json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/payments', authMiddleware, async (req, res) => {
  try {
    const payment = new Payment({ ...req.body, transporterId: req.transporterId });
    await payment.save();
    
    // Create notification
    const notification = new Notification({
      transporterId: req.transporterId,
      title: 'Payment Processed',
      message: `Payment of PKR ${payment.amount} has been ${payment.status.toLowerCase()}.`,
      icon: 'payment',
      color: '#28a745',
      type: 'payment',
      relatedId: payment._id,
    });
    await notification.save();
    
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/payments/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, transporterId: req.transporterId },
      req.body,
      { new: true }
    );
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// COMPLAINT ROUTES
app.get('/api/complaints', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ transporterId: req.transporterId });
    res.json(complaints);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/complaints', authMiddleware, async (req, res) => {
  try {
    const complaint = new Complaint({ ...req.body, transporterId: req.transporterId });
    await complaint.save();
    
    const notification = new Notification({
      transporterId: req.transporterId,
      title: 'New Complaint',
      message: `${complaint.byName} has filed a complaint: ${complaint.title}`,
      icon: 'warning',
      color: '#dc3545',
      type: 'complaint',
      relatedId: complaint._id,
    });
    await notification.save();
    
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/complaints/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    
    complaint.replies.push({
      text,
      by: req.transporter.name,
      date: new Date(),
      time: new Date().toLocaleTimeString(),
    });
    
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/complaints/:id/resolve', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndUpdate(
      { _id: req.params.id, transporterId: req.transporterId },
      { status: 'Resolved' },
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// NOTIFICATION ROUTES
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ transporterId: req.transporterId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, transporterId: req.transporterId },
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/notifications/mark-all-read', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { transporterId: req.transporterId, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// TRIP ROUTES (Live Tracking)
app.get('/api/trips', authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ transporterId: req.transporterId })
      .populate('routeId')
      .populate('driverId')
      .populate('passengers');
    res.json(trips);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/trips', authMiddleware, async (req, res) => {
  try {
    const trip = new Trip({ ...req.body, transporterId: req.transporterId });
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/trips/:id/location', authMiddleware, async (req, res) => {
  try {
    const { currentLocation, speed, currentStop, completedStops } = req.body;
    
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, transporterId: req.transporterId },
      { currentLocation, speed, currentStop, completedStops },
      { new: true }
    );
    
    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/trips/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, transporterId: req.transporterId },
      { status, endTime: status === 'Completed' ? new Date() : undefined },
      { new: true }
    );
    
    if (status === 'Completed') {
      await Driver.findByIdAndUpdate(trip.driverId, { 
        status: 'Available',
        $inc: { completedTrips: 1 } 
      });
    }
    
    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// JOIN REQUEST ROUTES
app.get('/api/join-requests', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    const query = { transporterId: req.transporterId, status: 'pending' };
    if (type) query.type = type;
    
    const requests = await JoinRequest.find(query);
    res.json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/join-requests', async (req, res) => {
  try {
    const request = new JoinRequest(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/join-requests/:id/accept', authMiddleware, async (req, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id);
    
    if (request.type === 'driver') {
      const driver = new Driver({
        transporterId: req.transporterId,
        name: request.name,
        phone: request.phone,
        email: request.email,
        license: request.license,
        experience: request.experience,
        van: request.vehicle,
        capacity: request.capacity,
        availableTimeSlots: request.availableTimeSlots,
      });
      await driver.save();
    } else {
      const passenger = new Passenger({
        transporterId: req.transporterId,
        name: request.name,
        phone: request.phone,
        email: request.email,
        location: request.location,
        pickupPoint: request.pickupPoint,
        destination: request.destination,
        preferredTimeSlot: request.preferredTimeSlot,
      });
      await passenger.save();
    }
    
    request.status = 'accepted';
    await request.save();
    
    res.json({ message: 'Request accepted', request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/join-requests/:id/reject', authMiddleware, async (req, res) => {
  try {
    const request = await JoinRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json({ message: 'Request rejected', request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AUTO ASSIGNMENT ALGORITHM
app.post('/api/auto-assign', authMiddleware, async (req, res) => {
  try {
    const passengers = await Passenger.find({ 
      transporterId: req.transporterId, 
      status: 'Confirmed' 
    });
    
    const drivers = await Driver.find({ 
      transporterId: req.transporterId, 
      status: 'Available' 
    });
    
    if (drivers.length === 0 || passengers.length === 0) {
      return res.status(400).json({ error: 'No available drivers or passengers' });
    }
    
    // Stop coordinates for distance calculation
    const stopCoordinates = {
      'Chaklala Bus Stop': { latitude: 33.6008, longitude: 73.0963 },
      'Korang Road': { latitude: 33.583, longitude: 73.1 },
      'Scheme 3': { latitude: 33.5858, longitude: 73.0887 },
      'PWD Housing': { latitude: 33.571, longitude: 73.145 },
      'Gulberg Greens': { latitude: 33.6, longitude: 73.16 },
      'F-7 Markaz': { latitude: 33.7214, longitude: 73.0572 },
      'F-8 Markaz': { latitude: 33.710, longitude: 73.040 },
      'F-10 Markaz': { latitude: 33.6953, longitude: 73.0129 },
      'I-10 Markaz': { latitude: 33.6476, longitude: 73.0388 },
      'G-11 Markaz': { latitude: 33.6686, longitude: 72.998 },
      'G-10 Markaz': { latitude: 33.6751, longitude: 73.017 },
    };
    
    // Calculate distance using Haversine formula
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };
    
    const assignments = [];
    let unassigned = [...passengers];
    
    // Sort drivers by capacity
    const sortedDrivers = [...drivers].sort((a, b) => b.capacity - a.capacity);
    
    for (const driver of sortedDrivers) {
      if (unassigned.length === 0) break;
      
      const targetCapacity = Math.floor(driver.capacity * 0.7);
      const driverVanName = driver.van.split(' ')[0] + ' Markaz';
      const driverLoc = stopCoordinates[driverVanName] || { latitude: 33.6844, longitude: 73.0479 };
      
      // Calculate distances to all unassigned passengers
      const passengerDistances = unassigned.map(p => {
        const pLoc = stopCoordinates[p.pickupPoint] || { latitude: 33.6844, longitude: 73.0479 };
        return {
          passenger: p,
          distance: calculateDistance(driverLoc.latitude, driverLoc.longitude, pLoc.latitude, pLoc.longitude)
        };
      });
      
      passengerDistances.sort((a, b) => a.distance - b.distance);
      
      // Cluster passengers within 5km radius
      const clusterRadius = 5;
      const cluster = [];
      
      if (passengerDistances.length > 0) {
        const nearestPassenger = passengerDistances[0];
        
        passengerDistances.forEach(pd => {
          if (cluster.length >= targetCapacity) return;
          
          const nearestLoc = stopCoordinates[nearestPassenger.passenger.pickupPoint] || { latitude: 33.6844, longitude: 73.0479 };
          const pdLoc = stopCoordinates[pd.passenger.pickupPoint] || { latitude: 33.6844, longitude: 73.0479 };
          const distToNearest = calculateDistance(
            nearestLoc.latitude, nearestLoc.longitude,
            pdLoc.latitude, pdLoc.longitude
          );
          
          if (distToNearest <= clusterRadius) {
            cluster.push(pd);
          }
        });
        
        if (cluster.length < Math.min(3, targetCapacity)) {
          cluster.length = 0;
          for (let i = 0; i < Math.min(targetCapacity, passengerDistances.length); i++) {
            cluster.push(passengerDistances[i]);
          }
        }
      }
      
      const assignedPassengers = cluster.slice(0, targetCapacity).map(c => c.passenger);
      
      // Remove from unassigned
      assignedPassengers.forEach(ap => {
        const idx = unassigned.findIndex(p => p._id.toString() === ap._id.toString());
        if (idx !== -1) unassigned.splice(idx, 1);
      });
      
      // Optimize route
      const optimizedRoute = [];
      let current = { latitude: driverLoc.latitude, longitude: driverLoc.longitude };
      let remaining = [...assignedPassengers];
      
      while (remaining.length > 0) {
        let nearest = null;
        let minDist = Infinity;
        let nearestIdx = -1;
        
        remaining.forEach((passenger, idx) => {
          const passengerLoc = stopCoordinates[passenger.pickupPoint] || { latitude: 33.6844, longitude: 73.0479 };
          const dist = calculateDistance(current.latitude, current.longitude, passengerLoc.latitude, passengerLoc.longitude);
          if (dist < minDist) {
            minDist = dist;
            nearest = passenger;
            nearestIdx = idx;
          }
        });
        
        if (nearest) {
          optimizedRoute.push(nearest);
          const nextLoc = stopCoordinates[nearest.pickupPoint] || { latitude: 33.6844, longitude: 73.0479 };
          current = { latitude: nextLoc.latitude, longitude: nextLoc.longitude };
          remaining.splice(nearestIdx, 1);
        } else {
          break;
        }
      }
      
      // Calculate metrics
      let totalDistance = 0;
      if (optimizedRoute.length > 0) {
        const firstLoc = stopCoordinates[optimizedRoute[0].pickupPoint] || { latitude: 33.6844, longitude: 73.0479 };
        totalDistance = calculateDistance(driverLoc.latitude, driverLoc.longitude, firstLoc.latitude, firstLoc.longitude);
        
        for (let i = 0; i < optimizedRoute.length - 1; i++) {
          const loc1 = stopCoordinates[optimizedRoute[i].pickupPoint] || { latitude: 33.6844, longitude: 73.0479 };
          const loc2 = stopCoordinates[optimizedRoute[i + 1].pickupPoint] || { latitude: 33.6844, longitude: 73.0479 };
          totalDistance += calculateDistance(loc1.latitude, loc1.longitude, loc2.latitude, loc2.longitude);
        }
      }
      
      const estimatedTime = Math.round((totalDistance / 30) * 60);
      const utilization = optimizedRoute.length > 0 ? ((optimizedRoute.length / targetCapacity) * 100).toFixed(0) : '0';
      const efficiencyScore = optimizedRoute.length > 0 ? 
        ((parseFloat(utilization) * 0.6) + ((1 / (totalDistance + 1)) * 100 * 0.4)).toFixed(1) : '0';
      
      assignments.push({
        driver: driver,
        passengers: optimizedRoute,
        totalDistance: totalDistance.toFixed(2),
        estimatedTime,
        utilization,
        efficiencyScore,
        targetCapacity
      });
    }
    
    res.json({ assignments, unassigned });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DEBUG ROUTES
app.get('/api/debug/db-status', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Count documents in each collection
    const counts = {};
    for (const collectionName of collectionNames) {
      counts[collectionName] = await mongoose.connection.db.collection(collectionName).countDocuments();
    }
    
    res.json({
      database: mongoose.connection.db.databaseName,
      collections: collectionNames,
      counts: counts,
      connectionState: mongoose.connection.readyState,
      mongooseVersion: mongoose.version
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/debug/test-insert', authMiddleware, async (req, res) => {
  try {
    const testPoll = new Poll({
      transporterId: req.transporterId,
      title: 'Test Poll - ' + new Date().toLocaleString(),
      timeSlots: ['07:00 AM', '07:30 AM'],
      closesAt: '22:00',
      active: true
    });
    
    const saved = await testPoll.save();
    
    res.json({
      message: 'Test poll inserted successfully',
      data: saved
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROOT ROUTE - Welcome page
app.get('/', (req, res) => {
  res.json({
    message: 'Transporter Dashboard API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      profile: 'GET /api/profile',
      dashboard: 'GET /api/dashboard/stats',
      drivers: 'GET /api/drivers',
      passengers: 'GET /api/passengers',
      routes: 'GET /api/routes',
      polls: 'GET /api/polls',
      payments: 'GET /api/payments',
      complaints: 'GET /api/complaints',
      notifications: 'GET /api/notifications',
      trips: 'GET /api/trips',
      joinRequests: 'GET /api/join-requests',
      autoAssign: 'POST /api/auto-assign',
      debug: {
        dbStatus: 'GET /api/debug/db-status',
        testInsert: 'POST /api/debug/test-insert'
      }
    },
    documentation: 'See README.md for full API documentation',
    timestamp: new Date().toISOString()
  });
});

// HEALTH CHECK ROUTE
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: db.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API STATUS ROUTE
app.get('/api', (req, res) => {
  res.json({
    message: 'API is working',
    version: '1.0.0',
    status: 'active'
  });
});

// ERROR HANDLER - 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist',
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/profile',
      'GET /api/dashboard/stats'
    ]
  });
});

// ERROR HANDLER - Global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Transporter Dashboard API Server        ║
║   Version: 1.0.0                          ║
║   Status: Running ✓                       ║
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   MongoDB: ${db.readyState === 1 ? 'Connected ✓' : 'Disconnected ✗'}             ║
║                                            ║
║   Access API at:                          ║
║   → http://localhost:${PORT}                  ║
║   → http://localhost:${PORT}/api              ║
║   → http://localhost:${PORT}/health           ║
║   → http://localhost:${PORT}/api/debug/db-status ║
╚════════════════════════════════════════════╝
  `);
});