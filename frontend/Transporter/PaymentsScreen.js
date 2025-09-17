import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

export default function PaymentsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payments</Text>
      <Text>Passenger Ali - Paid</Text>
      <Text>Driver Ahmed - Pending</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({ container: { padding: 20 }, title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 }});
