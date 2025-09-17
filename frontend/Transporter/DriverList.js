import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DriverList({ navigation }) {
  const [expandedDriver, setExpandedDriver] = useState(null);

  const [drivers, setDrivers] = useState([
    { id: 1, name: "Ali Khan", availability: "09:00 - 17:00", isAvailableToday: true },
    { id: 2, name: "Zara Iqbal", availability: "10:00 - 18:00", isAvailableToday: false },
    { id: 3, name: "Ahmed Raza", availability: "08:00 - 16:00", isAvailableToday: true },
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drivers List</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {drivers.map((driver) => (
          <View key={driver.id} style={styles.card}>
            <TouchableOpacity
              style={styles.driverHeader}
              onPress={() =>
                setExpandedDriver(expandedDriver === driver.id ? null : driver.id)
              }
            >
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.driverName}>{driver.name}</Text>
                {!driver.isAvailableToday && (
                  <View style={styles.unavailableContainer}>
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color="#dc3545"
                      style={{ marginLeft: 6 }}
                    />
                    <Text style={styles.unavailableText}>Not Available Today</Text>
                  </View>
                )}
              </View>
              <Text style={styles.driverAvailability}>
                Availability: {driver.availability}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    height: 60,
    backgroundColor: "#afd826",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  container: { padding: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  driverHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  driverName: { fontSize: 16, fontWeight: "600", color: "#000" },
  driverAvailability: { fontSize: 14, color: "#555", marginTop: 4 },
  unavailableContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  unavailableText: { color: "#dc3545", fontSize: 12, marginLeft: 2 },
});
