const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transporter/profile`);
      if (!response.ok) throw new Error('Failed to load profile');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load profile');
    }
  },
  
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transporter/stats`);
      if (!response.ok) throw new Error('Failed to load stats');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load stats');
    }
  },
  
  getDrivers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers`);
      if (!response.ok) throw new Error('Failed to load drivers');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load drivers');
    }
  },
  
  getPassengers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/passengers`);
      if (!response.ok) throw new Error('Failed to load passengers');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load passengers');
    }
  },
  
  getRoutes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/routes`);
      if (!response.ok) throw new Error('Failed to load routes');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load routes');
    }
  },
  
  getPolls: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/polls`);
      if (!response.ok) throw new Error('Failed to load polls');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load polls');
    }
  },
  
  getPayments: async (type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments?type=${type}`);
      if (!response.ok) throw new Error('Failed to load payments');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load payments');
    }
  },
  
  getComplaints: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints`);
      if (!response.ok) throw new Error('Failed to load complaints');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load complaints');
    }
  },
  
  getNotifications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      if (!response.ok) throw new Error('Failed to load notifications');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load notifications');
    }
  },
  
  getJoinRequests: async (type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/join-requests?type=${type}`);
      if (!response.ok) throw new Error('Failed to load join requests');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to load join requests');
    }
  },
  
  createPoll: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/polls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create poll');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to create poll');
    }
  },
  
  createRoute: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create route');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to create route');
    }
  },
  
  assignDriverToRoute: async (routeId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/routes/${routeId}/assign-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign driver');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to assign driver');
    }
  },
  
  acceptJoinRequest: async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/join-requests/${requestId}/accept`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept request');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to accept request');
    }
  },
  
  rejectJoinRequest: async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/join-requests/${requestId}/reject`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject request');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to reject request');
    }
  },
  
  createPayment: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to create payment');
    }
  },
  
  updateProfile: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transporter/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },
  
  resolveComplaint: async (complaintId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/resolve`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resolve complaint');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to resolve complaint');
    }
  },
  
  replyToComplaint: async (complaintId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reply to complaint');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to reply to complaint');
    }
  },
  
  autoAssign: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/routes/auto-assign`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Auto-assignment failed');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error('Auto-assignment failed');
    }
  },
};