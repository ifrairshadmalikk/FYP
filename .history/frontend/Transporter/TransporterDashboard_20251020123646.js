import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Animated,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function TransporterDashboard() {
  const navigation = useNavigation();

  // Sidebar state
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Enhanced Stats data with realistic numbers
  const stats = {
    passengers: { total: 847, picked: 623, percentage: 73 },
    drivers: { total: 24, active: 19, percentage: 79 },
    vans: { total: 18, active: 15, late: 2, percentage: 83 },
    revenue: { daily: "Rs 45,820", weekly: "Rs 289,450" }
  };

  // Quick Actions with proper navigation
  const quickActions = [
    { id: "1", label: "Ride Planner", icon: "calendar-outline", nav: "CreatePoll", color: "#8E44AD" },
    { id: "2", label: "View Responses", icon: "chatbubble-ellipses-outline", nav: "ViewResponse", color: "#3498DB" },
    { id: "3", label: "Assign Route", icon: "map-outline", nav: "AssignRoute", color: "#27AE60" },
    { id: "4", label: "Live Tracking", icon: "location-outline", nav: "VanTracking", color: "#E74C3C" },
    { id: "5", label: "Schedule", icon: "time-outline", nav: "SmartScheduling", color: "#F39C12" },
    { id: "6", label: "Reports", icon: "document-text-outline", nav: "Reports", color: "#16A085" },
  ];

  // Recent Activities
  const recentActivities = [
    { id: 1, type: "success", message: "Poll created for Blue Area route", time: "2 mins ago", icon: "checkmark-circle" },
    { id: 2, type: "info", message: "New driver registration approved", time: "15 mins ago", icon: "person-add" },
    { id: 3, type: "warning", message: "Van #12 delayed by 15 minutes", time: "30 mins ago", icon: "time" },
    { id: 4, type: "success", message: "Morning shift completed successfully", time: "1 hour ago", icon: "checkmark-done" },
    { id: 5, type: "info", message: "25 new passenger registrations", time: "2 hours ago", icon: "people" },
  ];

  // Manager Profile Data
  const managerProfile = {
    name: "Ali Ahmed",
    role: "Van Operations Manager",
    phone: "+92 300 1234567",
    experience: "5 years",
    rating: 4.8,
    totalRoutes: 12,
    completedTrips: 2450,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  };

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuVisible(false));
  };

  const handleNotification = () => {
    Alert.alert(
      "Notifications",
      "You have 3 new notifications:\n\n• 2 new poll responses\n• 1 driver request\n• System update available",
      [
        { text: "View All", onPress: () => navigation.navigate("Notifications") },
        { text: "OK", style: "cancel" }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => navigation.navigate("TransporterLogin")
        }
      ]
    );
  };

  const getActivityColor = (type) => {
    const colors = {
      success: "#27AE60",
      info: "#3498DB",
      warning: "#F39C12",
      error: "#E74C3C"
    };
    return colors[type] || "#3498DB";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />
      <View style={styles.container}>
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
              <Ionicons name="menu" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Operations Dashboard</Text>
              <Text style={styles.headerDate}>{getTodayDate()}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotification}>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Welcome Message */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.managerName}>{managerProfile.name} 👋</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats Overview - Enhanced */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: '#E8F5E8' }]}>
                    <Ionicons name="people" size={20} color="#27AE60" />
                  </View>
                  <Text style={styles.statPercentage}>{stats.passengers.percentage}%</Text>
                </View>
                <Text style={styles.statNumber}>{stats.passengers.picked}</Text>
                <Text style={styles.statLabel}>Passengers Served</Text>
                <Text style={styles.statSubtext}>of {stats.passengers.total} total</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="person" size={20} color="#3498DB" />
                  </View>
                  <Text style={styles.statPercentage}>{stats.drivers.percentage}%</Text>
                </View>
                <Text style={styles.statNumber}>{stats.drivers.active}</Text>
                <Text style={styles.statLabel}>Active Drivers</Text>
                <Text style={styles.statSubtext}>of {stats.drivers.total} total</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="bus" size={20} color="#F39C12" />
                  </View>
                  <Text style={styles.statPercentage}>{stats.vans.percentage}%</Text>
                </View>
                <Text style={styles.statNumber}>{stats.vans.active}</Text>
                <Text style={styles.statLabel}>Vans Operating</Text>
                <Text style={styles.statSubtext}>{stats.vans.late} running late</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: '#F3E5F5' }]}>
                    <Ionicons name="cash" size={20} color="#8E44AD" />
                  </View>
                  <Text style={styles.statPercentage}>+12%</Text>
                </View>
                <Text style={styles.statNumber}>{stats.revenue.daily}</Text>
                <Text style={styles.statLabel}>Today's Revenue</Text>
                <Text style={styles.statSubtext}>{stats.revenue.weekly} this week</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate(action.nav)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <Ionicons name={action.icon} size={24} color="#fff" />
                  </View>
                  <Text style={styles.actionText}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activities */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.activitiesCard}>
              {recentActivities.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: `${getActivityColor(activity.type)}15` }]}>
                    <Ionicons name={activity.icon} size={16} color={getActivityColor(activity.type)} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityMessage}>{activity.message}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Performance Highlights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Highlights</Text>
            <View style={styles.highlightsGrid}>
              <View style={styles.highlightCard}>
                <Ionicons name="trending-up" size={32} color="#27AE60" />
                <Text style={styles.highlightNumber}>94%</Text>
                <Text style={styles.highlightLabel}>On-time Performance</Text>
              </View>
              <View style={styles.highlightCard}>
                <Ionicons name="happy" size={32} color="#3498DB" />
                <Text style={styles.highlightNumber}>4.8</Text>
                <Text style={styles.highlightLabel}>Customer Rating</Text>
              </View>
              <View style={styles.highlightCard}>
                <Ionicons name="flash" size={32} color="#F39C12" />
                <Text style={styles.highlightNumber}>18%</Text>
                <Text style={styles.highlightLabel}>Efficiency Gain</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Enhanced Sidebar */}
        <Modal transparent visible={menuVisible} animationType="none">
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={closeMenu}
          >
            <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
              {/* Manager Profile Section */}
              <View style={styles.profileSection}>
                <TouchableOpacity
                  onPress={() => {
                    closeMenu();
                    navigation.navigate("ProfileScreen");
                  }}
                  style={styles.profileTouchable}
                >
                  <Image
                    source={{ uri: managerProfile.avatar }}
                    style={styles.profileImage}
                  />
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{managerProfile.name}</Text>
                    <Text style={styles.profileRole}>{managerProfile.role}</Text>
                    <View style={styles.profileStats}>
                      <View style={styles.profileStat}>
                        <Ionicons name="star" size={14} color="#F39C12" />
                        <Text style={styles.profileStatText}>{managerProfile.rating}</Text>
                      </View>
                      <View style={styles.profileStat}>
                        <Ionicons name="time" size={14} color="#3498DB" />
                        <Text style={styles.profileStatText}>{managerProfile.experience}</Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#7F8C8D" />
                </TouchableOpacity>
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Management</Text>
                {[
                  { icon: "person-add-outline", label: "Add Driver", nav: "AddDriver" },
                  { icon: "person-circle-outline", label: "Add Passenger", nav: "AddPassenger" },
                  { icon: "people-outline", label: "Drivers List", nav: "DriverList" },
                  { icon: "person-outline", label: "Passengers List", nav: "PassengerList" },
                  { icon: "bus-outline", label: "Van Fleet", nav: "VanFleet" },
                ].map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.menuItem}
                    onPress={() => {
                      closeMenu();
                      navigation.navigate(item.nav);
                    }}
                  >
                    <Ionicons name={item.icon} size={22} color="#2C3E50" />
                    <Text style={styles.menuText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Analytics</Text>
                {[
                  { icon: "bar-chart-outline", label: "Driver Performance", nav: "DriverPerformance" },
                  { icon: "analytics-outline", label: "Route Analytics", nav: "RouteAnalytics" },
                  { icon: "card-outline", label: "Revenue Reports", nav: "Payments" },
                  { icon: "trending-up-outline", label: "Growth Insights", nav: "GrowthInsights" },
                ].map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.menuItem}
                    onPress={() => {
                      closeMenu();
                      navigation.navigate(item.nav);
                    }}
                  >
                    <Ionicons name={item.icon} size={22} color="#2C3E50" />
                    <Text style={styles.menuText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.menuFooter}>
                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={22} color="#E74C3C" />
                  <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#afd826" },
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  
  // Enhanced Header
  header: {
    backgroundColor: "#afd826",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  menuButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  headerDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "500",
  },
  notificationButton: {
    padding: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  notificationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  welcomeSection: {
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  managerName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginTop: 2,
  },

  scrollContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
  },

  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
  },
  viewAllText: {
    fontSize: 14,
    color: "#afd826",
    fontWeight: "600",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    width: (width - 64) / 2 - 6,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statPercentage: {
    fontSize: 12,
    fontWeight: "700",
    color: "#27AE60",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: "#7F8C8D",
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  actionCard: {
    width: (width - 64) / 3 - 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
    lineHeight: 16,
  },

  // Recent Activities
  activitiesCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F9FA",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C3E50",
    marginBottom: 4,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 12,
    color: "#7F8C8D",
  },

  // Performance Highlights
  highlightsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  highlightNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2C3E50",
    marginVertical: 8,
  },
  highlightLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    textAlign: "center",
    fontWeight: "500",
  },

  // Enhanced Sidebar
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.78,
    backgroundColor: "#fff",
    paddingVertical: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
    marginBottom: 20,
  },
  profileTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: "row",
  },
  profileStat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  profileStatText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C3E50",
    marginLeft: 4,
  },
  menuSection: {
    marginBottom: 20,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7F8C8D",
    marginBottom: 12,
    paddingHorizontal: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F9FA",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: "#2C3E50",
    fontWeight: "500",
  },
  menuFooter: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#E74C3C",
  },
});