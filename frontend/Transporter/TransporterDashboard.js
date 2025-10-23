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

const { width } = Dimensions.get('window');

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
    activeDrivers: 2,
    totalPassengers: 12,
    completedTrips: 7,
    ongoingTrips: 1,
    complaints: 1,
    paymentsReceived: 45000,
    paymentsPending: 15000,
  });

  // Custom Time Slots for Polls
  const [customTimeSlots, setCustomTimeSlots] = useState(['07:00 AM', '07:30 AM', '08:00 AM']);
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // Poll State
  const [polls, setPolls] = useState([
    {
      id: 1,
      title: "Tomorrow's Travel Poll - October 24",
      timeSlots: ['07:00 AM', '07:30 AM', '08:00 AM'],
      responses: 10,
      total: 12,
      closesAt: "22:00",
      active: true,
      date: '23 Oct 2025',
    },
  ]);
  const [newPoll, setNewPoll] = useState({
    title: '',
    selectedSlots: [],
    closingTime: '',
  });

  // Passenger Responses
  const [passengerResponses, setPassengerResponses] = useState([
    { id: 1, name: 'Ali Hassan', status: 'Confirmed', selectedTimeSlot: '07:00 AM', location: 'F-7, Islamabad', pickupPoint: 'F-7 Markaz', contact: '0300-1234567' },
    { id: 2, name: 'Fatima Khan', status: 'Confirmed', selectedTimeSlot: '07:30 AM', location: 'F-8, Islamabad', pickupPoint: 'F-8 Markaz', contact: '0301-2345678' },
    { id: 3, name: 'Bilal Ahmed', status: 'Confirmed', selectedTimeSlot: '07:00 AM', location: 'Chaklala, Rawalpindi', pickupPoint: 'Chaklala Bus Stop', contact: '0302-3456789' },
    { id: 4, name: 'Sara Ali', status: 'Not Confirmed', selectedTimeSlot: null, location: 'G-11, Islamabad', pickupPoint: 'G-11 Markaz', contact: '0303-4567890' },
  ]);

  // Driver Availability
  const [driverAvailability, setDriverAvailability] = useState([
    { id: 1, name: 'Ahmed Khan', van: 'Van 1 (Toyota Hiace)', status: 'Available', availableTimeSlots: ['07:00 AM', '07:30 AM'], capacity: 8, contact: '0310-1234567', experience: '5 years' },
    { id: 2, name: 'Hassan Ali', van: 'Van 2 (Suzuki Every)', status: 'Assigned', availableTimeSlots: [], capacity: 6, contact: '0311-2345678', experience: '3 years' },
    { id: 3, name: 'Usman Tariq', van: 'Van 3 (Toyota Hiace)', status: 'Available', availableTimeSlots: ['08:00 AM'], capacity: 8, contact: '0312-3456789', experience: '4 years' },
  ]);

  // Routes
  const [routes, setRoutes] = useState([
    { id: 1, name: 'Route 1: Chaklala → Gulberg Greens', stops: ['Chaklala Bus Stop', 'Korang Road', 'Scheme 3', 'PWD Housing'], destination: 'Gulberg Greens', assignedDriver: 'Ahmed Khan', timeSlot: '07:00 AM', distance: '18 km', duration: '35 min', passengers: ['Ali Hassan', 'Bilal Ahmed'] },
    { id: 2, name: 'Route 2: F-Sectors → Gulberg Greens', stops: ['F-7 Markaz', 'F-8 Markaz', 'F-10 Markaz', 'I-10 Markaz'], destination: 'Gulberg Greens', assignedDriver: 'Hassan Ali', timeSlot: '07:30 AM', distance: '15 km', duration: '30 min', passengers: ['Fatima Khan'] },
  ]);
  const [newRoute, setNewRoute] = useState({ name: '', stops: '' });

  // Driver & Passenger Requests
  const [driverRequests, setDriverRequests] = useState([
    { id: 1, name: 'Kamran Shah', experience: '6 years', vehicle: 'Toyota Hiace 2018', capacity: 10, availableTimeSlots: ['07:00 AM', '08:00 AM', '05:00 PM'], contact: '0313-4567890', license: 'LHR-1234567' },
  ]);

  const [passengerRequests, setPassengerRequests] = useState([
    { id: 1, name: 'Zainab Malik', location: 'G-10, Islamabad', pickupPoint: 'G-10 Markaz', preferredTimeSlot: '07:30 AM', contact: '0314-5678901', destination: 'Gulberg Greens' },
  ]);

  // Payments
  const [driverPayments, setDriverPayments] = useState([
    { id: 1, driver: 'Ahmed Khan - Van 1', amount: 15000, mode: 'Bank Transfer', date: '22 Oct 2025', status: 'Confirmed', month: 'October 2025' },
  ]);

  const [passengerPayments, setPassengerPayments] = useState([
    { id: 1, passenger: 'Ali Hassan', status: 'Paid', amount: 5000, expiryDate: '30 Nov 2025', lastPaymentDate: '01 Oct 2025', location: 'F-7, Islamabad' },
    { id: 2, passenger: 'Sara Ali', status: 'Pending', amount: 5000, expiryDate: '25 Oct 2025', lastPaymentDate: '25 Sep 2025', location: 'G-11, Islamabad' },
    { id: 3, passenger: 'Ahmed Ali', status: 'Expired', amount: 5000, expiryDate: '20 Oct 2025', lastPaymentDate: '20 Sep 2025', location: 'Chaklala, Rawalpindi' },
  ]);
  const [newPayment, setNewPayment] = useState({ driver: '', amount: '', mode: 'Cash' });

  // Complaints
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      by: 'Passenger',
      byName: 'Ali Hassan',
      title: 'Late pickup',
      description: 'Driver was 15 minutes late at F-7 Markaz',
      status: 'Open',
      date: '23 Oct 2025',
      time: '08:30 AM',
      replies: [],
    },
  ]);
  const [newReply, setNewReply] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Complaint',
      message: 'Ali Hassan complained about late pickup.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      icon: 'warning',
      color: COLORS.danger,
      read: false,
    },
    {
      id: 2,
      title: 'Payment Received',
      message: 'Received PKR 5000 from Fatima Khan.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      icon: 'payment',
      color: COLORS.success,
      read: true,
    },
  ]);

  // Live Tracking
  const [vans, setVans] = useState([
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
    },
  ]);

  const vanPositions = useRef(
    vans.reduce((acc, van) => {
      acc[van.id] = {
        latitude: new Animated.Value(van.currentLocation.latitude),
        longitude: new Animated.Value(van.currentLocation.longitude),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(1),
      };
      return acc;
    }, {})
  ).current;

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
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdated(new Date());
      setStats(prev => ({
        ...prev,
        activeDrivers: driverAvailability.filter(d => d.status === 'Available').length,
        totalPassengers: passengerResponses.filter(p => p.status === 'Confirmed').length,
      }));
    }, 1000);
  }, [driverAvailability, passengerResponses]);

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

  const createPoll = () => {
    if (!newPoll.title || !newPoll.selectedSlots.length || !newPoll.closingTime) {
      Alert.alert('Error', 'Please fill all fields and select at least one time slot');
      return;
    }
    const poll = {
      id: polls.length + 1,
      title: newPoll.title,
      timeSlots: newPoll.selectedSlots,
      responses: 0,
      total: passengerResponses.length,
      closesAt: newPoll.closingTime,
      active: true,
      date: new Date().toLocaleDateString(),
    };
    setPolls([...polls, poll]);
    setNewPoll({ title: '', selectedSlots: [], closingTime: '' });
    Alert.alert('Success', `Poll created with ${newPoll.selectedSlots.length} time slots`);
  };

  // Route Functions
  const createRoute = () => {
    if (!newRoute.name || !newRoute.stops) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const route = {
      id: routes.length + 1,
      name: newRoute.name,
      stops: newRoute.stops.split('\n').filter(s => s.trim()),
      destination: 'Gulberg Greens',
      assignedDriver: null,
      timeSlot: null,
      distance: '15 km',
      duration: '30 min',
      passengers: [],
    };
    setRoutes([...routes, route]);
    setNewRoute({ name: '', stops: '' });
    Alert.alert('Success', 'Route created successfully');
  };

  const assignDriverToRoute = (routeId, driverId, timeSlot) => {
    const driver = driverAvailability.find(d => d.id === driverId);
    const route = routes.find(r => r.id === routeId);
    if (!driver || !route || driver.status !== 'Available' || !driver.availableTimeSlots.includes(timeSlot)) {
      Alert.alert('Error', 'Invalid assignment');
      return;
    }
    const routePassengers = passengerResponses.filter(p => p.status === 'Confirmed' && p.selectedTimeSlot === timeSlot);
    if (routePassengers.length > driver.capacity) {
      Alert.alert('Warning', `Capacity exceeded: ${routePassengers.length}/${driver.capacity}`);
    }
    setRoutes(routes.map(r =>
      r.id === routeId ? { ...r, assignedDriver: driver.name, timeSlot, passengers: routePassengers.map(p => p.name) } : r
    ));
    setDriverAvailability(driverAvailability.map(d =>
      d.id === driverId ? { ...d, status: 'Assigned', availableTimeSlots: d.availableTimeSlots.filter(t => t !== timeSlot) } : d
    ));
    setVans(vans.map(v => v.driver === driver.name ? { ...v, route: route.name, timeSlot, status: 'En Route' } : v));
    Alert.alert('Success', `${driver.name} assigned to ${route.name} at ${timeSlot}`);
  };

  // Request Management
  const handleDriverRequest = (requestId, action) => {
    const request = driverRequests.find(r => r.id === requestId);
    if (!request) return;
    if (action === 'accept') {
      setDriverAvailability([...driverAvailability, { id: driverAvailability.length + 1, ...request, van: `Van ${driverAvailability.length + 1} (${request.vehicle})`, status: 'Available' }]);
      setStats(prev => ({ ...prev, activeDrivers: prev.activeDrivers + 1 }));
      Alert.alert('Success', `${request.name} accepted`);
    } else {
      Alert.alert('Rejected', `${request.name}'s request rejected`);
    }
    setDriverRequests(driverRequests.filter(r => r.id !== requestId));
  };

  const handlePassengerRequest = (requestId, action) => {
    const request = passengerRequests.find(r => r.id === requestId);
    if (!request) return;
    if (action === 'accept') {
      setPassengerResponses([...passengerResponses, { id: passengerResponses.length + 1, ...request, status: 'Not Confirmed' }]);
      setStats(prev => ({ ...prev, totalPassengers: prev.totalPassengers + 1 }));
      Alert.alert('Success', `${request.name} accepted`);
    } else {
      Alert.alert('Rejected', `${request.name}'s request rejected`);
    }
    setPassengerRequests(passengerRequests.filter(r => r.id !== requestId));
  };

  // Payment Functions
  const sendDriverPayment = () => {
    if (!newPayment.driver || !newPayment.amount || !newPayment.mode) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const payment = { id: driverPayments.length + 1, driver: newPayment.driver, amount: parseInt(newPayment.amount), mode: newPayment.mode, date: new Date().toLocaleDateString(), status: 'Sent', month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) };
    setDriverPayments([...driverPayments, payment]);
    setStats(prev => ({ ...prev, paymentsReceived: prev.paymentsReceived + parseInt(newPayment.amount) }));
    setNewPayment({ driver: '', amount: '', mode: 'Cash' });
    Alert.alert('Success', 'Payment sent');
  };

  const sendRenewalNotification = passengerId => Alert.alert('Notification Sent', 'Renewal reminder sent');
  const sendPaymentReminder = passengerId => Alert.alert('Reminder Sent', 'Payment reminder sent');
  const updatePaymentStatus = (passengerId, newStatus) => {
    setPassengerPayments(passengerPayments.map(p => p.id === passengerId ? { ...p, status: newStatus, lastPaymentDate: new Date().toLocaleDateString(), expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() } : p));
    setStats(prev => ({ ...prev, paymentsPending: passengerPayments.filter(p => p.status === 'Pending').length * 5000 }));
    Alert.alert('Success', 'Payment status updated');
  };

  // Complaint Functions
  const resolveComplaint = complaintId => {
    setComplaints(complaints.map(c => c.id === complaintId ? { ...c, status: 'Resolved' } : c));
    setStats(prev => ({ ...prev, complaints: prev.complaints - 1 }));
    Alert.alert('Success', 'Complaint resolved');
  };

  const replyToComplaint = (complaintId) => {
    if (!newReply.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }
    setComplaints(complaints.map(c => c.id === complaintId ? {
      ...c,
      replies: [...(c.replies || []), {
        id: (c.replies?.length || 0) + 1,
        text: newReply,
        by: profile.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      }],
    } : c));
    setNewReply('');
    setSelectedResponse(null);
    Alert.alert('Success', 'Reply sent');
  };

  // Profile Functions
  const saveProfile = () => {
    setIsEditingProfile(false);
    Alert.alert('Success', 'Profile updated');
  };

  const handleLogout = () => Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Logout', onPress: () => Alert.alert('Logged Out') }]);

  // Get passengers/drivers by time slot
  const getPassengersByTimeSlot = timeSlot => passengerResponses.filter(p => p.status === 'Confirmed' && p.selectedTimeSlot === timeSlot);
  const getDriversByTimeSlot = timeSlot => driverAvailability.filter(d => d.availableTimeSlots.includes(timeSlot) && d.status === 'Available');

  // UI Components
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

  // Sections
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
</Text><Text></Text>

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

  const PollSection = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Create Travel Poll</Text>
      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Poll Title" value={newPoll.title} onChangeText={text => setNewPoll({ ...newPoll, title: text })} />
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
        <TextInput style={styles.input} placeholder="Route Name" value={newRoute.name} onChangeText={text => setNewRoute({ ...newRoute, name: text })} />
        <TextInput style={[styles.input, styles.textArea]} placeholder="Stops (one per line)" value={newRoute.stops} onChangeText={text => setNewRoute({ ...newRoute, stops: text })} multiline />
        <TouchableOpacity style={styles.primaryBtn} onPress={createRoute}><Text style={styles.primaryBtnText}>Create Route</Text></TouchableOpacity>
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
      <Text style={styles.sectionTitle}>Assign Drivers to Routes</Text>
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
    };
  
    const deleteNotification = (notificationId) => {
      setNotifications(notifications.filter(n => n.id !== notificationId));
      Alert.alert('Deleted', 'Notification deleted');
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
              <TouchableOpacity onPress={() => deleteNotification(notification.id)}>
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
    const [vanProgress, setVanProgress] = useState(
      vans.reduce((acc, van) => ({ ...acc, [van.id]: 0 }), {})
    );

    // Fit map to route coordinates
    const fitToRoute = useCallback(
      (van) => {
        if (mapRef.current && van) {
          const coordinates = van.stops
            .map((stop) => stopCoordinates[stop])
            .filter((coord) => coord && coord.latitude && coord.longitude);
          if (coordinates.length > 1) {
            mapRef.current.fitToCoordinates(coordinates, {
              edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          } else if (coordinates.length === 1) {
            mapRef.current.animateToRegion(
              {
                latitude: coordinates[0].latitude,
                longitude: coordinates[0].longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              },
              1000
            );
          }
        }
      },
      []
    );

    // Animation for van movement
    useEffect(() => {
      if (!isPlaying) {
        // Reset animations when paused
        vans.forEach((van) => {
          if (van.status === 'En Route') {
            Animated.parallel([
              Animated.timing(vanPositions[van.id].scale, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(vanPositions[van.id].rotation, {
                toValue: 0,
                duration: 300,
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

            // Increment progress (0 to 1 over the entire route)
            newProgress[van.id] = Math.min((prev[van.id] + 0.005) % 1, 0.99);

            // Calculate current segment
            const totalSegments = van.stops.length - 1;
            const segmentIndex = Math.floor(newProgress[van.id] * totalSegments);
            const segmentProgress = (newProgress[van.id] * totalSegments) % 1;

            if (segmentIndex >= totalSegments) {
              // Route completed
              Animated.sequence([
                Animated.timing(vanPositions[van.id].scale, {
                  toValue: 1.3,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(vanPositions[van.id].scale, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
              ]).start();
              setStats((prev) => ({
                ...prev,
                completedTrips: prev.completedTrips + 1,
                ongoingTrips: prev.ongoingTrips - 1,
              }));
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
              };
            }

            // Get start and end coordinates for the current segment
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

            // Calculate interpolated position
            const newLat = start.latitude + (end.latitude - start.latitude) * segmentProgress;
            const newLng = start.longitude + (end.longitude - start.longitude) * segmentProgress;

            // Animate position
            Animated.parallel([
              Animated.timing(vanPositions[van.id].latitude, {
                toValue: newLat,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(vanPositions[van.id].longitude, {
                toValue: newLng,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(vanPositions[van.id].scale, {
                  toValue: 1.1,
                  duration: 150,
                  useNativeDriver: true,
                }),
                Animated.timing(vanPositions[van.id].scale, {
                  toValue: 1,
                  duration: 150,
                  useNativeDriver: true,
                }),
              ]),
              Animated.timing(vanPositions[van.id].rotation, {
                toValue:
                  Math.atan2(end.longitude - start.longitude, end.latitude - start.latitude) *
                  (180 / Math.PI),
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();

            // Update passenger statuses and completed stops
            let updatedPassengers = van.passengersList;
            let updatedCompletedStops = van.completedStops;
            const currentStopIndex = van.stops.indexOf(van.currentStop);
            const nextStop = van.stops[segmentIndex];

            // Check if van is near a stop (within ~50 meters)
            const distance = Math.sqrt(
              Math.pow(newLat - start.latitude, 2) + Math.pow(newLng - start.longitude, 2)
            );
            if (distance < 0.0005 && !updatedCompletedStops.includes(startStop)) {
              updatedCompletedStops = [...updatedCompletedStops, startStop];
              updatedPassengers = updatedPassengers.map((p) => {
                const passenger = passengerResponses.find((pr) => pr.name === p.name);
                if (passenger && passenger.pickupPoint === startStop) {
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
                  toValue: 1.5,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(vanPositions[van.id].scale, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            }

            // Calculate ETA (assuming 15km total distance and 40km/h speed)
            const remainingDistance = (1 - newProgress[van.id]) * 15;
            const etaMinutes = Math.round((remainingDistance / 40) * 60);

            return {
              ...van,
              currentLocation: { latitude: newLat, longitude: newLng },
              currentStop: nextStop,
              completedStops: updatedCompletedStops,
              eta: `${etaMinutes} min`,
              speed: 40,
              passengersList: updatedPassengers,
              passengers: updatedPassengers.filter((p) => p.status === 'picked').length,
            };
          });

          // Update vans state
          setVans(updatedVans);

          // Center map on selected van
          if (selectedVan && mapRef.current && updatedVans.find((v) => v.id === selectedVan.id)) {
            const van = updatedVans.find((v) => v.id === selectedVan.id);
            mapRef.current.animateToRegion(
              {
                latitude: van.currentLocation.latitude,
                longitude: van.currentLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              },
              500
            );
          }

          return newProgress;
        });
      }, 100); // Update every 100ms for smooth animation

      return () => clearInterval(interval);
    }, [isPlaying, selectedVan]);

    // Initialize map when selecting a van
    useEffect(() => {
      if (selectedVan) {
        fitToRoute(selectedVan);
      }
    }, [selectedVan, fitToRoute]);

    return (
      <ScrollView style={styles.section}>
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
            <View style={[styles.vanHeader, { backgroundColor: selectedVan.color }]}>
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
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
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
                    <View style={styles.vanMarker}>
                      <Icon name="directions-car" size={30} color={selectedVan.color} />
                    </View>
                  </Animated.View>
                </Marker.Animated>
                <Polyline
                  coordinates={selectedVan.stops
                    .map((stop) => stopCoordinates[stop])
                    .filter((coord) => coord && coord.latitude && coord.longitude)}
                  strokeColor={selectedVan.color}
                  strokeWidth={4}
                  lineDashPattern={[10, 10]}
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
                    { width: `${(selectedVan.passengers / selectedVan.capacity) * 100}%` },
                  ]}
                />
              </View>
            </View>
            <View style={styles.passengerListCard}>
              <View style={styles.passengerListHeader}>
                <Text style={styles.cardTitle}>Passengers</Text>
                <View style={styles.passengerCountBadge}>
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
                    { width: `${(selectedVan.completedStops.length / selectedVan.stops.length) * 100}%` },
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
              style={[styles.map, { height: 200, marginBottom: 16 }]}
              initialRegion={{
                latitude: 33.6,
                longitude: 73.1,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
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
                    <View style={styles.vanMarker}>
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
                style={[styles.vanCard, { borderColor: van.color }]}
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
                <View style={[styles.vanColorIndicator, { backgroundColor: van.color }]} />
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
          <Text style={styles.emptyText}>No requests</Text>
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
          <Text style={styles.emptyText}>No requests</Text>
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
          <Text style={[styles.tabText, paymentTab === 'driver' && styles.tabTextActive]}>Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, paymentTab === 'passenger' && styles.tabActive]} 
          onPress={() => setPaymentTab('passenger')}
        >
          <Text style={styles.tabText}>Passenger</Text>
        </TouchableOpacity>
      </View>
      {paymentTab === 'driver' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Send Payment</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Driver" 
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
            placeholder="Mode" 
            value={newPayment.mode} 
            onChangeText={text => setNewPayment({ ...newPayment, mode: text })} 
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={sendDriverPayment}>
            <Text style={styles.primaryBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
      {paymentTab === 'passenger' && passengerPayments.map(p => (
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
          <Text style={styles.paymentDetail}>Last: {p.lastPaymentDate}</Text>
          <Text style={styles.paymentDetail}>Expiry: {p.expiryDate}</Text>
          <View style={styles.passengerActions}>
            {p.status === 'Expired' && (
              <TouchableOpacity 
                style={styles.reminderBtn} 
                onPress={() => sendPaymentReminder(p.id)}
              >
                <Text style={styles.reminderBtnText}>Reminder</Text>
              </TouchableOpacity>
            )}
            {p.status === 'Paid' && (
              <TouchableOpacity 
                style={styles.renewalBtn} 
                onPress={() => sendRenewalNotification(p.id)}
              >
                <Text style={styles.renewalBtnText}>Renewal</Text>
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
    </ScrollView>
  );

  const ComplaintsSection = () => (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Complaints Management</Text>
      {selectedResponse ? (
        <View style={styles.complaintDetailCard}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedResponse(null)}>
            <Text style={styles.backBtnText}>← Back</Text>
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
          <Text style={styles.complaintTime}>{selectedResponse.date} at {selectedResponse.time}</Text>
          <View style={styles.repliesContainer}>
            <Text style={styles.repliesTitle}>Replies</Text>
            {selectedResponse.replies?.map(reply => (
              <View key={reply.id} style={styles.replyItem}>
                <Text style={styles.replyBy}>{reply.by}</Text>
                <Text style={styles.replyText}>{reply.text}</Text>
                <Text style={styles.replyTime}>{reply.date} at {reply.time}</Text>
              </View>
            ))}
            {selectedResponse.replies?.length === 0 && (
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
              <Text style={styles.resolveBtnText}>Resolve</Text>
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
              <Text style={styles.complaintBy}>By: {c.byName}</Text>
              <Text style={styles.complaintDesc}>{c.description}</Text>
              <Text style={styles.complaintTime}>{c.date} at {c.time}</Text>
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
const styles = StyleSheet.create({
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
    marginBottom: 18,
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
