import React from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PassengerPerformance({ navigation }) {
  const passengersPerformance = [
    { id: 1, name: "Sara", onTimeRides: 46, lateRides: 4, totalRides: 50 },
    { id: 2, name: "Ahmed", onTimeRides: 42, lateRides: 8, totalRides: 50 },
    { id: 3, name: "Ali", onTimeRides: 50, lateRides: 0, totalRides: 50 },
  ];

  const getProgressWidth = (value, total) => `${(value / total) * 100}%`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Passenger Performance</Text>
        <View style={{ width: 24 }} /> {/* Placeholder to balance flex */}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {passengersPerformance.map((passenger) => (
          <View key={passenger.id} style={styles.card}>
            <Text style={styles.name}>{passenger.name}</Text>

            <Text style={styles.metric}>On-time Rides</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: getProgressWidth(passenger.onTimeRides, passenger.totalRides) }]} />
            </View>
            <Text style={styles.value}>{passenger.onTimeRides} / {passenger.totalRides}</Text>

            <Text style={styles.metric}>Late Rides</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: getProgressWidth(passenger.lateRides, passenger.totalRides), backgroundColor: "#dc3545" }]} />
            </View>
            <Text style={styles.value}>{passenger.lateRides} / {passenger.totalRides}</Text>
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
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 12, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  name: { fontSize: 16, fontWeight: "700", color: "#000", marginBottom: 10 },
  metric: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 6 },
  value: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 4 },
  progressBarBackground: { height: 10, width: "100%", backgroundColor: "#eee", borderRadius: 5 },
  progressBarFill: { height: 10, backgroundColor: "#afd826", borderRadius: 5 },
});
