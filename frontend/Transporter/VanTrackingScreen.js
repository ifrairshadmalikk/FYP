import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

export default function VanTrackingScreen({ navigation }) {
  const [vanLocations, setVanLocations] = useState([
    { id: 1, name: "V1", latitude: 24.8607, longitude: 67.0011 },
    { id: 2, name: "V2", latitude: 24.8610, longitude: 67.0025 },
    { id: 3, name: "V3", latitude: 24.8620, longitude: 67.0030 },
  ]);
  const [selectedVan, setSelectedVan] = useState(null);
  const mapRef = useRef();

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVanLocations((prev) =>
        prev.map((van) => ({
          ...van,
          latitude: van.latitude + (Math.random() - 0.5) * 0.0005,
          longitude: van.longitude + (Math.random() - 0.5) * 0.0005,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectVan = (van) => {
    setSelectedVan(van);
    mapRef.current.animateToRegion(
      {
        latitude: van.latitude,
        longitude: van.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      500
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
        <Text style={styles.headerTitle}>Van Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Info Panel */}
      <View style={styles.infoPanel}>
        <Text style={styles.infoTitle}>Track Your Vans in Real-Time</Text>
        <Text style={styles.infoSubtitle}>
          Tap on a van below to center its location on the map.
        </Text>

        {/* Van Selector */}
        <FlatList
          data={vanLocations}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.vanBtn,
                selectedVan?.id === item.id && styles.vanBtnSelected,
              ]}
              onPress={() => handleSelectVan(item)}
            >
              <Text
                style={[
                  styles.vanBtnText,
                  selectedVan?.id === item.id && { color: "#fff" },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 24.8607,
            longitude: 67.0011,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {vanLocations.map((van) => (
            <Marker
              key={van.id}
              coordinate={{ latitude: van.latitude, longitude: van.longitude }}
              title={van.name}
              pinColor={selectedVan?.id === van.id ? "#28a745" : "orange"}
            />
          ))}
        </MapView>
      </View>
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

  infoPanel: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    elevation: 3,
  },
  infoTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  infoSubtitle: { fontSize: 14, color: "#555" },

  vanBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginRight: 10,
  },
  vanBtnSelected: { backgroundColor: "#afd826" },
  vanBtnText: { fontWeight: "bold", color: "#000" },

  mapContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: { flex: 1 },
});
