import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DriverList({ navigation }) {
  const [expandedDriver, setExpandedDriver] = useState(null);

  const [drivers] = useState([
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

      <ScrollView contentContainerStyle={styles.container}>
        {drivers.map((driver) => (
          <View key={driver.id} style={styles.card}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                setExpandedDriver(expandedDriver === driver.id ? null : driver.id)
              }
            >
              {/* Top Row */}
              <View style={styles.row}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: driver.isAvailableToday ? "#eaf8ee" : "#fdeaea",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: driver.isAvailableToday ? "#28a745" : "#dc3545" },
                    ]}
                  >
                    {driver.isAvailableToday ? "Available Today" : "Not Available"}
                  </Text>
                </View>
              </View>

              {/* Availability */}
              <Text style={styles.driverAvailability}>
                Working Hours: {driver.availability}
              </Text>

              {/* Expanded Section */}
              {expandedDriver === driver.id && (
                <View style={styles.expandedSection}>
                  <Text style={styles.expandedText}>
                    More details about {driver.name} can be shown here.
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
    elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },

  container: { padding: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  driverName: { fontSize: 17, fontWeight: "700", color: "#111" },
  driverAvailability: { fontSize: 14, color: "#555", marginTop: 6 },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },

  expandedSection: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  expandedText: { fontSize: 13, color: "#444" },
});
