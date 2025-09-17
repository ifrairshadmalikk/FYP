import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

export default function TransporterDashboard({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transporter Dashboard</Text>

      {/* Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Active Vans: 5</Text>
        <Text>Drivers: 12 | Passengers: 60</Text>
      </View>

      {/* Navigation */}
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("AddDriver")}>
        <Text style={styles.btnText}>➕ Add Driver</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("AddPassenger")}>
        <Text style={styles.btnText}>➕ Add Passenger</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("ManageRecords")}>
        <Text style={styles.btnText}>📋 Manage Records</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Payments")}>
        <Text style={styles.btnText}>💰 Payments</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("VanTracking")}>
        <Text style={styles.btnText}>🗺️ Van Tracking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Alerts")}>
        <Text style={styles.btnText}>⚠️ Alerts</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: { padding: 15, backgroundColor: "#f2f2f2", marginBottom: 20, borderRadius: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  btn: { backgroundColor: "#007BFF", padding: 15, borderRadius: 8, marginBottom: 10 },
  btnText: { color: "#fff", fontSize: 16, textAlign: "center" },
});
