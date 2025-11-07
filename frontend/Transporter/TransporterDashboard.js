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
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';


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


// API Base URL - Update this to your actual backend URL
const API_BASE_URL = 'http://192.168.0.109:3000/api';



// API Service Functions
const apiService = {
  // Generic API call function
  async apiCall(endpoint, options = {}) {
    try {
      const token = await this.getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config = {
        ...options,
        headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async setToken(token) {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  async removeToken() {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  // ... rest of your API methods remain the same

  // Auth APIs
  async login(email, password) {
    return this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getProfile() {
    return this.apiCall('/profile');
  },

  async updateProfile(profileData) {
    return this.apiCall('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Dashboard APIs
  async getStats() {
    return this.apiCall('/dashboard/stats');
  },

  // Poll APIs
  async getPolls() {
    return this.apiCall('/polls');
  },

  async createPoll(pollData) {
    return this.apiCall('/polls', {
      method: 'POST',
      body: JSON.stringify(pollData),
    });
  },

  // Driver APIs
  async getDrivers() {
    return this.apiCall('/drivers');
  },

  async getDriverRequests() {
    return this.apiCall('/join-requests?type=driver');
  },

  async approveDriverRequest(requestId) {
    return this.apiCall(`/join-requests/${requestId}/accept`, {
      method: 'PUT',
    });
  },

  async rejectDriverRequest(requestId) {
    return this.apiCall(`/join-requests/${requestId}/reject`, {
      method: 'PUT',
    });
  },

  // Passenger APIs
  async getPassengers() {
    return this.apiCall('/passengers');
  },

  async getPassengerRequests() {
    return this.apiCall('/join-requests?type=passenger');
  },

  async approvePassengerRequest(requestId) {
    return this.apiCall(`/join-requests/${requestId}/accept`, {
      method: 'PUT',
    });
  },

  async rejectPassengerRequest(requestId) {
    return this.apiCall(`/join-requests/${requestId}/reject`, {
      method: 'PUT',
    });
  },

  // Route APIs
  async getRoutes() {
    return this.apiCall('/routes');
  },

  async createRoute(routeData) {
    return this.apiCall('/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  },

  async assignDriver(assignmentData) {
    return this.apiCall(`/routes/${assignmentData.routeId}/assign`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  },

  // Payment APIs
  async getDriverPayments() {
    return this.apiCall('/payments?type=driver');
  },

  async getPassengerPayments() {
    return this.apiCall('/payments?type=passenger');
  },

  async sendDriverPayment(paymentData) {
    return this.apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Complaint APIs
  async getComplaints() {
    return this.apiCall('/complaints');
  },

  async replyToComplaint(complaintId, replyData) {
    return this.apiCall(`/complaints/${complaintId}/reply`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  },

  async resolveComplaint(complaintId) {
    return this.apiCall(`/complaints/${complaintId}/resolve`, {
      method: 'PUT',
    });
  },

  // Notification APIs
  async getNotifications() {
    return this.apiCall('/notifications');
  },

  async markNotificationAsRead(notificationId) {
    return this.apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  // Trip APIs (Live Tracking)
  async getTrips() {
    return this.apiCall('/trips');
  },

  async updateTripLocation(tripId, locationData) {
    return this.apiCall(`/trips/${tripId}/location`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
  },

  // Auto Assignment API
  async generateAutoAssignments() {
    return this.apiCall('/auto-assign', {
      method: 'POST',
    });
  },
};

const TransporterDashboard = ()=> {
  const navigation = useNavigation(); 
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [paymentTab, setPaymentTab] = useState('driver');
  const [responseTab, setResponseTab] = useState('passenger');
  const [slideAnim] = useState(new Animated.Value(-250));
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVan, setSelectedVan] = useState(null);

  // Profile State
  const [profile, setProfile] = useState({
  name: 'Loading...',
  email: 'Loading...',
  phone: 'Loading...',
  company: 'Loading...',
  registrationDate: 'Loading...',
  address: 'Loading...',
  profileImage: '', 
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
  const [vanPositions, setVanPositions] = useState({});

  // Auto Assignment State
  const [autoAssignments, setAutoAssignments] = useState([]);
  const [unassignedInAuto, setUnassignedInAuto] = useState([]);
  const [selectedAutoRoute, setSelectedAutoRoute] = useState(null);
  const [viewMode, setViewMode] = useState('manual');

  // Initialize van positions
  useEffect(() => {
    const positions = vans.reduce((acc, van) => {
      acc[van.id] = {
        latitude: new Animated.Value(van.currentLocation?.latitude || 33.6844),
        longitude: new Animated.Value(van.currentLocation?.longitude || 73.0479),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(1),
      };
      return acc;
    }, {});
    setVanPositions(positions);
  }, [vans]);

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadProfile(),
        loadStats(),
        loadPolls(),
        loadPassengers(),
        loadDrivers(),
        loadRoutes(),
        loadDriverRequests(),
        loadPassengerRequests(),
        loadDriverPayments(),
        loadPassengerPayments(),
        loadComplaints(),
        loadNotifications(),
        loadTrips(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Individual data loading functions
  const loadProfile = async () => {
    try {
      const profileData = await apiService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await apiService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadPolls = async () => {
    try {
      const pollsData = await apiService.getPolls();
      setPolls(pollsData);
    } catch (error) {
      console.error('Error loading polls:', error);
    }
  };

  const loadPassengers = async () => {
    try {
      const passengersData = await apiService.getPassengers();
      setPassengerResponses(passengersData);
    } catch (error) {
      console.error('Error loading passengers:', error);
    }
  };

  const loadDrivers = async () => {
    try {
      const driversData = await apiService.getDrivers();
      setDriverAvailability(driversData);
    } catch (error) {
      console.error('Error loading drivers:', error);
    }
  };

  const loadRoutes = async () => {
    try {
      const routesData = await apiService.getRoutes();
      setRoutes(routesData);
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  const loadDriverRequests = async () => {
    try {
      const requestsData = await apiService.getDriverRequests();
      setDriverRequests(requestsData);
    } catch (error) {
      console.error('Error loading driver requests:', error);
    }
  };

  const loadPassengerRequests = async () => {
    try {
      const requestsData = await apiService.getPassengerRequests();
      setPassengerRequests(requestsData);
    } catch (error) {
      console.error('Error loading passenger requests:', error);
    }
  };

  const loadDriverPayments = async () => {
    try {
      const paymentsData = await apiService.getDriverPayments();
      setDriverPayments(paymentsData);
    } catch (error) {
      console.error('Error loading driver payments:', error);
    }
  };

  const loadPassengerPayments = async () => {
    try {
      const paymentsData = await apiService.getPassengerPayments();
      setPassengerPayments(paymentsData);
    } catch (error) {
      console.error('Error loading passenger payments:', error);
    }
  };

  const loadComplaints = async () => {
    try {
      const complaintsData = await apiService.getComplaints();
      setComplaints(complaintsData);
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationsData = await apiService.getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadTrips = async () => {
    try {
      const tripsData = await apiService.getTrips();
      // Convert trips to vans format for compatibility
      const vansData = tripsData.map(trip => ({
        id: trip._id,
        name: `Van ${trip.driverId?.name || 'Unknown'}`,
        driver: trip.driverId?.name || 'Unknown Driver',
        route: trip.routeId?.name || 'Unknown Route',
        timeSlot: '07:00 AM', // You might want to map this from your data
        status: trip.status,
        passengers: trip.passengers?.length || 0,
        capacity: 8, // Default capacity
        currentStop: trip.currentStop,
        stops: trip.routeId?.stops || [],
        completedStops: trip.completedStops || [],
        currentLocation: trip.currentLocation || { latitude: 33.6844, longitude: 73.0479 },
        speed: trip.speed || 0,
        eta: trip.eta || '0 min',
        color: '#3498DB',
        passengersList: trip.passengersList || [],
        notifiedPickups: false,
        notifiedComplete: false,
      }));
      setVans(vansData);
    } catch (error) {
      console.error('Error loading trips:', error);
    }
  };

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
      setStats(prev => ({
        ...prev,
        ongoingTrips: vans.filter(v => v.status === 'En Route').length,
        completedTrips: vans.filter(v => v.status === 'Completed').length,
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, [vans]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadAllData().finally(() => {
      setRefreshing(false);
      setLastUpdated(new Date());
    });
  }, []);

  // Poll Functions
  const addCustomTimeSlot = () => {
    if (!newTimeSlot) {
      Alert.alert('Error', 'Please enter a time slot');
      return;
    }
    setCustomTimeSlots([...customTimeSlots, newTimeSlot]);
    setNewTimeSlot('');
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
    if (!newPoll.title || !newPoll.selectedSlots.length || !newPoll.closingTime) {
      Alert.alert('Error', 'Please fill all fields and select at least one time slot');
      return;
    }

    try {
      const pollData = {
        title: newPoll.title,
        timeSlots: newPoll.selectedSlots,
        closesAt: newPoll.closingTime,
        closingDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      };

      const newPollData = await apiService.createPoll(pollData);
      setPolls(prev => [...prev, newPollData.poll]);
      setNewPoll({ title: '', selectedSlots: [], closingTime: '' });
      Alert.alert('Success', `Poll created with ${newPoll.selectedSlots.length} time slots`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create poll');
    }
  };

  // Route Functions
  const createRoute = async () => {
    if (!newRoute.name || !newRoute.stops) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const routeData = {
        name: newRoute.name,
        stops: newRoute.stops.split('\n').filter(s => s.trim()),
        destination: 'Gulberg Greens',
      };

      const newRouteData = await apiService.createRoute(routeData);
      setRoutes(prev => [...prev, newRouteData]);
      setNewRoute({ name: '', stops: '' });
      Alert.alert('Success', 'Route created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create route');
    }
  };

  const assignDriverToRoute = async (routeId, driverId, timeSlot) => {
    try {
      const driver = driverAvailability.find(d => d.id === driverId);
      const route = routes.find(r => r.id === routeId);
      
      if (!driver || !route || driver.status !== 'Available') {
        Alert.alert('Error', 'Invalid assignment');
        return;
      }

      const routePassengers = passengerResponses.filter(p => p.status === 'Confirmed' && p.selectedTimeSlot === timeSlot);
      if (routePassengers.length > driver.capacity) {
        Alert.alert('Warning', `Capacity exceeded: ${routePassengers.length}/${driver.capacity}`);
      }

      const assignmentData = {
        routeId,
        driverId,
        timeSlot,
        passengerIds: routePassengers.map(p => p.id),
      };

      await apiService.assignDriver(assignmentData);
      
      // Reload data to get updated assignments
      await loadRoutes();
      await loadDrivers();
      await loadTrips();
      
      Alert.alert('Success', `${driver.name} assigned to ${route.name} at ${timeSlot}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to assign driver');
    }
  };

  // Request Management
  const handleDriverRequest = async (requestId, action) => {
    try {
      if (action === 'accept') {
        await apiService.approveDriverRequest(requestId);
        Alert.alert('Success', 'Driver request accepted');
      } else {
        await apiService.rejectDriverRequest(requestId);
        Alert.alert('Rejected', 'Driver request rejected');
      }
      
      // Reload data
      await loadDriverRequests();
      await loadDrivers();
      await loadStats();
    } catch (error) {
      Alert.alert('Error', `Failed to ${action} driver request`);
    }
  };

  const handlePassengerRequest = async (requestId, action) => {
    try {
      if (action === 'accept') {
        await apiService.approvePassengerRequest(requestId);
        Alert.alert('Success', 'Passenger request accepted');
      } else {
        await apiService.rejectPassengerRequest(requestId);
        Alert.alert('Rejected', 'Passenger request rejected');
      }
      
      // Reload data
      await loadPassengerRequests();
      await loadPassengers();
      await loadStats();
    } catch (error) {
      Alert.alert('Error', `Failed to ${action} passenger request`);
    }
  };

  // Payment Functions
  const sendDriverPayment = async () => {
    if (!newPayment.driver || !newPayment.amount || !newPayment.mode) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const paymentData = {
        type: 'driver',
        driver: newPayment.driver,
        amount: parseInt(newPayment.amount),
        mode: newPayment.mode,
        status: 'Sent',
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      };

      await apiService.sendDriverPayment(paymentData);
      setNewPayment({ driver: '', amount: '', mode: 'Cash' });
      
      // Reload payments and stats
      await loadDriverPayments();
      await loadStats();
      
      Alert.alert('Success', 'Payment sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to send payment');
    }
  };

  const sendRenewalNotification = passengerId => Alert.alert('Notification Sent', 'Renewal reminder sent');
  const sendPaymentReminder = passengerId => Alert.alert('Reminder Sent', 'Payment reminder sent');
  
  const updatePaymentStatus = async (passengerId, newStatus) => {
    try {
      // You'll need to implement this API endpoint
      Alert.alert('Success', 'Payment status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update payment status');
    }
  };

  // Complaint Functions
  const resolveComplaint = async complaintId => {
    try {
      await apiService.resolveComplaint(complaintId);
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status: 'Resolved' } : c));
      await loadStats();
      Alert.alert('Success', 'Complaint resolved');
    } catch (error) {
      Alert.alert('Error', 'Failed to resolve complaint');
    }
  };

  const replyToComplaint = async (complaintId) => {
    if (!newReply.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }

    try {
      const replyData = {
        text: newReply,
      };

      await apiService.replyToComplaint(complaintId, replyData);
      setNewReply('');
      setSelectedResponse(null);
      
      // Reload complaints to get the updated replies
      await loadComplaints();
      
      Alert.alert('Success', 'Reply sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to send reply');
    }
  };

  // Profile Functions
  const saveProfile = async () => {
    try {
      await apiService.updateProfile(profile);
      setIsEditingProfile(false);
      Alert.alert('Success', 'Profile updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

 const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to log out?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // ✅ اگر آپ token وغیرہ save کرتے ہیں تو یہاں remove کر سکتے ہیں
          // AsyncStorage.removeItem("authToken");

          // ✅ اب user کو login screen پر واپس لے جائیں
          navigation.reset({
            index: 0,
            routes: [{ name: "TransporterLogin" }],
          });
        },
      },
    ]
  );
};


  // Get passengers/drivers by time slot
  const getPassengersByTimeSlot = timeSlot => passengerResponses.filter(p => p.status === 'Confirmed' && p.selectedTimeSlot === timeSlot);
  const getDriversByTimeSlot = timeSlot => driverAvailability.filter(d => d.availableTimeSlots?.includes(timeSlot) && d.status === 'Available');

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

  // Optimize route using nearest neighbor
  const optimizeRouteOrder = (driver, passengers) => {
    if (passengers.length === 0) return [];
    
    const route = [];
    const driverVanName = driver.van?.split(' ')[0] + ' Markaz';
    const driverLoc = stopCoordinates[driverVanName] || { latitude: 33.6844, longitude: 73.0479 };
    
    let current = { latitude: driverLoc.latitude, longitude: driverLoc.longitude };
    let remaining = [...passengers];
    
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
        route.push(nearest);
        const nextLoc = stopCoordinates[nearest.pickupPoint] || { latitude: 33.6844, longitude: 73.0479 };
        current = { latitude: nextLoc.latitude, longitude: nextLoc.longitude };
        remaining.splice(nearestIdx, 1);
      } else {
        break;
      }
    }
    
    return route;
  };

  // AUTOMATIC ASSIGNMENT ALGORITHM
  const handleAutoAssignment = async () => {
    try {
      const result = await apiService.generateAutoAssignments();
      setAutoAssignments(result.assignments);
      setUnassignedInAuto(result.unassigned);
      Alert.alert('Success', `Generated ${result.assignments.length} optimized routes with ${result.unassigned.length} unassigned passengers`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate auto assignments');
    }
  };

  const handleApproveAutoRoute = async (index) => {
    const assignment = autoAssignments[index];
    if (!assignment) return;

    try {
      // Update assignments state
      setAutoAssignments(prev => prev.map((a, i) => 
        i === index ? { ...a, status: 'approved' } : a
      ));

      // Create route from assignment
      const routeName = `Auto Route ${index + 1}: ${assignment.driver.van}`;
      const stops = assignment.passengers.map(p => p.pickupPoint);

      const routeData = {
        name: routeName,
        stops: stops,
        destination: 'Gulberg Greens',
        assignedDriver: assignment.driver._id,
        timeSlot: assignment.passengers[0]?.selectedTimeSlot || '07:00 AM',
        distance: assignment.totalDistance + ' km',
        duration: assignment.estimatedTime + ' min',
        passengers: assignment.passengers.map(p => p._id)
      };

      await apiService.createRoute(routeData);
      
      // Reload data
      await loadRoutes();
      await loadDrivers();
      
      Alert.alert('Route Approved', `${assignment.driver.name} assigned to ${routeName}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to approve auto route');
    }
  };

  const handleApproveAllAutoRoutes = () => {
    if (autoAssignments.length === 0) {
      Alert.alert('No Routes', 'No routes to approve');
      return;
    }

    autoAssignments.forEach((_, index) => {
      handleApproveAutoRoute(index);
    });
    Alert.alert('Success', 'All routes approved and assigned!');
  };

  // UI Components (Keep all your existing UI components exactly as they are)
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

  // Sections (Keep all your existing section components exactly as they are)
  // Only updating the data sources to use the state variables that now contain API data

  const ProfileSection = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Transporter Profile</Text>
      <View style={styles.card}>
        {isEditingProfile ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={profile.name}
              onChangeText={text => setProfile({ ...profile, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={profile.email}
              onChangeText={text => setProfile({ ...profile, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={profile.phone}
              onChangeText={text => setProfile({ ...profile, phone: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Company"
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
        Last Updated:{lastUpdated.toLocaleString('en-PK', { 
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
      <Text></Text>

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
    </ScrollView>
  );

  // ... Keep all your other section components exactly as they were ...
 const PollSection = () => (
  <ScrollView style={styles.section}>
    <Text style={styles.sectionTitle}>Create Travel Poll</Text>
    <View style={styles.card}>
      <TextInput 
        style={styles.input} 
        placeholder="Poll Title" 
        value={newPoll.title} 
        onChangeText={text => setNewPoll({ ...newPoll, title: text })} 
      />
      <Text style={styles.inputLabel}>Add Custom Time Slot:</Text>
      <View style={styles.customTimeSlotContainer}>
        <TextInput 
          style={[styles.input, { flex: 1, marginRight: 10 }]} 
          placeholder="Enter time (e.g., 09:00 AM)" 
          value={newTimeSlot} 
          onChangeText={setNewTimeSlot} 
        />
        <TouchableOpacity style={styles.addTimeSlotBtn} onPress={addCustomTimeSlot}>
          <Text style={styles.addTimeSlotBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.inputLabel}>Select Time Slots:</Text>
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
        placeholder="Closing Time (e.g., 22:00)" 
        value={newPoll.closingTime} 
        onChangeText={text => setNewPoll({ ...newPoll, closingTime: text })} 
      />
      <TouchableOpacity style={styles.primaryBtn} onPress={createPoll}>
        <Text style={styles.primaryBtnText}>Send Poll</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.sectionSubtitle}>Active Polls</Text>
    {polls.length > 0 ? polls.map(poll => (
      <View key={poll._id || poll.id} style={styles.pollCard}>
        <Text style={styles.pollTitle}>{poll.title}</Text>
        <Text style={styles.pollSlots}>Slots: {poll.timeSlots?.join(', ') || 'No slots'}</Text>
        <View style={styles.pollStats}>
          <Text style={styles.pollStat}>
            {poll.responses?.length || 0}/{passengerResponses.length}
          </Text>
          <Text style={styles.pollStat}>Closes: {poll.closesAt}</Text>
        </View>
        <Text style={styles.pollDate}>{new Date(poll.createdAt).toLocaleDateString()}</Text>
      </View>
    )) : (
      <View style={styles.emptyState}>
        <Icon name="poll" size={48} color="#999" />
        <Text style={styles.emptyText}>No active polls</Text>
      </View>
    )}
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
        <Text style={styles.sectionSubtitle}>Confirmed Passengers</Text>
        {passengerResponses.filter(p => p.status === 'Confirmed').length > 0 ? (
          passengerResponses.filter(p => p.status === 'Confirmed').map(p => (
            <View key={p._id || p.id} style={styles.responseCard}>
              <View style={styles.responseInfo}>
                <Text style={styles.responseName}>{p.name}</Text>
                <Text style={styles.responseLocation}>Pickup: {p.pickupPoint}</Text>
                <Text style={styles.responseDetail}>Time: {p.selectedTimeSlot || 'Not selected'}</Text>
                <Text style={styles.responseDetail}>{p.phone}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: COLORS.success }]}>
                <Text style={styles.statusText}>Confirmed</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="people" size={48} color="#999" />
            <Text style={styles.emptyText}>No confirmed passengers</Text>
          </View>
        )}
        
        <Text style={styles.sectionSubtitle}>Not Confirmed</Text>
        {passengerResponses.filter(p => p.status !== 'Confirmed').length > 0 ? (
          passengerResponses.filter(p => p.status !== 'Confirmed').map(p => (
            <View key={p._id || p.id} style={styles.responseCard}>
              <View style={styles.responseInfo}>
                <Text style={styles.responseName}>{p.name}</Text>
                <Text style={styles.responseLocation}>Pickup: {p.pickupPoint}</Text>
                <Text style={styles.responseDetail}>{p.phone}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: COLORS.gray }]}>
                <Text style={styles.statusText}>{p.status || 'Not Confirmed'}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="people-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>All passengers confirmed</Text>
          </View>
        )}
      </>
    )}
    
    {responseTab === 'driver' && (
      <>
        <Text style={styles.sectionSubtitle}>Available Drivers</Text>
        {driverAvailability.filter(d => d.status === 'Available').length > 0 ? (
          driverAvailability.filter(d => d.status === 'Available').map(d => (
            <View key={d._id || d.id} style={styles.driverResponseCard}>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{d.name}</Text>
                <Text style={styles.driverVan}>{d.van}</Text>
                <Text style={styles.driverDetail}>Capacity: {d.capacity}</Text>
                <Text style={styles.driverDetail}>
                  Available: {d.availableTimeSlots?.join(', ') || 'No slots'}
                </Text>
                <Text style={styles.driverDetail}>{d.phone}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: COLORS.success }]}>
                <Text style={styles.statusText}>Available</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="directions-car" size={48} color="#999" />
            <Text style={styles.emptyText}>No available drivers</Text>
          </View>
        )}
        
        <Text style={styles.sectionSubtitle}>Not Available</Text>
        {driverAvailability.filter(d => d.status !== 'Available').length > 0 ? (
          driverAvailability.filter(d => d.status !== 'Available').map(d => (
            <View key={d._id || d.id} style={styles.driverResponseCard}>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{d.name}</Text>
                <Text style={styles.driverVan}>{d.van}</Text>
                <Text style={styles.driverDetail}>Capacity: {d.capacity}</Text>
                <Text style={styles.driverDetail}>{d.phone}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: COLORS.gray }]}>
                <Text style={styles.statusText}>{d.status}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="directions-car" size={48} color="#999" />
            <Text style={styles.emptyText}>All drivers available</Text>
          </View>
        )}
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
        placeholder="Route Name" 
        value={newRoute.name} 
        onChangeText={text => setNewRoute({ ...newRoute, name: text })} 
      />
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Stops (one per line)" 
        value={newRoute.stops} 
        onChangeText={text => setNewRoute({ ...newRoute, stops: text })} 
        multiline 
      />
      <TouchableOpacity style={styles.primaryBtn} onPress={createRoute}>
        <Text style={styles.primaryBtnText}>Create Route</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.sectionSubtitle}>Existing Routes</Text>
    {routes.length > 0 ? routes.map(route => (
      <View key={route._id || route.id} style={styles.routeCard}>
        <Text style={styles.routeName}>{route.name}</Text>
        <View style={styles.stopsContainer}>
          {route.stops?.map((stop, i) => (
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
            <Text style={styles.assignedDriverText}>
              Driver: {typeof route.assignedDriver === 'object' ? route.assignedDriver.name : route.assignedDriver}
            </Text>
            <Text style={styles.assignedDriverText}>Time: {route.timeSlot}</Text>
            <Text style={styles.assignedDriverText}>
              Passengers: {route.passengers?.length || 0}
            </Text>
          </View>
        )}
      </View>
    )) : (
      <View style={styles.emptyState}>
        <Icon name="map" size={48} color="#999" />
        <Text style={styles.emptyText}>No routes created</Text>
      </View>
    )}
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
        {routes.length > 0 ? routes.map(route => (
          <View key={route._id || route.id} style={styles.assignCard}>
            <Text style={styles.assignRouteName}>{route.name}</Text>
            <Text style={styles.assignRouteStops}>
              {route.stops?.join(' → ')} → {route.destination}
            </Text>
            {route.assignedDriver ? (
              <View style={styles.alreadyAssigned}>
                <Text style={styles.alreadyAssignedText}>
                  Driver: {typeof route.assignedDriver === 'object' ? route.assignedDriver.name : route.assignedDriver}
                </Text>
                <Text style={styles.alreadyAssignedText}>Time: {route.timeSlot}</Text>
                <Text style={styles.alreadyAssignedText}>
                  Passengers: {route.passengers?.length || 0}
                </Text>
              </View>
            ) : (
              customTimeSlots.map(slot => {
                const drivers = getDriversByTimeSlot(slot);
                const passengers = getPassengersByTimeSlot(slot);
                return drivers.length > 0 ? (
                  <View key={slot} style={styles.timeSlotAssignSection}>
                    <Text style={styles.timeSlotAssignTitle}>{slot}</Text>
                    <Text style={styles.passengerCount}>{passengers.length} passengers</Text>
                    {drivers.map(d => (
                      <TouchableOpacity 
                        key={d._id || d.id} 
                        style={styles.driverSelectBtn} 
                        onPress={() => assignDriverToRoute(route._id || route.id, d._id || d.id, slot)}
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
        )) : (
          <View style={styles.emptyState}>
            <Icon name="assignment" size={48} color="#999" />
            <Text style={styles.emptyText}>No routes available for assignment</Text>
          </View>
        )}
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
                  {(autoAssignments.reduce((sum, a) => sum + parseFloat(a.efficiencyScore || 0), 0) / autoAssignments.length).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.autoStatItem}>
                <Text style={styles.autoStatLabel}>Avg Distance</Text>
                <Text style={styles.autoStatValue}>
                  {(autoAssignments.reduce((sum, a) => sum + parseFloat(a.totalDistance || 0), 0) / autoAssignments.length).toFixed(1)} km
                </Text>
              </View>
              <View style={styles.autoStatItem}>
                <Text style={styles.autoStatLabel}>Utilization</Text>
                <Text style={styles.autoStatValue}>
                  {(autoAssignments.reduce((sum, a) => sum + parseFloat(a.utilization || 0), 0) / autoAssignments.length).toFixed(0)}%
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
                  <View key={passenger._id || passenger.id} style={styles.passengerSequenceItem}>
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
                <Text key={p._id || p.id} style={styles.unassignedPassenger}>
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
const NotificationsSection = () => {
  const markAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      // You might need to implement a bulk read endpoint
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // You might need to implement a delete endpoint
      setNotifications(notifications.filter(n => n._id !== notificationId));
      Alert.alert('Deleted', 'Notification deleted');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    const seconds = Math.floor((new Date() - date) / 1000);
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
        </View>
      ) : (
        notifications.map(notification => (
          <TouchableOpacity
            key={notification._id}
            style={[styles.notificationCard, !notification.read && styles.notificationUnread]}
            onPress={() => markAsRead(notification._id)}
          >
            <View style={[styles.notificationIcon, { backgroundColor: (notification.color || COLORS.primary) + '20' }]}>
              <Icon name={notification.icon || 'notifications'} size={24} color={notification.color || COLORS.primary} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>
                {getTimeAgo(notification.createdAt || notification.timestamp)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => deleteNotification(notification._id)}>
              <Icon name="close" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};
const LiveTrackingSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const mapRef = useRef(null);
  const [vanProgress, setVanProgress] = useState({});

  const VAN_COLOR = COLORS.primary;

  const fitToRoute = useCallback((van) => {
    if (mapRef.current && van) {
      const coordinates = van.stops
        ?.map((stop) => stopCoordinates[stop])
        .filter((coord) => coord && coord.latitude && coord.longitude) || [];
      
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
  }, []);

  // Animation effect remains similar but uses API data
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(async () => {
      // Simulate van movement - in real app, you'd get updates from API
      setVanProgress(prev => {
        const newProgress = { ...prev };
        const updatedVans = vans.map((van) => {
          if (van.status !== 'En Route') return van;

          newProgress[van.id] = Math.min((prev[van.id] || 0) + 0.003, 0.99);

          // Update van position logic here...
          // This would typically come from real GPS data

          return van;
        });

        setVans(updatedVans);
        return newProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isPlaying]);

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
          
          {/* Map and tracking details - similar to before but using API data */}
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
                latitude: selectedVan.currentLocation?.latitude || 33.6844,
                longitude: selectedVan.currentLocation?.longitude || 73.0479,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              }}
            >
              {/* Map markers and polylines using API data */}
              <Marker
                coordinate={selectedVan.currentLocation || { latitude: 33.6844, longitude: 73.0479 }}
                title={selectedVan.name}
                description={`${selectedVan.currentStop} | ETA: ${selectedVan.eta}`}
              >
                <View style={[styles.vanMarker, { borderColor: VAN_COLOR }]}>
                  <Icon name="directions-car" size={30} color={VAN_COLOR} />
                </View>
              </Marker>
              
              {selectedVan.stops?.map((stop, index) => (
                <Marker
                  key={index}
                  coordinate={stopCoordinates[stop] || { latitude: 33.6844, longitude: 73.0479 }}
                  title={stop}
                >
                  <View style={styles.stopMarker}>
                    <Icon
                      name={stop === selectedVan.stops[0] ? 'flag' : 'location-pin'}
                      size={stop === selectedVan.stops[0] ? 32 : 24}
                      color={COLORS.primary}
                    />
                  </View>
                </Marker>
              ))}
            </MapView>
          </View>

          {/* Van details using API data */}
          <View style={styles.vanInfoCard}>
            <Text style={styles.cardTitle}>Van Details</Text>
            <View style={styles.vanInfoRow}>
              <Text style={styles.vanInfoLabel}>Route</Text>
              <Text style={styles.vanInfoValue}>{selectedVan.route}</Text>
            </View>
            <View style={styles.vanInfoRow}>
              <Text style={styles.vanInfoLabel}>Driver</Text>
              <Text style={styles.vanInfoValue}>{selectedVan.driver}</Text>
            </View>
            <View style={styles.vanInfoRow}>
              <Text style={styles.vanInfoLabel}>Capacity</Text>
              <Text style={styles.vanInfoValue}>
                {selectedVan.passengers}/{selectedVan.capacity}
              </Text>
            </View>
            <View style={styles.vanInfoRow}>
              <Text style={styles.vanInfoLabel}>Status</Text>
              <Text style={styles.vanInfoValue}>{selectedVan.status}</Text>
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
          >
            {vans.map((van) => (
              <Marker
                key={van.id}
                coordinate={van.currentLocation || { latitude: 33.6844, longitude: 73.0479 }}
                title={van.name}
                description={van.currentStop}
                onPress={() => setSelectedVan(van)}
              >
                <View style={[styles.vanMarker, { borderColor: VAN_COLOR }]}>
                  <Icon
                    name="directions-car"
                    size={24}
                    color={
                      van.status === 'Completed' ? COLORS.success : 
                      van.status === 'En Route' ? COLORS.warning : COLORS.gray
                    }
                  />
                </View>
              </Marker>
            ))}
          </MapView>
          
          {vans.length > 0 ? vans.map((van) => (
            <TouchableOpacity
              key={van.id}
              style={[styles.vanCard, { borderColor: VAN_COLOR }]}
              onPress={() => setSelectedVan(van)}
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
              <Text style={styles.vanDriver}>Driver: {van.driver}</Text>
              <Text style={styles.vanRoute}>Route: {van.route}</Text>
              <Text style={styles.vanLocation}>Current: {van.currentStop}</Text>
              <Text style={styles.vanPassengers}>
                {van.passengers}/{van.capacity} passengers
              </Text>
            </TouchableOpacity>
          )) : (
            <View style={styles.emptyState}>
              <Icon name="directions-car" size={48} color="#999" />
              <Text style={styles.emptyText}>No vans available for tracking</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};
const DriverRequestsSection = () => (
  <ScrollView style={styles.section}>
    <Text style={styles.sectionTitle}>Driver Join Requests</Text>
    {driverRequests.length > 0 ? driverRequests.map(request => (
      <View key={request._id} style={styles.requestCard}>
        <Text style={styles.requestName}>{request.name}</Text>
        <Text style={styles.requestDetail}>Vehicle: {request.vehicle}</Text>
        <Text style={styles.requestDetail}>Capacity: {request.capacity}</Text>
        <Text style={styles.requestDetail}>Experience: {request.experience}</Text>
        <Text style={styles.requestDetail}>Phone: {request.phone}</Text>
        <Text style={styles.requestDetail}>License: {request.license}</Text>
        <Text style={styles.requestDetail}>
          Available Slots: {request.availableTimeSlots?.join(', ') || 'Not specified'}
        </Text>
        <View style={styles.requestActions}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.acceptBtn]} 
            onPress={() => handleDriverRequest(request._id, 'accept')}
          >
            <Text style={styles.actionBtnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.rejectBtn]} 
            onPress={() => handleDriverRequest(request._id, 'reject')}
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
    {passengerRequests.length > 0 ? passengerRequests.map(request => (
      <View key={request._id} style={styles.requestCard}>
        <Text style={styles.requestName}>{request.name}</Text>
        <Text style={styles.requestDetail}>Location: {request.location}</Text>
        <Text style={styles.requestDetail}>Pickup: {request.pickupPoint}</Text>
        <Text style={styles.requestDetail}>Destination: {request.destination}</Text>
        <Text style={styles.requestDetail}>Preferred Time: {request.preferredTimeSlot}</Text>
        <Text style={styles.requestDetail}>Phone: {request.phone}</Text>
        <View style={styles.requestActions}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.acceptBtn]} 
            onPress={() => handlePassengerRequest(request._id, 'accept')}
          >
            <Text style={styles.actionBtnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.rejectBtn]} 
            onPress={() => handlePassengerRequest(request._id, 'reject')}
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
        <Text style={styles.tabText}>Passenger Payments</Text>
      </TouchableOpacity>
    </View>
    
    {paymentTab === 'driver' && (
      <>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Send Payment to Driver</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Driver Name" 
            value={newPayment.driver} 
            onChangeText={text => setNewPayment({ ...newPayment, driver: text })} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Amount" 
            value={newPayment.amount} 
            onChangeText={text => setNewPayment({ ...newPayment, amount: text })} 
            keyboardType="numeric" 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Payment Mode" 
            value={newPayment.mode} 
            onChangeText={text => setNewPayment({ ...newPayment, mode: text })} 
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={sendDriverPayment}>
            <Text style={styles.primaryBtnText}>Send Payment</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionSubtitle}>Payment History</Text>
        {driverPayments.length > 0 ? driverPayments.map(payment => (
          <View key={payment._id} style={styles.passengerPaymentCard}>
            <View style={styles.paymentHeader}>
              <Text style={styles.passengerName}>
                {typeof payment.driverId === 'object' ? payment.driverId.name : payment.driver}
              </Text>
              <View style={[
                styles.passengerStatusBadge, 
                payment.status === 'Confirmed' && styles.statusPaid,
                payment.status === 'Pending' && styles.statusPending,
                payment.status === 'Failed' && styles.statusExpired
              ]}>
                <Text style={styles.passengerStatusText}>{payment.status}</Text>
              </View>
            </View>
            <Text style={styles.paymentDetail}>Amount: PKR {payment.amount}</Text>
            <Text style={styles.paymentDetail}>Mode: {payment.mode}</Text>
            <Text style={styles.paymentDetail}>Date: {new Date(payment.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.paymentDetail}>Month: {payment.month}</Text>
          </View>
        )) : (
          <View style={styles.emptyState}>
            <Icon name="account-balance-wallet" size={48} color="#999" />
            <Text style={styles.emptyText}>No driver payments</Text>
          </View>
        )}
      </>
    )}
    
    {paymentTab === 'passenger' && (
      <>
        {passengerPayments.length > 0 ? passengerPayments.map(payment => (
          <View key={payment._id} style={styles.passengerPaymentCard}>
            <View style={styles.paymentHeader}>
              <Text style={styles.passengerName}>
                {typeof payment.passengerId === 'object' ? payment.passengerId.name : payment.passenger}
              </Text>
              <View style={[
                styles.passengerStatusBadge, 
                payment.status === 'Paid' && styles.statusPaid,
                payment.status === 'Pending' && styles.statusPending,
                payment.status === 'Expired' && styles.statusExpired
              ]}>
                <Text style={styles.passengerStatusText}>{payment.status}</Text>
              </View>
            </View>
            <Text style={styles.paymentDetail}>Amount: PKR {payment.amount}</Text>
            <Text style={styles.paymentDetail}>
              Last Payment: {new Date(payment.lastPaymentDate).toLocaleDateString()}
            </Text>
            <Text style={styles.paymentDetail}>
              Expiry: {new Date(payment.expiryDate).toLocaleDateString()}
            </Text>
            <View style={styles.passengerActions}>
              {payment.status === 'Expired' && (
                <TouchableOpacity 
                  style={styles.reminderBtn} 
                  onPress={() => sendPaymentReminder(payment._id)}
                >
                  <Text style={styles.reminderBtnText}>Send Reminder</Text>
                </TouchableOpacity>
              )}
              {payment.status === 'Paid' && (
                <TouchableOpacity 
                  style={styles.renewalBtn} 
                  onPress={() => sendRenewalNotification(payment._id)}
                >
                  <Text style={styles.renewalBtnText}>Renewal Notice</Text>
                </TouchableOpacity>
              )}
              {(payment.status === 'Pending' || payment.status === 'Expired') && (
                <TouchableOpacity 
                  style={styles.updateStatusBtn} 
                  onPress={() => updatePaymentStatus(payment._id, 'Paid')}
                >
                  <Text style={styles.updateStatusBtnText}>Mark Paid</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )) : (
          <View style={styles.emptyState}>
            <Icon name="account-balance-wallet" size={48} color="#999" />
            <Text style={styles.emptyText}>No passenger payments</Text>
          </View>
        )}
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
          <Text style={styles.backBtnText}>← Back to List</Text>
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
        <Text style={styles.complaintBy}>By: {selectedResponse.byName}</Text>
        <Text style={styles.complaintDesc}>{selectedResponse.description}</Text>
        <Text style={styles.complaintTime}>
          {new Date(selectedResponse.createdAt).toLocaleDateString()} at {new Date(selectedResponse.createdAt).toLocaleTimeString()}
        </Text>
        
        <View style={styles.repliesContainer}>
          <Text style={styles.repliesTitle}>Replies</Text>
          {selectedResponse.replies?.length > 0 ? selectedResponse.replies.map(reply => (
            <View key={reply._id || reply.id} style={styles.replyItem}>
              <Text style={styles.replyBy}>{reply.by}</Text>
              <Text style={styles.replyText}>{reply.text}</Text>
              <Text style={styles.replyTime}>
                {new Date(reply.date).toLocaleDateString()} at {reply.time}
              </Text>
            </View>
          )) : (
            <Text style={styles.noRepliesText}>No replies yet</Text>
          )}
        </View>
        
        {selectedResponse.status === 'Open' && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={[styles.input, styles.replyInput]}
              placeholder="Type your reply..."
              value={newReply}
              onChangeText={setNewReply}
              multiline
            />
            <TouchableOpacity 
              style={styles.replyBtn} 
              onPress={() => replyToComplaint(selectedResponse._id)}
            >
              <Text style={styles.replyBtnText}>Send Reply</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {selectedResponse.status === 'Open' && (
          <TouchableOpacity 
            style={styles.resolveBtn} 
            onPress={() => resolveComplaint(selectedResponse._id)}
          >
            <Text style={styles.resolveBtnText}>Mark as Resolved</Text>
          </TouchableOpacity>
        )}
      </View>
    ) : (
      <>
        {complaints.length > 0 ? complaints.map(complaint => (
          <TouchableOpacity 
            key={complaint._id} 
            style={styles.complaintCard} 
            onPress={() => setSelectedResponse(complaint)}
          >
            <View style={styles.complaintHeader}>
              <Text style={styles.complaintTitle}>{complaint.title}</Text>
              <View style={[
                styles.complaintStatusBadge, 
                complaint.status === 'Open' && styles.complaintStatusOpen,
                complaint.status === 'Resolved' && styles.complaintStatusResolved
              ]}>
                <Text style={styles.complaintStatusText}>{complaint.status}</Text>
              </View>
            </View>
            <Text style={styles.complaintBy}>By: {complaint.byName}</Text>
            <Text style={styles.complaintDesc}>
              {complaint.description?.length > 100 
                ? complaint.description.substring(0, 100) + '...' 
                : complaint.description
              }
            </Text>
            <Text style={styles.complaintTime}>
              {new Date(complaint.createdAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )) : (
          <View style={styles.emptyState}>
            <Icon name="check-circle" size={48} color="#999" />
            <Text style={styles.emptyText}>No complaints</Text>
          </View>
        )}
      </>
    )}
  </ScrollView>
);

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
              <Text style={styles.menuNotificationBadgeText}>
                {notifications.filter(n => !n.read).length}
              </Text>
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

  // For brevity, I'm showing that you should keep all your existing UI components
  // The only changes needed are replacing static data with state variables that now contain API data

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
    </SafeAreaView>
  );
};

// Keep all your existing styles exactly as they are
const styles = StyleSheet.create({
  // ... ALL YOUR EXISTING STYLES REMAIN EXACTLY THE SAME ...
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 10,
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  // ==================== CONTAINER & LAYOUT ====================
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 10,
  },

  // ==================== HEADER ====================
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  
  headerDate: {
    fontSize: 11,
    color: COLORS.white,
    marginTop: 3,
    opacity: 0.9,
    fontWeight: '500',
  },
  
  headerRight: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  
  notificationBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
  },

  // ==================== SIDEBAR ====================
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

  // ==================== SECTIONS ====================
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

  // ==================== OVERVIEW SECTION ====================
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

  // ==================== STATS CARD ====================
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

  // ==================== QUICK ACTIONS ====================
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

  // ==================== CARDS ====================
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

  // ==================== INPUT FIELDS ====================
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

  // ==================== TIME SLOTS ====================
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

  // ==================== BUTTONS ====================
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

  // ==================== POLL CARDS ====================
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

  // ==================== TABS ====================
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

  // ==================== RESPONSE CARDS ====================
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

  // ==================== DRIVER RESPONSE CARDS ====================
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

  // ==================== ROUTE CARDS ====================
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

  // ==================== ASSIGN SECTION ====================
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

  // ==================== TRACKING SECTION ====================
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
  
  activeVansText: {
    fontSize: 15,
    color: COLORS.black,
    fontWeight: '600',
  },
  
  activeVansCount: {
    fontWeight: '800',
    color: COLORS.primary,
  },
  
  selectVanText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: -0.2,
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

  // ==================== MAP ====================
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

  // ==================== VAN INFO ====================
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

  // ==================== PASSENGER LIST ====================
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
    fontSize: 13,color: COLORS.gray,
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

  // ==================== TIMELINE ====================
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

  // ==================== VAN CARDS ====================
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

  
  // ==================== AUTO ASSIGNMENT STYLES ====================
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
  // ==================== REQUEST CARDS ====================
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

  // ==================== EMPTY STATE ====================
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

  // ==================== PAYMENT SECTION ====================
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

  // ==================== COMPLAINTS SECTION ====================
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

  // ==================== PROFILE SECTION ====================
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

  // ==================== NOTIFICATIONS SECTION ====================
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

  // ==================== LOADING ====================
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

  // ==================== UPDATE TEXT ====================
  updateText: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 10,
    fontStyle: 'italic',
    fontWeight: '500',
  },
});




export default TransporterDashboard;