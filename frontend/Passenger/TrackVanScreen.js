// TrackVanScreen.js
import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function TrackVanScreen() {
  // Example van location (you can later make this dynamic)
  const [vanLocation] = useState({
    latitude: 24.8607, // Karachi
    longitude: 67.0011,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: vanLocation.latitude,
          longitude: vanLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={vanLocation}
          title="Your Van"
          description="Muhammad Ali - VAN-001"
          pinColor="#afd826"
        />
      </MapView>
      <View style={styles.overlay}>
        <Text style={styles.info}>Tracking your van...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  info: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    fontWeight: "600",
  },
});
