import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Notifications from "../Passenger/Notifications";
import Safety from "../Passenger/Safety";

export default function PassengerDashboard() {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>🚖 Passenger Dashboard</Text>

            <View style={styles.card}>
                <Text style={styles.title}>Daily Alerts</Text>
                <Text>- Do you plan to travel tomorrow? (Yes/No)</Text>
                <Text>- Arrival alert: 10 min before van</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Active Route</Text>
                <Text>Driver: Ali Khan</Text>
                <Text>Van No: LEA-1234</Text>
                <Text>ETA: 7:45 AM</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Payment Status</Text>
                <Text>Status: Pending (Due 28 Feb)</Text>
            </View>

            {/* Notifications Component */}
            <Notifications />

            {/* Safety Component */}
            <Safety />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    heading: { fontSize: 20, fontWeight: "700", marginBottom: 15, color: "#111" },
    card: {
        backgroundColor: "#f3f4f6",
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
    },
    title: { fontWeight: "600", marginBottom: 5, fontSize: 16 },
});
