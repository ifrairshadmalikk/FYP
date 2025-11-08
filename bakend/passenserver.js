const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/passenger_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Passenger Schema
const passengerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  emergencyContact: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Hash password before saving
passengerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
passengerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Passenger = mongoose.model('Passenger', passengerSchema);


// JWT Token Generator
const generateToken = (userId) => {
  return jwt.sign(
    { userId, type: 'passenger' },
    process.env.JWT_SECRET || 'your-secret-key-12345',
    { expiresIn: '30d' }
  );
};

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-12345');
    const passenger = await Passenger.findById(decoded.userId).select('-password');
    
    if (!passenger) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
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

// API Routes

// ✅ Check Existing Login
app.get('/api/auth/check', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      passenger: {
        id: req.passenger._id,
        email: req.passenger.email,
        fullName: req.passenger.fullName,
        phone: req.passenger.phone,
        isVerified: req.passenger.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while checking authentication'
    });
  }
});

// ✅ Passenger Login
app.post('/api/auth/login', async (req, res) => {
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
    const passenger = await Passenger.findOne({ email: email.toLowerCase() });
    
    if (!passenger) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await passenger.comparePassword(password);
    
    if (!isPasswordValid) {
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
        fullName: passenger.fullName,
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
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, address, emergencyContact, dateOfBirth } = req.body;

    // Validation
    if (!email || !password || !fullName) {
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
    const existingPassenger = await Passenger.findOne({ email: email.toLowerCase() });
    
    if (existingPassenger) {
      return res.status(409).json({
        success: false,
        message: 'Passenger with this email already exists'
      });
    }

    // Create new passenger
    const passenger = new Passenger({
      email: email.toLowerCase(),
      password,
      fullName,
      phone,
      address,
      emergencyContact,
      dateOfBirth
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
        fullName: passenger.fullName,
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

// ✅ Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    // Always return success for security
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
});

// ✅ Get Passenger Profile
app.get('/api/passenger/profile', authMiddleware, async (req, res) => {
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
app.put('/api/passenger/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, address, emergencyContact, dateOfBirth } = req.body;
    
    const updatedPassenger = await Passenger.findByIdAndUpdate(
      req.passenger._id,
      { fullName, phone, address, emergencyContact, dateOfBirth },
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

// Alert Schema (پہلے سے موجود ہے، صرف تصدیق کریں)
const alertSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger',
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

// ✅ Get Alerts for Passenger
app.get('/api/alerts', authMiddleware, async (req, res) => {
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
app.put('/api/alerts/:alertId/read', authMiddleware, async (req, res) => {
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
app.put('/api/alerts/mark-all-read', authMiddleware, async (req, res) => {
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

// ✅ Create Alert (ٹرانسپورٹر/ڈرائیور کے لیے)
app.post('/api/alerts', authMiddleware, async (req, res) => {
  try {
    const { 
      passengerId, 
      title, 
      message, 
      type = 'info', 
      category = 'system', 
      actionRequired = false,
      metadata = {} 
    } = req.body;

    // Validation
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    const alert = new Alert({
      passengerId: passengerId || req.passenger._id,
      title,
      message,
      type,
      category,
      actionRequired,
      metadata
    });

    await alert.save();

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      alert
    });

  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating alert'
    });
  }
});

// Helper functions for date formatting
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

// ✅ Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Passenger App Server is running',
    timestamp: new Date().toISOString()
  });
});


let notifications = [
  {
    id: '1',
    title: 'Payment Successful 💰',
    message: 'Your monthly subscription payment of Rs. 10,000 has been processed successfully.',
    type: 'success',
    category: 'payment',
    icon: 'checkmark-circle',
    read: false,
    time: '2 hours ago'
  },
  {
    id: '2', 
    title: 'Trip Scheduled 🚗',
    message: 'Your van trip for tomorrow at 8:00 AM has been confirmed with driver Ali Ahmed.',
    type: 'info',
    category: 'trip',
    icon: 'car',
    read: false,
    time: '1 day ago'
  },
  {
    id: '3',
    title: 'Driver Update 👨‍💼',
    message: 'Your regular driver has been changed. New driver: Muhammad Hassan.',
    type: 'warning', 
    category: 'driver',
    icon: 'person',
    read: true,
    time: '2 days ago'
  },
  {
    id: '4',
    title: 'Route Change 🗺️',
    message: 'Due to road construction, your pickup location has been temporarily changed.',
    type: 'warning',
    category: 'route', 
    icon: 'map',
    read: false,
    time: '3 days ago'
  },
  {
    id: '5',
    title: 'Welcome to VanPool! 🎉',
    message: 'Thank you for choosing VanPool for your daily commute. We are excited to serve you.',
    type: 'success',
    category: 'system',
    icon: 'heart',
    read: true,
    time: '1 week ago'
  }
];

// ============ ROUTES ============

// ✅ Health Check
app.get('/api/health', (req, res) => {
  console.log('✅ Health check called');
  res.json({
    success: true,
    message: 'OPEN Notification Server is running!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Get Notifications (COMPLETELY OPEN - NO AUTH)
app.get('/api/notifications', (req, res) => {
  try {
    const { category } = req.query;
    
    console.log('📨 Fetching notifications (open access)...');
    
    let filteredNotifications = notifications;
    if (category && category !== 'all') {
      filteredNotifications = notifications.filter(n => n.category === category);
    }

    console.log(`✅ Sending ${filteredNotifications.length} notifications`);

    res.json({
      success: true,
      notifications: filteredNotifications,
      counts: {
        total: filteredNotifications.length,
        unread: filteredNotifications.filter(n => !n.read).length
      }
    });

  } catch (error) {
    console.error('❌ Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load notifications'
    });
  }
});

// ✅ Mark Notification as Read (OPEN)
app.put('/api/notifications/:notificationId/read', (req, res) => {
  try {
    const { notificationId } = req.params;

    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notifications[notificationIndex].read = true;

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification'
    });
  }
});

// ✅ Mark All Notifications as Read (OPEN)
app.put('/api/notifications/mark-all-read', (req, res) => {
  try {
    notifications = notifications.map(n => ({ ...n, read: true }));

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notifications'
    });
  }
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚗 Passenger App Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Web Interface: http://localhost:${PORT}/`);
  console.log(`📍 Alerts API: http://localhost:${PORT}/api/alerts`);
});