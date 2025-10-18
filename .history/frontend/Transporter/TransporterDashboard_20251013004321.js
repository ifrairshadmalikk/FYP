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
  const [expandedActivity, setExpandedActivity] = useState(null);

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

  const toggleActivity = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedActivity(expandedActivity === id ? null : id);
  };

  // Stats data
  const stats = {
    passengers: { total: 600, picked: 396 },
    drivers: { total: 21, active: 18 },
    delay: { vansLate: 3 },
    revenue: { amount: "24,500" },
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

  // Activities
  const activities = [
    {
      id: "1",
      text: "Daily poll sent to Blue Area Express passengers",
      tag: "Blue Area Express",
      time: "5 mins ago",
      icon: "send",
      type: "poll",
      details: "Poll includes passenger satisfaction and route preferences.",
    },
    {
      id: "2",
      text: "Route assigned to Ahmed Khan for Gulberg morning shift",
      tag: "Gulberg Connect",
      time: "12 mins ago",
      icon: "map",
      type: "assignment",
      details: "Ahmed Khan assigned as driver for morning shift.",
    },
    {
      id: "3",
      text: "15 passengers picked up from F-8 Markaz",
      tag: "University Shuttle",
      time: "18 mins ago",
      icon: "people",
      type: "pickup",
      details: "All passengers safely reached the destination.",
    },
    {
      id: "4",
      text: "Payment received: Rs. 2,400 from morning shift",
      tag: "Blue Area Express",
      time: "25 mins ago",
      icon: "cash",
      type: "payment",
      details: "Payment confirmed for all morning shift passengers.",
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
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  };

  const getActivityIconColor = (type) => {
    const colors = {
      poll: "#8E44AD",
      assignment: "#3498DB",
      pickup: "#27AE60",
      payment: "#F39C12",
      default: "#7F8C8D",
    };
    return colors[type] || colors.default;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2E86AB" barStyle="light-content" />
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
          {/* Stats Overview - Enhanced */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Performance Overview</Text>
              <Text style={styles.cardSubtitle}>Today's Summary</Text>
            </View>
            <View style={styles.statsGrid}>
              {[
                {
                  label: "Passengers",
                  value: `${stats.passengers.picked}/${stats.passengers.total}`,
                  icon: "people-outline",
                  color: "#27AE60",
                  subtitle: "Picked/Total",
                },
                {
                  label: "Active Drivers",
                  value: `${stats.drivers.active}/${stats.drivers.total}`,
                  icon: "person-circle-outline",
                  color: "#3498DB",
                  subtitle: "Active/Total",
                },
                {
                  label: "Delayed Vans",
                  value: stats.delay.vansLate,
                  icon: "time-outline",
                  color: "#E74C3C",
                  subtitle: "Need attention",
                },
                {
                  label: "Revenue",
                  value: `Rs. ${stats.revenue.amount}`,
                  icon: "cash-outline",
                  color: "#F39C12",
                  subtitle: "Today's earnings",
                },
              ].map((stat, idx) => (
                <View key={idx} style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                    <Ionicons name={stat.icon} size={24} color={stat.color} />
                  </View>
                  <Text style={styles.statNumber}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions - Enhanced */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {[
                { id: "1", label: "Ride Planner", icon: "send-outline", nav: "CreatePoll", color: "#8E44AD" },
                { id: "2", label: "Responses", icon: "reader-outline", nav: "ViewResponses", color: "#3498DB" },
                { id: "3", label: "Assign Route", icon: "map-outline", nav: "AssignRoute", color: "#27AE60" },
                { id: "4", label: "Live Tracking", icon: "location-outline", nav: "VanTracking", color: "#E74C3C" },
                { id: "5", label: "Analytics", icon: "bar-chart-outline", nav: "Analytics", color: "#F39C12" },
                { id: "6", label: "Reports", icon: "document-text-outline", nav: "Reports", color: "#2C3E50" },
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

          {/* Route Management (Renamed from Network Status) */}
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

          {/* Recent Activities */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Activities</Text>
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                onPress={() => toggleActivity(activity.id)}
                activeOpacity={0.8}
              >
                <View style={styles.activityCard}>
                  <View style={styles.activityHeader}>
                    <View style={styles.activityIconContainer}>
                      <Ionicons 
                        name={activity.icon} 
                        size={18} 
                        color={getActivityIconColor(activity.type)} 
                      />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityText}>{activity.text}</Text>
                      <View style={styles.activityMeta}>
                        <View style={[styles.activityTag, { backgroundColor: `${getActivityIconColor(activity.type)}15` }]}>
                          <Text style={[styles.activityTagText, { color: getActivityIconColor(activity.type) }]}>
                            {activity.tag}
                          </Text>
                        </View>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                    </View>
                  </View>
                  
                  {expandedActivity === activity.id && (
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityDetailText}>{activity.details}</Text>
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
                  { icon: "analytics-outline", label: "Route Analytics", nav: "RouteAnalytics" },
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

              <View style={styles.menuSection}>
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
  safeArea: { flex: 1, backgroundColor: "#2E86AB" },
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  // Enhanced Header
  headerBar: {
    backgroundColor: "#2E86AB",
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
    borderLeftWidth: 4,
    borderLeftColor: "#2E86AB",
  },
  cardHeader: {
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

  // Enhanced Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 72) / 2,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECF0F1",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495E",
    marginBottom: 2,
    textAlign: "center",
  },
  statSubtitle: {
    fontSize: 12,
    color: "#7F8C8D",
    textAlign: "center",
  },

  // Enhanced Actions Grid
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
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
  },
  routeArea: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  routeStatus: {
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
    color: "#2E86AB",
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
    backgroundColor: "#2E86AB",
  },

  // Enhanced Activity Cards
  activityCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3498DB",
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ECF0F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C3E50",
    lineHeight: 20,
  },
  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  activityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  activityTagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  activityTime: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  activityDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
  },
  activityDetailText: {
    fontSize: 13,
    color: "#7F8C8D",
    lineHeight: 18,
  },

  // Enhanced Sidebar with Profile
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
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 12,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "center",
  },
  profileStat: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
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
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#E74C3C",
  },
});