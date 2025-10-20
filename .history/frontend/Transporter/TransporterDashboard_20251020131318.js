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

  // Quick Actions with proper navigation - Fixed 5 items
  const quickActions = [
    { id: "1", label: "Ride Planner", icon: "calendar-outline", nav: "CreatePoll", color: "#8E44AD" },
    { id: "2", label: "Responses", icon: "chatbubble-ellipses-outline", nav: "ViewResponse", color: "#3498DB" },
    { id: "3", label: "Assign Route", icon: "map-outline", nav: "AssignRoute", color: "#27AE60" },
    { id: "4", label: "Live Tracking", icon: "location-outline", nav: "VanTracking", color: "#E74C3C" },
    { id: "5", label: "Smart Scheduling", icon: "time-outline", nav: "SmartScheduling", color: "#F39C12" },
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
    // Navigate directly to Alerts screen instead of showing alert
    navigation.navigate("Alerts");
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
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Transport Dashboard</Text>
              <Text style={styles.headerDate}>{getTodayDate()}</Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationButton} 
              onPress={handleNotification}
            >
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
          {/* Stats Overview - Driver in the middle */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Overview</Text>
            <View style={styles.statsRow}>
              {/* Passengers - Left */}
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: "#afd82620" }]}>
                  <Ionicons
                    name="people-outline"
                    size={28}
                    color="#afd826"
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statNumber}>{`${stats.passengers.picked} / ${stats.passengers.total}`}</Text>
                  <Text style={styles.statLabel}>Passengers Picked</Text>
                </View>
              </View>

              {/* Drivers - Center (Highlighted) */}
              <View style={[styles.statItem, styles.centralStatItem]}>
                <View style={[styles.statIconContainer, { backgroundColor: "#3498DB20" }]}>
                  <Ionicons
                    name="person-circle-outline"
                    size={32}
                    color="#3498DB"
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={[styles.statNumber, styles.centralStatNumber]}>{`${stats.drivers.active} / ${stats.drivers.total}`}</Text>
                  <Text style={[styles.statLabel, styles.centralStatLabel]}>Active Drivers</Text>
                </View>
              </View>

              {/* Delay - Right */}
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: "#E74C3C20" }]}>
                  <Ionicons
                    name="time-outline"
                    size={28}
                    color="#E74C3C"
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statNumber}>{`${stats.delay.vansLate} vans late`}</Text>
                  <Text style={styles.statLabel}>Delay</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions - Perfect 3+2 Grid */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.actionsContainer}>
              {/* First Row - 3 Items */}
              <View style={styles.actionsRow}>
                {quickActions.slice(0, 3).map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.actionCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate(action.nav)}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                      <Ionicons name={action.icon} size={26} color={action.color} />
                    </View>
                    <Text style={styles.actionText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Second Row - 2 Items (Centered) */}
              <View style={styles.actionsRow}>
                {quickActions.slice(3, 5).map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.actionCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate(action.nav)}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                      <Ionicons name={action.icon} size={26} color={action.color} />
                    </View>
                    <Text style={styles.actionText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
                {/* Empty space to maintain grid alignment */}
                <View style={styles.emptyActionCard} />
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
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  // Enhanced Header
  header: {
    backgroundColor: "#afd826",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
    marginBottom: 10,
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
    marginTop: 5,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  managerName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginTop: 2,
  },

  scrollContent: {
    flex: 1,
    padding: 16,
    paddingBottom: 20,
  },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 20,
  },

  // Stats - Driver centered in the middle
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  centralStatItem: {
    // Emphasize the driver stat in the center
    transform: [{ scale: 1.05 }],
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statTextContainer: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
    textAlign: "center",
  },
  centralStatNumber: {
    fontSize: 18,
    color: "#3498DB",
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 13,
    color: "#7F8C8D",
    fontWeight: "500",
    textAlign: "center",
  },
  centralStatLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3498DB",
  },

  // Quick Actions - Perfect 3+2 Grid
  actionsContainer: {
    // Container for both rows
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionCard: {
    width: (width - 72) / 3, // 3 items per row
    alignItems: "center",
    padding: 12,
  },
  emptyActionCard: {
    width: (width - 72) / 3, // Empty space for alignment
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
    lineHeight: 16,
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