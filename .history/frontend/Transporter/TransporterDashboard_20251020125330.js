import React, { useState, useRef } from "react";
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

  // Stats data - Your original style
  const stats = {
    passengers: { total: 600, picked: 396 },
    drivers: { total: 21, active: 18 },
    delay: { vansLate: 3 },
  };

  // Quick Actions with beautiful design
  const quickActions = [
    { 
      id: "1", 
      label: "Ride Planner", 
      icon: "calendar-outline", 
      nav: "CreatePoll", 
      color: "#8E44AD",
      gradient: ["#9B59B6", "#8E44AD"]
    },
    { 
      id: "2", 
      label: "Responses", 
      icon: "chatbubble-ellipses-outline", 
      nav: "ViewResponse", 
      color: "#3498DB",
      gradient: ["#3498DB", "#2980B9"]
    },
    { 
      id: "3", 
      label: "Assign Route", 
      icon: "map-outline", 
      nav: "AssignRoute", 
      color: "#27AE60",
      gradient: ["#27AE60", "#229954"]
    },
    { 
      id: "4", 
      label: "Live Tracking", 
      icon: "location-outline", 
      nav: "VanTracking", 
      color: "#E74C3C",
      gradient: ["#E74C3C", "#C0392B"]
    },
    { 
      id: "5", 
      label: "Schedule", 
      icon: "time-outline", 
      nav: "SmartScheduling", 
      color: "#F39C12",
      gradient: ["#F39C12", "#E67E22"]
    },
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
            
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotification}>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Centered Welcome Message */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.managerName}>{managerProfile.name} 👋</Text>
            <Text style={styles.headerDate}>{getTodayDate()}</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats Overview - Your Original Style Enhanced */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Overview</Text>
            <View style={styles.statsRow}>
              {[
                {
                  label: "Passengers Picked",
                  value: `${stats.passengers.picked} / ${stats.passengers.total}`,
                  icon: "people-outline",
                  color: "#afd826"
                },
                {
                  label: "Active Drivers",
                  value: `${stats.drivers.active} / ${stats.drivers.total}`,
                  icon: "person-circle-outline",
                  color: "#3498DB"
                },
                {
                  label: "Delay",
                  value: `${stats.delay.vansLate} vans late`,
                  icon: "time-outline",
                  color: "#E74C3C"
                },
              ].map((stat, idx) => (
                <View key={idx} style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                    <Ionicons
                      name={stat.icon}
                      size={28}
                      color={stat.color}
                      style={styles.statIcon}
                    />
                  </View>
                  <View style={styles.statTextContainer}>
                    <Text style={styles.statNumber}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Beautiful Quick Actions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate(action.nav)}
                >
                  <View style={[styles.actionIconContainer, { 
                    backgroundColor: action.color,
                    shadowColor: action.color,
                  }]}>
                    <Ionicons name={action.icon} size={26} color="#fff" />
                  </View>
                  <Text style={styles.actionText}>{action.label}</Text>
                </TouchableOpacity>
              ))}
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
                  { icon: "card-outline", label: "Payments", nav: "Payments" },
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
    paddingBottom: 30,
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
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
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
  
  // Centered Welcome Section
  welcomeSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    marginBottom: 4,
  },
  managerName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  headerDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },

  scrollContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
  },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 20,
  },

  // Stats - Your Original Style Enhanced
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statTextContainer: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 6,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 13,
    color: "#7F8C8D",
    fontWeight: "500",
    textAlign: "center",
  },

  // Beautiful Quick Actions
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  actionCard: {
    width: (width - 88) / 2, // 2 items per row with proper spacing
    alignItems: "center",
    padding: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f8f9fa",
  },
  actionIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
    lineHeight: 18,
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