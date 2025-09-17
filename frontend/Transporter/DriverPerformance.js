import React from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DriverPerformance({ navigation }) {
  const driversPerformance = [
    { id: 1, name: "Ali Khan", completedRoutes: 45, totalRoutes: 50, onTimeDeliveries: 42, lateDeliveries: 3, rating: 4.7 },
    { id: 2, name: "Zara Iqbal", completedRoutes: 48, totalRoutes: 50, onTimeDeliveries: 47, lateDeliveries: 1, rating: 3.7 },
    { id: 3, name: "Ahmed Raza", completedRoutes: 40, totalRoutes: 50, onTimeDeliveries: 38, lateDeliveries: 2, rating: 2.5 },
  ];

  const getProgressWidth = (value, total) => `${(value / total) * 100}%`;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={16} color="#FFD700" />);
    }
    if (halfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#FFD700" />);
    }
    while (stars.length < 5) {
      stars.push(<Ionicons key={`empty-${stars.length}`} name="star-outline" size={16} color="#FFD700" />);
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Driver Performance</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {driversPerformance.map((driver) => (
          <View key={driver.id} style={styles.card}>
            {/* Driver Name + Stars + Numeric Rating */}
            <View style={styles.nameRow}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <View style={styles.starsContainer}>
                {renderStars(driver.rating)}
                <Text style={styles.ratingText}>{driver.rating.toFixed(1)} / 5</Text>
              </View>
            </View>

            {/* Completed Routes */}
            <Text style={styles.metric}>Completed Routes</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: getProgressWidth(driver.completedRoutes, driver.totalRoutes) }]} />
            </View>
            <Text style={styles.value}>{driver.completedRoutes} / {driver.totalRoutes}</Text>

            {/* On-time Deliveries */}
            <Text style={styles.metric}>On-time Deliveries</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: getProgressWidth(driver.onTimeDeliveries, driver.totalRoutes) }]} />
            </View>
            <Text style={styles.value}>{driver.onTimeDeliveries} / {driver.totalRoutes}</Text>

            {/* Late Deliveries */}
            <Text style={styles.metric}>Late Deliveries</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: getProgressWidth(driver.lateDeliveries, driver.totalRoutes), backgroundColor: "#dc3545" }]} />
            </View>
            <Text style={styles.value}>{driver.lateDeliveries} / {driver.totalRoutes}</Text>
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
  driverName: { fontSize: 16, fontWeight: "700", color: "#000" },
  nameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  starsContainer: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 14, fontWeight: "600", color: "#333", marginLeft: 6 },
  metric: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 6 },
  value: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 4 },
  progressBarBackground: { height: 10, width: "100%", backgroundColor: "#eee", borderRadius: 5 },
  progressBarFill: { height: 10, backgroundColor: "#afd826", borderRadius: 5 },
});
