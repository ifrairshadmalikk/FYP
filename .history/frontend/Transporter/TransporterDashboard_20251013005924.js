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

  // Transporter Profile Data
  const transporterProfile = {
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
            <Text style={styles.headerSubtitle}>Welcome back, {transporterProfile.name}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Alerts")} style={styles.headerButton}>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats Overview - Enhanced Style */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Performance Overview</Text>
              <Text style={styles.cardSubtitle}>Today's Operations Summary</Text>
            </View>
            <View style={styles.statsRow}>
              {[
                {
                  label: "Passengers Picked",
                  value: `${stats.passengers.picked} / ${stats.passengers.total}`,
                  icon: "people-outline",
                  trend: "+12%",
                },
                {
                  label: "Active Drivers",
                  value: `${stats.drivers.active} / ${stats.drivers.total}`,
                  icon: "person-circle-outline",
                  trend: "+2",
                },
                {
                  label: "Delayed Vans",
                  value: `${stats.delay.vansLate} vans`,
                  icon: "time-outline",
                  trend: "-1",
                  isWarning: true,
                },
              ].map((stat, idx) => (
                <View key={idx} style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons
                      name={stat.icon}
                      size={24}
                      color="#afd826"
                    />
                    <Text style={[styles.trendText, stat.isWarning && styles.trendWarning]}>
                      {stat.trend}
                    </Text>
                  </View>
                  <View style={styles.statTextContainer}>
                    <Text style={styles.statNumber}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Enhanced Quick Actions - 3x2 Grid with Different Colors */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Quick Actions</Text>
              <Text style={styles.cardSubtitle}>Manage your operations</Text>
            </View>
            <View style={styles.actionsGrid}>
              {[
                { 
                  id: "1", 
                  label: "Ride Planner", 
                  icon: "send-outline", 
                  nav: "CreatePoll", 
                  color: "#8E44AD",
                  bgColor: "#F4ECF7"
                },
                { 
                  id: "2", 
                  label: "View Responses", 
                  icon: "reader-outline", 
                  nav: "ViewResponses", 
                  color: "#3498DB",
                  bgColor: "#EBF5FB"
                },
                { 
                  id: "3", 
                  label: "Assign Route", 
                  icon: "map-outline", 
                  nav: "AssignRoute", 
                  color: "#27AE60",
                  bgColor: "#EAFAF1"
                },
                { 
                  id: "4", 
                  label: "Live Tracking", 
                  icon: "location-outline", 
                  nav: "VanTracking", 
                  color: "#E74C3C",
                  bgColor: "#FDEDEC"
                },
                { 
                  id: "5", 
                  label: "Analytics", 
                  icon: "bar-chart-outline", 
                  nav: "Analytics", 
                  color: "#F39C12",
                  bgColor: "#FEF9E7"
                },
                { 
                  id: "6", 
                  label: "Reports", 
                  icon: "document-text-outline", 
                  nav: "Reports", 
                  color: "#2C3E50",
                  bgColor: "#F4F6F6"
                },
              ].map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.actionCard, { backgroundColor: action.bgColor }]}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate(action.nav)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.bgColor }]}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                  </View>
                  <Text style={styles.actionText}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Enhanced Route Management */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Route Management</Text>
                <Text style={styles.cardSubtitle}>Active routes & performance metrics</Text>
              </View>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#afd826" />
              </TouchableOpacity>
            </View>
            {routes.map((route) => (
              <TouchableOpacity
                key={route.id}
                onPress={() => toggleRoute(route.id)}
                activeOpacity={0.9}
              >
                <View style={[
                  styles.routeCard,
                  route.status === "maintenance" && styles.maintenanceCard,
                  expandedRoute === route.id && styles.expandedRouteCard
                ]}>
                  <View style={styles.routeHeader}>
                    <View style={styles.routeInfo}>
                      <View style={styles.routeTitleContainer}>
                        <Text style={styles.routeName}>{route.name}</Text>
                        <View style={[
                          styles.statusIndicator,
                          route.status === "active" ? styles.activeIndicator : styles.maintenanceIndicator
                        ]} />
                      </View>
                      <Text style={styles.routeArea}>{route.area}</Text>
                    </View>
                    <View style={styles.routeMetrics}>
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
                        <View style={styles.detailRow}>
                          <View style={styles.detailItem}>
                            <Ionicons name="bus-outline" size={18} color="#afd826" />
                            <Text style={styles.detailText}>Active Vans: <Text style={styles.detailValue}>{route.vans}</Text></Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Ionicons name="people-outline" size={18} color="#afd826" />
                            <Text style={styles.detailText}>Passengers: <Text style={styles.detailValue}>{route.passengers}</Text></Text>
                          </View>
                        </View>
                        <View style={styles.detailRow}>
                          <View style={styles.detailItem}>
                            <Ionicons name="speedometer-outline" size={18} color="#afd826" />
                            <Text style={styles.detailText}>Efficiency: <Text style={styles.detailValue}>{route.efficiency}</Text></Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Ionicons name="stats-chart-outline" size={18} color="#afd826" />
                            <Text style={styles.detailText}>Utilization: <Text style={styles.detailValue}>{Math.round(route.utilization * 100)}%</Text></Text>
                          </View>
                        </View>
                      </View>
                      
                      <Text style={styles.routeDescription}>{route.details}</Text>
                      
                      <View style={styles.utilizationContainer}>
                        <View style={styles.utilizationHeader}>
                          <Text style={styles.utilizationLabel}>Route Utilization Progress</Text>
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

                      <View style={styles.routeActions}>
                        <TouchableOpacity style={styles.routeActionButton}>
                          <Ionicons name="eye-outline" size={16} color="#3498DB" />
                          <Text style={[styles.routeActionText, { color: "#3498DB" }]}>View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.routeActionButton}>
                          <Ionicons name="create-outline" size={16} color="#27AE60" />
                          <Text style={[styles.routeActionText, { color: "#27AE60" }]}>Edit Route</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Enhanced Sidebar with Transporter Profile */}
        <Modal transparent visible={menuVisible} animationType="none">
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={closeMenu}
          >
            <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
              {/* Transporter Profile Section */}
              <View style={styles.profileSection}>
                <Image
                  source={{ uri: transporterProfile.avatar }}
                  style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{transporterProfile.name}</Text>
                  <Text style={styles.profileRole}>{transporterProfile.role}</Text>
                  
                  <View style={styles.profileStats}>
                    <View style={styles.profileStat}>
                      <Ionicons name="star" size={16} color="#F39C12" />
                      <Text style={styles.profileStatText}>{transporterProfile.rating}</Text>
                      <Text style={styles.profileStatLabel}>Rating</Text>
                    </View>
                    <View style={styles.profileStat}>
                      <Ionicons name="business" size={16} color="#3498DB" />
                      <Text style={styles.profileStatText}>{transporterProfile.totalRoutes}</Text>
                      <Text style={styles.profileStatLabel}>Routes</Text>
                    </View>
                    <View style={styles.profileStat}>
                      <Ionicons name="checkmark-done" size={16} color="#27AE60" />
                      <Text style={styles.profileStatText}>{transporterProfile.completedTrips}</Text>
                      <Text style={styles.profileStatLabel}>Trips</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Operations</Text>
                {[
                  { icon: "person-add-outline", label: "Add Driver", nav: "AddDriver", color: "#3498DB" },
                  { icon: "person-circle-outline", label: "Add Passenger", nav: "AddPassenger", color: "#27AE60" },
                  { icon: "people-outline", label: "Drivers List", nav: "DriverList", color: "#8E44AD" },
                  { icon: "person-outline", label: "Passengers List", nav: "PassengerList", color: "#F39C12" },
                ].map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.menuItem}
                    onPress={() => {
                      closeMenu();
                      navigation.navigate(item.nav);
                    }}
                  >
                    <Ionicons name={item.icon} size={22} color={item.color} />
                    <Text style={styles.menuText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Analytics & Reports</Text>
                {[
                  { icon: "bar-chart-outline", label: "Driver Performance", nav: "DriverPerformance", color: "#2C3E50" },
                  { icon: "analytics-outline", label: "Route Analytics", nav: "RouteAnalytics", color: "#8E44AD" },
                  { icon: "rocket-outline", label: "Smart Scheduling", nav: "SmartScheduling", color: "#E74C3C" },
                  { icon: "card-outline", label: "Payments", nav: "Payments", color: "#27AE60" },
                ].map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.menuItem}
                    onPress={() => {
                      closeMenu();
                      navigation.navigate(item.nav);
                    }}
                  >
                    <Ionicons name={item.icon} size={22} color={item.color} />
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
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  // Enhanced Header
  headerBar: {
    backgroundColor: "#afd826",
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginTop: 2,
    fontWeight: "500",
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

  // Enhanced Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: "#afd826",
    fontWeight: "600",
    marginRight: 4,
  },

  // Enhanced Stats
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
    alignItems: "center",
    marginBottom: 8,
  },
  trendText: {
    fontSize: 11,
    color: "#27AE60",
    fontWeight: "700",
    marginTop: 2,
  },
  trendWarning: {
    color: "#E74C3C",
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
  statLabel: {
    fontSize: 13,
    color: "#7F8C8D",
    fontWeight: "600",
    textAlign: "center",
  },

  // Enhanced Quick Actions - 3x2 Grid
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 72) / 3,
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
  },

  // Enhanced Route Cards
  routeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECF0F1",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  expandedRouteCard: {
    borderColor: "#afd826",
    borderWidth: 1.5,
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
  routeTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
    marginRight: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: "#27AE60",
  },
  maintenanceIndicator: {
    backgroundColor: "#F39C12",
  },
  routeArea: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  routeMetrics: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  activeBadge: {
    backgroundColor: "#E8F6F3",
  },
  inactiveBadge: {
    backgroundColor: "#FDEDEC",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C3E50",
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
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: "#7F8C8D",
    marginLeft: 8,
    fontWeight: "500",
  },
  detailValue: {
    color: "#2C3E50",
    fontWeight: "700",
  },
  routeDescription: {
    fontSize: 13,
    color: "#7F8C8D",
    lineHeight: 18,
    marginBottom: 16,
    fontStyle: "italic",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  utilizationContainer: {
    marginBottom: 16,
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
  routeActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  routeActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
  },
  routeActionText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },

  // Enhanced Sidebar with Transporter Profile
  menuOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: "#fff",
    paddingVertical: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "#afd826",
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
    textAlign: "center",
  },
  profileRole: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 16,
    textAlign: "center",
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  profileStat: {
    alignItems: "center",
    flex: 1,
  },
  profileStatText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
    marginTop: 4,
  },
  profileStatLabel: {
    fontSize: 11,
    color: "#7F8C8D",
    marginTop: 2,
    textAlign: "center",
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