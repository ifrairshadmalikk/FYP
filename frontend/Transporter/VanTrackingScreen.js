import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function VanTrackingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Van Tracking</Text>
      <Text>Map will show real-time van locations here 🚐</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 }});
