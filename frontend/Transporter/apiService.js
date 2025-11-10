import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.0.109:5000/api';

export const apiService = {
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
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

  // ==================== AUTH APIs ====================
  async register(registerData) {
    return this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  },

  async login(email, password) {
    const result = await this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (result.token) {
      await this.setToken(result.token);
    }
    
    return result;
  },

  async getProfile() {
    return this.apiCall('/auth/profile');
  },

  async updateProfile(profileData) {
    return this.apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // ==================== TRANSPORTER APIs ====================
  async getPendingApprovals() {
    return this.apiCall('/transporter/pending-approvals');
  },

  async updateUserStatus(userId, status) {
    return this.apiCall(`/transporter/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async getDashboardStats() {
    return this.apiCall('/transporter/dashboard/stats');
  },

  // ==================== POLL APIs ====================
  async createPoll(pollData) {
    return this.apiCall('/polls', {
      method: 'POST',
      body: JSON.stringify(pollData),
    });
  },

  async getPolls() {
    return this.apiCall('/polls');
  },

  async respondToPoll(pollId, selectedTimeSlot) {
    return this.apiCall(`/polls/${pollId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ selectedTimeSlot }),
    });
  },

  // ==================== ROUTE APIs ====================
  async createRoute(routeData) {
    return this.apiCall('/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  },

  async getRoutes() {
    return this.apiCall('/routes');
  },

  // ==================== TRIP APIs ====================
  async getTrips() {
    return this.apiCall('/trips');
  },

  async updateTripLocation(tripId, locationData) {
    return this.apiCall(`/trips/${tripId}/location`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
  },

  async startTrip(tripId) {
    return this.apiCall(`/trips/${tripId}/start`, {
      method: 'POST',
    });
  },

  async completeTrip(tripId) {
    return this.apiCall(`/trips/${tripId}/complete`, {
      method: 'POST',
    });
  },

  // ==================== PAYMENT APIs ====================
  async createPayment(paymentData) {
    return this.apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  async getPayments() {
    return this.apiCall('/payments');
  },

  // ==================== COMPLAINT APIs ====================
  async createComplaint(complaintData) {
    return this.apiCall('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  },

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

  // ==================== NOTIFICATION APIs ====================
  async getNotifications() {
    return this.apiCall('/notifications');
  },

  async markNotificationAsRead(notificationId) {
    return this.apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  async markAllNotificationsAsRead() {
    return this.apiCall('/notifications/read-all', {
      method: 'PUT',
    });
  },

  // ==================== AUTO ASSIGNMENT API ====================
  async generateAutoAssignments() {
    return this.apiCall('/auto-assign', {
      method: 'POST',
    });
  },

  // ==================== SEED DATA API ====================
  async seedSampleData() {
    return this.apiCall('/seed-data', {
      method: 'POST',
    });
  }
};