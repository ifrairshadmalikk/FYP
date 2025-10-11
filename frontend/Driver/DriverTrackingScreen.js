// screens/VanTrackingScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const scale = width / 375; // base for responsive scaling

export default function VanTrackingScreen({ navigation }) {
  const [vanLocation, setVanLocation] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [passengers, setPassengers] = useState([
    {
      id: "1",
      name: "Ali Raza",
      pickup: {
        latitude: 31.523,
        longitude: 74.36,
        address: "Street 12, Model Town",
      },
      dropoff: {
        latitude: 31.529,
        longitude: 74.365,
        address: "City School",
      },
    },
    {
      id: "2",
      name: "Sara Ahmed",
      pickup: {
        latitude: 31.527,
        longitude: 74.368,
        address: "Block F, Johar Town",
      },
      dropoff: {
        latitude: 31.532,
        longitude: 74.372,
        address: "Beaconhouse School",
      },
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("pickup"); // pickup → drop

  // 🚐 Simulate live van movement
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
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
        setPhase("drop");
        Alert.alert("All pickups done ✅", "Now start dropping passengers.");
      }
    } else {
      if (currentIndex < passengers.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        Alert.alert("Route Completed 🎉", "All passengers have been dropped off.");
        navigation.goBack();
      }
    }
  };

  const currentPassenger = passengers[currentIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#AFD826" />
      <View style={styles.container}>
        {/* ✅ Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconLeft}
          >
            <Ionicons name="arrow-back" size={width * 0.06} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Van Live Tracking</Text>

          <View style={styles.iconRight}>
            <Ionicons name="car-outline" size={width * 0.065} color="#fff" />
          </View>
        </View>

        {/* ✅ Map */}
        <MapView
          style={styles.map}
          region={vanLocation}
          showsCompass={true}
          showsUserLocation={false}
        >
          <Marker
            coordinate={vanLocation}
            title="Your Van"
            description="Live location of your van"
            pinColor="#AFD826"
          />

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

        {/* ✅ Info Box */}
        <View style={styles.infoBox}>
          {currentPassenger ? (
            <>
              <Text style={styles.infoText}>
                {phase === "pickup" ? "Next Pickup:" : "Next Drop-off:"}{" "}
                <Text style={styles.boldText}>{currentPassenger.name}</Text>
              </Text>
              <Text style={styles.subText}>
                {phase === "pickup"
                  ? currentPassenger.pickup.address
                  : currentPassenger.dropoff.address}
              </Text>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleMarkAction}
              >
                <Text style={styles.actionText}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#AFD826", // ensures header background under status bar
  },
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#AFD826",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 6 },
    }),
  },
  headerText: {
    fontSize: 18 * scale,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  iconLeft: { width: 40, alignItems: "flex-start" },
  iconRight: { width: 40, alignItems: "flex-end" },

  map: {
    flex: 1,
    width: "100%",
    height: height * 0.7,
  },

  infoBox: {
    backgroundColor: "#fff",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.06,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16 * scale,
    color: "#000",
    marginBottom: 5,
    textAlign: "center",
  },
  subText: {
    fontSize: 14 * scale,
    color: "#555",
    marginBottom: 12,
    textAlign: "center",
  },
  boldText: { fontWeight: "bold" },
  actionBtn: {
    backgroundColor: "#AFD826",
    paddingVertical: height * 0.018,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  actionText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15 * scale,
  },
});