import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PassengerPerformance() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Performance</Text>
      <Text>Show performance metrics here...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
});
