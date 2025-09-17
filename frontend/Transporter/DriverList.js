import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function DriverList() {
  const drivers = [
    { id: 1, name: "Ali Khan", availability: "9AM - 5PM" },
    { id: 2, name: "Zara Iqbal", availability: "10AM - 6PM" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drivers List</Text>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.availability}>Availability: {item.availability}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  item: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  name: { fontWeight: "600", fontSize: 16 },
  availability: { marginTop: 5, color: "#555" },
});
