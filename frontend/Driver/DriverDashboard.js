import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Dummy backend simulation (ye baad me API call hoga)
const fetchTodayRoute = () => {
  // Dynamic date
  const today = new Date().toISOString().split("T")[0]; // "2025-09-20"

  // Example data (normally backend se ayega)
  const routes = {
    "2025-09-20": {
      routeName: "Morning School Route",
      driver: "Ahmed Khan",
      vehicle: "Van #12",
      passengers: [
        { id: "1", name: "Ali Raza", pickup: "Street 12, Model Town", dropoff: "City School" },
        { id: "2", name: "Sara Ahmed", pickup: "Block F, Johar Town", dropoff: "Beaconhouse School" },
        { id: "3", name: "Usman Malik", pickup: "Gulberg Main Road", dropoff: "Roots International" },
      ],
    },
    "2025-09-21": {
      routeName: "Evening Tuition Route",
      driver: "Ahmed Khan",
      vehicle: "Van #12",
      passengers: [
        { id: "4", name: "Hina Tariq", pickup: "DHA Phase 3", dropoff: "LGS" },
        { id: "5", name: "Bilal Khan", pickup: "Iqbal Town", dropoff: "KIPS Academy" },
      ],
    },
  };

  return routes[today] || null;
};

export default function DriverDashboard({ navigation }) {
  const [todayRoute, setTodayRoute] = useState(null);
  const todayDate = new Date().toDateString(); // e.g. "Sat Sep 20 2025"

  useEffect(() => {
    const route = fetchTodayRoute();
    setTodayRoute(route);
  }, []);

  const renderPassenger = ({ item }) => (
    <View style={styles.passengerCard}>
      <View style={styles.iconBox}>
        <Ionicons name="person-circle-outline" size={30} color="#ff6600" />
      </View>
      <View style={styles.passengerInfo}>
        <Text style={styles.passengerName}>{item.name}</Text>
        <Text style={styles.text}>
          <Ionicons name="location-outline" size={14} color="#ff6600" /> Pickup: {item.pickup}
        </Text>
        <Text style={styles.text}>
          <Ionicons name="location-sharp" size={14} color="#ff6600" /> Drop-off: {item.dropoff}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.routeTitle}>Today's Route</Text>
        <Text style={styles.subText}>{todayDate}</Text>
      </View>

      {/* Show Route or No Route */}
      {todayRoute ? (
        <>
          <View style={styles.routeInfo}>
            <Text style={styles.mainTitle}>{todayRoute.routeName}</Text>
            <Text style={styles.subText}>
              Driver: {todayRoute.driver} | {todayRoute.vehicle}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Scheduled Passengers</Text>
          <FlatList
            data={todayRoute.passengers}
            renderItem={renderPassenger}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("VanTracking")}
          >
            <Text style={styles.buttonText}>Start Route</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.noRouteBox}>
          <Ionicons name="alert-circle-outline" size={50} color="#ff6600" />
          <Text style={styles.noRouteText}>No route assigned for today</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 12, elevation: 2 },
  routeTitle: { fontSize: 20, fontWeight: "bold", color: "#000" },
  subText: { fontSize: 14, color: "#555" },
  routeInfo: { marginBottom: 15, padding: 12, backgroundColor: "#fdfdfd", borderRadius: 12, elevation: 2 },
  mainTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#000", marginVertical: 10 },
  passengerCard: {
    flexDirection: "row",
    backgroundColor: "#fdfdfd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  iconBox: { justifyContent: "center", marginRight: 12 },
  passengerInfo: { flex: 1 },
  passengerName: { fontSize: 16, fontWeight: "600", color: "#000" },
  text: { fontSize: 14, color: "#333", marginTop: 2 },
  button: {
    backgroundColor: "#ff6600",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  noRouteBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  noRouteText: { fontSize: 16, color: "#555", marginTop: 10 },
});
