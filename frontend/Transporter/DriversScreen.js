import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function DriversScreen() {
  const [expandedDriver, setExpandedDriver] = useState(null);

  const drivers = [
    {
      id: 1,
      name: "Ahmed",
      availability: "08:00 - 16:00",
      routes: ["Route A", "Route B"],
    },
    {
      id: 2,
      name: "Ali",
      availability: "10:00 - 18:00",
      routes: ["Route C"],
    },
    {
      id: 3,
      name: "Sara",
      availability: "07:00 - 15:00",
      routes: ["Route D", "Route E", "Route F"],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Registered Drivers</Text>

        {drivers.map(driver => (
          <View key={driver.id} style={styles.card}>
            <TouchableOpacity
              style={styles.driverHeader}
              onPress={() =>
                setExpandedDriver(expandedDriver === driver.id ? null : driver.id)
              }
            >
              <View>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverAvailability}>
                  Availability: {driver.availability}
                </Text>
              </View>
              <Ionicons
                name={expandedDriver === driver.id ? "chevron-up-outline" : "chevron-down-outline"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>

            {expandedDriver === driver.id && (
              <View style={styles.routesContainer}>
                {driver.routes.map((route, index) => (
                  <View key={index} style={styles.routeItem}>
                    <Text style={styles.routeText}>{route}</Text>
                    <TouchableOpacity style={styles.assignButton}>
                      <Text style={styles.assignButtonText}>Assign</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  driverAvailability: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  routesContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  routeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  routeText: {
    fontSize: 14,
    color: "#333",
  },
  assignButton: {
    backgroundColor: "#afd826",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  assignButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
