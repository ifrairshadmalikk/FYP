import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function TransporterDashboard({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Transporter Dashboard</Text>

      {/* Overview Cards */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Vans</Text>
          <Text style={styles.cardValue}>05</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Drivers</Text>
          <Text style={styles.cardValue}>12</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Passengers</Text>
          <Text style={styles.cardValue}>60</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Add Driver")}>
          <Text style={styles.actionText}>Add Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Add Passenger")}>
          <Text style={styles.actionText}>Add Passenger</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Manage Records")}>
          <Text style={styles.actionText}>Manage Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Payments")}>
          <Text style={styles.actionText}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Van Tracking")}>
          <Text style={styles.actionText}>Van Tracking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Alerts")}>
          <Text style={styles.actionText}>Alerts</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 20 },
  header: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 25, textAlign: "center" },

  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1.5,
    borderColor: "#111827",
  },
  cardTitle: { fontSize: 14, color: "#111827", marginBottom: 5 },
  cardValue: { fontSize: 20, fontWeight: "bold", color: "#111827" },

  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 15, color: "#111827" },

  actions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  actionBtn: {
    backgroundColor: "#afd826",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
    width: width * 0.44, // two buttons per row
  },
  actionText: { color: "#ffffff", fontWeight: "700", fontSize: 16 },
});
