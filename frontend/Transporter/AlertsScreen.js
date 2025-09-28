import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet, SafeAreaView, StatusBar, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AlertsScreen({ navigation }) {
  const alerts = [
    { id: 1, title: "Missed Passenger", detail: "Ali did not board the van", time: "2 mins ago", icon: "person-remove", color: "#f39c12" },
    { id: 2, title: "Vehicle Delay", detail: "Van 101 delayed by 15 mins", time: "5 mins ago", icon: "time-outline", color: "#e67e22" },
    { id: 3, title: "Breakdown Alert", detail: "Van 102 stopped near Blue Area", time: "12 mins ago", icon: "alert-circle-outline", color: "#c0392b" },
    { id: 4, title: "Overcapacity", detail: "Van 104 exceeded capacity", time: "20 mins ago", icon: "people-outline", color: "#d35400" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerBar}>
        <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Alerts</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {alerts.map((alert) => (
          <Pressable
            key={alert.id}
            android_ripple={{ color: "#ddd", borderless: false }}
            style={({ pressed }) => [
              styles.notificationCard,
              pressed && { backgroundColor: "#f0f0f0" }, // iOS-like feedback
            ]}
            onPress={() => console.log(`${alert.title} opened`)}
          >
            <View style={[styles.iconCircle, { backgroundColor: alert.color + "20" }]}>
              <Ionicons name={alert.icon} size={22} color={alert.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertDetail}>{alert.detail}</Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#afd826" },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#afd826",
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  alertTitle: { fontSize: 15, fontWeight: "bold", color: "#333" },
  alertDetail: { fontSize: 13, color: "#555", marginTop: 2 },
  alertTime: { fontSize: 12, color: "#999", marginTop: 4 },
});
