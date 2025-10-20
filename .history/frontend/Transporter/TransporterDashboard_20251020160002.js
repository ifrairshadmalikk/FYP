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

  // Enhanced Stats data with progress
  const stats = {
    passengers: { total: 600, picked: 396, percentage: 66 },
    drivers: { total: 21, active: 18, percentage: 86 },
    delay: { vansLate: 3, onTime: 18, percentage: 86 },
  };

  // Enhanced Quick Actions with better icons and colors
  const quickActions = [
    { 
      id: "1", 
      label: "Ride Planner", 
      icon: "calendar", 
      nav: "CreatePoll", 
      color: "#8E44AD",
      description: "Plan new routes"
    },
    { 
      id: "2", 
      label: "Responses", 
      icon: "chatbubble", 
      nav: "ViewResponse", 
      color: "#3498DB",
      description: "View poll results"
    },
    { 
      id: "3", 
      label: "Assign Route", 
      icon: "map", 
      nav: "AssignRoute", 
      color: "#27AE60",
      description: "Assign drivers"
    },
    { 
      id: "4", 
      label: "Live Tracking", 
      icon: "location", 
      nav: "VanTracking", 
      color: "#E74C3C",
      description: "Real-time tracking"
    },
    { 
      id: "5", 
      label: "Smart Schedule", 
      icon: "time", 
      nav: "SmartScheduling", 
      color: "#F39C12",
      description: "Optimize schedules"
    },
  ];

  // Enhanced Manager Profile Data
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

  // Progress Bar Component
  const ProgressBar = ({ percentage, color }) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${percentage}%`,
              backgroundColor: color
            }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{percentage}%</Text>
    </View>
  );

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
              <Ionicons name="notifications" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Enhanced Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.managerName}>{managerProfile.name} 👋</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Enhanced Stats Overview with Progress Bars */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Today's Overview</Text>
              <Text style={styles.cardSubtitle}>Real-time performance metrics</Text>
            </View>
            <View style={styles.statsRow}>
              {/* Passengers - Left */}
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: "#afd82620" }]}>
                  <Ionicons name="people" size={28} color="#afd826" />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statNumber}>{stats.passengers.picked}</Text>
                  <Text style={styles.statLabel}>Picked Up</Text>
                  <Text style={styles.statSubtext}>of {stats.passengers.total} total</Text>
                  <ProgressBar percentage={stats.passengers.percentage} color="#afd826" />
                </View>
              </View>

              {/* Drivers - Center (Highlighted) */}
              <View style={[styles.statItem, styles.centralStatItem]}>
                <View style={[styles.statIconContainer, styles.centralIconContainer]}>
                  <Ionicons name="person" size={32} color="#3498DB" />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={[styles.statNumber, styles.centralStatNumber]}>{stats.drivers.active}</Text>
                  <Text style={[styles.statLabel, styles.centralStatLabel]}>Active Drivers</Text>
                  <Text style={[styles.statSubtext, styles.centralStatSubtext]}>of {stats.drivers.total} total</Text>
                  <ProgressBar percentage={stats.drivers.percentage} color="#3498DB" />
                </View>
              </View>

              {/* Delay - Right */}
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: "#E74C3C20" }]}>
                  <Ionicons name="time" size={28} color="#E74C3C" />
                </View>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statNumber}>{stats.delay.onTime}</Text>
                  <Text style={styles.statLabel}>On Time</Text>
                  <Text style={styles.statSubtext}>of {stats.delay.onTime + stats.delay.vansLate} vans</Text>
                  <ProgressBar percentage={stats.delay.percentage} color="#27AE60" />
                </View>
              </View>
            </View>
          </View>

          {/* Enhanced Quick Actions */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Quick Actions</Text>
              <Text style={styles.cardSubtitle}>Manage your operations</Text>
            </View>
            <View style={styles.actionsContainer}>
              {/* First Row - 3 Items */}
              <View style={styles.actionsRow}>
                {quickActions.slice(0, 3).map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.actionCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate(action.nav)}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                      <Ionicons name={action.icon} size={28} color={action.color} />
                    </View>
                    <Text style={styles.actionText}>{action.label}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Second Row - 2 Items (Centered) */}
              <View style={styles.actionsRow}>
                {quickActions.slice(3, 5).map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.actionCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate(action.nav)}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                      <Ionicons name={action.icon} size={28} color={action.color} />
                    </View>
                    <Text style={styles.actionText}>{action.label}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
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
              {/* Enhanced Manager Profile Section */}
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
                  { icon: "person-add", label: "Add Driver", nav: "AddDriver" },
                  { icon: "person", label: "Add Passenger", nav: "AddPassenger" },
                  { icon: "people", label: "Drivers List", nav: "DriverList" },
                  { icon: "people-circle", label: "Passengers List", nav: "PassengerList" },
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
                <Text style={styles.menuSectionTitle}>Analytics & Performance</Text>
                {[
                  { icon: "bar-chart", label: "Driver Performance", nav: "DriverPerformance" },
                  { icon: "analytics", label: "Passenger Performance", nav: "PassengerPerformance" },
                  { icon: "card", label: "Payments", nav: "Payments" },
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
                  <Ionicons name="log-out" size={22} color="#E74C3C" />
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
    paddingVertical: 20,
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
    marginBottom: 15,
  },
  menuButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
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
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
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
    alignItems: "flex-start",
  },
  welcomeTextContainer: {
    flex: 1,
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
    padding: 16,
    paddingBottom: 20,
  },

  // Enhanced Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },

  // Enhanced Stats - Better Alignment
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  centralStatItem: {
    transform: [{ scale: 1.05 }],
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  centralIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#3498DB20",
    borderWidth: 2,
    borderColor: "#3498DB40",
  },
  statTextContainer: {
    alignItems: "center",
    width: "100%",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 4,
    textAlign: "center",
  },
  centralStatNumber: {
    fontSize: 22,
    color: "#3498DB",
  },
  statLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  centralStatLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3498DB",
  },
  statSubtext: {
    fontSize: 11,
    color: "#95A5A6",
    textAlign: "center",
    marginBottom: 8,
  },
  centralStatSubtext: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Progress Bar
  progressBarContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: "#ECF0F1",
    borderRadius: 3,
    marginRight: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#7F8C8D",
    minWidth: 30,
  },

  // Enhanced Quick Actions
  actionsContainer: {
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionCard: {
    width: (width - 96) / 3,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  emptyActionCard: {
    width: (width - 96) / 3,
  },
  actionIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 11,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 14,
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
    width: width * 0.82,
    backgroundColor: "#fff",
    paddingVertical: 25,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
  },
  profileSection: {
    paddingHorizontal: 25,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
    marginBottom: 20,
  },
  profileTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 10,
  },
  profileStats: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  profileStat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  profileStatText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2C3E50",
    marginLeft: 4,
  },
  menuSection: {
    marginBottom: 25,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7F8C8D",
    marginBottom: 15,
    paddingHorizontal: 25,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F9FA",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 18,
    color: "#2C3E50",
    fontWeight: "600",
  },
  menuFooter: {
    marginTop: 'auto',
    paddingTop: 25,
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#E74C3C",
  },
});