import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SmartScheduling({ navigation }) {
  // Example passenger bookings
  const [bookings, setBookings] = useState([
    { id: 1, name: "Sara", pickup: "Gulberg", drop: "Model Town", preferredTime: "08:00" },
    { id: 2, name: "Ahmed", pickup: "DHA", drop: "Gulberg", preferredTime: "08:15" },
    { id: 3, name: "Ali", pickup: "Johar Town", drop: "DHA", preferredTime: "08:30" },
    { id: 4, name: "Zara", pickup: "Wapda Town", drop: "Gulberg", preferredTime: "08:45" }
  ]);

  // Available drivers
  const [drivers, setDrivers] = useState(["Ali Khan", "Ahmed Raza", "Zara Iqbal"]);

  // Auto-suggested routes
  const [suggestedRoutes, setSuggestedRoutes] = useState([]);

  // Confirmed schedule
  const [confirmedRoutes, setConfirmedRoutes] = useState([]);

  useEffect(() => {
    generateSuggestedRoutes();
  }, []);

  // Generate routes based on passenger locations (simple mock logic)
  const generateSuggestedRoutes = () => {
    // For simplicity, just split into 2 routes
    const route1 = { id: Date.now() + 1, name: "Route 1", passengers: bookings.slice(0, 2), driver: "" };
    const route2 = { id: Date.now() + 2, name: "Route 2", passengers: bookings.slice(2), driver: "" };
    setSuggestedRoutes([route1, route2]);
  };

  const assignDriver = (routeId, driver) => {
    const updatedRoutes = suggestedRoutes.map((route) =>
      route.id === routeId ? { ...route, driver } : route
    );
    setSuggestedRoutes(updatedRoutes);
  };

  const adjustPickupTime = (routeId, passengerId, newTime) => {
    const updatedRoutes = suggestedRoutes.map((route) => {
      if (route.id === routeId) {
        const updatedPassengers = route.passengers.map((p) =>
          p.id === passengerId ? { ...p, preferredTime: newTime } : p
        );
        return { ...route, passengers: updatedPassengers };
      }
      return route;
    });
    setSuggestedRoutes(updatedRoutes);
  };

  const confirmSchedule = (route) => {
    if (!route.driver) {
      Alert.alert("Assign Driver", "Please assign a driver before confirming.");
      return;
    }
    setConfirmedRoutes([...confirmedRoutes, route]);
    setSuggestedRoutes(suggestedRoutes.filter((r) => r.id !== route.id));
    Alert.alert("Schedule Confirmed", `${route.name} has been confirmed with driver ${route.driver}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Scheduling</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Suggested Routes</Text>
        {suggestedRoutes.map((route) => (
          <View key={route.id} style={styles.card}>
            <Text style={styles.routeName}>{route.name}</Text>

            <Text style={styles.subTitle}>Passengers:</Text>
            {route.passengers.map((p) => (
              <View key={p.id} style={styles.passengerRow}>
                <Text style={styles.passengerName}>{p.name}</Text>
                <TextInput
                  style={styles.timeInput}
                  value={p.preferredTime}
                  onChangeText={(text) => adjustPickupTime(route.id, p.id, text)}
                />
                <Text style={styles.locationText}>{p.pickup} → {p.drop}</Text>
              </View>
            ))}

            <Text style={styles.subTitle}>Assign Driver:</Text>
            <ScrollView horizontal>
              {drivers.map((driver, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.driverButton,
                    route.driver === driver && { backgroundColor: "#afd826" }
                  ]}
                  onPress={() => assignDriver(route.id, driver)}
                >
                  <Text style={styles.driverButtonText}>{driver}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.confirmButton} onPress={() => confirmSchedule(route)}>
              <Text style={styles.confirmButtonText}>Confirm Schedule</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Confirmed Routes</Text>
        {confirmedRoutes.map((route) => (
          <View key={route.id} style={styles.card}>
            <Text style={styles.routeName}>{route.name}</Text>
            <Text style={styles.subTitle}>Driver: {route.driver}</Text>
            {route.passengers.map((p) => (
              <Text key={p.id} style={styles.locationText}>
                {p.name}: {p.pickup} → {p.drop} at {p.preferredTime}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  headerContainer: { height: 60, backgroundColor: "#afd826", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  container: { padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 10 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 12, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  routeName: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  subTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  passengerRow: { marginBottom: 6 },
  passengerName: { fontSize: 14, fontWeight: "600" },
  locationText: { fontSize: 13, color: "#555" },
  timeInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 4, width: 70, marginVertical: 2 },
  driverButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: "#eee", marginRight: 8 },
  driverButtonText: { fontSize: 14, fontWeight: "600", color: "#333" },
  confirmButton: { marginTop: 10, backgroundColor: "#afd826", paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  confirmButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 }
});
