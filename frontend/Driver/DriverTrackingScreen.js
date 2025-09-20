// screens/VanTrackingScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

export default function VanTrackingScreen({ navigation }) {
  const [vanLocation, setVanLocation] = useState({
    latitude: 31.5204, // Lahore start
    longitude: 74.3587,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Dummy passenger data
  const [passengers, setPassengers] = useState([
    {
      id: "1",
      name: "Ali Raza",
      pickup: { latitude: 31.523, longitude: 74.36, address: "Street 12, Model Town" },
      dropoff: { latitude: 31.529, longitude: 74.365, address: "City School" },
    },
    {
      id: "2",
      name: "Sara Ahmed",
      pickup: { latitude: 31.527, longitude: 74.368, address: "Block F, Johar Town" },
      dropoff: { latitude: 31.532, longitude: 74.372, address: "Beaconhouse School" },
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("pickup"); // "pickup" or "drop"

  // Simulate live van movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVanLocation((prev) => ({
        ...prev,
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAction = () => {
    if (phase === "pickup") {
      if (currentIndex < passengers.length - 1) {
        // next passenger pickup
        setCurrentIndex(currentIndex + 1);
      } else {
        // all pickups done → move to drop phase
        setCurrentIndex(0);
        setPhase("drop");
      }
    } else {
      if (currentIndex < passengers.length - 1) {
        // next passenger drop
        setCurrentIndex(currentIndex + 1);
      } else {
        alert("All passengers picked & dropped! 🎉");
        navigation.goBack();
      }
    }
  };

  const currentPassenger = passengers[currentIndex];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Van Live Tracking</Text>
        <Ionicons name="car-outline" size={24} color="#fff" />
      </View>

      {/* Map */}
      <MapView style={styles.map} region={vanLocation}>
        {/* Van Marker */}
        <Marker coordinate={vanLocation} title="Your Van" pinColor="#afd826" />

        {/* Current Passenger Marker */}
        {currentPassenger && (
          <>
            {phase === "pickup" ? (
              <Marker
                coordinate={currentPassenger.pickup}
                title={`Pickup: ${currentPassenger.name}`}
                description={currentPassenger.pickup.address}
                pinColor="blue"
              />
            ) : (
              <Marker
                coordinate={currentPassenger.dropoff}
                title={`Drop-off: ${currentPassenger.name}`}
                description={currentPassenger.dropoff.address}
                pinColor="red"
              />
            )}
          </>
        )}
      </MapView>

      {/* Bottom Info */}
      <View style={styles.infoBox}>
        {currentPassenger ? (
          <>
            <Text style={styles.infoText}>
              {phase === "pickup" ? "Next Pickup:" : "Next Drop-off:"}{" "}
              <Text style={{ fontWeight: "bold" }}>{currentPassenger.name}</Text>
            </Text>
            <Text style={styles.subText}>
              {phase === "pickup"
                ? currentPassenger.pickup.address
                : currentPassenger.dropoff.address}
            </Text>
            <TouchableOpacity style={styles.stopBtn} onPress={handleMarkAction}>
              <Text style={styles.stopText}>
                {phase === "pickup"
                  ? "Mark Pickup Completed"
                  : "Mark Drop Completed"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.infoText}>No more passengers for today 🎉</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#afd826",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
  },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#fff" },

  map: { flex: 1 },

  infoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  infoText: { fontSize: 16, color: "#000", marginBottom: 6 },
  subText: { fontSize: 14, color: "#555", marginBottom: 12 },
  stopBtn: {
    backgroundColor: "#afd826",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  stopText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});
