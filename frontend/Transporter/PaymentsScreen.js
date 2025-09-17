import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentsScreen({ navigation }) {
  const [payments, setPayments] = useState([
    { id: 1, type: "Passenger", name: "Ali", paid: true },
    { id: 2, type: "Driver", name: "Ahmed", paid: false },
    { id: 3, type: "Passenger", name: "Sara", paid: false },
    { id: 4, type: "Driver", name: "Bilal", paid: true },
  ]);

  const togglePayment = (id) => {
    setPayments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, paid: !item.paid } : item
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {payments.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>
                {item.type}: {item.name}
              </Text>
              <View style={styles.switchContainer}>
                <Text style={{ marginRight: 8 }}>
                  {item.paid ? "Paid" : "Pending"}
                </Text>
                <Switch
                  value={item.paid}
                  onValueChange={() => togglePayment(item.id)}
                  trackColor={{ false: "#ccc", true: "#afd826" }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>
        ))}
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
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 16, fontWeight: "bold" },
  switchContainer: { flexDirection: "row", alignItems: "center" },
});
