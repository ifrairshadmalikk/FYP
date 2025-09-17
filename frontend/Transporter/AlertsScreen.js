import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AlertsScreen({ navigation }) {
  const [expanded, setExpanded] = useState({
    missedPassengers: false,
    vehicleDelays: false,
    vehicleBreakdowns: false,
    overCapacity: false,
  });

  const alerts = {
    missedPassengers: ["Ali", "Sara", "Ahmed"],
    vehicleDelays: ["101", "103"],
    vehicleBreakdowns: ["102"],
    overCapacity: ["104"],
  };

  const toggleExpand = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderAlertCard = (key, title, data, iconColor) => (
    <View style={styles.alertCard}>
      <TouchableOpacity onPress={() => toggleExpand(key)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={expanded[key] ? "chevron-down-circle-outline" : "chevron-forward-circle-outline"} size={22} color={iconColor} style={{ marginRight: 10 }} />
        <Text style={styles.alertTitle}>{title}</Text>
      </TouchableOpacity>
      {expanded[key] && data.length > 0 && (
        <View style={{ marginTop: 6, marginLeft: 32 }}>
          {data.map((item, idx) => (
            <Text key={idx} style={styles.alertDetail}>• {item}</Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alerts</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {renderAlertCard("missedPassengers", "Missed Passengers", alerts.missedPassengers, "#f39c12")}
        {renderAlertCard("vehicleDelays", "Vehicle Delays", alerts.vehicleDelays, "#e67e22")}
        {renderAlertCard("vehicleBreakdowns", "Vehicle Breakdowns", alerts.vehicleBreakdowns, "#c0392b")}
        {renderAlertCard("overCapacity", "Overcapacity Warnings", alerts.overCapacity, "#d35400")}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#afd826",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#afd826",
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  alertCard: {
    backgroundColor: "#fdf2e9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f5c78b",
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  alertDetail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
});
