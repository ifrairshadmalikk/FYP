import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get("window");

export default function PassengerHomeScreen() {
    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 24.8607,
                    longitude: 67.0011,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                <Marker
                    coordinate={{ latitude: 24.8607, longitude: 67.0011 }}
                    title="My Location"
                    description="Pickup Point"
                />
            </MapView>

            {/* Floating Info Card */}
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Next Ride</Text>
                <Text style={styles.infoText}>Pickup: Gulshan</Text>
                <Text style={styles.infoText}>Drop: University</Text>
                <Text style={styles.infoText}>Time: 08:30 AM</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    infoCard: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
        color: "#afd826",
    },
    infoText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 2,
    },
});