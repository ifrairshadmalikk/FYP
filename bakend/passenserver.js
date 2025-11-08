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

// Alert Schema
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

// ✅ ALERTS ROUTES

// ✅ Get Alerts for Passenger
app.get('/api/alerts', authMiddleware, async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    
    let query = { passengerId: req.passenger._id };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Format dates for frontend
    const formattedAlerts = alerts.map(alert => {
      const now = new Date();
      const alertDate = new Date(alert.createdAt);
      const diffTime = Math.abs(now - alertDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let dateDisplay = '';
      if (diffDays === 1) {
        dateDisplay = 'Today';
      } else if (diffDays === 2) {
        dateDisplay = 'Yesterday';
      } else if (diffDays <= 7) {
        dateDisplay = `${diffDays - 1} days ago`;
      } else {
        dateDisplay = alertDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }

      const timeDisplay = alertDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      return {
        ...alert,
        id: alert._id.toString(),
        date: dateDisplay,
        time: timeDisplay
      };
    });

    res.json({
      success: true,
      alerts: formattedAlerts,
      total: formattedAlerts.length,
      unreadCount: formattedAlerts.filter(alert => !alert.read).length
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

// ✅ Create Sample Alerts (Optional - for testing)
app.post('/api/alerts/sample', authMiddleware, async (req, res) => {
  try {
    const sampleAlerts = [
      {
        passengerId: req.passenger._id,
        title: 'Travel Confirmation Required',
        message: 'Please confirm your travel plans for tomorrow morning by 8:00 PM today',
        type: 'urgent',
        category: 'travel',
        icon: 'warning',
        actionRequired: true,
        metadata: { tripId: '12345' }
      },
      {
        passengerId: req.passenger._id,
        title: 'Van Arriving Soon',
        message: 'Your van is 5 minutes away from your pickup location. Please be ready.',
        type: 'info',
        category: 'ride',
        icon: 'bus',
        actionRequired: false,
        metadata: { driverId: '67890', eta: '5 minutes' }
      },
      {
        passengerId: req.passenger._id,
        title: 'Subscription Renewal Due',
        message: 'Your monthly subscription plan needs renewal to continue using our services without interruption.',
        type: 'warning',
        category: 'payment',
        icon: 'card',
        actionRequired: true,
        metadata: { dueDate: '2024-01-20' }
      }
    ];

    await Alert.insertMany(sampleAlerts);

    res.json({
      success: true,
      message: 'Sample alerts created successfully'
    });

  } catch (error) {
    console.error('Create sample alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating sample alerts'
    });
  }
});

// ✅ Delete Alert
app.delete('/api/alerts/:alertId', authMiddleware, async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findOneAndDelete({
      _id: alertId,
      passengerId: req.passenger._id
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });

  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting alert'
    });
  }
});

// ✅ Get Alert Statistics
app.get('/api/alerts/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await Alert.aggregate([
      { $match: { passengerId: req.passenger._id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] }
          }
        }
      }
    ]);

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
      stats: {
        total: totalAlerts,
        unread: unreadCount,
        actionRequired: actionRequiredCount,
        byCategory: stats
      }
    });

  } catch (error) {
    console.error('Get alert stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching alert statistics'
    });
  }
});

// Serve React Native app static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Passenger App Server is running', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚗 Passenger App Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Web Interface: http://localhost:${PORT}/`);
  console.log(`📍 Alerts API: http://localhost:${PORT}/api/alerts`);
});