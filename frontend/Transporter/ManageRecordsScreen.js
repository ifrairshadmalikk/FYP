import React from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ManageRecordsScreen() {
  // Later fetch records from backend
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Manage Records</Text>
      <Text>List of Drivers & Passengers will appear here</Text>
      <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Edit</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Delete</Text></TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 20 }, title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  btn: { backgroundColor: "#ffc107", padding: 10, borderRadius: 5, marginTop: 5 }, btnText: { color: "#000" },
});
