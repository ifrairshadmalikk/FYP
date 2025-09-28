import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

export default function VanTrackingScreen({ navigation }) {
  const [vanLocations, setVanLocations] = useState([
    { id: 1, name: "V1", latitude: 24.8607, longitude: 67.0011 },
    { id: 2, name: "V2", latitude: 24.861, longitude: 67.0025 },
    { id: 3, name: "V3", latitude: 24.862, longitude: 67.003 },
  ]);
  const [selectedVan, setSelectedVan] = useState(null);
  const mapRef = useRef();

  // Fake real-time update
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
        <Text style={styles.infoTitle}>Track Vans in Real-Time</Text>
        <Text style={styles.infoSubtitle}>
          Select a van below to focus on its live location on the map.
        </Text>

        {/* Van Selector */}
        <FlatList
          data={vanLocations}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 14 }}
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
                  selectedVan?.id === item.id && styles.vanBtnTextSelected,
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
              pinColor={selectedVan?.id === van.id ? "#28a745" : "#f39c12"}
            />
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f9fa" },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#afd826",
    paddingHorizontal: 15,
    height: 60,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },

  infoPanel: {
    backgroundColor: "#fff",
    padding: 18,
    margin: 15,
    borderRadius: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  infoTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  infoSubtitle: { fontSize: 14, color: "#666", marginTop: 6, lineHeight: 20 },

  vanBtn: {
    paddingVertical: 9,
    paddingHorizontal: 20,
    backgroundColor: "#f1f3f5",
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  vanBtnSelected: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
    shadowColor: "#28a745",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  vanBtnText: { fontSize: 14, fontWeight: "600", color: "#333" },
  vanBtnTextSelected: { color: "#fff" },

  mapContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  map: { flex: 1 },
});
