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
@@ -19,6 +19,13 @@ mongoose.connect(MONGODB_URI, {
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
@@ -159,7 +166,421 @@ const joinRequestSchema = new mongoose.Schema({

const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema);

// ==================== APIs ====================
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
@@ -237,10 +658,9 @@ app.get('/api/profile', async (req, res) => {
        company: user.company,
        registrationDate: user.registrationDate,
        address: user.address,
        profileImage: user.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' // default image
        profileImage: user.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      });
    } else {
      // Default transporter if not exists
      const defaultTransporter = new User({
        name: 'Transport Company',
        email: 'admin@transport.com',
@@ -249,7 +669,7 @@ app.get('/api/profile', async (req, res) => {
        phone: '+1234567890',
        company: 'City Transport Ltd',
        address: '123 Main Street, City',
        profileImage: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' // ✅ default image
        profileImage: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      });
      await defaultTransporter.save();

@@ -268,7 +688,6 @@ app.get('/api/profile', async (req, res) => {
  }
});


app.put('/api/profile', async (req, res) => {
  try {
    const profileData = req.body;
@@ -288,7 +707,6 @@ app.get('/api/dashboard/stats', async (req, res) => {
    const ongoingTrips = await Trip.countDocuments({ status: 'En Route' });
    const complaints = await Complaint.countDocuments({ status: 'Open' });

    // Calculate payments
    const driverPayments = await Payment.aggregate([
      { $match: { type: 'driver', status: 'Sent' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
@@ -382,7 +800,6 @@ app.post('/api/routes', async (req, res) => {
    const newRoute = new Route(routeData);
    await newRoute.save();

    // Populate the response
    const populatedRoute = await Route.findById(newRoute._id)
      .populate('assignedDriver')
      .populate('passengers');
@@ -409,7 +826,6 @@ app.put('/api/routes/:routeId/assign', async (req, res) => {
      { new: true }
    ).populate('assignedDriver').populate('passengers');

    // Create a trip for this assignment
    const newTrip = new Trip({
      driverId,
      routeId,
@@ -462,7 +878,6 @@ app.put('/api/join-requests/:requestId/accept', async (req, res) => {
      { new: true }
    );

    // Create user from accepted request
    const newUser = new User({
      name: request.name,
      email: request.email,
@@ -635,11 +1050,9 @@ app.put('/api/trips/:tripId/location', async (req, res) => {
// ✅ AUTO ASSIGNMENT API
app.post('/api/auto-assign', async (req, res) => {
  try {
    // Get available drivers and passengers
    const drivers = await User.find({ role: 'driver', status: 'active' });
    const passengers = await User.find({ role: 'passenger', status: 'active' });

    // Simple auto-assignment logic (you can enhance this)
    const assignments = drivers.map((driver, index) => {
      const assignedPassengers = passengers.slice(index * 3, (index + 1) * 3);
      return {
@@ -668,7 +1081,6 @@ app.post('/api/auto-assign', async (req, res) => {
// ✅ Add some sample data
app.post('/api/seed-data', async (req, res) => {
  try {
    // Create sample drivers
    const sampleDrivers = [
      {
        name: 'Ahmed Khan',
@@ -698,7 +1110,6 @@ app.post('/api/seed-data', async (req, res) => {
      }
    ];

    // Create sample passengers
    const samplePassengers = [
      {
        name: 'Sara Ahmed',
@@ -733,18 +1144,13 @@ app.post('/api/seed-data', async (req, res) => {
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});// ==================== TRANSPORTER AUTH APIs ====================
// ==================== TRANSPORTER AUTH APIs ====================

// Transporter Login API
app.post('/api/transporter/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
@@ -760,7 +1166,6 @@ app.post('/api/transporter/login', async (req, res) => {
      });
    }

    // Find transporter by email
    const transporter = await User.findOne({ 
      email: email.toLowerCase(), 
      role: 'transporter' 
@@ -773,18 +1178,15 @@ app.post('/api/transporter/login', async (req, res) => {
      });
    }

    // Check password (in real app, use bcrypt for hashing)
    if (password !== transporter.password) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password. Please try again." 
      });
    }

    // Generate JWT token (in real app)
    const token = generateToken(transporter._id);

    // Successful login response
    res.json({
      success: true,
      message: "Login successful!",
@@ -826,15 +1228,13 @@ app.post('/api/transporter/register', async (req, res) => {
      profileImage
    } = req.body;

    // Validation
    if (!fullName || !companyName || !phone || !country || !city || !zone || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required." 
      });
    }

    // Name validation
    const nameRegex = /^[A-Za-z ]{2,50}$/;
    if (!nameRegex.test(fullName)) {
      return res.status(400).json({ 
@@ -843,7 +1243,6 @@ app.post('/api/transporter/register', async (req, res) => {
      });
    }

    // Phone validation
    const phoneRegex = /^[0-9+]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
@@ -852,7 +1251,6 @@ app.post('/api/transporter/register', async (req, res) => {
      });
    }

    // Location validation
    const textRegex = /^[A-Za-z0-9, ]{1,100}$/;
    if (!textRegex.test(country) || !textRegex.test(city) || !textRegex.test(zone)) {
      return res.status(400).json({ 
@@ -861,7 +1259,6 @@ app.post('/api/transporter/register', async (req, res) => {
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
@@ -870,7 +1267,6 @@ app.post('/api/transporter/register', async (req, res) => {
      });
    }

    // Password validation
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({ 
@@ -886,7 +1282,6 @@ app.post('/api/transporter/register', async (req, res) => {
      });
    }

    // Check if email already exists
    const existingTransporter = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'transporter' 
@@ -899,14 +1294,12 @@ app.post('/api/transporter/register', async (req, res) => {
      });
    }

    // Create address from location fields
    const address = `${zone}, ${city}, ${country}`;

    // Create new transporter
    const newTransporter = new User({
      name: fullName,
      email: email.toLowerCase(),
      password: password, // In real app, hash this password
      password: password,
      role: 'transporter',
      phone: phone,
      company: companyName,
@@ -920,16 +1313,10 @@ app.post('/api/transporter/register', async (req, res) => {
      status: 'active'
    });

    // Save to database
    await newTransporter.save();

    // Generate JWT token
    const token = generateToken(newTransporter._id);

    // Send welcome email (in real app)
    // await sendWelcomeEmail(email, fullName);

    // Success response
    res.status(201).json({
      success: true,
      message: "Registration successful!",
@@ -974,18 +1361,13 @@ app.post('/api/transporter/forgot-password', async (req, res) => {
    });

    if (!transporter) {
      // For security, don't reveal if email exists or not
      return res.json({ 
        success: true, 
        message: "If the email exists, a password reset link will be sent." 
      });
    }

    // Generate reset token (in real app)
    const resetToken = generateResetToken(transporter._id);
    
    // Send reset email (in real app)
    // await sendPasswordResetEmail(email, resetToken);

    res.json({ 
      success: true, 
@@ -1020,7 +1402,6 @@ app.post('/api/transporter/reset-password', async (req, res) => {
      });
    }

    // Verify reset token (in real app)
    const transporterId = verifyResetToken(token);

    if (!transporterId) {
@@ -1030,9 +1411,8 @@ app.post('/api/transporter/reset-password', async (req, res) => {
      });
    }

    // Update password
    await User.findByIdAndUpdate(transporterId, { 
      password: newPassword // In real app, hash this password
      password: newPassword
    });

    res.json({ 
@@ -1076,7 +1456,6 @@ app.get('/api/transporter/check-email/:email', async (req, res) => {

// Generate JWT Token (simplified version)
const generateToken = (userId) => {
  // In real app, use jsonwebtoken library
  return `transporter_token_${userId}_${Date.now()}`;
};

@@ -1087,303 +1466,26 @@ const generateResetToken = (userId) => {

// Verify Reset Token (simplified version)
const verifyResetToken = (token) => {
  // In real app, verify JWT token
  const parts = token.split('_');
  return parts[2]; // return userId
};

// Passenger Schema
const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  cnic: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'passenger' },
  pickup: { type: String, default: 'N/A' },
  dropoff: { type: String, default: 'N/A' },
  status: { type: String, default: 'Pending' },
  image: { type: String, default: 'https://randomuser.me/api/portraits/women/79.jpg' },
  attendanceStatus: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Passenger = mongoose.model('Passenger', passengerSchema);

// Image Upload Configuration
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
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
  return parts[2];
};

// Routes

// Register Passenger
app.post('/api/passengers/register', async (req, res) => {
  try {
    const { name, email, mobile, cnic, password, pickup, dropoff } = req.body;

    // Check if passenger already exists
    const existingPassenger = await Passenger.findOne({ 
      $or: [{ email }, { cnic }] 
    });

    if (existingPassenger) {
      return res.status(400).json({ 
        message: 'Passenger with this email or CNIC already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new passenger
    const passenger = new Passenger({
      name,
      email,
      mobile,
      cnic,
      password: hashedPassword,
      pickup: pickup || 'N/A',
      dropoff: dropoff || 'N/A'
    });

    await passenger.save();

    // Create token
    const token = jwt.sign(
      { userId: passenger._id, role: passenger.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Passenger registered successfully',
      token,
      passenger: {
        id: passenger._id,
        name: passenger.name,
        email: passenger.email,
        mobile: passenger.mobile,
        cnic: passenger.cnic,
        role: passenger.role,
        pickup: passenger.pickup,
        dropoff: passenger.dropoff,
        status: passenger.status,
        image: passenger.image
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login Passenger
app.post('/api/passengers/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find passenger
    const passenger = await Passenger.findOne({ email });
    if (!passenger) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, passenger.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: passenger._id, role: passenger.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      passenger: {
        id: passenger._id,
        name: passenger.name,
        email: passenger.email,
        mobile: passenger.mobile,
        cnic: passenger.cnic,
        role: passenger.role,
        pickup: passenger.pickup,
        dropoff: passenger.dropoff,
        status: passenger.status,
        image: passenger.image,
        attendanceStatus: passenger.attendanceStatus
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get Passenger Profile
app.get('/api/passengers/profile', authMiddleware, async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.user.userId).select('-password');
    
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    res.json({ passenger });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Passenger Profile
app.put('/api/passengers/profile', authMiddleware, async (req, res) => {
  try {
    const { name, mobile, pickup, dropoff } = req.body;
    
    const passenger = await Passenger.findByIdAndUpdate(
      req.user.userId,
      { 
        name, 
        mobile, 
        pickup: pickup || 'N/A', 
        dropoff: dropoff || 'N/A' 
      },
      { new: true }
    ).select('-password');

    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      passenger
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Update Profile Picture
app.put('/api/passengers/profile-picture', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const passenger = await Passenger.findByIdAndUpdate(
      req.user.userId,
      { image: imageUrl },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile picture updated successfully',
      passenger
    });
  } catch (error) {
    console.error('Profile picture update error:', error);
    res.status(500).json({ message: 'Server error during profile picture update' });
  }
});

// Update Attendance Status
app.put('/api/passengers/attendance', authMiddleware, async (req, res) => {
  try {
    const { attendanceStatus } = req.body;
    
    const validStatuses = ['Yes - Traveling', 'No - Not Traveling', 'Pending'];
    if (!validStatuses.includes(attendanceStatus)) {
      return res.status(400).json({ message: 'Invalid attendance status' });
    }

    const passenger = await Passenger.findByIdAndUpdate(
      req.user.userId,
      { attendanceStatus },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Attendance status updated successfully',
      passenger
    });
  } catch (error) {
    console.error('Attendance update error:', error);
    res.status(500).json({ message: 'Server error during attendance update' });
  }
});

// Get All Passengers (for admin)
app.get('/api/passengers', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
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

    const passengers = await Passenger.find().select('-password');
    res.json({ passengers });
  } catch (error) {
    console.error('Get passengers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
  });
});












app.listen(PORT, () => {
  console.log(`🚀 Transporter Server running on http://localhost:${PORT}`);
});
