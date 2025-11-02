// src/services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// یہ آپ کے کمپیوٹر کا IP address ہوگا
const API_BASE_URL = 'http://192.168.1.100:5000/api'; // اپنا IP ڈالیں

const apiService = {
  // Token management
  getToken: async () => {
    return await AsyncStorage.getItem('token');
  },

  setToken: async (token) => {
    await AsyncStorage.setItem('token', token);
  },

  removeToken: async () => {
    await AsyncStorage.removeItem('token');
  },

  // Generic API call function
  makeRequest: async (endpoint, options = {}) => {
    try {
      const token = await apiService.getToken();
      
      const config = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
        ...(options.body && { body: JSON.stringify(options.body) }),
      };

      console.log(`API Call: ${config.method} ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  },

  // ==================== AUTH ====================
  login: async (credentials) => {
    const data = await apiService.makeRequest('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    if (data.token) {
      await apiService.setToken(data.token);
    }
    
    return data;
  },

  register: async (userData) => {
    const data = await apiService.makeRequest('/auth/register', {
      method: 'POST',
      body: userData,
    });
    
    if (data.token) {
      await apiService.setToken(data.token);
    }
    
    return data;
  },

  logout: async () => {
    await apiService.removeToken();
  },

  // ==================== PROFILE ====================
  getProfile: async () => {
    return await apiService.makeRequest('/profile');
  },

  updateProfile: async (profileData) => {
    return await apiService.makeRequest('/profile', {
      method: 'PUT',
      body: profileData,
    });
  },

  // ==================== DASHBOARD ====================
  getStats: async () => {
    return await apiService.makeRequest('/dashboard/stats');
  },

  // ==================== DRIVERS ====================
  getDrivers: async () => {
    return await apiService.makeRequest('/drivers');
  },

  createDriver: async (driverData) => {
    return await apiService.makeRequest('/drivers', {
      method: 'POST',
      body: driverData,
    });
  },

  updateDriver: async (driverId, driverData) => {
    return await apiService.makeRequest(`/drivers/${driverId}`, {
      method: 'PUT',
      body: driverData,
    });
  },

  deleteDriver: async (driverId) => {
    return await apiService.makeRequest(`/drivers/${driverId}`, {
      method: 'DELETE',
    });
  },

  // ==================== PASSENGERS ====================
  getPassengers: async () => {
    return await apiService.makeRequest('/passengers');
  },

  createPassenger: async (passengerData) => {
    return await apiService.makeRequest('/passengers', {
      method: 'POST',
      body: passengerData,
    });
  },

  updatePassenger: async (passengerId, passengerData) => {
    return await apiService.makeRequest(`/passengers/${passengerId}`, {
      method: 'PUT',
      body: passengerData,
    });
  },

  // ==================== ROUTES ====================
  getRoutes: async () => {
    return await apiService.makeRequest('/routes');
  },

  createRoute: async (routeData) => {
    return await apiService.makeRequest('/routes', {
      method: 'POST',
      body: routeData,
    });
  },

  assignDriverToRoute: async (routeId, assignmentData) => {
    return await apiService.makeRequest(`/routes/${routeId}/assign`, {
      method: 'PUT',
      body: assignmentData,
    });
  },

  // ==================== POLLS ====================
  getPolls: async () => {
    return await apiService.makeRequest('/polls');
  },

  createPoll: async (pollData) => {
    return await apiService.makeRequest('/polls', {
      method: 'POST',
      body: pollData,
    });
  },

  respondToPoll: async (pollId, responseData) => {
    return await apiService.makeRequest(`/polls/${pollId}/respond`, {
      method: 'POST',
      body: responseData,
    });
  },

  // ==================== PAYMENTS ====================
  getPayments: async (type) => {
    return await apiService.makeRequest(`/payments?type=${type}`);
  },

  createPayment: async (paymentData) => {
    return await apiService.makeRequest('/payments', {
      method: 'POST',
      body: paymentData,
    });
  },

  updatePayment: async (paymentId, paymentData) => {
    return await apiService.makeRequest(`/payments/${paymentId}`, {
      method: 'PUT',
      body: paymentData,
    });
  },

  // ==================== COMPLAINTS ====================
  getComplaints: async () => {
    return await apiService.makeRequest('/complaints');
  },

  createComplaint: async (complaintData) => {
    return await apiService.makeRequest('/complaints', {
      method: 'POST',
      body: complaintData,
    });
  },

  replyToComplaint: async (complaintId, replyData) => {
    return await apiService.makeRequest(`/complaints/${complaintId}/reply`, {
      method: 'POST',
      body: replyData,
    });
  },

  resolveComplaint: async (complaintId) => {
    return await apiService.makeRequest(`/complaints/${complaintId}/resolve`, {
      method: 'PUT',
    });
  },

  // ==================== NOTIFICATIONS ====================
  getNotifications: async () => {
    return await apiService.makeRequest('/notifications');
  },

  markNotificationRead: async (notificationId) => {
    return await apiService.makeRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  markAllNotificationsRead: async () => {
    return await apiService.makeRequest('/notifications/mark-all-read', {
      method: 'PUT',
    });
  },

  // ==================== TRIPS ====================
  getTrips: async () => {
    return await apiService.makeRequest('/trips');
  },

  createTrip: async (tripData) => {
    return await apiService.makeRequest('/trips', {
      method: 'POST',
      body: tripData,
    });
  },

  updateTripLocation: async (tripId, locationData) => {
    return await apiService.makeRequest(`/trips/${tripId}/location`, {
      method: 'PUT',
      body: locationData,
    });
  },

  updateTripStatus: async (tripId, status) => {
    return await apiService.makeRequest(`/trips/${tripId}/status`, {
      method: 'PUT',
      body: { status },
    });
  },

  // ==================== JOIN REQUESTS ====================
  getJoinRequests: async (type) => {
    return await apiService.makeRequest(`/join-requests?type=${type}`);
  },

  createJoinRequest: async (requestData) => {
    return await apiService.makeRequest('/join-requests', {
      method: 'POST',
      body: requestData,
    });
  },

  acceptJoinRequest: async (requestId) => {
    return await apiService.makeRequest(`/join-requests/${requestId}/accept`, {
      method: 'PUT',
    });
  },

  rejectJoinRequest: async (requestId) => {
    return await apiService.makeRequest(`/join-requests/${requestId}/reject`, {
      method: 'PUT',
    });
  },

  // ==================== AUTO ASSIGNMENT ====================
  autoAssign: async () => {
    return await apiService.makeRequest('/auto-assign', {
      method: 'POST',
    });
  },

  // ==================== HEALTH CHECK ====================
  healthCheck: async () => {
    try {
      const response = await fetch(API_BASE_URL.replace('/api', '/health'));
      return await response.json();
    } catch (error) {
      throw new Error('Server is not reachable');
    }
  },
};

export default apiService;