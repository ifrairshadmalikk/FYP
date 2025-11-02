import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
  Animated,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Define colors
const COLORS = {
  primary: '#afd826',
  primaryDark: '#8fb320',
  primaryLight: '#d4e99e',
  success: '#28a745',
  warning: '#f39c12',
  danger: '#dc3545',
  white: '#ffffff',
  black: '#111111',
  gray: '#6c757d',
  lightGray: '#f8f9fa',
  border: '#e0e0e0',
  darkGray: '#495057',
};

// Predefined stop coordinates
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
  'Van 1 Markaz': { latitude: 33.6844, longitude: 73.0479 },
  'Van 2 Markaz': { latitude: 33.6844, longitude: 73.0479 },
  'Van 3 Markaz': { latitude: 33.6844, longitude: 73.0479 },
};

// API Service with proper error handling
const apiService = {
  getProfile: async () => {
    try {
      return {
        name: 'Transporter Name',
        email: 'transporter@example.com',
        phone: '0300-1234567',
        company: 'ABC Transport',
        license: 'TRN-123456',
        address: '123 Main St, Islamabad',
        registrationDate: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Failed to load profile');
    }
  },
  
  getStats: async () => {
    try {
      return {
        activeDrivers: 2,
        totalPassengers: 12,
        completedTrips: 7,
        ongoingTrips: 1,
        complaints: 1,
        paymentsReceived: 45000,
        paymentsPending: 15000,
      };
    } catch (error) {
      throw new Error('Failed to load stats');
    }
  },
  
  getDrivers: async () => {
    try {
      return [
        { _id: 1, name: 'Ahmed Khan', van: 'Van 1 (Toyota Hiace)', status: 'Available', availableTimeSlots: ['07:00 AM', '07:30 AM'], capacity: 8, phone: '0310-1234567', experience: '5 years' },
        { _id: 2, name: 'Hassan Ali', van: 'Van 2 (Suzuki Every)', status: 'Assigned', availableTimeSlots: [], capacity: 6, phone: '0311-2345678', experience: '3 years' },
        { _id: 3, name: 'Usman Tariq', van: 'Van 3 (Toyota Hiace)', status: 'Available', availableTimeSlots: ['08:00 AM'], capacity: 8, phone: '0312-3456789', experience: '4 years' },
      ];
    } catch (error) {
      throw new Error('Failed to load drivers');
    }
  },
  
  getPassengers: async () => {
    try {
      return [
        { _id: 1, name: 'Ali Hassan', status: 'Confirmed', selectedTimeSlot: '07:00 AM', location: 'F-7, Islamabad', pickupPoint: 'F-7 Markaz', phone: '0300-1234567', paymentStatus: 'Paid', amount: 5000, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), lastPaymentDate: new Date().toISOString() },
        { _id: 2, name: 'Fatima Khan', status: 'Confirmed', selectedTimeSlot: '07:30 AM', location: 'F-8, Islamabad', pickupPoint: 'F-8 Markaz', phone: '0301-2345678', paymentStatus: 'Paid', amount: 5000, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), lastPaymentDate: new Date().toISOString() },
        { _id: 3, name: 'Bilal Ahmed', status: 'Confirmed', selectedTimeSlot: '07:00 AM', location: 'Chaklala, Rawalpindi', pickupPoint: 'Chaklala Bus Stop', phone: '0302-3456789', paymentStatus: 'Pending', amount: 5000, expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), lastPaymentDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString() },
        { _id: 4, name: 'Sara Ali', status: 'Not Confirmed', selectedTimeSlot: null, location: 'G-11, Islamabad', pickupPoint: 'G-11 Markaz', phone: '0303-4567890', paymentStatus: 'Expired', amount: 5000, expiryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), lastPaymentDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() },
      ];
    } catch (error) {
      throw new Error('Failed to load passengers');
    }
  },
  
  getRoutes: async () => {
    try {
      return [
        { _id: 1, name: 'Route 1: Chaklala → Gulberg Greens', stops: ['Chaklala Bus Stop', 'Korang Road', 'Scheme 3', 'PWD Housing'], destination: 'Gulberg Greens', assignedDriver: { name: 'Ahmed Khan' }, timeSlot: '07:00 AM', distance: '18 km', duration: '35 min', passengers: [{ name: 'Ali Hassan' }, { name: 'Bilal Ahmed' }] },
        { _id: 2, name: 'Route 2: F-Sectors → Gulberg Greens', stops: ['F-7 Markaz', 'F-8 Markaz', 'F-10 Markaz', 'I-10 Markaz'], destination: 'Gulberg Greens', assignedDriver: { name: 'Hassan Ali' }, timeSlot: '07:30 AM', distance: '15 km', duration: '30 min', passengers: [{ name: 'Fatima Khan' }] },
      ];
    } catch (error) {
      throw new Error('Failed to load routes');
    }
  },
  
  getPolls: async () => {
    try {
      return [
        { _id: 1, title: "Tomorrow's Travel Poll - October 24", timeSlots: ['07:00 AM', '07:30 AM', '08:00 AM'], responses: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}], closesAt: "22:00", active: true, createdAt: new Date().toISOString() },
      ];
    } catch (error) {
      throw new Error('Failed to load polls');
    }
  },
  
  getPayments: async (type) => {
    try {
      return type === 'driver' ? [
        { _id: 1, driverId: { name: 'Ahmed Khan' }, amount: 15000, mode: 'Bank Transfer', status: 'Confirmed', month: 'October 2025', createdAt: new Date().toISOString() },
      ] : [];
    } catch (error) {
      throw new Error('Failed to load payments');
    }
  },
  
  getComplaints: async () => {
    try {
      return [
        { _id: 1, by: 'Passenger', byName: 'Ali Hassan', title: 'Late pickup', description: 'Driver was 15 minutes late at F-7 Markaz', status: 'Open', createdAt: new Date().toISOString(), replies: [] },
      ];
    } catch (error) {
      throw new Error('Failed to load complaints');
    }
  },
  
  getNotifications: async () => {
    try {
      return [
        { _id: 1, title: 'New Complaint', message: 'Ali Hassan complained about late pickup.', icon: 'warning', color: '#dc3545', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { _id: 2, title: 'Payment Received', message: 'Received PKR 5000 from Fatima Khan.', icon: 'payment', color: '#28a745', read: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
      ];
    } catch (error) {
      throw new Error('Failed to load notifications');
    }
  },
  
  getJoinRequests: async (type) => {
    try {
      return type === 'driver' ? [
        { _id: 1, name: 'Kamran Shah', experience: '6 years', vehicle: 'Toyota Hiace 2018', capacity: 10, availableTimeSlots: ['07:00 AM', '08:00 AM', '05:00 PM'], phone: '0313-4567890', license: 'LHR-1234567' },
      ] : [
        { _id: 1, name: 'Zainab Malik', location: 'G-10, Islamabad', pickupPoint: 'G-10 Markaz', preferredTimeSlot: '07:30 AM', phone: '0314-5678901', destination: 'Gulberg Greens' },
      ];
    } catch (error) {
      throw new Error('Failed to load join requests');
    }
  },
  
  createPoll: async (data) => {
    try {
      console.log('Creating poll:', data);
      // Validate required fields
      if (!data.title || !data.timeSlots || !data.closesAt) {
        throw new Error('All poll fields are required');
      }
      if (!Array.isArray(data.timeSlots) || data.timeSlots.length === 0) {
        throw new Error('At least one time slot is required');
      }
      return { success: true, poll: { ...data, _id: Date.now(), createdAt: new Date().toISOString() } };
    } catch (error) {
      throw new Error(error.message || 'Failed to create poll');
    }
  },
  
  createRoute: async (data) => {
    try {
      console.log('Creating route:', data);
      if (!data.name || !data.stops) {
        throw new Error('Route name and stops are required');
      }
      return { success: true, route: { ...data, _id: Date.now(), createdAt: new Date().toISOString() } };
    } catch (error) {
      throw new Error(error.message || 'Failed to create route');
    }
  },
  
  assignDriverToRoute: async (routeId, data) => {
    try {
      console.log('Assigning driver to route:', routeId, data);
      if (!routeId || !data.driverId || !data.timeSlot) {
        throw new Error('Route ID, driver ID, and time slot are required');
      }
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to assign driver');
    }
  },
  
  acceptJoinRequest: async (requestId) => {
    try {
      console.log('Accepting join request:', requestId);
      if (!requestId) {
        throw new Error('Request ID is required');
      }
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to accept request');
    }
  },
  
  rejectJoinRequest: async (requestId) => {
    try {
      console.log('Rejecting join request:', requestId);
      if (!requestId) {
        throw new Error('Request ID is required');
      }
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to reject request');
    }
  },
  
  createPayment: async (data) => {
    try {
      console.log('Creating payment:', data);
      if (!data.type || !data.amount || !data.mode) {
        throw new Error('Payment type, amount, and mode are required');
      }
      if (data.type === 'driver' && !data.driverId) {
        throw new Error('Driver ID is required for driver payments');
      }
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to create payment');
    }
  },
  
  updateProfile: async (data) => {
    try {
      console.log('Updating profile:', data);
      if (!data.name || !data.email || !data.phone) {
        throw new Error('Name, email, and phone are required');
      }
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },
  
  resolveComplaint: async (complaintId) => {
    try {
      console.log('Resolving complaint:', complaintId);
      if (!complaintId) {
        throw new Error('Complaint ID is required');
      }
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to resolve complaint');
    }
  },
  
  replyToComplaint: async (complaintId, data) => {
    try {
      console.log('Replying to complaint:', complaintId, data);
      if (!complaintId || !data.text) {
        throw new Error('Complaint ID and reply text are required');
      }
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to reply to complaint');
    }
  },
  
  autoAssign: async () => {
    try {
      // Mock auto-assignment data
      return {
        assignments: [
          {
            driver: { _id: 1, name: 'Ahmed Khan', van: 'Van 1 (Toyota Hiace)', capacity: 8 },
            passengers: [
              { _id: 1, name: 'Ali Hassan', pickupPoint: 'F-7 Markaz', selectedTimeSlot: '07:00 AM' },
              { _id: 3, name: 'Bilal Ahmed', pickupPoint: 'Chaklala Bus Stop', selectedTimeSlot: '07:00 AM' },
            ],
            totalDistance: 18.5,
            estimatedTime: 35,
            utilization: '75',
            efficiencyScore: '85',
          }
        ],
        unassigned: []
      };
    } catch (error) {
      throw new Error('Auto-assignment failed');
    }
  },
};

const TransporterDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [paymentTab, setPaymentTab] = useState('driver');
  const [responseTab, setResponseTab] = useState('passenger');
  const [slideAnim] = useState(new Animated.Value(-250));
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Transporter Name',
    email: 'transporter@example.com',
    phone: '0300-1234567',
    company: 'ABC Transport',
    registrationDate: '15 Jan 2023',
    license: 'TRN-123456',
    address: '123 Main St, Islamabad',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Dashboard Stats
  const [stats, setStats] = useState({
    activeDrivers: 0,
    totalPassengers: 0,
    completedTrips: 0,
    ongoingTrips: 0,
    complaints: 0,
    paymentsReceived: 0,
    paymentsPending: 0,
  });

  // Custom Time Slots for Polls
  const [customTimeSlots, setCustomTimeSlots] = useState(['07:00 AM', '07:30 AM', '08:00 AM']);
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // Poll State
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({
    title: '',
    selectedSlots: [],
    closingTime: '',
  });

  // Passenger Responses
  const [passengerResponses, setPassengerResponses] = useState([]);

  // Driver Availability
  const [driverAvailability, setDriverAvailability] = useState([]);

  // Routes
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({ name: '', stops: '' });

  // Driver & Passenger Requests
  const [driverRequests, setDriverRequests] = useState([]);
  const [passengerRequests, setPassengerRequests] = useState([]);

  // Payments
  const [driverPayments, setDriverPayments] = useState([]);
  const [passengerPayments, setPassengerPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({ driver: '', amount: '', mode: 'Cash' });

  // Complaints
  const [complaints, setComplaints] = useState([]);
  const [newReply, setNewReply] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Live Tracking
  const [vans, setVans] = useState([]);
  const [trips, setTrips] = useState([]);

  // Auto Assignment
  const [autoAssignments, setAutoAssignments] = useState([]);
  const [unassignedInAuto, setUnassignedInAuto] = useState([]);
  const [selectedAutoRoute, setSelectedAutoRoute] = useState(null);
  const [viewMode, setViewMode] = useState('manual');

  const vanPositions = useRef({}).current;

  // ==================== HELPER FUNCTIONS ====================

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9+\-\s()]{10,}$/;
    return re.test(phone);
  };

  const validateTimeSlot = (time) => {
    const re = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    return re.test(time);
  };

  // ==================== API FUNCTIONS ====================

  // Load Profile from Backend
  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getProfile();
      setProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        license: data.license,
        address: data.address || '',
        registrationDate: new Date(data.registrationDate).toLocaleDateString(),
      });
    } catch (error) {
      console.error('Load profile error:', error);
      Alert.alert('Error', error.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Load Dashboard Stats
  const loadStats = async () => {
    try {
      const data = await apiService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Load stats error:', error);
      Alert.alert('Error', error.message || 'Failed to load stats');
    }
  };

  // Load Drivers
  const loadDrivers = async () => {
    try {
      const data = await apiService.getDrivers();
      setDriverAvailability(data.map(d => ({
        id: d._id,
        name: d.name,
        van: d.van || 'Van',
        status: d.status,
        availableTimeSlots: d.availableTimeSlots || [],
        capacity: d.capacity,
        contact: d.phone,
        experience: d.experience || 'N/A',
      })));
    } catch (error) {
      console.error('Load drivers error:', error);
      Alert.alert('Error', error.message || 'Failed to load drivers');
    }
  };

  // Load Passengers
  const loadPassengers = async () => {
    try {
      const data = await apiService.getPassengers();
      setPassengerResponses(data.map(p => ({
        id: p._id,
        name: p.name,
        status: p.status,
        selectedTimeSlot: p.selectedTimeSlot,
        location: p.location,
        pickupPoint: p.pickupPoint,
        contact: p.phone,
      })));
      
      setPassengerPayments(data.map(p => ({
        id: p._id,
        passenger: p.name,
        status: p.paymentStatus,
        amount: p.amount || 5000,
        expiryDate: p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : 'N/A',
        lastPaymentDate: p.lastPaymentDate ? new Date(p.lastPaymentDate).toLocaleDateString() : 'N/A',
        location: p.location,
      })));
    } catch (error) {
      console.error('Load passengers error:', error);
      Alert.alert('Error', error.message || 'Failed to load passengers');
    }
  };

  // Load Routes
  const loadRoutes = async () => {
    try {
      const data = await apiService.getRoutes();
      setRoutes(data.map(r => ({
        id: r._id,
        name: r.name,
        stops: r.stops,
        destination: r.destination,
        assignedDriver: r.assignedDriver?.name,
        timeSlot: r.timeSlot,
        distance: r.distance,
        duration: r.duration,
        passengers: r.passengers?.map(p => p.name) || [],
      })));
    } catch (error) {
      console.error('Load routes error:', error);
      Alert.alert('Error', error.message || 'Failed to load routes');
    }
  };

  // Load Polls
  const loadPolls = async () => {
    try {
      const data = await apiService.getPolls();
      setPolls(data.map(p => ({
        id: p._id,
        title: p.title,
        timeSlots: p.timeSlots,
        responses: p.responses?.length || 0,
        total: passengerResponses.length,
        closesAt: p.closesAt,
        active: p.active,
        date: new Date(p.createdAt).toLocaleDateString(),
      })));
    } catch (error) {
      console.error('Load polls error:', error);
      Alert.alert('Error', error.message || 'Failed to load polls');
    }
  };

  // Load Payments
  const loadPayments = async () => {
    try {
      const driverPaymentsData = await apiService.getPayments('driver');
      setDriverPayments(driverPaymentsData.map(p => ({
        id: p._id,
        driver: p.driverId?.name || 'Unknown',
        amount: p.amount,
        mode: p.mode,
        date: new Date(p.createdAt).toLocaleDateString(),
        status: p.status,
        month: p.month,
      })));
    } catch (error) {
      console.error('Load payments error:', error);
      Alert.alert('Error', error.message || 'Failed to load payments');
    }
  };

  // Load Complaints
  const loadComplaints = async () => {
    try {
      const data = await apiService.getComplaints();
      setComplaints(data.map(c => ({
        id: c._id,
        by: c.by,
        byName: c.byName,
        title: c.title,
        description: c.description,
        status: c.status,
        date: new Date(c.createdAt).toLocaleDateString(),
        time: new Date(c.createdAt).toLocaleTimeString(),
        replies: c.replies || [],
      })));
    } catch (error) {
      console.error('Load complaints error:', error);
      Alert.alert('Error', error.message || 'Failed to load complaints');
    }
  };

  // Load Notifications
  const loadNotifications = async () => {
    try {
      const data = await apiService.getNotifications();
      setNotifications(data.map(n => ({
        id: n._id,
        title: n.title,
        message: n.message,
        timestamp: new Date(n.createdAt),
        icon: n.icon || 'notifications',
        color: n.color || COLORS.primary,
        read: n.read,
      })));
    } catch (error) {
      console.error('Load notifications error:', error);
      Alert.alert('Error', error.message || 'Failed to load notifications');
    }
  };

  // Load Join Requests
  const loadJoinRequests = async () => {
    try {
      const driverReqs = await apiService.getJoinRequests('driver');
      setDriverRequests(driverReqs.map(r => ({
        id: r._id,
        name: r.name,
        experience: r.experience,
        vehicle: r.vehicle,
        capacity: r.capacity,
        availableTimeSlots: r.availableTimeSlots || [],
        contact: r.phone,
        license: r.license,
      })));

      const passengerReqs = await apiService.getJoinRequests('passenger');
      setPassengerRequests(passengerReqs.map(r => ({
        id: r._id,
        name: r.name,
        location: r.location,
        pickupPoint: r.pickupPoint,
        preferredTimeSlot: r.preferredTimeSlot,
        contact: r.phone,
        destination: r.destination,
      })));
    } catch (error) {
      console.error('Load join requests error:', error);
      Alert.alert('Error', error.message || 'Failed to load join requests');
    }
  };

  // Load All Data
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadProfile(),
        loadStats(),
        loadDrivers(),
        loadPassengers(),
        loadRoutes(),
        loadPolls(),
        loadPayments(),
        loadComplaints(),
        loadNotifications(),
        loadJoinRequests(),
      ]);
    } catch (error) {
      console.error('Load all data error:', error);
      Alert.alert('Error', error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize van positions
  useEffect(() => {
    const initialVans = [
      {
        id: 1,
        name: 'Van 1',
        driver: 'Ahmed Khan',
        route: 'Route 1',
        timeSlot: '07:00 AM',
        status: 'Completed',
        passengers: 6,
        capacity: 8,
        currentStop: 'Gulberg Greens',
        stops: ['Chaklala Bus Stop', 'Korang Road', 'Scheme 3', 'PWD Housing', 'Gulberg Greens'],
        completedStops: ['Chaklala Bus Stop', 'Korang Road', 'Scheme 3', 'PWD Housing', 'Gulberg Greens'],
        currentLocation: stopCoordinates['Gulberg Greens'],
        speed: 0,
        eta: '0 min',
        color: '#3498DB',
        passengersList: [
          { name: 'Ali Hassan', status: 'picked', pickupTime: '7:00 AM' },
          { name: 'Bilal Ahmed', status: 'picked', pickupTime: '7:10 AM' },
        ],
        notifiedPickups: false,
        notifiedComplete: false,
      },
      {
        id: 2,
        name: 'Van 2',
        driver: 'Hassan Ali',
        route: 'Route 2',
        timeSlot: '07:30 AM',
        status: 'Paused',
        passengers: 3,
        capacity: 6,
        currentStop: 'F-10 Markaz',
        stops: ['F-7 Markaz', 'F-8 Markaz', 'F-10 Markaz', 'I-10 Markaz', 'Gulberg Greens'],
        completedStops: ['F-7 Markaz', 'F-8 Markaz', 'F-10 Markaz'],
        currentLocation: stopCoordinates['F-10 Markaz'],
        speed: 0,
        eta: 'Paused',
        color: '#E74C3C',
        passengersList: [
          { name: 'Fatima Khan', status: 'picked', pickupTime: '7:30 AM' },
        ],
        notifiedPickups: false,
        notifiedComplete: false,
      },
      {
        id: 3,
        name: 'Van 3',
        driver: 'Usman Tariq',
        route: 'Route 1',
        timeSlot: '08:00 AM',
        status: 'En Route',
        passengers: 4,
        capacity: 8,
        currentStop: 'Korang Road',
        stops: ['Chaklala Bus Stop', 'Korang Road', 'Scheme 3', 'PWD Housing', 'Gulberg Greens'],
        completedStops: ['Chaklala Bus Stop'],
        currentLocation: stopCoordinates['Korang Road'],
        speed: 20,
        eta: '25 min',
        color: '#2ECC71',
        passengersList: [],
        notifiedPickups: false,
        notifiedComplete: false,
      },
    ];

    setVans(initialVans);
    
    // Initialize animated values
    initialVans.forEach(van => {
      vanPositions[van.id] = {
        latitude: new Animated.Value(van.currentLocation.latitude),
        longitude: new Animated.Value(van.currentLocation.longitude),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(1),
      };
    });
  }, []);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  // Sidebar animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? 0 : -250,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sidebarVisible]);

  // Real-time simulation for dashboard stats
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      loadStats();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    setLastUpdated(new Date());
  }, []);

  // ==================== POLL FUNCTIONS ====================
  
  const addCustomTimeSlot = () => {
    if (!newTimeSlot.trim()) {
      Alert.alert('Error', 'Please enter a time slot');
      return;
    }
    if (!validateTimeSlot(newTimeSlot)) {
      Alert.alert('Error', 'Please enter a valid time format (e.g., 09:00 AM)');
      return;
    }
    if (customTimeSlots.includes(newTimeSlot)) {
      Alert.alert('Error', 'This time slot already exists');
      return;
    }
    setCustomTimeSlots([...customTimeSlots, newTimeSlot]);
    setNewTimeSlot('');
    showSuccess('Time slot added successfully');
  };

  const toggleTimeSlot = slot => {
    setNewPoll(prev => ({
      ...prev,
      selectedSlots: prev.selectedSlots.includes(slot)
        ? prev.selectedSlots.filter(s => s !== slot)
        : [...prev.selectedSlots, slot],
    }));
  };

  const createPoll = async () => {
    if (!newPoll.title.trim()) {
      Alert.alert('Error', 'Please enter a poll title');
      return;
    }
    if (!newPoll.selectedSlots.length) {
      Alert.alert('Error', 'Please select at least one time slot');
      return;
    }
    if (!newPoll.closingTime.trim()) {
      Alert.alert('Error', 'Please enter a closing time');
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await apiService.createPoll({
        title: newPoll.title,
        timeSlots: newPoll.selectedSlots,
        closesAt: newPoll.closingTime,
        active: true,
      });
      
      setNewPoll({ title: '', selectedSlots: [], closingTime: '' });
      await loadPolls();
      showSuccess(`Poll created with ${newPoll.selectedSlots.length} time slots`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== ROUTE FUNCTIONS ====================
  
  const createRoute = async () => {
    if (!newRoute.name.trim()) {
      Alert.alert('Error', 'Please enter a route name');
      return;
    }
    if (!newRoute.stops.trim()) {
      Alert.alert('Error', 'Please enter route stops');
      return;
    }
    
    try {
      setIsLoading(true);
      await apiService.createRoute({
        name: newRoute.name,
        stops: newRoute.stops.split('\n').filter(s => s.trim()),
        destination: 'Gulberg Greens',
        distance: '15 km',
        duration: '30 min',
      });
      
      setNewRoute({ name: '', stops: '' });
      await loadRoutes();
      showSuccess('Route created successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const assignDriverToRoute = async (routeId, driverId, timeSlot) => {
    const driver = driverAvailability.find(d => d.id === driverId);
    const route = routes.find(r => r.id === routeId);
    
    if (!driver || !route) {
      Alert.alert('Error', 'Driver or route not found');
      return;
    }
    
    if (driver.status !== 'Available') {
      Alert.alert('Error', 'Driver is not available');
      return;
    }
    
    if (!driver.availableTimeSlots.includes(timeSlot)) {
      Alert.alert('Error', 'Driver is not available at this time slot');
      return;
    }
    
    const routePassengers = passengerResponses.filter(p => 
      p.status === 'Confirmed' && p.selectedTimeSlot === timeSlot
    );
    
    if (routePassengers.length > driver.capacity) {
      Alert.alert('Warning', `Capacity exceeded: ${routePassengers.length}/${driver.capacity}`);
    }
    
    try {
      setIsLoading(true);
      await apiService.assignDriverToRoute(routeId, {
        driverId,
        timeSlot,
        passengerIds: routePassengers.map(p => p.id),
      });
      
      await Promise.all([loadRoutes(), loadDrivers()]);
      showSuccess(`${driver.name} assigned to ${route.name} at ${timeSlot}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== REQUEST MANAGEMENT ====================
  
  const handleDriverRequest = async (requestId, action) => {
    try {
      setIsLoading(true);
      if (action === 'accept') {
        await apiService.acceptJoinRequest(requestId);
        await loadDrivers();
        showSuccess('Driver request accepted');
      } else {
        await apiService.rejectJoinRequest(requestId);
        Alert.alert('Rejected', 'Driver request rejected');
      }
      await loadJoinRequests();
      await loadStats();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassengerRequest = async (requestId, action) => {
    try {
      setIsLoading(true);
      if (action === 'accept') {
        await apiService.acceptJoinRequest(requestId);
        await loadPassengers();
        showSuccess('Passenger request accepted');
      } else {
        await apiService.rejectJoinRequest(requestId);
        Alert.alert('Rejected', 'Passenger request rejected');
      }
      await loadJoinRequests();
      await loadStats();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== PAYMENT FUNCTIONS ====================
  
  const sendDriverPayment = async () => {
    if (!newPayment.driver.trim()) {
      Alert.alert('Error', 'Please select a driver');
      return;
    }
    if (!newPayment.amount.trim() || isNaN(newPayment.amount) || parseFloat(newPayment.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!newPayment.mode.trim()) {
      Alert.alert('Error', 'Please select a payment mode');
      return;
    }
    
    try {
      setIsLoading(true);
      const driver = driverAvailability.find(d => d.name === newPayment.driver);
      if (!driver) {
        Alert.alert('Error', 'Driver not found');
        return;
      }
      
      await apiService.createPayment({
        type: 'driver',
        driverId: driver.id,
        amount: parseInt(newPayment.amount),
        mode: newPayment.mode,
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      });
      
      setNewPayment({ driver: '', amount: '', mode: 'Cash' });
      await loadPayments();
      await loadStats();
      showSuccess('Payment sent successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendRenewalNotification = passengerId => {
    showSuccess('Renewal reminder sent');
  };
  
  const sendPaymentReminder = passengerId => {
    showSuccess('Payment reminder sent');
  };
  
  const updatePaymentStatus = async (passengerId, newStatus) => {
    try {
      setIsLoading(true);
      await apiService.updateProfile({ 
        paymentStatus: newStatus 
      });
      
      await loadPassengers();
      await loadStats();
      showSuccess('Payment status updated');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== COMPLAINT FUNCTIONS ====================
  
  const resolveComplaint = async (complaintId) => {
    try {
      setIsLoading(true);
      await apiService.resolveComplaint(complaintId);
      await loadComplaints();
      await loadStats();
      showSuccess('Complaint resolved successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const replyToComplaint = async (complaintId) => {
    if (!newReply.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }
    
    try {
      setIsLoading(true);
      await apiService.replyToComplaint(complaintId, { text: newReply });
      setNewReply('');
      setSelectedResponse(null);
      await loadComplaints();
      showSuccess('Reply sent successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== PROFILE FUNCTIONS ====================
  
  const saveProfile = async () => {
    if (!profile.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!validateEmail(profile.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!validatePhone(profile.phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    if (!profile.company.trim()) {
      Alert.alert('Error', 'Please enter your company name');
      return;
    }
    
    try {
      setIsLoading(true);
      await apiService.updateProfile(profile);
      setIsEditingProfile(false);
      showSuccess('Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('token');
            Alert.alert('Logged Out', 'You have been logged out successfully');
            // Navigate to login screen
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        }
      }
    ]);
  };

  // ==================== AUTO ASSIGNMENT ====================
  
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

  const handleAutoAssignment = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.autoAssign();
      setAutoAssignments(data.assignments);
      setUnassignedInAuto(data.unassigned);
      showSuccess(`Generated ${data.assignments.length} optimized routes`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAutoRoute = async (index) => {
    const assignment = autoAssignments[index];
    if (!assignment) return;
    
    try {
      setIsLoading(true);
      
      // Create route
      const routeName = `Auto Route ${index + 1}: ${assignment.driver.van}`;
      const stops = assignment.passengers.map(p => p.pickupPoint);
      
      await apiService.createRoute({
        name: routeName,
        stops: stops,
        destination: 'Gulberg Greens',
        distance: assignment.totalDistance + ' km',
        duration: assignment.estimatedTime + ' min',
      });
      
      // Assign driver to route
      const routesData = await apiService.getRoutes();
      const newRoute = routesData[routesData.length - 1];
      
      await apiService.assignDriverToRoute(newRoute._id, {
        driverId: assignment.driver._id,
        timeSlot: assignment.passengers[0]?.selectedTimeSlot || '07:00 AM',
        passengerIds: assignment.passengers.map(p => p._id),
      });
      
      setAutoAssignments(prev => prev.map((a, i) => 
        i === index ? { ...a, status: 'approved' } : a
      ));
      
      await Promise.all([loadRoutes(), loadDrivers()]);
      showSuccess(`${assignment.driver.name} assigned to ${routeName}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAllAutoRoutes = async () => {
    if (autoAssignments.length === 0) {
      Alert.alert('No Routes', 'No routes to approve');
      return;
    }
    
    try {
      setIsLoading(true);
      for (let i = 0; i < autoAssignments.length; i++) {
        await handleApproveAutoRoute(i);
      }
      showSuccess('All routes approved and assigned!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get passengers/drivers by time slot
  const getPassengersByTimeSlot = timeSlot => 
    passengerResponses.filter(p => p.status === 'Confirmed' && p.selectedTimeSlot === timeSlot);
  
  const getDriversByTimeSlot = timeSlot => 
    driverAvailability.filter(d => d.availableTimeSlots.includes(timeSlot) && d.status === 'Available');

  // ==================== UI COMPONENTS ====================
  
  const StatCard = ({ label, value, iconName, color }) => (
    <View style={[styles.statCard, { borderColor: color, backgroundColor: COLORS.lightGray }]}>
      <Icon name={iconName} size={32} color={COLORS.gray} style={styles.statIcon} />
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: COLORS.gray }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: COLORS.gray }]}>{label}</Text>
      </View>
    </View>
  );

  const QuickActionCard = ({ iconName, title, onPress }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={styles.quickActionIcon}><Icon name={iconName} size={28} color="#000" /></View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.successModal}>
          <Icon name="check-circle" size={48} color={COLORS.success} />
          <Text style={styles.successModalText}>{successMessage}</Text>
        </View>
      </View>
    </Modal>
  );

  // ==================== SECTIONS ====================

  const ProfileSection = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Transporter Profile</Text>
      <View style={styles.card}>
        {isEditingProfile ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name *"
              value={profile.name}
              onChangeText={text => setProfile({ ...profile, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email *"
              value={profile.email}
              onChangeText={text => setProfile({ ...profile, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone *"
              value={profile.phone}
              onChangeText={text => setProfile({ ...profile, phone: text })}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Company *"
              value={profile.company}
              onChangeText={text => setProfile({ ...profile, company: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={profile.address}
              onChangeText={text => setProfile({ ...profile, address: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="License"
              value={profile.license}
              onChangeText={text => setProfile({ ...profile, license: text })}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={saveProfile}>
              <Text style={styles.primaryBtnText}>Save Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setIsEditingProfile(false)}>
              <Text style={styles.secondaryBtnText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Name:</Text>
              <Text style={styles.profileValue}>{profile.name}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Email:</Text>
              <Text style={styles.profileValue}>{profile.email}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Phone:</Text>
              <Text style={styles.profileValue}>{profile.phone}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Company:</Text>
              <Text style={styles.profileValue}>{profile.company}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Address:</Text>
              <Text style={styles.profileValue}>{profile.address}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>License:</Text>
              <Text style={styles.profileValue}>{profile.license}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Registration Date:</Text>
              <Text style={styles.profileValue}>{profile.registrationDate}</Text>
            </View>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setIsEditingProfile(true)}>
              <Text style={styles.primaryBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );

  const OverviewSection = () => (
    <ScrollView style={styles.section} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
      <Text style={styles.sectionTitle}>Today's Overview</Text>
      <Text style={styles.updateText}>
        Last Updated: {lastUpdated.toLocaleString('en-PK', { 
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
      
      <View style={styles.overviewGrid}>
        <View style={[styles.overviewCard, { backgroundColor: '#E8F5E9' }]}>
          <Icon name="directions-car" size={32} color="#4CAF50" />
          <Text style={styles.overviewValue}>{stats.activeDrivers}</Text>
          <Text style={styles.overviewLabel}>Active Drivers</Text>
        </View>
        <View style={[styles.overviewCard, { backgroundColor: '#E3F2FD' }]}>
          <Icon name="people" size={32} color="#2196F3" />
          <Text style={styles.overviewValue}>{stats.totalPassengers}</Text>
          <Text style={styles.overviewLabel}>Total Riders</Text>
        </View>
        <View style={[styles.overviewCard, { backgroundColor: '#FFF3E0' }]}>
          <Icon name="autorenew" size={32} color="#FF9800" />
          <Text style={styles.overviewValue}>{stats.ongoingTrips}</Text>
          <Text style={styles.overviewLabel}>Live Trips</Text>
        </View>
        <View style={[styles.overviewCard, { backgroundColor: '#F3E5F5' }]}>
          <Icon name="check-circle" size={32} color="#9C27B0" />
          <Text style={styles.overviewValue}>{stats.completedTrips}</Text>
          <Text style={styles.overviewLabel}>Completed</Text>
        </View>
      </View>
      
      <Text style={styles.sectionSubtitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <QuickActionCard iconName="poll" title="Create Poll" onPress={() => setActiveSection('poll')} />
        <QuickActionCard iconName="map" title="Routes" onPress={() => setActiveSection('routes')} />
        <QuickActionCard iconName="assignment-ind" title="Assign" onPress={() => setActiveSection('assign')} />
        <QuickActionCard iconName="my-location" title="Track Live" onPress={() => setActiveSection('tracking')} />
      </View>
      
      <Text style={styles.sectionSubtitle}>System Stats</Text>
      <View style={styles.statsContainer}>
        <StatCard label="Active Drivers" value={stats.activeDrivers} iconName="directions-car" color={COLORS.primary} />
        <StatCard label="Total Passengers" value={stats.totalPassengers} iconName="people" color={COLORS.success} />
        <StatCard label="Completed Trips" value={stats.completedTrips} iconName="check-circle" color={COLORS.success} />
        <StatCard label="Ongoing Trips" value={stats.ongoingTrips} iconName="autorenew" color={COLORS.warning} />
        <StatCard label="Pending Complaints" value={stats.complaints} iconName="warning" color={COLORS.danger} />
        <StatCard label="Payments Received" value={`PKR ${stats.paymentsReceived}`} iconName="payment" color={COLORS.success} />
        <StatCard label="Payments Pending" value={`PKR ${stats.paymentsPending}`} iconName="schedule" color={COLORS.warning} />
      </View>
    </ScrollView>
  );

  const PollSection = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Create Travel Poll</Text>
      <View style={styles.card}>
        <TextInput 
          style={styles.input} 
          placeholder="Poll Title *" 
          value={newPoll.title} 
          onChangeText={text => setNewPoll({ ...newPoll, title: text })} 
        />
        <Text style={styles.inputLabel}>Add Custom Time Slot:</Text>
        <View style={styles.customTimeSlotContainer}>
          <TextInput 
            style={[styles.input, { flex: 1, marginRight: 10 }]} 
            placeholder="Enter time (e.g., 09:00 AM) *" 
            value={newTimeSlot} 
            onChangeText={setNewTimeSlot} 
          />
          <TouchableOpacity style={styles.addTimeSlotBtn} onPress={addCustomTimeSlot}>
            <Text style={styles.addTimeSlotBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.inputLabel}>Select Time Slots *:</Text>
        {customTimeSlots.map((slot, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.timeSlotOption, newPoll.selectedSlots.includes(slot) && styles.timeSlotSelected]} 
            onPress={() => toggleTimeSlot(slot)}
          >
            <View style={[styles.checkbox, newPoll.selectedSlots.includes(slot) && styles.checkboxSelected]}>
              <Icon name="check" size={16} color="#000" />
            </View>
            <Text style={styles.timeSlotLabel}>{slot}</Text>
          </TouchableOpacity>
        ))}
        <TextInput 
          style={styles.input} 
          placeholder="Closing Time (e.g., 22:00) *" 
          value={newPoll.closingTime} 
          onChangeText={text => setNewPoll({ ...newPoll, closingTime: text })} 
        />
        <TouchableOpacity style={styles.primaryBtn} onPress={createPoll}>
          <Text style={styles.primaryBtnText}>Send Poll</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionSubtitle}>Active Polls</Text>
      {polls.map(poll => (
        <View key={poll.id} style={styles.pollCard}>
          <Text style={styles.pollTitle}>{poll.title}</Text>
          <Text style={styles.pollSlots}>Slots: {poll.timeSlots.join(', ')}</Text>
          <View style={styles.pollStats}>
            <Text style={styles.pollStat}>{poll.responses}/{poll.total}</Text>
            <Text style={styles.pollStat}>Closes: {poll.closesAt}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
const ResponsesSection = () => (
  <ScrollView style={styles.section}>
    <Text style={styles.sectionTitle}>Poll Responses</Text>
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, responseTab === 'passenger' && styles.tabActive]} 
        onPress={() => setResponseTab('passenger')}
      >
        <Text style={[styles.tabText, responseTab === 'passenger' && styles.tabTextActive]}>Passengers</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, responseTab === 'driver' && styles.tabActive]} 
        onPress={() => setResponseTab('driver')}
      >
        <Text style={[styles.tabText, responseTab === 'driver' && styles.tabTextActive]}>Drivers</Text>
      </TouchableOpacity>
    </View>
    {responseTab === 'passenger' && (
      <>
        <Text style={styles.sectionSubtitle}>Confirmed for Tomorrow</Text>
        {passengerResponses.filter(p => p.status === 'Confirmed').map(p => (
          <View key={p.id} style={styles.responseCard}>
            <View style={styles.responseInfo}>
              <Text style={styles.responseName}>{p.name}</Text>
              <Text style={styles.responseLocation}>Pickup: {p.pickupPoint}</Text>
              <Text style={styles.responseDetail}>Time: {p.selectedTimeSlot}</Text>
              <Text style={styles.responseDetail}>{p.contact}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: COLORS.success }]}>
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
        ))}
        <Text style={styles.sectionSubtitle}>Not Confirmed</Text>
        {passengerResponses.filter(p => p.status === 'Not Confirmed').map(p => (
          <View key={p.id} style={styles.responseCard}>
            <View style={styles.responseInfo}>
              <Text style={styles.responseName}>{p.name}</Text>
              <Text style={styles.responseLocation}>Pickup: {p.pickupPoint}</Text>
              <Text style={styles.responseDetail}>{p.contact}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: COLORS.gray }]}>
              <Text style={styles.statusText}>Not Confirmed</Text>
            </View>
          </View>
        ))}
      </>
    )}
    {responseTab === 'driver' && (
      <>
        <Text style={styles.sectionSubtitle}>Available Drivers</Text>
        {driverAvailability.filter(d => d.status === 'Available').map(d => (
          <View key={d.id} style={styles.driverResponseCard}>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{d.name}</Text>
              <Text style={styles.driverVan}>{d.van}</Text>
              <Text style={styles.driverDetail}>Capacity: {d.capacity}</Text>
              <Text style={styles.driverDetail}>Available: {d.availableTimeSlots.join(', ')}</Text>
              <Text style={styles.driverDetail}>{d.contact}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: COLORS.success }]}>
              <Text style={styles.statusText}>Available</Text>
            </View>
          </View>
        ))}
        <Text style={styles.sectionSubtitle}>Not Available</Text>
        {driverAvailability.filter(d => d.status !== 'Available').map(d => (
          <View key={d.id} style={styles.driverResponseCard}>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{d.name}</Text>
              <Text style={styles.driverVan}>{d.van}</Text>
              <Text style={styles.driverDetail}>Capacity: {d.capacity}</Text>
              <Text style={styles.driverDetail}>{d.contact}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: COLORS.gray }]}>
              <Text style={styles.statusText}>{d.status}</Text>
            </View>
          </View>
        ))}
      </>
    )}
  </ScrollView>
);

const RouteSchedulingSection = () => (
  <ScrollView style={styles.section}>
    <Text style={styles.sectionTitle}>Route Scheduling</Text>
    <View style={styles.card}>
      <TextInput 
        style={styles.input} 
        placeholder="Route Name *" 
        value={newRoute.name} 
        onChangeText={text => setNewRoute({ ...newRoute, name: text })} 
      />
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Stops (one per line) *" 
        value={newRoute.stops} 
        onChangeText={text => setNewRoute({ ...newRoute, stops: text })} 
        multiline 
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.primaryBtn} onPress={createRoute}>
        <Text style={styles.primaryBtnText}>Create Route</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.sectionSubtitle}>Existing Routes</Text>
    {routes.map(route => (
      <View key={route.id} style={styles.routeCard}>
        <Text style={styles.routeName}>{route.name}</Text>
        <View style={styles.stopsContainer}>
          {route.stops.map((stop, i) => (
            <View key={i} style={styles.stopItem}>
              <View style={styles.stopDot} />
              <Text style={styles.stopText}>{stop}</Text>
            </View>
          ))}
          <View style={styles.stopItem}>
            <View style={[styles.stopDot, styles.destinationDot]} />
            <Text style={[styles.stopText, styles.destinationText]}>{route.destination}</Text>
          </View>
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.routeInfoText}>{route.distance}</Text>
          <Text style={styles.routeInfoText}>{route.duration}</Text>
        </View>
        {route.assignedDriver && (
          <View style={styles.assignedDriverBadge}>
            <Text style={styles.assignedDriverText}>Driver: {route.assignedDriver}</Text>
            <Text style={styles.assignedDriverText}>Time: {route.timeSlot}</Text>
            <Text style={styles.assignedDriverText}>Passengers: {route.passengers.length}</Text>
          </View>
        )}
      </View>
    ))}
  </ScrollView>
);

const AssignDriversSection = () => (
  <ScrollView style={styles.section}>
    <View style={styles.assignModeSelector}>
      <Text style={styles.sectionTitle}>Route Assignment</Text>
      <View style={styles.modeSwitcher}>
        <TouchableOpacity 
          style={[styles.modeBtn, viewMode === 'manual' && styles.modeBtnActive]}
          onPress={() => setViewMode('manual')}
        >
          <Text style={[styles.modeBtnText, viewMode === 'manual' && styles.modeBtnTextActive]}>Manual</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeBtn, viewMode === 'auto' && styles.modeBtnActive]}
          onPress={() => setViewMode('auto')}
        >
          <Text style={[styles.modeBtnText, viewMode === 'auto' && styles.modeBtnTextActive]}>AI Auto-Assign</Text>
        </TouchableOpacity>
      </View>
    </View>

    {viewMode === 'manual' ? (
      <>
        {routes.map(route => (
          <View key={route.id} style={styles.assignCard}>
            <Text style={styles.assignRouteName}>{route.name}</Text>
            <Text style={styles.assignRouteStops}>{route.stops.join(' → ')} → {route.destination}</Text>
            {route.assignedDriver ? (
              <View style={styles.alreadyAssigned}>
                <Text style={styles.alreadyAssignedText}>Assigned to: {route.assignedDriver}</Text>
                <Text style={styles.alreadyAssignedText}>Time: {route.timeSlot}</Text>
                <Text style={styles.alreadyAssignedText}>Passengers: {route.passengers.length}</Text>
              </View>
            ) : (
              customTimeSlots.map(slot => {
                const drivers = getDriversByTimeSlot(slot);
                const passengers = getPassengersByTimeSlot(slot);
                return drivers.length ? (
                  <View key={slot} style={styles.timeSlotAssignSection}>
                    <Text style={styles.timeSlotAssignTitle}>{slot}</Text>
                    <Text style={styles.passengerCount}>{passengers.length} passengers</Text>
                    {drivers.map(d => (
                      <TouchableOpacity 
                        key={d.id} 
                        style={styles.driverSelectBtn} 
                        onPress={() => assignDriverToRoute(route.id, d.id, slot)}
                      >
                        <View style={styles.driverSelectInfo}>
                          <Text style={styles.driverSelectText}>{d.name} - {d.van}</Text>
                          <Text style={styles.driverCapacity}>Capacity: {d.capacity}</Text>
                        </View>
                        <Text style={styles.assignArrow}>→</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null;
              })
            )}
          </View>
        ))}
      </>
    ) : (
      <>
        <View style={styles.autoAssignHeader}>
          <Text style={styles.autoAssignSubtitle}>AI-Powered Route Optimization</Text>
          <Text style={styles.autoAssignDesc}>Proximity-based clustering with capacity optimization</Text>
          <View style={styles.autoAssignActions}>
            <TouchableOpacity style={styles.autoAssignBtn} onPress={handleAutoAssignment}>
              <Icon name="refresh" size={18} color={COLORS.white} />
              <Text style={styles.autoAssignBtnText}>Generate Routes</Text>
            </TouchableOpacity>
            {autoAssignments.length > 0 && (
              <TouchableOpacity style={styles.approveAllBtn} onPress={handleApproveAllAutoRoutes}>
                <Icon name="check-circle" size={18} color={COLORS.white} />
                <Text style={styles.approveAllBtnText}>Approve All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {autoAssignments.length > 0 && (
          <View style={styles.autoStatsCard}>
            <Text style={styles.autoStatsTitle}>System Performance</Text>
            <View style={styles.autoStatsGrid}>
              <View style={styles.autoStatItem}>
                <Text style={styles.autoStatLabel}>Routes</Text>
                <Text style={styles.autoStatValue}>{autoAssignments.length}</Text>
              </View>
              <View style={styles.autoStatItem}>
                <Text style={styles.autoStatLabel}>Avg Efficiency</Text>
                <Text style={styles.autoStatValue}>
                  {(autoAssignments.reduce((sum, a) => sum + parseFloat(a.efficiencyScore), 0) / autoAssignments.length).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.autoStatItem}>
                <Text style={styles.autoStatLabel}>Avg Distance</Text>
                <Text style={styles.autoStatValue}>
                  {(autoAssignments.reduce((sum, a) => sum + parseFloat(a.totalDistance), 0) / autoAssignments.length).toFixed(1)} km
                </Text>
              </View>
              <View style={styles.autoStatItem}>
                <Text style={styles.autoStatLabel}>Utilization</Text>
                <Text style={styles.autoStatValue}>
                  {(autoAssignments.reduce((sum, a) => sum + parseFloat(a.utilization), 0) / autoAssignments.length).toFixed(0)}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {autoAssignments.map((assignment, idx) => (
          <View key={idx} style={[
            styles.autoRouteCard,
            assignment.status === 'approved' && styles.autoRouteApproved,
            selectedAutoRoute === idx && styles.autoRouteSelected
          ]}>
            <View style={styles.autoRouteHeader}>
              <View style={styles.autoRouteDriverInfo}>
                <Icon name="local-shipping" size={24} color={COLORS.primary} />
                <View style={styles.autoRouteDriverText}>
                  <Text style={styles.autoRouteDriverName}>{assignment.driver.name}</Text>
                  <Text style={styles.autoRouteDriverVan}>{assignment.driver.van}</Text>
                </View>
              </View>
              {assignment.status === 'approved' && (
                <Icon name="check-circle" size={28} color={COLORS.success} />
              )}
            </View>

            <View style={styles.autoRouteMetrics}>
              <View style={styles.autoRouteMetricItem}>
                <Icon name="people" size={16} color={COLORS.gray} />
                <Text style={styles.autoRouteMetricText}>
                  {assignment.passengers.length}/{assignment.targetCapacity}
                </Text>
              </View>
              <View style={styles.autoRouteMetricItem}>
                <Icon name="map" size={16} color={COLORS.gray} />
                <Text style={styles.autoRouteMetricText}>{assignment.totalDistance} km</Text>
              </View>
              <View style={styles.autoRouteMetricItem}>
                <Icon name="schedule" size={16} color={COLORS.gray} />
                <Text style={styles.autoRouteMetricText}>{assignment.estimatedTime} min</Text>
              </View>
              <View style={styles.autoRouteMetricItem}>
                <Icon name="trending-up" size={16} color={COLORS.success} />
                <Text style={styles.autoRouteMetricText}>{assignment.efficiencyScore}%</Text>
              </View>
            </View>

            <View style={styles.capacityBarContainer}>
              <View style={styles.capacityBarHeader}>
                <Text style={styles.capacityBarLabel}>Capacity</Text>
                <Text style={styles.capacityBarValue}>{assignment.utilization}%</Text>
              </View>
              <View style={styles.capacityBarTrack}>
                <View style={[styles.capacityBarFill, { width: `${assignment.utilization}%` }]} />
              </View>
            </View>

            <View style={styles.algorithmInfo}>
              <Text style={styles.algorithmTitle}>🤖 Algorithm Details</Text>
              <Text style={styles.algorithmText}>• Target: {assignment.targetCapacity} passengers</Text>
              <Text style={styles.algorithmText}>• Method: Proximity clustering (5km)</Text>
              <Text style={styles.algorithmText}>• Route: Nearest neighbor optimization</Text>
            </View>

            {selectedAutoRoute === idx && (
              <View style={styles.passengerSequence}>
                <Text style={styles.passengerSequenceTitle}>Optimized Pickup Sequence:</Text>
                {assignment.passengers.map((passenger, pIdx) => (
                  <View key={passenger.id} style={styles.passengerSequenceItem}>
                    <View style={styles.passengerSequenceNumber}>
                      <Text style={styles.passengerSequenceNumberText}>{pIdx + 1}</Text>
                    </View>
                    <View style={styles.passengerSequenceInfo}>
                      <Text style={styles.passengerSequenceName}>{passenger.name}</Text>
                      <Text style={styles.passengerSequenceLocation}>{passenger.pickupPoint}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.autoRouteActions}>
              <TouchableOpacity 
                style={styles.viewDetailsBtn}
                onPress={() => setSelectedAutoRoute(selectedAutoRoute === idx ? null : idx)}
              >
                <Text style={styles.viewDetailsBtnText}>
                  {selectedAutoRoute === idx ? 'Hide Details' : 'View Details'}
                </Text>
              </TouchableOpacity>
              {assignment.status === 'pending' && (
                <TouchableOpacity 
                  style={styles.approveRouteBtn}
                  onPress={() => handleApproveAutoRoute(idx)}
                >
                  <Icon name="check" size={16} color={COLORS.white} />
                  <Text style={styles.approveRouteBtnText}>Approve</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {unassignedInAuto.length > 0 && (
          <View style={styles.unassignedAlert}>
            <Icon name="warning" size={24} color={COLORS.danger} />
            <View style={styles.unassignedAlertContent}>
              <Text style={styles.unassignedAlertTitle}>
                Unassigned Passengers ({unassignedInAuto.length})
              </Text>
              {unassignedInAuto.map(p => (
                <Text key={p.id} style={styles.unassignedPassenger}>
                  • {p.name} - {p.pickupPoint}
                </Text>
              ))}
            </View>
          </View>
        )}
      </>
    )}
  </ScrollView>
);

const LiveTrackingSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const mapRef = useRef(null);
  const [vanProgress, setVanProgress] = useState(
    vans.reduce((acc, van) => ({ ...acc, [van.id]: 0 }), {})
  );

  const VAN_COLOR = COLORS.primary;

  const fitToRoute = useCallback(
    (van) => {
      if (mapRef.current && van) {
        const coordinates = van.stops
          .map((stop) => stopCoordinates[stop])
          .filter((coord) => coord && coord.latitude && coord.longitude);
        if (coordinates.length > 1) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 120, right: 60, bottom: 60, left: 60 },
            animated: true,
          });
        } else if (coordinates.length === 1) {
          mapRef.current.animateToRegion(
            {
              latitude: coordinates[0].latitude,
              longitude: coordinates[0].longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            },
            800
          );
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!isPlaying) {
      vans.forEach((van) => {
        if (van.status === 'En Route') {
          Animated.parallel([
            Animated.timing(vanPositions[van.id].scale, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(vanPositions[van.id].rotation, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        }
      });
      return;
    }

    const interval = setInterval(() => {
      setVanProgress((prev) => {
        const newProgress = { ...prev };
        const updatedVans = vans.map((van) => {
          if (van.status !== 'En Route') return van;

          newProgress[van.id] = Math.min((prev[van.id] + 0.003) % 1, 0.99);

          const totalSegments = van.stops.length - 1;
          const segmentIndex = Math.floor(newProgress[van.id] * totalSegments);
          const segmentProgress = (newProgress[van.id] * totalSegments) % 1;

          if (segmentIndex >= totalSegments) {
            Animated.sequence([
              Animated.timing(vanPositions[van.id].scale, {
                toValue: 1.4,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(vanPositions[van.id].scale, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
            ]).start();
            setStats((prev) => ({
              ...prev,
              completedTrips: prev.completedTrips + 1,
              ongoingTrips: prev.ongoingTrips - 1,
            }));

            if (!van.notifiedComplete) {
              setNotifications(prevNotifications => [
                ...prevNotifications,
                {
                  id: prevNotifications.length + 1,
                  title: 'Route Completed',
                  message: `${van.driver} has completed the route ${van.route} and dropped all passengers.`,
                  timestamp: new Date(),
                  icon: 'flag',
                  color: COLORS.success,
                  read: false,
                }
              ]);
            }

            return {
              ...van,
              status: 'Completed',
              eta: '0 min',
              currentStop: van.stops[van.stops.length - 1],
              completedStops: van.stops,
              currentLocation: stopCoordinates[van.stops[van.stops.length - 1]],
              passengersList: van.passengersList.map((p) => ({
                ...p,
                status: 'picked',
                pickupTime: p.pickupTime || new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' }),
              })),
              notifiedComplete: true,
            };
          }

          const startStop = van.stops[segmentIndex];
          const endStop = van.stops[segmentIndex + 1];
          const start = stopCoordinates[startStop] || {
            latitude: van.currentLocation.latitude,
            longitude: van.currentLocation.longitude,
          };
          const end = stopCoordinates[endStop] || {
            latitude: van.currentLocation.latitude,
            longitude: van.currentLocation.longitude,
          };

          const newLat = start.latitude + (end.latitude - start.latitude) * segmentProgress;
          const newLng = start.longitude + (end.longitude - start.longitude) * segmentProgress;

          Animated.parallel([
            Animated.timing(vanPositions[van.id].latitude, {
              toValue: newLat,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(vanPositions[van.id].longitude, {
              toValue: newLng,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(vanPositions[van.id].scale, {
                toValue: 1.05,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(vanPositions[van.id].scale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(vanPositions[van.id].rotation, {
              toValue:
                Math.atan2(end.longitude - start.longitude, end.latitude - start.latitude) *
                (180 / Math.PI),
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();

          let updatedPassengers = van.passengersList;
          let updatedCompletedStops = van.completedStops;
          const nextStop = van.stops[segmentIndex + 1] || van.currentStop;

          const distance = Math.sqrt(
            Math.pow(newLat - end.latitude, 2) + Math.pow(newLng - end.longitude, 2)
          );
          if (distance < 0.0003 && !updatedCompletedStops.includes(endStop)) {
            updatedCompletedStops = [...updatedCompletedStops, endStop];
            updatedPassengers = updatedPassengers.map((p) => {
              const passenger = passengerResponses.find((pr) => pr.name === p.name);
              if (passenger && passenger.pickupPoint === endStop) {
                return {
                  ...p,
                  status: 'picked',
                  pickupTime: new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' }),
                };
              }
              return p;
            });
            Animated.sequence([
              Animated.timing(vanPositions[van.id].scale, {
                toValue: 1.3,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(vanPositions[van.id].rotation, {
                toValue: vanPositions[van.id].rotation._value + 360,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(vanPositions[van.id].scale, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start();
          }

          const allPicked = updatedPassengers.every(p => p.status === 'picked');
          if (allPicked && !van.notifiedPickups) {
            setNotifications(prevNotifications => [
              ...prevNotifications,
              {
                id: prevNotifications.length + 1,
                title: 'All Pickups Completed',
                message: `${van.driver} has picked up all passengers for ${van.route}.`,
                timestamp: new Date(),
                icon: 'check-circle',
                color: COLORS.success,
                read: false,
              }
            ]);
          }

          const remainingDistance = (1 - newProgress[van.id]) * 20;
          const etaMinutes = Math.round((remainingDistance / 50) * 60);

          return {
            ...van,
            currentLocation: { latitude: newLat, longitude: newLng },
            currentStop: nextStop,
            completedStops: updatedCompletedStops,
            eta: `${etaMinutes} min`,
            speed: Math.round(40 + Math.random() * 20),
            passengersList: updatedPassengers,
            passengers: updatedPassengers.filter((p) => p.status === 'picked').length,
            color: VAN_COLOR,
            notifiedPickups: allPicked ? true : van.notifiedPickups,
          };
        });

        setVans(updatedVans);

        if (selectedVan && mapRef.current && updatedVans.find((v) => v.id === selectedVan.id)) {
          const van = updatedVans.find((v) => v.id === selectedVan.id);
          mapRef.current.animateCamera(
            {
              center: {
                latitude: van.currentLocation.latitude,
                longitude: van.currentLocation.longitude,
              },
              zoom: 15,
              pitch: 45,
              heading: vanPositions[van.id].rotation._value,
            },
            { duration: 600 }
          );
        }

        return newProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isPlaying, selectedVan]);

  useEffect(() => {
    if (selectedVan) {
      fitToRoute(selectedVan);
    }
  }, [selectedVan, fitToRoute]);

  return (
    <ScrollView style={styles.section} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Live Driver Tracking</Text>
      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={[styles.controlButton, isPlaying ? styles.pauseButton : styles.playButton]}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Icon name={isPlaying ? "pause" : "play-arrow"} size={20} color={COLORS.white} />
          <Text style={styles.controlButtonText}>{isPlaying ? "Pause" : "Play"} Simulation</Text>
        </TouchableOpacity>
        
        <Text style={styles.activeVansText}>
          Active Vans: <Text style={styles.activeVansCount}>{vans.filter(v => v.status === 'En Route').length}</Text>
        </Text>
      </View>
      {selectedVan ? (
        <View style={styles.trackingDetailCard}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedVan(null)}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <View style={[styles.vanHeader, { backgroundColor: VAN_COLOR }]}>
            <Text style={styles.vanDetailName}>
              {selectedVan.name} - {selectedVan.driver}
            </Text>
            <Text style={styles.vanDetailRoute}>
              {selectedVan.route} | {selectedVan.timeSlot}
            </Text>
          </View>
          <View style={styles.mapContainer}>
            <View style={styles.mapHeader}>
              <Text style={styles.mapSimulationTitle}>Live Location</Text>
              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            </View>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: selectedVan.currentLocation.latitude,
                longitude: selectedVan.currentLocation.longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              }}
              mapType="hybrid"
              showsUserLocation={true}
              showsTraffic={true}
            >
              <Marker.Animated
                coordinate={{
                  latitude: vanPositions[selectedVan.id].latitude,
                  longitude: vanPositions[selectedVan.id].longitude,
                }}
                title={selectedVan.name}
                description={`${selectedVan.currentStop} | ETA: ${selectedVan.eta}`}
              >
                <Animated.View
                  style={{
                    transform: [
                      { scale: vanPositions[selectedVan.id].scale },
                      {
                        rotate: vanPositions[selectedVan.id].rotation.interpolate({
                          inputRange: [0, 360],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  }}
                >
                  <View style={[styles.vanMarker, { borderColor: VAN_COLOR }]}>
                    <Icon name="directions-car" size={30} color={VAN_COLOR} />
                  </View>
                </Animated.View>
              </Marker.Animated>
              <Polyline
                coordinates={selectedVan.stops
                  .map((stop) => stopCoordinates[stop])
                  .filter((coord) => coord && coord.latitude && coord.longitude)}
                strokeColor={VAN_COLOR}
                strokeWidth={5}
                lineDashPattern={[8, 8]}
                geodesic={true}
              />
              {selectedVan.stops.map((stop, index) => (
                <Marker
                  key={index}
                  coordinate={stopCoordinates[stop] || { latitude: 0, longitude: 0 }}
                  title={stop}
                  pinColor={
                    stop === selectedVan.stops[0]
                      ? COLORS.primary
                      : selectedVan.completedStops.includes(stop)
                      ? COLORS.success
                      : COLORS.gray
                  }
                >
                  <View style={styles.stopMarker}>
                    <Icon
                      name={stop === selectedVan.stops[0] ? 'flag' : 'location-pin'}
                      size={stop === selectedVan.stops[0] ? 32 : 24}
                      color={
                        stop === selectedVan.stops[0]
                          ? COLORS.primary
                          : selectedVan.completedStops.includes(stop)
                          ? COLORS.success
                          : COLORS.gray
                      }
                    />
                  </View>
                </Marker>
              ))}
            </MapView>
            <View style={styles.mapOverlay}>
              <Text style={styles.coordinates}>
                Lat: {selectedVan.currentLocation.latitude.toFixed(4)}, Lng:{' '}
                {selectedVan.currentLocation.longitude.toFixed(4)}
              </Text>
              <Text style={styles.speedText}>Speed: {selectedVan.speed} km/h</Text>
              <Text style={styles.etaText}>ETA: {selectedVan.eta}</Text>
            </View>
          </View>
          <View style={styles.vanInfoCard}>
            <Text style={styles.cardTitle}>Van Details</Text>
            <View style={styles.vanInfoRow}>
              <Text style={styles.vanInfoLabel}>Route</Text>
              <Text style={styles.vanInfoValue}>{selectedVan.route}</Text>
            </View>
            <View style={styles.vanInfoRow}>
              <Text style={styles.vanInfoLabel}>Contact</Text>
              <Text style={styles.vanInfoValue}>
                <Icon name="phone" size={14} color={COLORS.primary} />{' '}
                {selectedVan.driver}
              </Text>
            </View>
            <View style={styles.vanInfoRow}>
              <Text style={styles.vanInfoLabel}>Capacity</Text>
              <Text style={styles.vanInfoValue}>
                {selectedVan.passengers}/{selectedVan.capacity}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(selectedVan.passengers / selectedVan.capacity) * 100}%`, backgroundColor: VAN_COLOR },
                ]}
              />
            </View>
          </View>
          <View style={styles.passengerListCard}>
            <View style={styles.passengerListHeader}>
              <Text style={styles.cardTitle}>Passengers</Text>
              <View style={[styles.passengerCountBadge, { backgroundColor: VAN_COLOR }]}>
                <Text style={styles.passengerCountText}>{selectedVan.passengers}</Text>
              </View>
            </View>
            {selectedVan.passengersList?.map((p, i) => (
              <View
                key={i}
                style={[
                  styles.passengerItem,
                  p.status === 'picked' && styles.passengerPicked,
                  p.status === 'current' && styles.passengerCurrent,
                  p.status === 'pending' && styles.passengerPending,
                ]}
              >
                <View>
                  <Text style={styles.passengerName}>{p.name}</Text>
                  <Text style={styles.passengerTime}>
                    <Icon name="access-time" size={12} color={COLORS.gray} />{' '}
                    {p.pickupTime || 'Pending'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.passengerStatusBadge,
                    p.status === 'picked' && styles.statusPicked,
                    p.status === 'current' && styles.statusCurrent,
                    p.status === 'pending' && styles.statusPending,
                  ]}
                >
                  <Text style={styles.passengerStatusText}>
                    {p.status === 'picked'
                      ? '✓ Picked'
                      : p.status === 'current'
                      ? '→ Current'
                      : '○ Pending'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.stopsTimeline}>
            <Text style={styles.timelineTitle}>Route Progress</Text>
            {selectedVan.stops.map((stop, i) => {
              const isCompleted = selectedVan.completedStops.includes(stop);
              const isCurrent = selectedVan.currentStop === stop;
              return (
                <View key={i} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      isCompleted && styles.timelineDotCompleted,
                      isCurrent && styles.timelineDotCurrent,
                    ]}
                  />
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineText,
                        isCompleted && styles.timelineTextCompleted,
                        isCurrent && styles.timelineTextCurrent,
                      ]}
                    >
                      {stop}
                    </Text>
                    {isCompleted && !isCurrent && (
                      <Text style={styles.timelineStatus}>Completed</Text>
                    )}
                    {isCurrent && (
                      <Text style={styles.timelineStatusCurrent}>Current</Text>
                    )}
                  </View>
                  {isCurrent && (
                    <Text style={styles.timelineEta}>ETA: {selectedVan.eta}</Text>
                  )}
                </View>
              );
            })}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(selectedVan.completedStops.length / selectedVan.stops.length) * 100}%`, backgroundColor: VAN_COLOR },
                ]}
              />
            </View>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.selectVanText}>Select a van to track:</Text>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={[styles.map, { height: 220, marginBottom: 18 }]}
            initialRegion={{
              latitude: 33.6,
              longitude: 73.1,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }}
            mapType="standard"
            showsTraffic={true}
          >
            {vans.map((van) => (
              <Marker
                key={van.id}
                coordinate={van.currentLocation}
                title={van.name}
                description={van.currentStop}
                onPress={() => {
                  setSelectedVan(van);
                  fitToRoute(van);
                }}
              >
                <Animated.View
                  style={{
                    transform: [
                      { scale: vanPositions[van.id].scale },
                      {
                        rotate: vanPositions[van.id].rotation.interpolate({
                          inputRange: [0, 360],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  }}
                >
                  <View style={[styles.vanMarker, { borderColor: VAN_COLOR }]}>
                    <Icon
                      name="directions-car"
                      size={24}
                      color={van.status === 'Completed' ? COLORS.success : van.status === 'En Route' ? COLORS.warning : COLORS.gray}
                    />
                  </View>
                </Animated.View>
              </Marker>
            ))}
          </MapView>
          {vans.map((van) => (
            <TouchableOpacity
              key={van.id}
              style={[styles.vanCard, { borderColor: VAN_COLOR }]}
              onPress={() => {
                setSelectedVan(van);
                fitToRoute(van);
              }}
            >
              <View style={styles.vanHeader}>
                <Text style={styles.vanName}>{van.name}</Text>
                <View
                  style={[
                    styles.vanStatusBadge,
                    van.status === 'Completed' && styles.vanStatusCompleted,
                    van.status === 'En Route' && styles.vanStatusEnRoute,
                    van.status === 'Paused' && styles.vanStatusPaused,
                  ]}
                >
                  <Text style={styles.vanStatusText}>{van.status}</Text>
                </View>
              </View>
              <View style={[styles.vanColorIndicator, { backgroundColor: VAN_COLOR }]} />
              <Text style={styles.vanDriver}>Driver: {van.driver}</Text>
              <Text style={styles.vanRoute}>Route: {van.route}</Text>
              <Text style={styles.vanTimeSlot}>{van.timeSlot}</Text>
              <Text style={styles.vanLocation}>Current: {van.currentStop}</Text>
              <Text style={styles.vanPassengers}>
                {van.passengers}/{van.capacity}
              </Text>
              <Text style={styles.vanEta}>ETA: {van.eta}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const DriverRequestsSection = () => (
  <ScrollView style={styles.section}>
    <Text style={styles.sectionTitle}>Driver Join Requests</Text>
    {driverRequests.length ? driverRequests.map(r => (
      <View key={r.id} style={styles.requestCard}>
        <Text style={styles.requestName}>{r.name}</Text>
        <Text style={styles.requestDetail}>Vehicle: {r.vehicle}</Text>
        <Text style={styles.requestDetail}>Capacity: {r.capacity}</Text>
        <Text style={styles.requestDetail}>Experience: {r.experience}</Text>
        <Text style={styles.requestDetail}>{r.contact}</Text>
        <Text style={styles.requestDetail}>License: {r.license}</Text>
        <Text style={styles.requestDetail}>Slots: {r.availableTimeSlots.join(', ')}</Text>
        <View style={styles.requestActions}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.acceptBtn]} 
            onPress={() => handleDriverRequest(r.id, 'accept')}
          >
            <Text style={styles.actionBtnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.rejectBtn]} 
            onPress={() => handleDriverRequest(r.id, 'reject')}
          >
            <Text style={styles.actionBtnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    )) : (
      <View style={styles.emptyState}>
        <Icon name="inbox" size={48} color="#999" />
        <Text style={styles.emptyText}>No driver requests</Text>
      </View>
    )}
  </ScrollView>
);

const PassengerRequestsSection = () => (
  <ScrollView style={styles.section}>
    <Text style={styles.sectionTitle}>Passenger Join Requests</Text>
    {passengerRequests.length ? passengerRequests.map(r => (
      <View key={r.id} style={styles.requestCard}>
        <Text style={styles.requestName}>{r.name}</Text>
        <Text style={styles.requestDetail}>Location: {r.location}</Text>
        <Text style={styles.requestDetail}>Pickup: {r.pickupPoint}</Text>
        <Text style={styles.requestDetail}>Destination: {r.destination}</Text>
        <Text style={styles.requestDetail}>Preferred: {r.preferredTimeSlot}</Text>
        <Text style={styles.requestDetail}>{r.contact}</Text>
        <View style={styles.requestActions}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.acceptBtn]} 
            onPress={() => handlePassengerRequest(r.id, 'accept')}
          >
            <Text style={styles.actionBtnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.rejectBtn]} 
            onPress={() => handlePassengerRequest(r.id, 'reject')}
          >
            <Text style={styles.actionBtnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    )) : (
      <View style={styles.emptyState}>
        <Icon name="inbox" size={48} color="#999" />
        <Text style={styles.emptyText}>No passenger requests</Text>
      </View>
    )}
  </ScrollView>
);

const PaymentsSection = () => (
  <ScrollView style={styles.section}>
    <Text style={styles.sectionTitle}>Payments Management</Text>
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, paymentTab === 'driver' && styles.tabActive]} 
        onPress={() => setPaymentTab('driver')}
      >
        <Text style={[styles.tabText, paymentTab === 'driver' && styles.tabTextActive]}>Driver Payments</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, paymentTab === 'passenger' && styles.tabActive]} 
        onPress={() => setPaymentTab('passenger')}
      >
        <Text style={[styles.tabText, paymentTab === 'passenger' && styles.tabTextActive]}>Passenger Payments</Text>
      </TouchableOpacity>
    </View>
    {paymentTab === 'driver' && (
      <>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Send Payment to Driver</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Driver Name *" 
            value={newPayment.driver} 
            onChangeText={text => setNewPayment({ ...newPayment, driver: text })} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Amount (PKR) *" 
            value={newPayment.amount} 
            onChangeText={text => setNewPayment({ ...newPayment, amount: text })} 
            keyboardType="numeric" 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Payment Mode *" 
            value={newPayment.mode} 
            onChangeText={text => setNewPayment({ ...newPayment, mode: text })} 
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={sendDriverPayment}>
            <Text style={styles.primaryBtnText}>Send Payment</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionSubtitle}>Payment History</Text>
        {driverPayments.map(p => (
          <View key={p.id} style={styles.paymentCard}>
            <Text style={styles.paymentDriver}>{p.driver}</Text>
            <Text style={styles.paymentAmount}>PKR {p.amount}</Text>
            <Text style={styles.paymentMode}>{p.mode}</Text>
            <Text style={styles.paymentDate}>{p.date}</Text>
            <View style={[styles.statusBadge, p.status === 'Confirmed' ? { backgroundColor: COLORS.success } : { backgroundColor: COLORS.warning }]}>
              <Text style={styles.statusText}>{p.status}</Text>
            </View>
          </View>
        ))}
      </>
    )}
    {paymentTab === 'passenger' && (
      <>
        <Text style={styles.sectionSubtitle}>Passenger Payment Status</Text>
        {passengerPayments.map(p => (
          <View key={p.id} style={styles.passengerPaymentCard}>
            <View style={styles.paymentHeader}>
              <Text style={styles.passengerName}>{p.passenger}</Text>
              <View style={[
                styles.passengerStatusBadge, 
                p.status === 'Paid' && styles.statusPaid,
                p.status === 'Pending' && styles.statusPending,
                p.status === 'Expired' && styles.statusExpired
              ]}>
                <Text style={styles.passengerStatusText}>{p.status}</Text>
              </View>
            </View>
            <Text style={styles.paymentDetail}>Amount: PKR {p.amount}</Text>
            <Text style={styles.paymentDetail}>Last Payment: {p.lastPaymentDate}</Text>
            <Text style={styles.paymentDetail}>Expiry: {p.expiryDate}</Text>
            <View style={styles.passengerActions}>
              {p.status === 'Expired' && (
                <TouchableOpacity 
                  style={styles.reminderBtn} 
                  onPress={() => sendPaymentReminder(p.id)}
                >
                  <Text style={styles.reminderBtnText}>Send Reminder</Text>
                </TouchableOpacity>
              )}
              {p.status === 'Paid' && (
                <TouchableOpacity 
                  style={styles.renewalBtn} 
                  onPress={() => sendRenewalNotification(p.id)}
                >
                  <Text style={styles.renewalBtnText}>Renewal Notice</Text>
                </TouchableOpacity>
              )}
              {(p.status === 'Pending' || p.status === 'Expired') && (
                <TouchableOpacity 
                  style={styles.updateStatusBtn} 
                  onPress={() => updatePaymentStatus(p.id, 'Paid')}
                >
                  <Text style={styles.updateStatusBtnText}>Mark Paid</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </>
    )}
  </ScrollView>
);

const ComplaintsSection = () => (
  <ScrollView style={styles.section}>
    <Text style={styles.sectionTitle}>Complaints Management</Text>
    {selectedResponse ? (
      <View style={styles.complaintDetailCard}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedResponse(null)}>
          <Text style={styles.backBtnText}>← Back to Complaints</Text>
        </TouchableOpacity>
        <View style={styles.complaintHeader}>
          <Text style={styles.complaintTitle}>{selectedResponse.title}</Text>
          <View style={[
            styles.complaintStatusBadge, 
            selectedResponse.status === 'Open' && styles.complaintStatusOpen,
            selectedResponse.status === 'Resolved' && styles.complaintStatusResolved
          ]}>
            <Text style={styles.complaintStatusText}>{selectedResponse.status}</Text>
          </View>
        </View>
        <Text style={styles.complaintBy}>By: {selectedResponse.byName} ({selectedResponse.by})</Text>
        <Text style={styles.complaintDesc}>{selectedResponse.description}</Text>
        <Text style={styles.complaintTime}>Submitted: {selectedResponse.date} at {selectedResponse.time}</Text>
        <View style={styles.repliesContainer}>
          <Text style={styles.repliesTitle}>Replies</Text>
          {selectedResponse.replies?.map((reply, index) => (
            <View key={index} style={styles.replyItem}>
              <Text style={styles.replyBy}>{reply.by}</Text>
              <Text style={styles.replyText}>{reply.text}</Text>
              <Text style={styles.replyTime}>{reply.date} at {reply.time}</Text>
            </View>
          ))}
          {(!selectedResponse.replies || selectedResponse.replies.length === 0) && (
            <Text style={styles.noRepliesText}>No replies yet</Text>
          )}
        </View>
        {selectedResponse.status === 'Open' && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={[styles.input, styles.replyInput]}
              placeholder="Type your reply here..."
              value={newReply}
              onChangeText={setNewReply}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity 
              style={styles.replyBtn} 
              onPress={() => replyToComplaint(selectedResponse.id)}
            >
              <Text style={styles.replyBtnText}>Send Reply</Text>
            </TouchableOpacity>
          </View>
        )}
        {selectedResponse.status === 'Open' && (
          <TouchableOpacity 
            style={styles.resolveBtn} 
            onPress={() => resolveComplaint(selectedResponse.id)}
          >
            <Text style={styles.resolveBtnText}>Mark as Resolved</Text>
          </TouchableOpacity>
        )}
      </View>
    ) : (
      <>
        {complaints.length ? complaints.map(c => (
          <TouchableOpacity 
            key={c.id} 
            style={styles.complaintCard} 
            onPress={() => setSelectedResponse(c)}
          >
            <View style={styles.complaintHeader}>
              <Text style={styles.complaintTitle}>{c.title}</Text>
              <View style={[
                styles.complaintStatusBadge, 
                c.status === 'Open' && styles.complaintStatusOpen,
                c.status === 'Resolved' && styles.complaintStatusResolved
              ]}>
                <Text style={styles.complaintStatusText}>{c.status}</Text>
              </View>
            </View>
            <Text style={styles.complaintBy}>By: {c.byName} ({c.by})</Text>
            <Text style={styles.complaintDesc}>{c.description}</Text>
            <Text style={styles.complaintTime}>{c.date} at {c.time}</Text>
            {c.replies && c.replies.length > 0 && (
              <Text style={styles.repliesCount}>{c.replies.length} replies</Text>
            )}
          </TouchableOpacity>
        )) : (
          <View style={styles.emptyState}>
            <Icon name="check-circle" size={48} color="#999" />
            <Text style={styles.emptyText}>No complaints to display</Text>
          </View>
        )}
      </>
    )}
  </ScrollView>
);

const NotificationsSection = () => {
  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showSuccess('All notifications marked as read');
  };

  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    showSuccess('Notification deleted');
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <ScrollView style={styles.section}>
      <View style={styles.notificationHeader}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {notifications.filter(n => !n.read).length > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
            <Text style={styles.markAllBtnText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="notifications-none" size={64} color={COLORS.gray} />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>You're all caught up!</Text>
        </View>
      ) : (
        notifications.map(notification => (
          <TouchableOpacity
            key={notification.id}
            style={[styles.notificationCard, !notification.read && styles.notificationUnread]}
            onPress={() => markAsRead(notification.id)}
          >
            <View style={[styles.notificationIcon, { backgroundColor: notification.color + '20' }]}>
              <Icon name={notification.icon} size={24} color={notification.color} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{getTimeAgo(notification.timestamp)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteNotificationBtn}
              onPress={() => deleteNotification(notification.id)}
            >
              <Icon name="close" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};
 

  const Sidebar = () => (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
      <View style={styles.sidebarHeader}>
        <TouchableOpacity onPress={() => { setActiveSection('profile'); setSidebarVisible(false); }}>
          <Text style={styles.sidebarTitle}>{profile.name}</Text>
          <Text style={styles.sidebarSubtitle}>{profile.company}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSidebarVisible(false)}>
          <Icon name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.sidebarMenu}>
        {[
          { key: 'overview', label: 'Dashboard', icon: 'dashboard' },
          { key: 'profile', label: 'My Profile', icon: 'account-circle' },
          { key: 'poll', label: 'Create Poll', icon: 'poll' },
          { key: 'responses', label: 'Poll Insights', icon: 'insights' },
          { key: 'routes', label: 'Route Manager', icon: 'map' },
          { key: 'assign', label: 'Smart Assign', icon: 'assignment-ind' },
          { key: 'tracking', label: 'Live Tracker', icon: 'my-location' },
          { key: 'driver-req', label: 'Driver Requests', icon: 'group-add' },
          { key: 'pass-req', label: 'Rider Requests', icon: 'person-add' },
          { key: 'payments', label: 'Finances', icon: 'account-balance-wallet' },
          { key: 'complaints', label: 'Support Desk', icon: 'support-agent' },
          { key: 'notifications', label: 'Notifications', icon: 'notifications-active' },
        ].map(item => (
          <TouchableOpacity 
            key={item.key} 
            style={[styles.menuItem, activeSection === item.key && styles.menuItemActive]} 
            onPress={() => { setActiveSection(item.key); setSidebarVisible(false); }}
          >
            <Icon name={item.icon} size={22} color={activeSection === item.key ? COLORS.primary : COLORS.gray} />
            <Text style={[styles.menuItemText, activeSection === item.key && styles.menuItemTextActive]}>
              {item.label}
            </Text>
            {item.key === 'notifications' && notifications.filter(n => !n.read).length > 0 && (
              <View style={styles.menuNotificationBadge}>
                <Text style={styles.menuNotificationBadgeText}>{notifications.filter(n => !n.read).length}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        <View style={styles.menuDivider} />
        <TouchableOpacity style={styles.logoutMenuItem} onPress={handleLogout}>
          <Icon name="logout" size={22} color={COLORS.danger} />
          <Text style={styles.logoutMenuText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );

  // ... (Other sections like ResponsesSection, RouteSchedulingSection, etc. remain the same)

  const renderSection = () => {
    const sections = { 
      overview: <OverviewSection />, 
      profile: <ProfileSection />,
      poll: <PollSection />, 
      responses: <ResponsesSection />, 
      routes: <RouteSchedulingSection />, 
      assign: <AssignDriversSection />, 
      tracking: <LiveTrackingSection />, 
      'driver-req': <DriverRequestsSection />, 
      'pass-req': <PassengerRequestsSection />, 
      payments: <PaymentsSection />, 
      complaints: <ComplaintsSection />,
      notifications: <NotificationsSection />
    };
    return sections[activeSection] || <OverviewSection />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setSidebarVisible(true)}>
          <Icon name="menu" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transporter Dashboard</Text>
        <View style={styles.headerRight} />
      </View>
      {sidebarVisible && <Sidebar />}
      {sidebarVisible && <TouchableOpacity style={styles.overlay} onPress={() => setSidebarVisible(false)} />}
      {renderSection()}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      <SuccessModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  headerRight: {
    width: 40,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: COLORS.white,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    zIndex: 1000,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 50,
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 32,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  sidebarSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.95,
    marginTop: 4,
    fontWeight: '500',
  },
  sidebarMenu: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 3,
    borderRadius: 14,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: '#F0F9D9',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  menuItemText: {
    fontSize: 15,
    color: COLORS.darkGray,
    marginLeft: 14,
    fontWeight: '600',
    flex: 1,
  },
  menuItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  menuNotificationBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  menuNotificationBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
    marginHorizontal: 24,
  },
  logoutMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#ffebee',
    marginTop: 8,
  },
  logoutMenuText: {
    fontSize: 15,
    color: COLORS.danger,
    marginLeft: 14,
    fontWeight: '700',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 999,
  },
  section: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.black,
    marginBottom: 20,
    letterSpacing: -0.8,
  },
  sectionSubtitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.black,
    marginTop: 24,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  updateText: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 10,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  overviewCard: {
    width: '48%',
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  overviewValue: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.black,
    marginTop: 10,
    letterSpacing: -1,
  },
  overviewLabel: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F0F9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginBottom: 24,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statIcon: {
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.black,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 22,
    marginBottom: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    fontSize: 15,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    fontWeight: '500',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  inputLabel: {
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 10,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  customTimeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  addTimeSlotBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    minWidth: 90,
    alignItems: 'center',
    elevation: 2,
  },
  addTimeSlotBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  timeSlotOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  timeSlotSelected: {
    backgroundColor: '#F0F9D9',
    borderColor: COLORS.primary,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotLabel: {
    fontSize: 15,
    color: COLORS.black,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  backBtn: {
    padding: 10,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '700',
  },
  pollCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  pollTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  pollSlots: {
    fontSize: 15,
    color: COLORS.gray,
    marginBottom: 10,
    fontWeight: '500',
  },
  pollStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  pollStat: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: COLORS.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 15,
    color: COLORS.gray,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  responseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  responseInfo: {
    flex: 1,
    paddingRight: 12,
  },
  responseName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  responseLocation: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 6,
    fontWeight: '500',
  },
  responseDetail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    elevation: 2,
  },
  statusText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: '700',
  },
  driverResponseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  driverInfo: {
    flex: 1,
    paddingRight: 12,
  },
  driverName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  driverVan: {
    fontSize: 15,
    color: COLORS.gray,
    marginBottom: 6,
    fontWeight: '600',
  },
  driverDetail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  routeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  routeName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  stopsContainer: {
    marginBottom: 14,
    paddingLeft: 6,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.gray,
    marginRight: 14,
  },
  destinationDot: {
    backgroundColor: COLORS.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stopText: {
    fontSize: 15,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  destinationText: {
    fontWeight: '700',
    color: COLORS.primary,
    fontSize: 16,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  routeInfoText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
  },
  assignedDriverBadge: {
    backgroundColor: '#F0F9D9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  assignedDriverText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 4,
    fontWeight: '600',
  },
  assignModeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  modeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeBtnActive: {
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modeBtnText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  assignCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  assignRouteName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  assignRouteStops: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 14,
    fontWeight: '500',
  },
  alreadyAssigned: {
    backgroundColor: '#F0F9D9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  alreadyAssignedText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 4,
    fontWeight: '600',
  },
  timeSlotAssignSection: {
    marginBottom: 18,
  },
  timeSlotAssignTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  passengerCount: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
    fontWeight: '600',
  },
  driverSelectBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  driverSelectInfo: {
    flex: 1,
  },
  driverSelectText: {
    fontSize: 15,
    color: COLORS.black,
    fontWeight: '700',
    marginBottom: 4,
  },
  driverCapacity: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
    fontWeight: '500',
  },
  assignArrow: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: '800',
  },
  autoAssignHeader: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  autoAssignSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  autoAssignDesc: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
    fontWeight: '500',
  },
  autoAssignActions: {
    flexDirection: 'row',
    gap: 12,
  },
  autoAssignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flex: 1,
    justifyContent: 'center',
    elevation: 3,
  },
  autoAssignBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  approveAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flex: 1,
    justifyContent: 'center',
    elevation: 3,
  },
  approveAllBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  autoStatsCard: {
    backgroundColor: '#F0F9D9',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  autoStatsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  autoStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  autoStatItem: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  autoStatLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 6,
    fontWeight: '600',
  },
  autoStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.black,
    letterSpacing: -0.5,
  },
  autoRouteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  autoRouteApproved: {
    backgroundColor: '#d1fae5',
    borderColor: COLORS.success,
  },
  autoRouteSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F9D9',
  },
  autoRouteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  autoRouteDriverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  autoRouteDriverText: {
    flex: 1,
  },
  autoRouteDriverName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: -0.3,
  },
  autoRouteDriverVan: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
    fontWeight: '600',
  },
  autoRouteMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  autoRouteMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  autoRouteMetricText: {
    fontSize: 13,
    color: COLORS.black,
    fontWeight: '700',
  },
  capacityBarContainer: {
    marginBottom: 16,
  },
  capacityBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  capacityBarLabel: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '600',
  },
  capacityBarValue: {
    fontSize: 13,
    color: COLORS.black,
    fontWeight: '800',
  },
  capacityBarTrack: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  algorithmInfo: {
    backgroundColor: '#F0F9D9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  algorithmTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  algorithmText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  passengerSequence: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  passengerSequenceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  passengerSequenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  passengerSequenceNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerSequenceNumberText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  passengerSequenceInfo: {
    flex: 1,
  },
  passengerSequenceName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 4,
  },
  passengerSequenceLocation: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  autoRouteActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewDetailsBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  viewDetailsBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  approveRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    elevation: 2,
  },
  approveRouteBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  unassignedAlert: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.danger,
    marginTop: 10,
  },
  unassignedAlertContent: {
    flex: 1,
  },
  unassignedAlertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.danger,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  unassignedPassenger: {
    fontSize: 13,
    color: '#7f1d1d',
    marginBottom: 4,
    fontWeight: '500',
  },
  controlPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
  },
  playButton: {
    backgroundColor: COLORS.success,
  },
  pauseButton: {
    backgroundColor: COLORS.warning,
  },
  controlButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  activeVansText: {
    fontSize: 15,
    color: COLORS.black,
    fontWeight: '600',
  },
  activeVansCount: {
    fontWeight: '800',
    color: COLORS.primary,
  },
  trackingDetailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  vanHeader: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
  },
  vanDetailName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  vanDetailRoute: {
    fontSize: 14,
    color: COLORS.white,
    marginTop: 6,
    opacity: 0.95,
    fontWeight: '600',
  },
  mapContainer: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  mapSimulationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: -0.2,
  },
  liveBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  map: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 12,
  },
  coordinates: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 2,
  },
  speedText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 2,
  },
  etaText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: '600',
  },
  vanMarker: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 8,
    borderWidth: 3,
    borderColor: COLORS.black,
    elevation: 5,
  },
  stopMarker: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.gray,
    elevation: 3,
  },
  vanInfoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  vanInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  vanInfoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
  },
  vanInfoValue: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  passengerListCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  passengerListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  passengerCountBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    minWidth: 36,
    alignItems: 'center',
  },
  passengerCountText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  passengerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  passengerPicked: {
    backgroundColor: '#d1fae5',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  passengerCurrent: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  passengerPending: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  passengerName: {
    fontSize: 15,
    color: COLORS.black,
    fontWeight: '700',
  },
  passengerTime: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 6,
    fontWeight: '500',
  },
  passengerStatusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  statusPicked: {
    backgroundColor: COLORS.success,
  },
  statusCurrent: {
    backgroundColor: COLORS.warning,
  },
  statusPending: {
    backgroundColor: COLORS.gray,
  },
  passengerStatusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  stopsTimeline: {
    marginTop: 14,
  },
  timelineTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#e0e0e0',
    marginRight: 14,
    borderWidth: 3,
    borderColor: COLORS.gray,
  },
  timelineDotCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  timelineDotCurrent: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  timelineContent: {
    flex: 1,
  },
  timelineText: {
    fontSize: 15,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  timelineTextCompleted: {
    color: COLORS.success,
    fontWeight: '700',
  },
  timelineTextCurrent: {
    fontWeight: '800',
    color: COLORS.primary,
  },
  timelineStatus: {
    fontSize: 12,
    color: COLORS.success,
    marginTop: 4,
    fontWeight: '600',
  },
  timelineStatusCurrent: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: '700',
  },
  timelineEta: {
    fontSize: 13,
    color: COLORS.black,
    fontWeight: '700',
  },
  selectVanText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  vanCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderLeftWidth: 5,
  },
  vanColorIndicator: {
    width: 5,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  vanName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  vanDriver: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '600',
  },
  vanRoute: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '600',
  },
  vanTimeSlot: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '600',
  },
  vanLocation: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '600',
  },
  vanPassengers: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '600',
  },
  vanEta: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '700',
  },
  vanStatusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 10,
    elevation: 2,
  },
  vanStatusCompleted: {
    backgroundColor: COLORS.success,
  },
  vanStatusEnRoute: {
    backgroundColor: COLORS.warning,
  },
  vanStatusPaused: {
    backgroundColor: COLORS.gray,
  },
  vanStatusText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  requestCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  requestName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  requestDetail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 6,
    fontWeight: '500',
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 12,
  },
  actionBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    elevation: 2,
  },
  acceptBtn: {
    backgroundColor: COLORS.success,
  },
  rejectBtn: {
    backgroundColor: COLORS.danger,
  },
  actionBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginTop: 24,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 14,
    fontWeight: '600',
  },
  passengerPaymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  passengerName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: -0.3,
  },
  statusPaid: {
    backgroundColor: COLORS.success,
  },
  statusPending: {
    backgroundColor: COLORS.warning,
  },
  statusExpired: {
    backgroundColor: COLORS.danger,
  },
  paymentDetail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 6,
    fontWeight: '500',
  },
  passengerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 10,
  },
  reminderBtn: {
    backgroundColor: COLORS.warning,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    elevation: 2,
  },
  reminderBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  renewalBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    elevation: 2,
  },
  renewalBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  updateStatusBtn: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    elevation: 2,
  },
  updateStatusBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  complaintCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  complaintDetailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  complaintTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    flex: 1,
    paddingRight: 12,
    letterSpacing: -0.3,
  },
  complaintStatusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    elevation: 2,
  },
  complaintStatusOpen: {
    backgroundColor: COLORS.warning,
  },
  complaintStatusResolved: {
    backgroundColor: COLORS.success,
  },
  complaintStatusText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  complaintBy: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 10,
    fontWeight: '600',
  },
  complaintDesc: {
    fontSize: 15,
    color: COLORS.darkGray,
    marginBottom: 10,
    lineHeight: 22,
    fontWeight: '500',
  },
  complaintTime: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '500',
  },
  repliesContainer: {
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  repliesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  replyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  replyBy: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  replyText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  replyTime: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  noRepliesText: {
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 14,
  },
  replyInputContainer: {
    marginTop: 18,
  },
  replyInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  replyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 14,
    elevation: 3,
  },
  replyBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  resolveBtn: {
    backgroundColor: COLORS.success,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 14,
    elevation: 3,
  },
  resolveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray,
    width: 150,
  },
  profileValue: {
    fontSize: 15,
    color: COLORS.black,
    flex: 1,
    fontWeight: '600',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  markAllBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F0F9D9',
    elevation: 2,
  },
  markAllBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  notificationUnread: {
    backgroundColor: '#F0F9D9',
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  notificationContent: {
    flex: 1,
    paddingRight: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    fontWeight: '500',
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 8,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 14,
    fontWeight: '700',
  },
});

export default TransporterDashboard;