import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, Dimensions, TextInput, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { driverStyles } from "./driverStyles";

const { width, height } = Dimensions.get("window");

const UnifiedDriverDashboard = ({ navigation }) => {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("Dashboard");

  // Dashboard states
  const [available, setAvailable] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    completedTrips: 142,
    activeTrips: 1,
    pendingTrips: 2,
    monthlyEarnings: 35000
  });

  // Availability states
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const [startTime, setStartTime] = useState("07:00 AM");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [availabilityDate, setAvailabilityDate] = useState(new Date());

  // Routes states
  const [routeStarted, setRouteStarted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(0);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [routeStops, setRouteStops] = useState([
    { 
      id: 1, 
      name: "Stop 1 - DHA Phase 5", 
      passenger: "Ali Khan", 
      status: "Pending", 
      scheduledTime: "7:30 AM",
      pickupTime: null,
      dropoffTime: null,
      phone: "+92 300 1234567", 
      coordinate: { latitude: 24.8125, longitude: 67.0611 } 
    },
    { 
      id: 2, 
      name: "Stop 2 - SMCHS", 
      passenger: "Sara Malik", 
      status: "Pending", 
      scheduledTime: "7:45 AM",
      pickupTime: null,
      dropoffTime: null,
      phone: "+92 301 2345678", 
      coordinate: { latitude: 24.8235, longitude: 67.0725 } 
    },
    { 
      id: 3, 
      name: "Stop 3 - Saddar", 
      passenger: "Bilal Ahmed", 
      status: "Pending", 
      scheduledTime: "8:00 AM",
      pickupTime: null,
      dropoffTime: null,
      phone: "+92 302 3456789", 
      coordinate: { latitude: 24.8520, longitude: 67.0180 } 
    },
    { 
      id: 4, 
      name: "Stop 4 - Clifton Block 2", 
      passenger: "Hina Shah", 
      status: "Pending", 
      scheduledTime: "8:15 AM",
      pickupTime: null,
      dropoffTime: null,
      phone: "+92 303 4567890", 
      coordinate: { latitude: 24.8138, longitude: 67.0300 } 
    },
    { 
      id: 5, 
      name: "Final Stop - Karachi Grammar School", 
      passenger: "Multiple", 
      status: "Pending", 
      scheduledTime: "8:30 AM",
      pickupTime: null,
      dropoffTime: null,
      phone: "N/A", 
      coordinate: { latitude: 24.8607, longitude: 67.0011 } 
    },
  ]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Payment states
  const [paymentDetailsVisible, setPaymentDetailsVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const paymentData = [
    { 
      id: 1, 
      month: "October 2025", 
      amount: 30000, 
      status: "Transferred", 
      date: "15 Oct 2025", 
      trips: 142, 
      totalEarnings: 35000, 
      commission: 5000, 
      transactionId: "EP2025101512345",
      paymentMethod: "Easypaisa"
    },
    { 
      id: 2, 
      month: "September 2025", 
      amount: 28500, 
      status: "Transferred", 
      date: "15 Sep 2025", 
      trips: 138, 
      totalEarnings: 33500, 
      commission: 5000, 
      transactionId: "EP2025091512234",
      paymentMethod: "Easypaisa"
    },
    { 
      id: 3, 
      month: "August 2025", 
      amount: 29000, 
      status: "Transferred", 
      date: "15 Aug 2025", 
      trips: 140, 
      totalEarnings: 34000, 
      commission: 5000, 
      transactionId: "EP2025081512123",
      paymentMethod: "Easypaisa"
    },
  ];

  // Trip History states
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripDetailsVisible, setTripDetailsVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  const trips = [
    { 
      id: "1", 
      date: "2025-10-10", 
      route: "DHA Phase 5 → Saddar → KGS", 
      startPoint: "DHA Phase 5",
      destination: "Karachi Grammar School",
      status: "Completed", 
      time: "08:30 AM - 12:45 PM", 
      duration: "4h 15m", 
      distance: "25 km", 
      fare: 2500, 
      passengers: 4, 
      rating: 4.8, 
      vehicle: "Coaster - LEA-4567" 
    },
    { 
      id: "2", 
      date: "2025-10-12", 
      route: "Gulshan → Clifton → KGS", 
      startPoint: "Gulshan-e-Iqbal",
      destination: "Karachi Grammar School",
      status: "Cancelled", 
      time: "06:00 AM - 10:30 AM", 
      duration: "4h 30m", 
      distance: "28 km", 
      fare: 2800, 
      passengers: 5, 
      rating: null, 
      vehicle: "Coaster - LEA-4567",
      cancellationReason: "Vehicle maintenance required" 
    },
    { 
      id: "3", 
      date: "2025-10-18", 
      route: "Malir → Korangi → KGS", 
      startPoint: "Malir Cantt",
      destination: "Karachi Grammar School",
      status: "Upcoming", 
      time: "07:00 AM - 11:30 AM", 
      duration: "4h 30m", 
      distance: "32 km", 
      fare: 2700, 
      passengers: 6, 
      rating: null, 
      vehicle: "Coaster - LEA-4567" 
    },
    { 
      id: "4", 
      date: "2025-10-19", 
      route: "DHA Phase 5 → SMCHS → KGS", 
      startPoint: "DHA Phase 5",
      destination: "Karachi Grammar School",
      status: "Completed", 
      time: "09:00 AM - 01:15 PM", 
      duration: "4h 15m", 
      distance: "24 km", 
      fare: 2600, 
      passengers: 4, 
      rating: 4.9, 
      vehicle: "Coaster - LEA-4567" 
    },
  ];

  // Support states
  const [supportTickets, setSupportTickets] = useState([
    {
      id: 1,
      category: "Payment Issue",
      subject: "October payment not received",
      description: "I haven't received my payment for October yet",
      status: "Resolved",
      createdDate: "2025-10-05",
      resolvedDate: "2025-10-08",
      attachment: null
    },
    {
      id: 2,
      category: "Route Issue",
      subject: "Wrong route assigned",
      description: "The route assigned doesn't match my usual schedule",
      status: "In Progress",
      createdDate: "2025-10-15",
      resolvedDate: null,
      attachment: null
    }
  ]);
  const [newTicketVisible, setNewTicketVisible] = useState(false);
  const [ticketCategory, setTicketCategory] = useState("Payment Issue");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");

  // Notification states
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: "Day Off Granted", 
      message: "The transporter has granted you a day off for tomorrow (20 Oct 2025). Enjoy your rest!", 
      time: "1 hour ago", 
      type: "info",
      read: false,
      timestamp: new Date().toISOString()
    },
    { 
      id: 2, 
      title: "Route Assigned for Tomorrow", 
      message: "You have been assigned Morning Pickup Route for tomorrow (20 Oct 2025). Please check route details.", 
      time: "2 hours ago", 
      type: "success",
      read: false,
      timestamp: new Date().toISOString()
    },
    { 
      id: 3, 
      title: "Payment Received", 
      message: "Your payment for October 2025 has been transferred to your Easypaisa account.", 
      time: "5 hours ago", 
      type: "success",
      read: false,
      timestamp: new Date().toISOString()
    },
    { 
      id: 4, 
      title: "Availability Confirmation Required", 
      message: "Please confirm your availability for tomorrow's route assignment.", 
      time: "1 day ago", 
      type: "warning",
      read: true,
      timestamp: new Date().toISOString()
    },
    { 
      id: 5, 
      title: "Trip Completed", 
      message: "You have successfully completed the Morning Pickup Route.", 
      time: "2 days ago", 
      type: "success",
      read: true,
      timestamp: new Date().toISOString()
    },
  ]);

  const routeData = {
    routeName: "Morning Pickup Route",
    date: "19 Oct 2025",
    vehicleNumber: "LEA-4567",
    vehicleType: "Coaster",
    pickupTime: "7:30 AM",
    estimatedArrival: "9:00 AM",
    totalStops: 5,
    totalDistance: "25 km",
    estimatedDuration: "1h 30m",
    startPoint: "DHA Phase 5",
    destination: "Karachi Grammar School"
  };

  // Auto-refresh dashboard every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data update
      setDashboardStats(prev => ({
        ...prev,
        activeTrips: routeStarted ? 1 : 0
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, [routeStarted]);

  // Vehicle movement simulation (GPS tracking - refreshes every 5-10 seconds)
  useEffect(() => {
    if (routeStarted && currentLocation < routeStops.length) {
      const timer = setTimeout(() => {
        setCurrentLocation(prev => prev + 1);
      }, 8000); // Simulating 8 second GPS refresh
      return () => clearTimeout(timer);
    }
  }, [routeStarted, currentLocation]);

  // Format date for tomorrow
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Navigation
  const navigateTo = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  // Route handlers
  const handleStartRoute = () => {
    Alert.alert(
      "Start Route", 
      "Are you ready to start this route? GPS tracking will begin.", 
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Start", 
          onPress: () => { 
            setRouteStarted(true); 
            setCurrentLocation(0);
            // Send notification
            addNotification("Trip Started", "GPS tracking is now active. Drive safely!", "success");
          } 
        }
      ]
    );
  };

  const handleEndRoute = () => {
    const allCompleted = routeStops.every(stop => stop.status === "Completed");
    if (!allCompleted) {
      Alert.alert(
        "Incomplete Route", 
        "Some stops are still pending. Are you sure you want to end the route?", 
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "End Anyway", 
            style: "destructive", 
            onPress: () => { 
              setRouteStarted(false); 
              setCurrentLocation(0);
              addNotification("Trip Ended", "Route ended. GPS tracking stopped.", "info");
              Alert.alert("Success", "Route ended successfully!");
            } 
          }
        ]
      );
    } else {
      setRouteStarted(false);
      setCurrentLocation(0);
      addNotification("Trip Completed", "All passengers have been dropped off successfully!", "success");
      Alert.alert("Success", "Route completed successfully!");
    }
  };

  const toggleStopStatus = (stopId) => {
    if (!routeStarted) {
      Alert.alert("Route Not Started", "Please start the route first before marking stops.");
      return;
    }

    const stop = routeStops.find(s => s.id === stopId);
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (stop.status === "Pending") {
      // Mark as Picked Up
      Alert.alert(
        "Mark Pickup",
        `Confirm pickup for ${stop.passenger}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: () => {
              setRouteStops(routeStops.map(s => 
                s.id === stopId 
                  ? { ...s, status: "Picked Up", pickupTime: currentTime } 
                  : s
              ));
              addNotification("Passenger Picked Up", `${stop.passenger} has been picked up at ${stop.name}`, "success");
            }
          }
        ]
      );
    } else if (stop.status === "Picked Up") {
      // Mark as Dropped Off
      Alert.alert(
        "Mark Drop-off",
        `Confirm drop-off for ${stop.passenger}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: () => {
              setRouteStops(routeStops.map(s => 
                s.id === stopId 
                  ? { ...s, status: "Completed", dropoffTime: currentTime } 
                  : s
              ));
              addNotification("Passenger Dropped Off", `${stop.passenger} has been dropped off at ${stop.name}`, "success");
            }
          }
        ]
      );
    } else {
      // Reset to Pending
      setRouteStops(routeStops.map(s => 
        s.id === stopId 
          ? { ...s, status: "Pending", pickupTime: null, dropoffTime: null } 
          : s
      ));
    }
  };

  // Helper function to add notifications
  const addNotification = (title, message, type) => {
    const newNotif = {
      id: notifications.length + 1,
      title,
      message,
      time: "Just now",
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Handle availability confirmation
  const handleConfirmAvailability = () => {
    Alert.alert(
      "Confirm Availability",
      `Confirming your availability for ${getTomorrowDate()} from ${startTime} to ${endTime}. This will be sent to the transporter.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setAvailable(true);
            setAvailabilityModalVisible(false);
            addNotification(
              "Availability Confirmed",
              `Your availability for ${getTomorrowDate()} (${startTime} - ${endTime}) has been sent to the transporter.`,
              "success"
            );
            Alert.alert("Success", "Your availability has been confirmed and sent to the transporter!");
          }
        }
      ]
    );
  };

  // Support ticket submission
  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newTicket = {
      id: supportTickets.length + 1,
      category: ticketCategory,
      subject: ticketSubject,
      description: ticketDescription,
      status: "Pending",
      createdDate: new Date().toISOString().split('T')[0],
      resolvedDate: null,
      attachment: null
    };

    setSupportTickets([newTicket, ...supportTickets]);
    setNewTicketVisible(false);
    setTicketSubject("");
    setTicketDescription("");
    addNotification("Support Ticket Created", "Your support request has been submitted successfully.", "info");
    Alert.alert("Success", "Your support ticket has been submitted. We'll get back to you soon.");
  };

  // Calculate stats
  const completedStops = routeStops.filter(s => s.status === "Completed").length;
  const progress = routeStops.length > 0 ? (completedStops / routeStops.length) * 100 : 0;
  const completedTrips = trips.filter(t => t.status === "Completed").length;
  const totalEarnings = trips.filter(t => t.status === "Completed").reduce((sum, t) => sum + t.fare, 0);
  const avgRating = trips.filter(t => t.rating).length > 0 
    ? (trips.filter(t => t.rating).reduce((sum, t) => sum + t.rating, 0) / trips.filter(t => t.rating).length).toFixed(1)
    : "N/A";
  const totalEarned = paymentData.reduce((sum, p) => sum + p.amount, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Filtered trips
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.route.toLowerCase().includes(search.toLowerCase()) || 
                          trip.date.includes(search) ||
                          trip.startPoint.toLowerCase().includes(search.toLowerCase()) ||
                          trip.destination.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" ? true : trip.status === filter;
    const matchesDate = dateFilter === "All" ? true : trip.date.includes(dateFilter);
    return matchesSearch && matchesFilter && matchesDate;
  });

  const routeCoordinates = routeStops.map(stop => stop.coordinate);
  const vehiclePosition = routeStarted && currentLocation > 0 
    ? routeStops[Math.min(currentLocation - 1, routeStops.length - 1)].coordinate 
    : routeStops[0].coordinate;

  const styles = driverStyles;

  const StatusBadge = ({ status }) => {
    let bgColor = styles.statusBgColors.Pending;
    let textColor = styles.statusColors.Pending;
    
    if (status === "Completed" || status === "Transferred" || status === "Resolved") {
      bgColor = styles.statusBgColors.Completed;
      textColor = styles.statusColors.Completed;
    } else if (status === "Cancelled") {
      bgColor = styles.statusBgColors.Cancelled;
      textColor = styles.statusColors.Cancelled;
    } else if (status === "Picked Up" || status === "In Progress") {
      bgColor = "#E3F2FD";
      textColor = "#2196F3";
    }

    return (
      <View style={[styles.statusBadge, { 
        backgroundColor: bgColor, 
        paddingVertical: 6, 
        paddingHorizontal: 12, 
        minWidth: 90, 
        borderRadius: 12, 
        alignItems: "center" 
      }]}>
        <Text style={[{ fontWeight: "600", fontSize: 12, color: textColor }]}>
          {status}
        </Text>
      </View>
    );
  };

  const renderDashboard = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.contentPadding}>
        {/* Dashboard Statistics - FR-2.2.2 */}
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={28} color="#A1D826" />
            <Text style={styles.statValue}>{dashboardStats.completedTrips}</Text>
            <Text style={styles.statLabel}>Completed Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={28} color="#FF9800" />
            <Text style={styles.statValue}>{dashboardStats.activeTrips}</Text>
            <Text style={styles.statLabel}>Active Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="alert-circle" size={28} color="#2196F3" />
            <Text style={styles.statValue}>{dashboardStats.pendingTrips}</Text>
            <Text style={styles.statLabel}>Pending Trips</Text>
          </View>
        </View>

        {/* Monthly Earnings Summary - FR-2.2.2.4 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Earnings Summary</Text>
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Text style={{ fontSize: 14, color: "#999", marginBottom: 8 }}>Current Month Earnings</Text>
            <Text style={{ fontSize: 38, fontWeight: "800", color: "#A1D826" }}>
              Rs {dashboardStats.monthlyEarnings.toLocaleString()}
            </Text>
            <Text style={{ fontSize: 13, color: "#666", marginTop: 4 }}>October 2025</Text>
          </View>
        </View>

        {/* Assigned Route Information - FR-2.4 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Assigned Route</Text>
          <View style={styles.routeInfo}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location" size={20} color="#A1D826" />
              </View>
              <Text style={styles.cardText}>{routeData.routeName}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="navigate" size={20} color="#A1D826" />
              </View>
              <Text style={styles.cardText}>{routeData.startPoint} → {routeData.destination}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="time" size={20} color="#A1D826" />
              </View>
              <Text style={styles.cardText}>Start: {routeData.pickupTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="map" size={20} color="#A1D826" />
              </View>
              <Text style={styles.cardText}>{routeData.totalDistance} • {routeData.estimatedDuration}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigateTo("Routes")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>View Full Route Details</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Access Menu - FR-2.2.3 */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        {[
          { title: "Assigned Routes", icon: "map", view: "Routes" },
          { title: "Trip History", icon: "time", view: "History" },
          { title: "Payment & Salary", icon: "card", view: "Payments" },
          { title: "Support & Complaints", icon: "help-circle", view: "Support" },
          { title: "Notifications", icon: "notifications", view: "Notifications", badge: unreadNotifications }
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigateTo(item.view)}
            style={styles.menuCard}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name={item.icon} size={22} color="#A1D826" style={{ marginRight: 14 }} />
              <Text style={styles.menuCardText}>{item.title}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.badge > 0 && (
                <View style={{
                  backgroundColor: "#F44336",
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10
                }}>
                  <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
                    {item.badge}
                  </Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color="#A1D826" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderAvailability = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.contentPadding}>
        {/* Current Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Availability Status</Text>
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Ionicons 
              name={available ? "checkmark-circle" : "close-circle"} 
              size={64} 
              color={available ? "#A1D826" : "#999"} 
            />
            <Text style={{ 
              fontSize: 18, 
              fontWeight: "700", 
              color: available ? "#A1D826" : "#999", 
              marginTop: 12 
            }}>
              {available ? "Available for Tomorrow" : "Not Available"}
            </Text>
            {available && (
              <View style={{ marginTop: 10, alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: "#666" }}>
                  Date: {getTomorrowDate()}
                </Text>
                <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
                  Time: {startTime} - {endTime}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Confirm Availability Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Confirm Tomorrow's Availability</Text>
          <Text style={styles.cardText}>
            Let the transporter know your available timings for {getTomorrowDate()}
          </Text>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 10 }}>
              Start Time
            </Text>
            <View style={{
              backgroundColor: "#f9f9f9",
              borderWidth: 1,
              borderColor: "#e5e5e5",
              borderRadius: 12,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20
            }}>
              <Ionicons name="time-outline" size={20} color="#A1D826" style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1, fontSize: 15, color: "#333" }}
                placeholder="07:00 AM"
                value={startTime}
                onChangeText={setStartTime}
                placeholderTextColor="#999"
              />
            </View>

            <Text style={{ fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 10 }}>
              End Time
            </Text>
            <View style={{
              backgroundColor: "#f9f9f9",
              borderWidth: 1,
              borderColor: "#e5e5e5",
              borderRadius: 12,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20
            }}>
              <Ionicons name="time-outline" size={20} color="#A1D826" style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1, fontSize: 15, color: "#333" }}
                placeholder="06:00 PM"
                value={endTime}
                onChangeText={setEndTime}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirmAvailability}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Confirm Availability</Text>
          </TouchableOpacity>

         ({available && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#F44336", marginTop: 12 }]}
              onPress={() => {
                Alert.alert(
                  "Mark Unavailable",
                  "Are you sure you want to mark yourself as unavailable for tomorrow?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Yes, Unavailable",
                      style: "destructive",
                      onPress: () => {
                        setAvailable(false);
                        addNotification(
                          "Marked Unavailable",
                          `You have marked yourself as unavailable for ${getTomorrowDate()}.`,
                          "warning"
                        );
                        Alert.alert("Updated", "You have been marked as unavailable for tomorrow.");
                      }
                    }
                  ]
                );
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Mark Unavailable</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Information Card */}
        <View style={[styles.card, { backgroundColor: "#F0F9D9" }]}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="information-circle" size={24} color="#6B8E23" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#6B8E23", marginBottom: 8 }}>
                Important Information
              </Text>
              <Text style={{ fontSize: 14, color: "#6B8E23", lineHeight: 20 }}>
                • Please confirm your availability before 6:00 PM daily{"\n"}
                • Your availability will be sent to the transporter{"\n"}
                • You'll receive a notification once route is assigned{"\n"}
                • Update your timings if there are any changes
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Availability History */}
        <Text style={styles.sectionTitle}>Recent Availability History</Text>
        {[
          { date: "19 Oct 2025", status: "Available", time: "07:00 AM - 06:00 PM", assigned: true },
          { date: "18 Oct 2025", status: "Available", time: "07:00 AM - 06:00 PM", assigned: true },
          { date: "17 Oct 2025", status: "Unavailable", time: "-", assigned: false },
          { date: "16 Oct 2025", status: "Available", time: "07:00 AM - 05:00 PM", assigned: true },
        ].map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#333" }}>{item.date}</Text>
              <View style={[styles.statusBadge, { 
                backgroundColor: item.status === "Available" ? "#E8F5E9" : "#FFEBEE",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 12
              }]}>
                <Text style={{ 
                  fontSize: 12, 
                  fontWeight: "600", 
                  color: item.status === "Available" ? "#4CAF50" : "#F44336" 
                }}>
                  {item.status}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
              <Ionicons name="time-outline" size={14} color="#999" />
              <Text style={{ fontSize: 14, color: "#666", marginLeft: 6 }}>
                {item.time}
              </Text>
            </View>
            {item.assigned && (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                <Ionicons name="checkmark-circle" size={14} color="#A1D826" />
                <Text style={{ fontSize: 13, color: "#A1D826", marginLeft: 6 }}>
                  Route was assigned
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderRoutes = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Real-time GPS Map View - FR-2.6 */}
      <View style={[styles.mapContainer, { marginHorizontal: 20, marginTop: 20 }]}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            latitude: 24.8300,
            longitude: 67.0400,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }}
          showsUserLocation={routeStarted}
          showsMyLocationButton={false}
        >
          {/* Route Path */}
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#A1D826"
            strokeWidth={4}
            lineDashPattern={[1]}
          />
          
          {/* Passenger Stops - FR-2.4.2.4 */}
          {routeStops.map((stop, index) => (
            <Marker
              key={stop.id}
              coordinate={stop.coordinate}
              title={stop.name}
              description={stop.passenger}
              onPress={() => { setSelectedStop(stop); setDetailsVisible(true); }}
            >
              <View style={{
                backgroundColor: stop.status === "Completed" ? "#4CAF50" : 
                               stop.status === "Picked Up" ? "#2196F3" : "#FF9800",
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: "#fff",
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}>
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                  {index + 1}
                </Text>
              </View>
            </Marker>
          ))}
          
          {/* Live Vehicle Position - FR-2.6.1 */}
          {routeStarted && (
            <Marker
              coordinate={vehiclePosition}
              title="Your Vehicle"
              description={routeData.vehicleNumber}
            >
              <View style={{
                backgroundColor: "#2196F3",
                width: 42,
                height: 42,
                borderRadius: 21,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: "#fff",
                shadowColor: "#000",
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 8,
              }}>
                <Ionicons name="car" size={22} color="#fff" />
              </View>
            </Marker>
          )}
        </MapView>
        
        <View style={styles.mapOverlay}>
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={() => setMapExpanded(!mapExpanded)}
            activeOpacity={0.7}
          >
            <Ionicons name={mapExpanded ? "contract" : "expand"} size={16} color="#A1D826" />
            <Text style={styles.mapButtonText}>{mapExpanded ? "Collapse" : "Expand"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentPadding}>
        {/* Route Progress - FR-2.6.5 */}
        {routeStarted && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>{completedStops} / {routeStops.length} stops</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={{ fontSize: 12, color: "#999", marginTop: 8, textAlign: "center" }}>
              GPS tracking active • Last updated: {new Date().toLocaleTimeString()}
            </Text>
          </View>
        )}

        {/* Route Details - FR-2.4.2 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{routeData.routeName}</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Ionicons name="calendar" size={20} color="#A1D826" /></View>
            <Text style={styles.cardText}>Date: {routeData.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Ionicons name="bus" size={20} color="#A1D826" /></View>
            <Text style={styles.cardText}>{routeData.vehicleType} - {routeData.vehicleNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Ionicons name="location" size={20} color="#A1D826" /></View>
            <Text style={styles.cardText}>{routeData.startPoint} → {routeData.destination}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Ionicons name="time" size={20} color="#A1D826" /></View>
            <Text style={styles.cardText}>{routeData.pickupTime} - {routeData.estimatedArrival}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Ionicons name="navigate" size={20} color="#A1D826" /></View>
            <Text style={styles.cardText}>{routeData.totalDistance} • {routeData.estimatedDuration}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Ionicons name="people" size={20} color="#A1D826" /></View>
            <Text style={styles.cardText}>Total Stops: {routeData.totalStops}</Text>
          </View>
        </View>

        {/* Pickup and Drop Services - FR-2.5 */}
        <Text style={styles.sectionTitle}>Route Stops & Passengers</Text>
        {routeStops.map((stop, index) => (
          <View key={stop.id} style={styles.stopCard}>
            <View style={styles.stopHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View style={styles.stopNumber}>
                  <Text style={styles.stopNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stopName}>{stop.name}</Text>
              </View>
              <StatusBadge status={stop.status} />
            </View>
            
            <Text style={styles.stopPassenger}>
              <Ionicons name="person" size={14} color="#999" /> {stop.passenger}
            </Text>
            
            <View style={styles.stopTime}>
              <Ionicons name="time-outline" size={14} color="#999" />
              <Text style={styles.stopTimeText}>Scheduled: {stop.scheduledTime}</Text>
            </View>
            
            {/* Timestamp Recording - FR-2.5.4 */}
            {stop.pickupTime && (
              <View style={styles.stopTime}>
                <Ionicons name="log-in-outline" size={14} color="#4CAF50" />
                <Text style={[styles.stopTimeText, { color: "#4CAF50" }]}>
                  Picked up: {stop.pickupTime}
                </Text>
              </View>
            )}
            
            {stop.dropoffTime && (
              <View style={styles.stopTime}>
                <Ionicons name="log-out-outline" size={14} color="#2196F3" />
                <Text style={[styles.stopTimeText, { color: "#2196F3" }]}>
                  Dropped off: {stop.dropoffTime}
                </Text>
              </View>
            )}

            {/* Mark Pickup/Drop-off - FR-2.5.2 */}
            <View style={styles.stopFooter}>
              <TouchableOpacity
                style={[styles.actionButton, { flex: 1, marginRight: 8 }]}
                onPress={() => toggleStopStatus(stop.id)}
                activeOpacity={0.7}
                disabled={!routeStarted}
              >
                <Ionicons 
                  name={stop.status === "Completed" ? "checkmark-done-circle" : 
                       stop.status === "Picked Up" ? "arrow-down-circle" : "arrow-up-circle"} 
                  size={20} 
                  color="#fff" 
                />
                <Text style={styles.actionButtonText}>
                  {stop.status === "Completed" ? "Completed" : 
                   stop.status === "Picked Up" ? "Drop Off" : "Pick Up"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => { setSelectedStop(stop); setDetailsVisible(true); }}
                activeOpacity={0.7}
              >
                <Ionicons name="information-circle-outline" size={20} color="#A1D826" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Start/End Trip - FR-2.4.3 */}
        <TouchableOpacity
          onPress={routeStarted ? handleEndRoute : handleStartRoute}
          style={[styles.startButton, { backgroundColor: routeStarted ? "#F44336" : "#A1D826" }]}
          activeOpacity={0.8}
        >
          <Ionicons name={routeStarted ? "stop-circle" : "play-circle"} size={24} color="#fff" />
          <Text style={styles.actionButtonText}>
            {routeStarted ? "End Route & Stop GPS" : "Start Route & GPS Tracking"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderPayments = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.contentPadding}>
        {/* Payment Notification - FR-2.7.3 */}
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
            <Text style={styles.notificationTitle}>Latest Payment Update</Text>
          </View>
          <Text style={styles.notificationText}>
            Your salary for October 2025 has been transferred to your Easypaisa account.
          </Text>
          <Text style={styles.notificationTime}>15 Oct 2025 - 2:15 PM</Text>
        </View>

        {/* Current Month Payment Summary - FR-2.7.1 */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryMonth}>{paymentData[0].month}</Text>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>{paymentData[0].status}</Text>
            </View>
          </View>
          
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount Received</Text>
            <Text style={styles.amountValue}>Rs {paymentData[0].amount.toLocaleString()}</Text>
            <Text style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
              via {paymentData[0].paymentMethod}
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{paymentData[0].trips}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{paymentData[0].totalEarnings.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{paymentData[0].commission.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Commission</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, { flexDirection: "row", justifyContent: "center" }]}
            onPress={() => { setSelectedPayment(paymentData[0]); setPaymentDetailsVisible(true); }}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>View Complete Details</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* Payment History - FR-2.7.4 */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          <Text style={{ fontSize: 14, color: "#A1D826", fontWeight: "600" }}>
            Total: Rs {totalEarned.toLocaleString()}
          </Text>
        </View>

        {paymentData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.paymentCard}
            onPress={() => { setSelectedPayment(item); setPaymentDetailsVisible(true); }}
            activeOpacity={0.7}
          >
            <View style={styles.paymentCardHeader}>
              <View>
                <Text style={styles.paymentMonth}>{item.month}</Text>
                <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                  {item.trips} trips completed
                </Text>
              </View>
              <Text style={styles.paymentAmount}>Rs {item.amount.toLocaleString()}</Text>
            </View>
            
            <View style={styles.paymentCardFooter}>
              <View style={styles.paymentDate}>
                <Ionicons name="calendar-outline" size={14} color="#999" style={{ marginRight: 6 }} />
                <Text style={{ color: "#999", fontSize: 12 }}>{item.date}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="wallet-outline" size={14} color="#4CAF50" style={{ marginRight: 4 }} />
                <Text style={styles.paymentStatus}>{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderHistory = () => (
    <View style={{ flex: 1 }}>
      {/* Trip Statistics */}
      <View style={{ marginHorizontal: 20, marginTop: 20, marginBottom: 10, flexDirection: "row", gap: 10 }}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#A1D826" />
          <Text style={styles.statValue}>{completedTrips}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color="#A1D826" />
          <Text style={styles.statValue}>{(totalEarnings / 1000).toFixed(0)}k</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="star" size={24} color="#A1D826" />
          <Text style={styles.statValue}>{avgRating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Search and Filter - FR-2.8.3 */}
      <View style={[styles.searchContainer, { marginHorizontal: 20, marginTop: 15 }]}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search by route, location or date..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filter */}
      <View style={[styles.tabContainer, { marginHorizontal: 20 }]}>
        {["All", "Completed", "Cancelled", "Upcoming"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.tab, filter === item && styles.tabActive]}
            onPress={() => setFilter(item)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, filter === item && styles.tabTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trip History List - FR-2.8 */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        {filteredTrips.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={{ fontSize: 16, color: "#999", marginTop: 16 }}>No trips found</Text>
          </View>
        ) : (
          filteredTrips.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.tripCard}
              onPress={() => { setSelectedTrip(item); setTripDetailsVisible(true); }}
              activeOpacity={0.7}
            >
              <View style={styles.tripHeader}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.routeText}>{item.route}</Text>
                  <Text style={{ fontSize: 13, color: "#999", marginTop: 4 }}>
                    {item.vehicle}
                  </Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <Ionicons name="calendar-outline" size={14} color="#999" />
                <Text style={styles.dateText}> {item.date}</Text>
                <Ionicons name="time-outline" size={14} color="#999" style={{ marginLeft: 15 }} />
                <Text style={styles.dateText}> {item.time}</Text>
              </View>
              
              <View style={styles.tripDetails}>
                <View style={styles.tripDetailItem}>
                  <Ionicons name="speedometer-outline" size={16} color="#A1D826" />
                  <Text style={styles.tripDetailText}>{item.distance}</Text>
                </View>
                <View style={styles.tripDetailItem}>
                  <Ionicons name="hourglass-outline" size={16} color="#A1D826" />
                  <Text style={styles.tripDetailText}>{item.duration}</Text>
                </View>
                <View style={styles.tripDetailItem}>
                  <Ionicons name="people-outline" size={16} color="#A1D826" />
                  <Text style={styles.tripDetailText}>{item.passengers} passengers</Text>
                </View>
              </View>
              
              {item.status === "Completed" && (
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <Text style={styles.fareText}>Rs {item.fare.toLocaleString()}</Text>
                  {item.rating && (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="star" size={16} color="#FFB300" />
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#666", marginLeft: 4 }}>
                        {item.rating}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              
              {item.cancellationReason && (
                <View style={{ marginTop: 10, padding: 10, backgroundColor: "#FFEBEE", borderRadius: 8 }}>
                  <Text style={{ fontSize: 12, color: "#C62828" }}>
                    <Ionicons name="alert-circle" size={12} /> {item.cancellationReason}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderSupport = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.contentPadding}>
        {/* Submit New Ticket Button - FR-2.10 */}
        <TouchableOpacity
          style={[styles.button, { marginBottom: 20 }]}
          onPress={() => setNewTicketVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Submit New Support Request</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Support Tickets</Text>

        {/* Support Tickets List - FR-2.10.4 */}
        {supportTickets.length === 0 ? (
          <View style={styles.card}>
            <View style={{ alignItems: "center", paddingVertical: 30 }}>
              <Ionicons name="checkmark-circle-outline" size={64} color="#A1D826" />
              <Text style={{ fontSize: 16, color: "#666", marginTop: 16, textAlign: "center" }}>
                No support tickets yet
              </Text>
            </View>
          </View>
        ) : (
          supportTickets.map((ticket) => (
            <View key={ticket.id} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                    <View style={{
                      backgroundColor: "#F0F9D9",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                      marginRight: 10
                    }}>
                      <Text style={{ fontSize: 11, fontWeight: "600", color: "#6B8E23" }}>
                        {ticket.category}
                      </Text>
                    </View>
                    <StatusBadge status={ticket.status} />
                  </View>
                  <Text style={{ fontSize: 17, fontWeight: "700", color: "#333", marginTop: 4 }}>
                    {ticket.subject}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.cardText}>{ticket.description}</Text>
              
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#f0f0f0" }}>
                <View>
                  <Text style={{ fontSize: 12, color: "#999" }}>
                    <Ionicons name="calendar-outline" size={12} /> Created: {ticket.createdDate}
                  </Text>
                  {ticket.resolvedDate && (
                    <Text style={{ fontSize: 12, color: "#4CAF50", marginTop: 4 }}>
                      <Ionicons name="checkmark-circle" size={12} /> Resolved: {ticket.resolvedDate}
                    </Text>
                  )}
                </View>
                <Text style={{ fontSize: 12, fontWeight: "600", color: "#A1D826" }}>
                  #{ticket.id.toString().padStart(4, '0')}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  const renderNotifications = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.contentPadding}>
        {/* Notification Center - FR-2.9.3 */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>All Notifications</Text>
          {unreadNotifications > 0 && (
            <TouchableOpacity
              onPress={() => {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
                Alert.alert("Success", "All notifications marked as read");
              }}
              style={{ padding: 8 }}
            >
              <Text style={{ fontSize: 13, color: "#A1D826", fontWeight: "600" }}>
                Mark all as read
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List - FR-2.9.1 */}
        {notifications.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.card, { 
              marginBottom: 12,
              backgroundColor: notif.read ? "#fff" : "#F0F9D9",
              borderLeftWidth: notif.read ? 0 : 4,
              borderLeftColor: "#A1D826"
            }]}
            onPress={() => {
              setNotifications(notifications.map(n => 
                n.id === notif.id ? { ...n, read: true } : n
              ));
            }}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 22, 
                backgroundColor: notif.read ? "#f5f5f5" : "#fff", 
                alignItems: "center", 
                justifyContent: "center", 
                marginRight: 14 
              }}>
                <Ionicons 
                  name={notif.type === "success" ? "checkmark-circle" : 
                       notif.type === "warning" ? "alert-circle" : 
                       notif.type === "info" ? "information-circle" : "notifications"} 
                  size={26} 
                  color={notif.type === "success" ? "#4CAF50" : 
                        notif.type === "warning" ? "#FF9800" : 
                        notif.type === "info" ? "#2196F3" : "#A1D826"} 
                />
              </View>
              
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#333", flex: 1, marginRight: 8 }}>
                    {notif.title}
                  </Text>
                  {!notif.read && (
                    <View style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#A1D826"
                    }} />
                  )}
                </View>
                
                <Text style={{ fontSize: 14, color: "#666", lineHeight: 20, marginTop: 4 }}>
                  {notif.message}
                </Text>
                
                <Text style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
                  <Ionicons name="time-outline" size={12} /> {notif.time}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(!sidebarOpen)}>
          <Ionicons name={sidebarOpen ? "close" : "menu"} size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{currentView}</Text>
          <Text style={styles.headerSubtitle}>Driver Portal</Text>
        </View>
        <View style={{ width: 40 }}>
          {currentView === "Notifications" && unreadNotifications > 0 && (
            <View style={{
              backgroundColor: "#F44336",
              width: 20,
              height: 20,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                {unreadNotifications}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <TouchableOpacity 
            style={styles.sidebarOverlay}
            onPress={() => setSidebarOpen(false)}
            activeOpacity={1}
          />
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarHeaderText}>Driver Portal</Text>
              <Text style={styles.sidebarHeaderSubtext}>Muhammad Ahmed</Text>
            </View>
            
            <ScrollView style={styles.sidebarMenu}>
              {[
                { view: "Dashboard", title: "Dashboard", icon: "home" },
                { view: "Availability", title: "Confirm Availability", icon: "calendar-outline" },
                { view: "Routes", title: "Assigned Routes", icon: "map" },
                { view: "History", title: "Trip History", icon: "time" },
                { view: "Payments", title: "Payments & Salary", icon: "card" },
                { view: "Support", title: "Support & Complaints", icon: "help-circle" },
                { view: "Notifications", title: "Notifications", icon: "notifications", badge: unreadNotifications },
              ].map((item) => (
                <TouchableOpacity
                  key={item.view}
                  style={[styles.sidebarItem, currentView === item.view && styles.sidebarItemActive]}
                  onPress={() => navigateTo(item.view)}
                >
                  <Ionicons name={item.icon} size={20} color={currentView === item.view ? "#A1D826" : "#666"} />
                  <Text style={[styles.sidebarItemText, currentView === item.view && styles.sidebarItemTextActive]}>
                    {item.title}
                  </Text>
                  {item.badge > 0 && (
                    <View style={{
                      backgroundColor: "#F44336",
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "auto"
                    }}>
                      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.sidebarFooter}>
              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={() => Alert.alert(
                  "Logout", 
                  "Are you sure you want to logout?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Logout", style: "destructive", onPress: () => {
                      Alert.alert("Success", "Logged out successfully");
                    }}
                  ]
                )}
              >
                <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Content Views */}
      {currentView === "Dashboard" && renderDashboard()}
      {currentView === "Availability" && renderAvailability()}
      {currentView === "Routes" && renderRoutes()}
      {currentView === "Payments" && renderPayments()}
      {currentView === "History" && renderHistory()}
      {currentView === "Support" && renderSupport()}
      {currentView === "Notifications" && renderNotifications()}

      {/* Stop Details Modal */}
      <Modal visible={detailsVisible} transparent={true} animationType="slide" onRequestClose={() => setDetailsVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setDetailsVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Stop Details</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setDetailsVisible(false)}>
                <Ionicons name="close" size={26} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedStop && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Stop Name</Text>
                    <Text style={styles.detailValue}>{selectedStop.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Passenger</Text>
                    <Text style={styles.detailValue}>{selectedStop.passenger}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Scheduled Time</Text>
                    <Text style={styles.detailValue}>{selectedStop.scheduledTime}</Text>
                  </View>
                  {selectedStop.pickupTime && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Pickup Time</Text>
                      <Text style={[styles.detailValue, { color: "#4CAF50" }]}>{selectedStop.pickupTime}</Text>
                    </View>
                  )}
                  {selectedStop.dropoffTime && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Drop-off Time</Text>
                      <Text style={[styles.detailValue, { color: "#2196F3" }]}>{selectedStop.dropoffTime}</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone</Text>
                    <Text style={styles.detailValue}>{selectedStop.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <StatusBadge status={selectedStop.status} />
                    </View>
                  </View>
                </View>
                
                {selectedStop.phone !== "N/A" && (
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => {
                      Alert.alert("Call Passenger", `Calling ${selectedStop.passenger}...`);
                      setDetailsVisible(false);
                    }}
                  >
                    <Ionicons name="call" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Call Passenger</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Payment Details Modal */}
      <Modal visible={paymentDetailsVisible} transparent={true} animationType="slide" onRequestClose={() => setPaymentDetailsVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setPaymentDetailsVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Details</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setPaymentDetailsVisible(false)}>
                <Ionicons name="close" size={26} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedPayment && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Month</Text>
                    <Text style={styles.detailValue}>{selectedPayment.month}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment Date</Text>
                    <Text style={styles.detailValue}>{selectedPayment.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Trips</Text>
                    <Text style={styles.detailValue}>{selectedPayment.trips}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Earnings</Text>
                    <Text style={styles.detailValue}>Rs {selectedPayment.totalEarnings.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Commission</Text>
                    <Text style={styles.detailValue}>Rs {selectedPayment.commission.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Net Amount</Text>
                    <Text style={styles.detailHighlight}>Rs {selectedPayment.amount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment Method</Text>
                    <Text style={styles.detailValue}>{selectedPayment.paymentMethod}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Transaction ID</Text>
                    <Text style={styles.detailValue}>{selectedPayment.transactionId}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <StatusBadge status={selectedPayment.status} />
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => setPaymentDetailsVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Trip Details Modal */}
      <Modal visible={tripDetailsVisible} transparent={true} animationType="slide" onRequestClose={() => setTripDetailsVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setTripDetailsVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Trip Details</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setTripDetailsVisible(false)}>
                <Ionicons name="close" size={26} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedTrip && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Route</Text>
                    <Text style={styles.detailValue}>{selectedTrip.route}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Start Point</Text>
                    <Text style={styles.detailValue}>{selectedTrip.startPoint}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Destination</Text>
                    <Text style={styles.detailValue}>{selectedTrip.destination}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{selectedTrip.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailValue}>{selectedTrip.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailValue}>{selectedTrip.duration}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Distance</Text>
                    <Text style={styles.detailValue}>{selectedTrip.distance}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Passengers</Text>
                    <Text style={styles.detailValue}>{selectedTrip.passengers}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Vehicle</Text>
                    <Text style={styles.detailValue}>{selectedTrip.vehicle}</Text>
                  </View>
                  {selectedTrip.status === "Completed" && (
                    <>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Fare</Text>
                        <Text style={styles.detailHighlight}>Rs {selectedTrip.fare.toLocaleString()}</Text>
                      </View>
                      {selectedTrip.rating && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Rating</Text>
                          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                            <Ionicons name="star" size={18} color="#FFB300" />
                            <Text style={[styles.detailValue, { marginLeft: 4 }]}>{selectedTrip.rating}</Text>
                          </View>
                        </View>
                      )}
                    </>
                  )}
                  {selectedTrip.cancellationReason && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Cancellation Reason</Text>
                      <Text style={[styles.detailValue, { color: "#F44336" }]}>{selectedTrip.cancellationReason}</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <StatusBadge status={selectedTrip.status} />
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => setTripDetailsVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* New Support Ticket Modal */}
      <Modal visible={newTicketVisible} transparent={true} animationType="slide" onRequestClose={() => setNewTicketVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setNewTicketVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Support Request</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setNewTicketVisible(false)}>
                <Ionicons name="close" size={26} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 10 }}>
                Category
              </Text>
              
              {/* Category Selection - FR-2.10.2 */}
              <View style={styles.tabContainer}>
                {["Payment Issue", "Route Issue", "Technical Issue"].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.tab, ticketCategory === category && styles.tabActive]}
                    onPress={() => setTicketCategory(category)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tabText, ticketCategory === category && styles.tabTextActive]}>
                      {category.replace(" Issue", "")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 10, marginTop: 20 }}>
                Subject
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#f9f9f9",
                  borderWidth: 1,
                  borderColor: "#e5e5e5",
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 15,
                  color: "#333",
                  marginBottom: 20
                }}
                placeholder="Enter subject"
                value={ticketSubject}
                onChangeText={setTicketSubject}
                placeholderTextColor="#999"
              />

              <Text style={{ fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 10 }}>
                Description
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#f9f9f9",
                  borderWidth: 1,
                  borderColor: "#e5e5e5",
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 15,
                  color: "#333",
                  height: 120,
                  textAlignVertical: "top",
                  marginBottom: 20
                }}
                placeholder="Describe your issue in detail..."
                value={ticketDescription}
                onChangeText={setTicketDescription}
                multiline
                numberOfLines={5}
                placeholderTextColor="#999"
              />

              {/* FR-2.10.3: Attachment option */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: 14,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20
                }}
                onPress={() => Alert.alert("Attachment", "File picker would open here")}
              >
                <Ionicons name="attach" size={20} color="#666" />
                <Text style={{ color: "#666", marginLeft: 8, fontSize: 15 }}>
                  Attach Image or Document
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSubmitTicket}
              >
                <Text style={styles.buttonText}>Submit Request</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, { backgroundColor: "#f5f5f5", marginTop: 10 }]} 
                onPress={() => setNewTicketVisible(false)}
              >
                <Text style={[styles.buttonText, { color: "#666" }]}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UnifiedDriverDashboard;