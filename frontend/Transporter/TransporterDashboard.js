import React, { useState } from "react";
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

const { width } = Dimensions.get("window");

export default function TransporterDashboard({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-width))[0];

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

  // Dummy data for demonstration
  const drivers = [
    { id: 1, name: "Ali Khan", route: "Route A", passengers: ["Sara", "Ahmed"] },
    { id: 2, name: "Zara Iqbal", route: "Route B", passengers: ["Hassan", "Ayesha"] },
  ];

  const passengers = [
    { id: 1, name: "Sara", pickup: "Location 1", van: "Van 1", payment: "Paid" },
    { id: 2, name: "Ahmed", pickup: "Location 2", van: "Van 1", payment: "Pending" },
  ];

  const lowDemandRoutes = [
    { route: "Route C", passengers: 3 },
  ];

  const performanceLogs = {
    drivers: [
      { name: "Ali Khan", attendance: 25, onTime: 23, fuelUsed: 120 },
      { name: "Zara Iqbal", attendance: 28, onTime: 28, fuelUsed: 100 },
    ],
    passengers: [
      { name: "Sara", attendance: 20, missed: 1 },
      { name: "Ahmed", attendance: 22, missed: 0 },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity
            onPress={openMenu}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollContent}>
          {/* Overview */}
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Overview</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Ionicons name="car-outline" size={28} color="#000" />
                <Text style={styles.statNumber}>05</Text>
                <Text style={styles.statLabel}>Active Vans</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="people-outline" size={28} color="#000" />
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Drivers</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="person-outline" size={28} color="#000" />
                <Text style={styles.statNumber}>60</Text>
                <Text style={styles.statLabel}>Passengers</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Add Driver")}
            >
              <Ionicons name="person-add-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Add Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("AddPassenger")}
            >
              <Ionicons name="person-circle-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Add Passenger</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Manage Records")}
            >
              <Ionicons name="folder-open-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Manage Records</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Payments")}
            >
              <Ionicons name="card-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Payments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Van Tracking")}
            >
              <Ionicons name="location-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Van Tracking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Alerts")}
            >
              <Ionicons name="notifications-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Alerts</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Sidebar Drawer */}
        {/* Sidebar Drawer */}
<Modal transparent visible={menuVisible} animationType="none">
  <TouchableOpacity
    style={styles.menuOverlay}
    activeOpacity={1}
    onPress={closeMenu}
  >
    <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
      <Text style={styles.sidebarTitle}>Menu</Text>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          closeMenu();
          navigation.navigate("DriverList");
        }}
      >
        <Ionicons name="people-outline" size={22} color="#333" />
        <Text style={styles.menuText}>Drivers List</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          closeMenu();
          navigation.navigate("PassengerList");
        }}
      >
        <Ionicons name="person-outline" size={22} color="#333" />
        <Text style={styles.menuText}>Passengers List</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          closeMenu();
          navigation.navigate("DriverPerformance");
        }}
      >
        <Ionicons name="bar-chart-outline" size={22} color="#333" />
        <Text style={styles.menuText}>Driver Performance</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          closeMenu();
          navigation.navigate("PassengerPerformance");
        }}
      >
        <Ionicons name="analytics-outline" size={22} color="#333" />
        <Text style={styles.menuText}>Passenger Performance</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          closeMenu();
          navigation.navigate("RouteAssignment");
        }}
      >
        <Ionicons name="map-outline" size={22} color="#333" />
        <Text style={styles.menuText}>Route Assignment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          closeMenu();
          navigation.navigate("SmartScheduling");
        }}
      >
        <Ionicons name="rocket-outline" size={22} color="#333" />
        <Text style={styles.menuText}>Smart Scheduling</Text>
      </TouchableOpacity>
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
    elevation: 5,
  },
  headerTitle: { fontSize: width * 0.05, fontWeight: "700", color: "#FFFFFF" },
  scrollContent: { padding: 15 },

  // Overview / Stats Card
  statsCard: { 
    backgroundColor: "#fff", 
    marginBottom: 20, 
    padding: 20, 
    borderRadius: 12, 
    elevation: 3, 
    borderWidth: 1, 
    borderColor: "#afd826"   // تھیم کلر کے مطابق بارڈر
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#333" },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBox: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 18, fontWeight: "700", marginTop: 6, color: "#000" }, // آئیکن کے ساتھ match
  statLabel: { fontSize: 14, color: "#555", marginTop: 2 },

  // Quick Actions Section
  section: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 15, 
    elevation: 3,
    borderWidth: 1,
    borderColor: "#afd826"   
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 15, color: "#333" },

  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  menuText: { fontSize: 15, marginLeft: 12, color: "#333" },
  menuOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  sidebar: { position: "absolute", top: 0, bottom: 0, width: width * 0.72, backgroundColor: "#fff", padding: 20, elevation: 6 },
  sidebarTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20, color: "#111827" },
  itemRow: { marginBottom: 8 },
  bold: { fontWeight: "600" },

  downloadBtn: { backgroundColor: "#afd826", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 15 },
  downloadText: { color: "#fff", fontWeight: "700" },


  iconColor: { color: "#000" } 
});
