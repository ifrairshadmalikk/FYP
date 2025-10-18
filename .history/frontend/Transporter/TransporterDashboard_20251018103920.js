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
  LayoutAnimation,
  UIManager,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TransporterDashboard() {
  const navigation = useNavigation();

  // Sidebar state
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  // Expand/Collapse state
  const [expandedRoute, setExpandedRoute] = useState(null);

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

  const toggleRoute = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedRoute(expandedRoute === id ? null : id);
  };

  // Stats data
  const stats = {
    passengers: { total: 600, picked: 396 },
    drivers: { total: 21, active: 18 },
    delay: { vansLate: 3 },
  };

  // Routes (renamed from networks)
  const routes = [
    {
      id: "1",
      name: "Blue Area Express",
      area: "Blue Area - DHA",
      vans: "8/10",
      passengers: 156,
      status: "active",
      utilization: 0.8,
      efficiency: "92%",
      details: "Route: Blue Area to DHA. Morning and evening shifts available.",
    },
    {
      id: "2",
      name: "Gulberg Connect",
      area: "Gulberg - Model Town",
      vans: "6/8",
      passengers: 98,
      status: "active",
      utilization: 0.75,
      efficiency: "88%",
      details: "Route: Gulberg to Model Town. Evening shift only.",
    },
    {
      id: "3",
      name: "University Shuttle",
      area: "LUMS - LCP - FAST",
      vans: "4/6",
      passengers: 124,
      status: "active",
      utilization: 0.67,
      efficiency: "85%",
      details: "University shuttle service for students with multiple stops.",
    },
    {
      id: "4",
      name: "Defence Route",
      area: "DHA - Cantt",
      vans: "4/7",
      passengers: 67,
      status: "maintenance",
      utilization: 0.6,
      efficiency: "78%",
      details: "Route under maintenance. Only limited service.",
    },
  ];

  // Utilization animation
  const animatedWidths = routes.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    routes.forEach((route, i) => {
      Animated.timing(animatedWidths[i], {
        toValue: route.utilization * 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  // Driver Profile Data
  const driverProfile = {
    name: "Ali Ahmed",
    role: "Transport Manager",
    phone: "+92 300 1234567",
    experience: "5 years",
    rating: 4.8,
    totalRoutes: 12,
    completedTrips: 2450,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />
      <View style={styles.container}>
        {/* Enhanced Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={openMenu} style={styles.headerButton}>
            <Ionicons name="menu" size={26} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Transport Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome back, {driverProfile.name}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Alerts")} style={styles.headerButton}>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats Overview - Original Style */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Overview</Text>
            <View style={styles.statsRow}>
              {[
                {
                  label: "Passengers Picked",
                  value: `${stats.passengers.picked} / ${stats.passengers.total}`,
                  icon: "people-outline",
                },
                {
                  label: "Active Drivers",
                  value: `${stats.drivers.active} / ${stats.drivers.total}`,
                  icon: "person-circle-outline",
                },
                {
                  label: "Delay",
                  value: `${stats.delay.vansLate} vans late`,
                  icon: "time-outline",
                },
              ].map((stat, idx) => (
                <View key={idx} style={styles.statItem}>
                  <Ionicons
                    name={stat.icon}
                    size={28}
                    color="#afd826"
                    style={styles.statIcon}
                  />
                  <View style={styles.statTextContainer}>
                    <Text style={styles.statNumber}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions - 3x2 Grid with Colorful Icons */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {[
                { id: "1", label: "Ride Planner", icon: "send-outline", nav: "CreatePoll", color: "#8E44AD" },
                { id: "2", label: "Responses", icon: "reader-outline", nav: "ViewResponses", color: "#3498DB" },
                { id: "3", label: "Assign Route", icon: "map-outline", nav: "AssignRoute", color: "#27AE60" },
                { id: "4", label: "Live Tracking", icon: "location-outline", nav: "VanTracking", color: "#E74C3C" },
                { id: "5", label: "Smart Scheduling", icon: "rocket-outline", nav: "SmartScheduling", color: "#F39C12" },
                { id: "6", label: "Reports", icon: "document-text-outline", nav: "Reports", color: "#2C3E50" },
                { icon: "rocket-outline", label: "Smart Scheduling", nav: "SmartScheduling" },
              ].map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate(action.nav)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                    <Ionicons name={action.icon} size={22} color={action.color} />
                  </View>
                  <Text style={styles.actionText}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Route Management */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Route Management</Text>
              <Text style={styles.cardSubtitle}>Active routes & performance</Text>
            </View>
            {routes.map((route) => (
              <TouchableOpacity
                key={route.id}
                onPress={() => toggleRoute(route.id)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.routeCard,
                  route.status === "maintenance" && styles.maintenanceCard
                ]}>
                  <View style={styles.routeHeader}>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeName}>{route.name}</Text>
                      <Text style={styles.routeArea}>{route.area}</Text>
                    </View>
                    <View style={styles.routeStatus}>
                      <View style={[
                        styles.statusBadge,
                        route.status === "active" ? styles.activeBadge : styles.inactiveBadge
                      ]}>
                        <Text style={styles.statusText}>
                          {route.status === "active" ? "Active" : "Maintenance"}
                        </Text>
                      </View>
                      <Text style={styles.efficiencyText}>{route.efficiency}</Text>
                    </View>
                  </View>

                  {expandedRoute === route.id && (
                    <View style={styles.expandedContent}>
                      <View style={styles.routeDetails}>
                        <View style={styles.detailItem}>
                          <Ionicons name="bus-outline" size={16} color="#7F8C8D" />
                          <Text style={styles.detailText}>Active Vans: {route.vans}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Ionicons name="people-outline" size={16} color="#7F8C8D" />
                          <Text style={styles.detailText}>Passengers: {route.passengers}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Ionicons name="speedometer-outline" size={16} color="#7F8C8D" />
                          <Text style={styles.detailText}>Efficiency: {route.efficiency}</Text>
                        </View>
                      </View>

                      <Text style={styles.routeDescription}>{route.details}</Text>

                      <View style={styles.utilizationContainer}>
                        <View style={styles.utilizationHeader}>
                          <Text style={styles.utilizationLabel}>Route Utilization</Text>
                          <Text style={styles.utilizationPercent}>
                            {Math.round(route.utilization * 100)}%
                          </Text>
                        </View>
                        <View style={styles.utilizationBar}>
                          <Animated.View
                            style={[
                              styles.utilizationFill,
                              {
                                width: animatedWidths[routes.indexOf(route)].interpolate({
                                  inputRange: [0, 100],
                                  outputRange: ["0%", "100%"],
                                }),
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Enhanced Sidebar with Driver Profile */}
        <Modal transparent visible={menuVisible} animationType="none">
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={closeMenu}
          >
            <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
              {/* Driver Profile Section */}
              <View style={styles.profileSection}>
                <TouchableOpacity
                  onPress={() => {
                    closeMenu();
                    navigation.navigate("ProfileScreen");
                  }}
                  style={styles.profileTouchable}
                >
                  <Image
                    source={{ uri: driverProfile.avatar }}
                    style={styles.profileImage}
                  />
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{driverProfile.name}</Text>
                    <Text style={styles.profileRole}>{driverProfile.role}</Text>
                    <View style={styles.profileStats}>
                      <View style={styles.profileStat}>
                        <Ionicons name="star" size={14} color="#F39C12" />
                        <Text style={styles.profileStatText}>{driverProfile.rating}</Text>
                      </View>
                      <View style={styles.profileStat}>
                        <Ionicons name="time" size={14} color="#3498DB" />
                        <Text style={styles.profileStatText}>{driverProfile.experience}</Text>
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
                  { icon: "bar-chart-outline", label: "Passenger Performance", nav: "PassengerPerformance" },
                  { icon: "rocket-outline", label: "Smart Scheduling", nav: "SmartScheduling" },
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
                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
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
  headerBar: {
    backgroundColor: "#afd826",
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
  },
  headerButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: width * 0.035,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 2,
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

  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#a4ff50ff",
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },

  // Stats - Original Style
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  statIcon: {
    marginBottom: 8,
  },
  statTextContainer: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 2,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 13,
    color: "#6c757d",
    fontWeight: "500",
    textAlign: "center",
  },

  // Quick Actions - 3x2 Grid
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 72) / 3,
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
  },

  // Route Cards
  routeCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  maintenanceCard: {
    backgroundColor: "#FEF9E7",
    borderLeftWidth: 4,
    borderLeftColor: "#F39C12",
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  routeArea: {
    fontSize: 14,
    color: "#6c757d",
  },
  routeStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  activeBadge: {
    backgroundColor: "#e6f9ed",
  },
  inactiveBadge: {
    backgroundColor: "#ffecec",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  efficiencyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#27AE60",
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
  },
  routeDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#34495E",
    marginLeft: 8,
    fontWeight: "500",
  },
  routeDescription: {
    fontSize: 13,
    color: "#7F8C8D",
    lineHeight: 18,
    marginBottom: 16,
    fontStyle: "italic",
  },
  utilizationContainer: {
    marginTop: 8,
  },
  utilizationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  utilizationLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
  },
  utilizationPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#afd826",
  },
  utilizationBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ECF0F1",
    overflow: "hidden",
  },
  utilizationFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#afd826",
  },

  // Enhanced Sidebar with Profile
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.72,
    backgroundColor: "#fff",
    paddingVertical: 20,
    elevation: 6,
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