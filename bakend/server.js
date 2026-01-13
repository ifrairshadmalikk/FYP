const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // Add axios for API calls
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require('multer');

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const MONGODB_URI = 'mongodb://localhost:27017/transportdb';
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

// User Schema
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
  // Passenger specific fields
  pickupPoint: String,
  destination: String,
  selectedTimeSlot: String,
  preferredTimeSlot: String
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

// ==================== REAL-TIME TRACKING APIs ====================

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

// ==================== EXISTING APIs (ORIGINAL) ====================

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
    const trips = await Trip.find()
      .populate('driverId')
      .populate('routeId')
      .populate('passengers');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trips' });
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

// ==================== TRANSPORTER AUTH APIs ====================

// Transporter Login API
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

// Transporter Registration API
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

// Forgot Password API
app.post('/api/transporter/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required." 
      });
    }

    const transporter = await User.findOne({ 
      email: email.toLowerCase(), 
      role: 'transporter' 
    });

    if (!transporter) {
      return res.json({ 
        success: true, 
        message: "If the email exists, a password reset link will be sent." 
      });
    }

    const resetToken = generateResetToken(transporter._id);

    res.json({ 
      success: true, 
      message: "Password recovery link will be sent to your registered email." 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to process request. Please try again." 
    });
  }
});

// Reset Password API
app.post('/api/transporter/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required." 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match." 
      });
    }

    const transporterId = verifyResetToken(token);
    
    if (!transporterId) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired reset token." 
      });
    }

    await User.findByIdAndUpdate(transporterId, { 
      password: newPassword
    });

    res.json({ 
      success: true, 
      message: "Password reset successfully. You can now login with your new password." 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to reset password. Please try again." 
    });
  }
});

// Check Email Availability API
app.get('/api/transporter/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const existingTransporter = await User.findOne({ 
      email: email.toLowerCase(), 
      role: 'transporter' 
    });

    res.json({ 
      available: !existingTransporter 
    });

  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to check email availability." 
    });
  }
});

// ==================== HELPER FUNCTIONS ====================

// Generate JWT Token (simplified version)
const generateToken = (userId) => {
  return `transporter_token_${userId}_${Date.now()}`;
};

// Generate Reset Token (simplified version)
const generateResetToken = (userId) => {
  return `reset_token_${userId}_${Date.now()}`;
};

// Verify Reset Token (simplified version)
const verifyResetToken = (token) => {
  const parts = token.split('_');
  return parts[2];
};

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Transporter Server is running with enhanced communication APIs',
    timestamp: new Date().toISOString(),
    services: {
      gateway: MICROSERVICES.GATEWAY,
      driver: MICROSERVICES.DRIVER,
      passenger: MICROSERVICES.PASSENGER
    }
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Transporter Server running on http://localhost:${PORT}`);
});
