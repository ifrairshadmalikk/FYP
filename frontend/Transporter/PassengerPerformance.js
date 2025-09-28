import React from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PassengerPerformance({ navigation }) {
  const passengersPerformance = [
    { id: 1, name: "Sara", onTimeRides: 46, lateRides: 4, totalRides: 50 },
    { id: 2, name: "Ahmed", onTimeRides: 42, lateRides: 8, totalRides: 50 },
    { id: 3, name: "Ali", onTimeRides: 50, lateRides: 0, totalRides: 50 },
  ];

  const getProgressWidth = (value, total) => `${(value / total) * 100}%`;

  const getPerformanceColor = (onTime, total) => {
    const percent = (onTime / total) * 100;
    if (percent >= 90) return "#4caf50"; // green
    if (percent >= 60) return "#f1c40f"; // yellow
    return "#e74c3c"; // red
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Passenger Performance</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {passengersPerformance.map((passenger) => {
          const perfColor = getPerformanceColor(passenger.onTimeRides, passenger.totalRides);
          const percentOnTime = ((passenger.onTimeRides / passenger.totalRides) * 100).toFixed(0);
          const percentLate = ((passenger.lateRides / passenger.totalRides) * 100).toFixed(0);

          return (
            <View key={passenger.id} style={[styles.card, { borderLeftColor: perfColor }]}>
              {/* Header Row */}
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{passenger.name}</Text>
                <Ionicons name="person-circle-outline" size={28} color={perfColor} />
              </View>

              {/* On-time Rides */}
              <Text style={styles.metric}>On-time Rides</Text>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: getProgressWidth(passenger.onTimeRides, passenger.totalRides), backgroundColor: perfColor }]} />
              </View>
              <Text style={styles.value}>{passenger.onTimeRides} / {passenger.totalRides} ({percentOnTime}%)</Text>

              {/* Late Rides */}
              <Text style={styles.metric}>Late Rides</Text>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: getProgressWidth(passenger.lateRides, passenger.totalRides), backgroundColor: "#dc3545" }]} />
              </View>
              <Text style={styles.value}>{passenger.lateRides} / {passenger.totalRides} ({percentLate}%)</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  headerContainer: { height: 60, backgroundColor: "#afd826", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  container: { padding: 15 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderLeftWidth: 6,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "700", color: "#000" },
  metric: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 6 },
  value: { fontSize: 13, fontWeight: "500", color: "#333", marginBottom: 4 },
  progressBarBackground: { height: 10, width: "100%", backgroundColor: "#eee", borderRadius: 5, marginTop: 4 },
  progressBarFill: { height: 10, borderRadius: 5 },
});
