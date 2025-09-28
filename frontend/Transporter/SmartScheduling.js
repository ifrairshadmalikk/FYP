import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SmartScheduling({ navigation }) {
  const [bookings] = useState([
    { id: 1, name: "Sara", pickup: "Gulberg", drop: "Model Town", preferredTime: "08:00" },
    { id: 2, name: "Ahmed", pickup: "DHA", drop: "Gulberg", preferredTime: "08:15" },
    { id: 3, name: "Ali", pickup: "Johar Town", drop: "DHA", preferredTime: "08:30" },
    { id: 4, name: "Zara", pickup: "Wapda Town", drop: "Gulberg", preferredTime: "08:45" },
  ]);

  const [drivers] = useState(["Ali Khan", "Ahmed Raza", "Zara Iqbal"]);

  const [suggestedRoutes, setSuggestedRoutes] = useState([]);
  const [confirmedRoutes, setConfirmedRoutes] = useState([]);

  useEffect(() => {
    generateSuggestedRoutes();
  }, []);

  const generateSuggestedRoutes = () => {
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
    Alert.alert("✅ Schedule Confirmed", `${route.name} confirmed with driver ${route.driver}`);
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
        <Ionicons name="" size={22} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Suggested */}
        <Text style={styles.sectionTitle}>🚐 Suggested Routes</Text>
        {suggestedRoutes.map((route, idx) => (
          <View key={route.id} style={[styles.card, { borderLeftColor: idx % 2 === 0 ? "#3498db" : "#9b59b6" }]}>
            <Text style={styles.routeName}>{route.name}</Text>

            {/* Passengers */}
            <Text style={styles.subTitle}>👥 Passengers</Text>
            {route.passengers.map((p) => (
              <View key={p.id} style={styles.passengerRow}>
                <Ionicons name="person-circle-outline" size={18} color="#555" />
                <Text style={styles.passengerName}>{p.name}</Text>
                <TextInput
                  style={styles.timeInput}
                  value={p.preferredTime}
                  onChangeText={(text) => adjustPickupTime(route.id, p.id, text)}
                />
                <Text style={styles.locationText}>{p.pickup} → {p.drop}</Text>
              </View>
            ))}

            {/* Drivers */}
            <Text style={styles.subTitle}>🧑‍✈️ Assign Driver</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 5 }}>
              {drivers.map((driver, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.driverChip,
                    route.driver === driver && { backgroundColor: "#afd826" },
                  ]}
                  onPress={() => assignDriver(route.id, driver)}
                >
                  <Ionicons name="person-outline" size={16} color={route.driver === driver ? "#fff" : "#333"} />
                  <Text
                    style={[
                      styles.driverChipText,
                      route.driver === driver && { color: "#fff" },
                    ]}
                  >
                    {driver}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Confirm */}
            <TouchableOpacity style={styles.confirmButton} onPress={() => confirmSchedule(route)}>
              <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.confirmButtonText}>Confirm Schedule</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Confirmed */}
        <Text style={styles.sectionTitle}>✅ Confirmed Routes</Text>
        {confirmedRoutes.map((route) => (
          <View key={route.id} style={[styles.card, { borderLeftColor: "#2ecc71" }]}>
            <Text style={styles.routeName}>{route.name}</Text>
            <Text style={styles.subTitle}>Driver: {route.driver}</Text>
            {route.passengers.map((p) => (
              <Text key={p.id} style={styles.confirmedPassenger}>
                {p.name} → {p.drop} at {p.preferredTime}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  headerContainer: {
    height: 60,
    backgroundColor: "#afd826",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  container: { padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderLeftWidth: 5,
  },
  routeName: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  subTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4, color: "#444" },
  passengerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    backgroundColor: "#f8f9fa",
    padding: 6,
    borderRadius: 8,
  },
  passengerName: { fontSize: 14, fontWeight: "600", marginLeft: 4, marginRight: 8 },
  locationText: { fontSize: 13, color: "#555" },
  timeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 4,
    width: 70,
    marginRight: 8,
    textAlign: "center",
    fontSize: 13,
  },
  driverChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  driverChipText: { fontSize: 13, fontWeight: "600", marginLeft: 4, color: "#333" },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#afd826",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  confirmButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  confirmedPassenger: {
    fontSize: 13,
    marginVertical: 2,
    color: "#2d3436",
  },
});
