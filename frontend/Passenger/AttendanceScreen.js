import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, LayoutAnimation, TextInput } from "react-native";
import * as Location from "expo-location";

export default function AttendanceScreen() {
    const [status, setStatus] = useState("Pending");
    const [deadlinePassed, setDeadlinePassed] = useState(false);
    const [loading, setLoading] = useState(true);

    // extra states for time input
    const [departureTime, setDepartureTime] = useState("");
    const [returnTime, setReturnTime] = useState("");

    useEffect(() => {
        const fetchLocationAndCheckTime = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    console.log("Permission denied");
                    setLoading(false);
                    return;
                }

                await Location.getCurrentPositionAsync({});
                const now = new Date();

                // deadline 12:00 AM
                const deadline = new Date();
                deadline.setHours(0, 0, 0, 0);
                deadline.setDate(deadline.getDate() + 1);

                if (now > deadline) {
                    setDeadlinePassed(true);
                    setStatus("Deadline Passed");
                } else {
                    setDeadlinePassed(false);
                    setStatus("Pending Response");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error:", err);
                setLoading(false);
            }
        };
        fetchLocationAndCheckTime();
    }, []);

    const handleResponse = (response) => {
        if (deadlinePassed) return;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setStatus(response);
    };

    const getStatusColor = () => {
        if (status === "Yes - Traveling") return "#afd826";
        if (status === "No - Not Traveling") return "#f87171";
        return "#f59e0b";
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#afd826" />
                <Text style={{ fontSize: 16, marginTop: 10, color: "#555" }}>
                    Preparing your check-in...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>🗓 Travel Check-in</Text>
            <Text style={styles.subText}>Will you travel tomorrow? (Respond before 12:00 AM)</Text>

            {/* Yes Button */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, { backgroundColor: "#afd826" }]}
                onPress={() => handleResponse("Yes - Traveling")}
                disabled={deadlinePassed || status === "Yes - Traveling"}
            >
                <Text style={styles.btnText}>Yes</Text>
            </TouchableOpacity>

            {/* No Button */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, { backgroundColor: "#f87171" }]}
                onPress={() => handleResponse("No - Not Traveling")}
                disabled={deadlinePassed || status === "No - Not Traveling"}
            >
                <Text style={styles.btnText}>No</Text>
            </TouchableOpacity>

            {/* Show Time Inputs if user selected Yes */}
            {status === "Yes - Traveling" && !deadlinePassed && (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>Enter your travel times:</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Departure Time (e.g. 8:00 AM)"
                        value={departureTime}
                        onChangeText={setDepartureTime}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Return Time (e.g. 5:00 PM)"
                        value={returnTime}
                        onChangeText={setReturnTime}
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: "#46eb25ff" }]}
                        onPress={() =>
                            Alert.alert(
                                "Confirm Travel Times",
                                `📍 Departure: ${departureTime || "Not Selected"}\n🏠 Return: ${returnTime || "Not Selected"}`,
                                [
                                    { text: "Cancel", style: "cancel" },
                                    { text: "Confirm", onPress: () => Alert.alert("✅ Saved", "Your travel times are saved!") },
                                ]
                            )
                        }
                    >
                        <Text style={styles.btnText}>Save Times</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Status Card */}
            <View style={[styles.statusCard, { borderColor: getStatusColor() }]}>
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                    Current Status: {status}
                </Text>
            </View>

            {status === "Pending" && !deadlinePassed && (
                <Text style={styles.alertText}>
                    ⚠ If no response till 12:00 AM → Marked as Not Traveling
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
    button: { marginTop: 12, paddingVertical: 14, borderRadius: 10, alignItems: "center" },
    btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    statusCard: {
        marginTop: 25,
        padding: 15,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusText: { fontSize: 18, fontWeight: "600" },
    alertText: { marginTop: 10, fontSize: 14, color: "#f87171" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
    },
});