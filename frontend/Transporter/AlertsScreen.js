import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

export default function AlertsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Alerts</Text>
      <Text>⚠️ Missed Passengers</Text>
      <Text>⚠️ Van Delays</Text>
      <Text>⚠️ Vehicle Breakdowns</Text>
      <Text>⚠️ Overcapacity Warnings</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({ container: { padding: 20 }, title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 }});
