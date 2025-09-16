import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as Location from "expo-location";

export default function AttendanceScreen() {
    const [status, setStatus] = useState("Pending");
    const [deadlinePassed, setDeadlinePassed] = useState(false);
    const [loading, setLoading] = useState(true);

    // ⏰ Check deadline using device location & time
    useEffect(() => {
        (async () => {
            try {
                // Request location permissions
                let { status: locStatus } = await Location.requestForegroundPermissionsAsync();
                if (locStatus !== "granted") {
                    Alert.alert("Permission Denied", "Location access is needed for proper timing.");
                    setLoading(false);
                    return;
                }

                setLoading(false);

                // Function to check deadline
                const checkDeadline = () => {
                    const now = new Date();
                    const deadline = new Date();
                    deadline.setHours(12, 0, 0, 0); // 12 PM today

                    if (now > deadline && status === "Pending") {
                        setStatus("No - Not Traveling");
                        setDeadlinePassed(true);
                    }
                };

                // Initial check
                checkDeadline();

                // Check every minute
                const interval = setInterval(checkDeadline, 60000);
                return () => clearInterval(interval);
            } catch (error) {
                console.error("Error fetching location:", error);
            }
        })();
    }, [status]);

    const handleResponse = (response) => {
        if (deadlinePassed) return; // Prevent after deadline
        setStatus(response);
    };

    // Status color helper
    const getStatusColor = () => {
        if (status === "Yes - Traveling") return "#afd826"; // App primary
        if (status === "No - Not Traveling") return "#f87171"; // Red
        return "#f59e0b"; // Pending (orange)
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ fontSize: 18, color: "#555" }}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>🗓 Travel Check-in</Text>
            <Text style={styles.subText}>Will you travel tomorrow? (Respond before 12:00 PM)</Text>

            {/* Buttons */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#afd826" }]}
                onPress={() => handleResponse("Yes - Traveling")}
                disabled={deadlinePassed || status === "Yes - Traveling"}
            >
                <Text style={styles.btnText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#f87171" }]}
                onPress={() => handleResponse("No - Not Traveling")}
                disabled={deadlinePassed || status === "No - Not Traveling"}
            >
                <Text style={styles.btnText}>No</Text>
            </TouchableOpacity>

            {/* Current Status */}
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
                Current Status: {status}
            </Text>

            {/* Alerts */}
            {status === "Pending" && !deadlinePassed && (
                <Text style={styles.alertText}>
                    ⚠ If no response till 12:00 PM → Marked as Not Traveling
                </Text>
            )}
            {deadlinePassed && (
                <Text style={styles.alertText}>
                    ❌ Deadline passed! Auto-marked as "Not Traveling"
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    heading: { fontSize: 22, fontWeight: "700", marginBottom: 8, color: "#111" },
    subText: { fontSize: 16, marginBottom: 20, color: "#555" },
    button: {
        marginTop: 12,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    statusText: { marginTop: 25, fontSize: 18, fontWeight: "600" },
    alertText: { marginTop: 10, fontSize: 14, color: "#f87171" },
});