import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    LayoutAnimation,
    Modal,
    Platform,
} from "react-native";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AttendanceScreen() {
    const [status, setStatus] = useState("Pending");
    const [deadlinePassed, setDeadlinePassed] = useState(false);
    const [loading, setLoading] = useState(true);

    const [departureTime, setDepartureTime] = useState(null);
    const [returnTime, setReturnTime] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [showPicker, setShowPicker] = useState({ type: null, visible: false });

    useEffect(() => {
        const fetchLocationAndCheckTime = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setLoading(false);
                    return;
                }
                await Location.getCurrentPositionAsync({});
                const now = new Date();
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
        if (status === "No - Not Traveling") return "#ef4444";
        if (status === "Deadline Passed") return "#6b7280";
        return "#f59e0b";
    };

    const formatTime = (date) => {
        if (!date) return "Not Selected";
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#afd826" />
                <Text style={{ fontSize: 16, marginTop: 10, color: "#555" }}>
                    Preparing your check-in...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.subText}>Will you travel tomorrow? (Respond before 12:00 AM)</Text>

            {/* Yes Button */}
            <TouchableOpacity
                activeOpacity={0.9}
                style={[
                    styles.actionBtn,
                    { backgroundColor: "#afd826" },
                    status === "Yes - Traveling" && { opacity: 0.7 },
                ]}
                onPress={() => handleResponse("Yes - Traveling")}
                disabled={deadlinePassed}
            >
                <Text style={styles.actionText}>Yes, I will travel</Text>
            </TouchableOpacity>

            {/* No Button */}
            <TouchableOpacity
                activeOpacity={0.9}
                style={[
                    styles.actionBtn,
                    { backgroundColor: "#ef4444" },
                    status === "No - Not Traveling" && { opacity: 0.7 },
                ]}
                onPress={() => handleResponse("No - Not Traveling")}
                disabled={deadlinePassed}
            >
                <Text style={styles.actionText}>No, I won’t travel</Text>
            </TouchableOpacity>

            {/* Time Pickers if Yes */}
            {status === "Yes - Traveling" && !deadlinePassed && (
                <View style={{ marginTop: 25, width: "100%" }}>
                    <Text style={styles.label}>Select your travel times:</Text>

                    <TouchableOpacity
                        style={styles.inputBtn}
                        onPress={() => setShowPicker({ type: "departure", visible: true })}
                    >
                        <Text style={styles.inputText}>Departure: {formatTime(departureTime)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.inputBtn}
                        onPress={() => setShowPicker({ type: "return", visible: true })}
                    >
                        <Text style={styles.inputText}>Return: {formatTime(returnTime)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.saveBtn]}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={{ color: "white", fontWeight: "600" }}>Save Times</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Status simple tag */}
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {status}
            </Text>

            {status === "Pending Response" && !deadlinePassed && (
                <Text style={styles.alertText}>
                    ⚠ If no response till 12:00 AM → Marked as Not Traveling
                </Text>
            )}
            {deadlinePassed && (
                <Text style={styles.alertText}>
                    ❌ Deadline passed! Auto-marked as "Not Traveling"
                </Text>
            )}

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Confirm Travel Times</Text>
                        <Text style={styles.modalText}>📍 Departure: {formatTime(departureTime)}</Text>
                        <Text style={styles.modalText}>🏠 Return: {formatTime(returnTime)}</Text>

                        <View style={{ flexDirection: "row", marginTop: 20 }}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: "#ef4444" }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={{ color: "white", fontWeight: "600" }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: "#afd826" }]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setTimeout(() => {
                                        alert("✅ Your travel times are saved!");
                                    }, 200);
                                }}
                            >
                                <Text style={{ color: "white", fontWeight: "600" }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Time Picker */}
            {showPicker.visible && (
                <DateTimePicker
                    value={new Date()}
                    mode="time"
                    is24Hour={false}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedTime) => {
                        setShowPicker({ type: null, visible: false });
                        if (selectedTime) {
                            if (showPicker.type === "departure") setDepartureTime(selectedTime);
                            if (showPicker.type === "return") setReturnTime(selectedTime);
                        }
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    subText: { fontSize: 16, marginBottom: 25, color: "#444", fontWeight: "500" },

    actionBtn: {
        marginTop: 12,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionText: { color: "#fff", fontSize: 16, fontWeight: "600" },

    label: { fontSize: 16, fontWeight: "600", marginBottom: 12, color: "#111" },
    inputBtn: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 14,
        marginBottom: 12,
        backgroundColor: "#f9f9f9",
    },
    inputText: { fontSize: 16, color: "#333" },
    saveBtn: {
        marginTop: 10,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#111",
        alignItems: "center",
    },

    statusText: {
        marginTop: 30,
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
    },
    alertText: { marginTop: 10, fontSize: 14, color: "#ef4444", textAlign: "center" },

    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalBox: {
        width: "85%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        alignItems: "center",
        elevation: 6,
    },
    modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#111" },
    modalText: { fontSize: 16, color: "#333", marginVertical: 5 },
    modalBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 8,
        alignItems: "center",
    },
});