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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function TransporterDashboard() {
  const navigation = useNavigation();

  // Sidebar state
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

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

  // Stats data
  const stats = {
    revenue: "Rs. 66,750",
    passengers: 445,
    drivers: 21,
    responseRate: "87%",
  };

  // Only these two in Quick Actions
  

  // Networks
  const networks = [
    { id: "1", name: "Blue Area Express", area: "Blue Area - DHA", vans: "8/10", passengers: 156, revenue: "Rs. 23,400", status: "active", utilization: 0.8 },
    { id: "2", name: "Gulberg Connect", area: "Gulberg - Model Town", vans: "6/8", passengers: 98, revenue: "Rs. 14,700", status: "active", utilization: 0.75 },
    { id: "3", name: "University Shuttle", area: "LUMS - LCP - FAST", vans: "4/6", passengers: 124, revenue: "Rs. 18,600", status: "active", utilization: 0.67 },
    { id: "4", name: "Defence Route", area: "DHA - Cantt", vans: "4/7", passengers: 67, revenue: "Rs. 10,050", status: "maintenance", utilization: 0.6 },
  ];

  // Activities
  const activities = [
    { id: "1", text: "Daily poll sent to Blue Area Express passengers", tag: "Blue Area Express", time: "5 mins ago", icon: "send" },
    { id: "2", text: "Route assigned to Ahmed Khan for Gulberg morning shift", tag: "Gulberg Connect", time: "12 mins ago", icon: "map" },
    { id: "3", text: "15 passengers picked up from F-8 Markaz", tag: "University Shuttle", time: "18 mins ago", icon: "people" },
    { id: "4", text: "Payment received: Rs. 2,400 from morning shift", tag: "Blue Area Express", time: "25 mins ago", icon: "cash" },
  ];

  // Utilization bar animation
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
          <Text style={styles.headerTitle}>Transporter Dashboard</Text>
          <TouchableOpacity onPress={openMenu}>
            <Ionicons name="menu" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Stats */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Overview</Text>
            <View style={styles.statsRow}>
              {[
                { label: "Today's Revenue", value: stats.revenue, icon: "cash-outline" },
                { label: "Total Passengers", value: stats.passengers, icon: "people-outline" },
                { label: "Active Drivers", value: stats.drivers, icon: "person-circle-outline" },
                { label: "Response Rate", value: stats.responseRate, icon: "stats-chart-outline" },
              ].map((stat, idx) => (
                <View key={idx} style={styles.statBox}>
                  <Ionicons name={stat.icon} size={26} color="#afd826" />
                  <Text style={styles.statNumber}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
         {/* Quick Actions */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>Quick Actions</Text>
  <View style={styles.actionsRow}>
    {[
      { id: "1", label: "Create Poll", icon: "send-outline", nav: "CreatePoll" },
      { id: "2", label: "Responses", icon: "reader-outline", nav: "ViewResponses" },
      { id: "3", label: "Assign Routes", icon: "map-outline", nav: "AssignRoute" },
      { id: "4", label: "Driver Dashboard", icon: "speedometer-outline", nav: "DriverDashboard" },
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


          {/* Network Status */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Network Status</Text>
            {networks.map((net, i) => (
              <View key={net.id} style={styles.networkCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.networkName}>{net.name}</Text>
                  <Text style={net.status === "active" ? styles.activeBadge : styles.inactiveBadge}>
                    {net.status}
                  </Text>
                </View>
                <Text style={styles.networkDetail}>{net.area}</Text>
                <Text style={styles.networkDetail}>Active Vans: {net.vans}</Text>
                <Text style={styles.networkDetail}>Passengers: {net.passengers}</Text>
                <Text style={styles.networkDetail}>Revenue: {net.revenue}</Text>
                <View style={styles.utilizationBar}>
                  <Animated.View
                    style={[
                      styles.utilizationFill,
                      {
                        width: animatedWidths[i].interpolate({
                          inputRange: [0, 100],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Recent Activity */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            {activities.map((act) => (
              <View key={act.id} style={styles.activityCard}>
                <View style={styles.rowBetween}>
                  <Ionicons name={act.icon} size={20} color="#afd826" />
                  <Text style={styles.activityTime}>{act.time}</Text>
                </View>
                <Text style={styles.activityText}>{act.text}</Text>
                <Text style={styles.activityTag}>{act.tag}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Sidebar */}
        <Modal transparent visible={menuVisible} animationType="none">
          <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={closeMenu}>
            <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
              <Text style={styles.sidebarTitle}>Menu</Text>
              {[
                { icon: "location-outline", label: "Van Tracking", nav: "VanTracking" },
                { icon: "person-add-outline", label: "Add Driver", nav: "AddDriver" },
                { icon: "person-circle-outline", label: "Add Passenger", nav: "AddPassenger" },
                { icon: "people-outline", label: "Drivers List", nav: "DriverList" },
                { icon: "person-outline", label: "Passengers List", nav: "PassengerList" },
                { icon: "bar-chart-outline", label: "Driver Performance", nav: "DriverPerformance" },
                { icon: "analytics-outline", label: "Passenger Performance", nav: "PassengerPerformance" },                            { icon: "rocket-outline", label: "Smart Scheduling", nav: "SmartScheduling" },
              
                { icon: "folder-open-outline", label: "Manage Records", nav: "ManageRecords" },
                { icon: "card-outline", label: "Payments", nav: "Payments" },
                
                { icon: "notifications-outline", label: "Alerts", nav: "Alerts" },
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
  safeArea: {
    flex: 1,
    backgroundColor: "#afd826",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#afd826",
    paddingHorizontal: 18,
    paddingVertical: 12,
    elevation: 4,
  },
  headerTitle: { fontSize: width * 0.05, fontWeight: "700", color: "#fff" },

  scrollContent: { padding: 15 },

  // Cards
  card: {
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#a4ff50ff",
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12, color: "#111827" },

  // Stats
  statsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  statBox: { alignItems: "center", width: "48%", marginBottom: 12 },
  statNumber: { fontSize: 16, fontWeight: "700", marginTop: 6, color: "#000" },
  statLabel: { fontSize: 13, color: "#555", marginTop: 2 },

  // Quick Actions
  actionsRow: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginBottom: 12,
    width: "48%",
  },
  actionText: { fontSize: 14, marginLeft: 10, color: "#333", fontWeight: "500" },

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
  sidebarTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20, color: "#111827" },

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
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
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
  activityTag: { marginTop: 2, fontSize: 12, fontWeight: "bold", color: "#333" },
});
