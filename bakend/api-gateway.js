// api-gateway.js - Frontend API Service
const API_GATEWAY = 'http://192.168.0.109:3005';

export const gatewayService = {
  // Send notification
  async sendNotification(notificationData) {
    const response = await fetch(`${API_GATEWAY}/api/notifications/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData)
    });
    return response.json();
  },

  // Socket connection for real-time updates
  connectSocket() {
    const socket = io(API_GATEWAY);
    
    socket.on('connect', () => {
      console.log('Connected to gateway');
    });

    socket.on('location-update', (data) => {
      // Handle live location updates
      console.log('Location update:', data);
    });

    socket.on('new-poll-response', (data) => {
      // Handle new poll responses
      console.log('New poll response:', data);
    });

    return socket;
  },

  // Join route for live tracking
  joinRoute(socket, routeId) {
    socket.emit('join-route', routeId);
  },

  // Send driver location update
  sendLocationUpdate(socket, data) {
    socket.emit('driver-location-update', data);
  }
};