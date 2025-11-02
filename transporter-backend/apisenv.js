// API Service with proper error handling - COMPLETE VERSION
const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
  // ==================== AUTH METHODS ====================
  register: async (data) => {
    try {
      console.log('📝 Registering user:', data);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Save token
      if (result.token) {
        await AsyncStorage.setItem('token', result.token);
      }

      console.log('✅ Registration successful');
      return result;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  },

  login: async (data) => {
    try {
      console.log('🔐 Logging in user:', data.email);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Save token
      if (result.token) {
        await AsyncStorage.setItem('token', result.token);
      }

      console.log('✅ Login successful');
      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  // ==================== PROFILE METHODS ====================
  getProfile: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw new Error('Failed to load profile');
    }
  },

  updateProfile: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      console.log('✅ Profile updated successfully');
      return result;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  // ==================== DASHBOARD METHODS ====================
  getStats: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get stats error:', error);
      throw new Error('Failed to load dashboard stats');
    }
  },

  // ==================== DRIVER METHODS ====================
  getDrivers: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/drivers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load drivers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get drivers error:', error);
      throw new Error('Failed to load drivers');
    }
  },

  createDriver: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/drivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create driver');
      }

      console.log('✅ Driver created successfully');
      return result;
    } catch (error) {
      console.error('❌ Create driver error:', error);
      throw new Error(error.message || 'Failed to create driver');
    }
  },

  updateDriver: async (id, data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update driver');
      }

      console.log('✅ Driver updated successfully');
      return result;
    } catch (error) {
      console.error('❌ Update driver error:', error);
      throw new Error(error.message || 'Failed to update driver');
    }
  },

  deleteDriver: async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete driver');
      }

      console.log('✅ Driver deleted successfully');
      return result;
    } catch (error) {
      console.error('❌ Delete driver error:', error);
      throw new Error(error.message || 'Failed to delete driver');
    }
  },

  // ==================== PASSENGER METHODS ====================
  getPassengers: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/passengers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load passengers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get passengers error:', error);
      throw new Error('Failed to load passengers');
    }
  },

  createPassenger: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/passengers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create passenger');
      }

      console.log('✅ Passenger created successfully');
      return result;
    } catch (error) {
      console.error('❌ Create passenger error:', error);
      throw new Error(error.message || 'Failed to create passenger');
    }
  },

  updatePassenger: async (id, data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/passengers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update passenger');
      }

      console.log('✅ Passenger updated successfully');
      return result;
    } catch (error) {
      console.error('❌ Update passenger error:', error);
      throw new Error(error.message || 'Failed to update passenger');
    }
  },

  // ==================== ROUTE METHODS ====================
  getRoutes: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/routes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load routes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get routes error:', error);
      throw new Error('Failed to load routes');
    }
  },

  createRoute: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create route');
      }

      console.log('✅ Route created successfully');
      return result;
    } catch (error) {
      console.error('❌ Create route error:', error);
      throw new Error(error.message || 'Failed to create route');
    }
  },

  assignDriverToRoute: async (routeId, data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/routes/${routeId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to assign driver to route');
      }

      console.log('✅ Driver assigned to route successfully');
      return result;
    } catch (error) {
      console.error('❌ Assign driver error:', error);
      throw new Error(error.message || 'Failed to assign driver to route');
    }
  },

  // ==================== POLL METHODS ====================
  getPolls: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/polls`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load polls');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get polls error:', error);
      throw new Error('Failed to load polls');
    }
  },

  createPoll: async (data) => {
    try {
      console.log('🎯 Sending poll creation request:', data);
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/polls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('❌ Server error:', result);
        throw new Error(result.error || 'Failed to create poll');
      }

      console.log('✅ Poll creation response:', result);
      return result;

    } catch (error) {
      console.error('❌ Network error:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  },

  respondToPoll: async (pollId, data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/polls/${pollId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to respond to poll');
      }

      console.log('✅ Poll response submitted successfully');
      return result;
    } catch (error) {
      console.error('❌ Poll response error:', error);
      throw new Error(error.message || 'Failed to respond to poll');
    }
  },

  // ==================== PAYMENT METHODS ====================
  getPayments: async (type = null) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let url = `${API_BASE_URL}/payments`;
      if (type) {
        url += `?type=${type}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load payments');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get payments error:', error);
      throw new Error('Failed to load payments');
    }
  },

  createPayment: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment');
      }

      console.log('✅ Payment created successfully');
      return result;
    } catch (error) {
      console.error('❌ Create payment error:', error);
      throw new Error(error.message || 'Failed to create payment');
    }
  },

  updatePayment: async (id, data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update payment');
      }

      console.log('✅ Payment updated successfully');
      return result;
    } catch (error) {
      console.error('❌ Update payment error:', error);
      throw new Error(error.message || 'Failed to update payment');
    }
  },

  // ==================== COMPLAINT METHODS ====================
  getComplaints: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/complaints`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load complaints');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get complaints error:', error);
      throw new Error('Failed to load complaints');
    }
  },

  createComplaint: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create complaint');
      }

      console.log('✅ Complaint created successfully');
      return result;
    } catch (error) {
      console.error('❌ Create complaint error:', error);
      throw new Error(error.message || 'Failed to create complaint');
    }
  },

  replyToComplaint: async (complaintId, data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reply to complaint');
      }

      console.log('✅ Reply sent successfully');
      return result;
    } catch (error) {
      console.error('❌ Reply to complaint error:', error);
      throw new Error(error.message || 'Failed to reply to complaint');
    }
  },

  resolveComplaint: async (complaintId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/resolve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to resolve complaint');
      }

      console.log('✅ Complaint resolved successfully');
      return result;
    } catch (error) {
      console.error('❌ Resolve complaint error:', error);
      throw new Error(error.message || 'Failed to resolve complaint');
    }
  },

  // ==================== NOTIFICATION METHODS ====================
  getNotifications: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load notifications');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get notifications error:', error);
      throw new Error('Failed to load notifications');
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to mark notification as read');
      }

      console.log('✅ Notification marked as read');
      return result;
    } catch (error) {
      console.error('❌ Mark notification as read error:', error);
      throw new Error(error.message || 'Failed to mark notification as read');
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to mark all notifications as read');
      }

      console.log('✅ All notifications marked as read');
      return result;
    } catch (error) {
      console.error('❌ Mark all notifications as read error:', error);
      throw new Error(error.message || 'Failed to mark all notifications as read');
    }
  },

  // ==================== TRIP METHODS ====================
  getTrips: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/trips`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load trips');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get trips error:', error);
      throw new Error('Failed to load trips');
    }
  },

  createTrip: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create trip');
      }

      console.log('✅ Trip created successfully');
      return result;
    } catch (error) {
      console.error('❌ Create trip error:', error);
      throw new Error(error.message || 'Failed to create trip');
    }
  },

  updateTripLocation: async (tripId, data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/trips/${tripId}/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update trip location');
      }

      console.log('✅ Trip location updated successfully');
      return result;
    } catch (error) {
      console.error('❌ Update trip location error:', error);
      throw new Error(error.message || 'Failed to update trip location');
    }
  },

  updateTripStatus: async (tripId, data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/trips/${tripId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update trip status');
      }

      console.log('✅ Trip status updated successfully');
      return result;
    } catch (error) {
      console.error('❌ Update trip status error:', error);
      throw new Error(error.message || 'Failed to update trip status');
    }
  },

  // ==================== JOIN REQUEST METHODS ====================
  getJoinRequests: async (type = null) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let url = `${API_BASE_URL}/join-requests`;
      if (type) {
        url += `?type=${type}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load join requests');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Get join requests error:', error);
      throw new Error('Failed to load join requests');
    }
  },

  createJoinRequest: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/join-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create join request');
      }

      console.log('✅ Join request created successfully');
      return result;
    } catch (error) {
      console.error('❌ Create join request error:', error);
      throw new Error(error.message || 'Failed to create join request');
    }
  },

  acceptJoinRequest: async (requestId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/join-requests/${requestId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to accept join request');
      }

      console.log('✅ Join request accepted successfully');
      return result;
    } catch (error) {
      console.error('❌ Accept join request error:', error);
      throw new Error(error.message || 'Failed to accept join request');
    }
  },

  rejectJoinRequest: async (requestId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/join-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reject join request');
      }

      console.log('✅ Join request rejected successfully');
      return result;
    } catch (error) {
      console.error('❌ Reject join request error:', error);
      throw new Error(error.message || 'Failed to reject join request');
    }
  },

  // ==================== AUTO ASSIGNMENT ====================
  autoAssign: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auto-assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Auto-assignment failed');
      }

      console.log('✅ Auto-assignment completed successfully');
      return result;
    } catch (error) {
      console.error('❌ Auto-assignment error:', error);
      throw new Error(error.message || 'Auto-assignment failed');
    }
  },

  // ==================== DEBUG METHODS ====================
  testDBConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/debug/db-status`);
      return await response.json();
    } catch (error) {
      throw new Error('Failed to test database connection');
    }
  },

  insertTestData: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/debug/test-insert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to insert test data');
    }
  },

  // ==================== UTILITY METHODS ====================
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('✅ Logout successful');
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw new Error('Failed to logout');
    }
  },

  getAuthToken: async () => {
    return await AsyncStorage.getItem('token');
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }
};

export default apiService;