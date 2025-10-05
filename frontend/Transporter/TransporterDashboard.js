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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

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

  // Expand/Collapse state for Network and Activity
  const [expandedNetwork, setExpandedNetwork] = useState(null);
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

  const toggleNetwork = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedNetwork(expandedNetwork === id ? null : id);
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
  };

  // Networks
  const networks = [
    {
      id: "1",
      name: "Blue Area Express",
      area: "Blue Area - DHA",
      vans: "8/10",
      passengers: 156,
      status: "active",
      utilization: 0.8,
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
      details: "Poll includes passenger satisfaction and route preferences.",
    },
    {
      id: "2",
      text: "Route assigned to Ahmed Khan for Gulberg morning shift",
      tag: "Gulberg Connect",
      time: "12 mins ago",
      icon: "map",
      details: "Ahmed Khan assigned as driver for morning shift.",
    },
    {
      id: "3",
      text: "15 passengers picked up from F-8 Markaz",
      tag: "University Shuttle",
      time: "18 mins ago",
      icon: "people",
      details: "All passengers safely reached the destination.",
    },
    {
      id: "4",
      text: "Payment received: Rs. 2,400 from morning shift",
      tag: "Blue Area Express",
      time: "25 mins ago",
      icon: "cash",
      details: "Payment confirmed for all morning shift passengers.",
    },
  ];

  // Utilization animation
  const animatedWidths = networks.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    networks.forEach((net, i) => {
      Animated.timing(animatedWidths[i], {
        toValue: net.utilization * 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={openMenu}>
            <Ionicons name="menu" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitleCentered}>Transporter Dashboard</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Alerts")}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats Overview - Exactly as before */}
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

          {/* Quick Actions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.actionsRow}>
              {[
                { id: "1", label: "Ride Planner", icon: "send-outline", nav: "CreatePoll" },
                { id: "2", label: "Responses", icon: "reader-outline", nav: "ViewResponses" },
                { id: "3", label: "Assign Passenger", icon: "map-outline", nav: "AssignRoute" },
                { id: "4", label: "Van Tracking", icon: "location-outline", nav: "VanTracking" },
              ].map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionBtn}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate(action.nav)}
                >
                  <Ionicons name={action.icon} size={22} color="#333" />
                  <Text style={styles.actionText}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Network Status - Exactly as before */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Network Status</Text>
            {networks.map((net) => (
              <TouchableOpacity
                key={net.id}
                onPress={() => toggleNetwork(net.id)}
                activeOpacity={0.8}
              >
                <View style={styles.networkCard}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.networkName}>{net.name}</Text>
                    <Text
                      style={
                        net.status === "active"
                          ? styles.activeBadge
                          : styles.inactiveBadge
                      }
                    >
                      {net.status}
                    </Text>
                  </View>
                  {expandedNetwork === net.id && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={styles.networkDetail}>{net.area}</Text>
                      <Text style={styles.networkDetail}>
                        Active Vans: {net.vans}
                      </Text>
                      <Text style={styles.networkDetail}>
                        Passengers: {net.passengers}
                      </Text>
                      <Text style={styles.networkDetail}>{net.details}</Text>
                      <View style={styles.utilizationBar}>
                        <Animated.View
                          style={[
                            styles.utilizationFill,
                            {
                              width: animatedWidths[networks.indexOf(net)].interpolate(
                                {
                                  inputRange: [0, 100],
                                  outputRange: ["0%", "100%"],
                                }
                              ),
                            },
                          ]}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

        {/* Sidebar */}
        <Modal transparent visible={menuVisible} animationType="none">
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={closeMenu}
          >
            <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
              <Text style={styles.sidebarTitle}>Menu</Text>
              {[
                { icon: "person-add-outline", label: "Add Driver", nav: "AddDriver" },
                { icon: "person-circle-outline", label: "Add Passenger", nav: "AddPassenger" },
                { icon: "people-outline", label: "Drivers List", nav: "DriverList" },
                { icon: "person-outline", label: "Passengers List", nav: "PassengerList" },
                { icon: "bar-chart-outline", label: "Driver Performance", nav: "DriverPerformance" },
                { icon: "analytics-outline", label: "Passenger Performance", nav: "PassengerPerformance" },
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
                  <Ionicons name={item.icon} size={22} color="#333" />
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
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

  headerBar: {
    backgroundColor: "#afd826",
    paddingVertical: 14,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },
  headerTitleCentered: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },

  scrollContent: { padding: 15 },

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
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },

  // Stats - Icons on top
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

  // Quick Actions
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginBottom: 12,
    width: "48%",
  },
  actionText: {
    fontSize: 14,
    marginLeft: 10,
    color: "#333",
    fontWeight: "500",
  },

  // Menu Items
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: { fontSize: 15, marginLeft: 12, color: "#333" },

  // Sidebar
  menuOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.72,
    backgroundColor: "#fff",
    padding: 20,
    elevation: 6,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },

  // Network Cards
  networkCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  networkName: { fontSize: 15, fontWeight: "bold", color: "#000" },
  networkDetail: { fontSize: 13, color: "#555", marginTop: 2 },
  activeBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#e6f9ed",
    color: "#0a0",
  },
  inactiveBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#ffecec",
    color: "#a00",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  utilizationBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    marginTop: 8,
    overflow: "hidden",
  },
  utilizationFill: { height: 8, borderRadius: 4, backgroundColor: "#afd826" },

  // Activities
  activityCard: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  activityTime: { fontSize: 12, color: "#888" },
  activityText: { marginTop: 6, fontSize: 13, color: "#000" },
  activityDetail: { marginTop: 4, fontSize: 12, color: "#555" },
  activityTag: { marginTop: 2, fontSize: 12, fontWeight: "bold", color: "#333" },
});