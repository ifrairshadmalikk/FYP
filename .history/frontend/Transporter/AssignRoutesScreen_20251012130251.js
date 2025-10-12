import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AssignRoutesScreen() {
    const [selectedTab, setSelectedTab] = useState("routes");
    const [selectedShift, setSelectedShift] = useState("8:00 - 10:00 AM");
    const [shiftOpen, setShiftOpen] = useState(false);
    const [openPassenger, setOpenPassenger] = useState(null);
    const [assignments, setAssignments] = useState({}); // passengerId -> driverId

    const drivers = [
        { id: "1", name: "Ahmed Khan", vehicle: "Toyota Hiace" },
        { id: "2", name: "Hassan Ali", vehicle: "Suzuki Every" },
        { id: "3", name: "Ali Raza", vehicle: "Suzuki Bolan" },
    ];

    const passengers = [
        { id: "p1", name: "Ahmad Ali", area: "F-8 Markaz", university: "LUMS University" },
        { id: "p2", name: "Faisal Khan", area: "DHA", university: "UCP University" },
        { id: "p3", name: "Hassan Sheikh", area: "Jinnah Super", university: "FAST University" },
    ];

    const shifts = ["8:00 - 10:00 AM", "10:00 - 12:00 PM", "1:00 - 3:00 PM"];

    // Filter passengers who are NOT assigned
    const unassignedPassengers = passengers.filter((p) => !assignments[p.id]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />

            {/* Header */}
            <View style={styles.headerBar}>
                <Text style={styles.headerTitle}>Route Assignment</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.subHeader}>Assign passengers to drivers</Text>

                {/* Save All Button */}
                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={() => {
                        console.log("All Assignments Saved:", assignments);
                        alert("✅ All assignments saved successfully!");
                    }}
                >
                    <Text style={styles.saveBtnText}>💾 Save All Assignments</Text>
                </TouchableOpacity>

                {/* Shift Dropdown */}
                <View style={styles.dropdownBox}>
                    <TouchableOpacity
                        style={styles.dropdownHeader}
                        onPress={() => setShiftOpen(!shiftOpen)}
                    >
                        <Ionicons name="time-outline" size={18} color="#333" />
                        <Text style={{ marginLeft: 6 }}>{selectedShift}</Text>
                        <Ionicons
                            name={shiftOpen ? "chevron-up" : "chevron-down"}
                            size={18}
                            color="#333"
                            style={{ marginLeft: "auto" }}
                        />
                    </TouchableOpacity>

                    {shiftOpen && (
                        <View style={styles.dropdownList}>
                            {shifts.map((shift, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setSelectedShift(shift);
                                        setShiftOpen(false);
                                    }}
                                >
                                    <Text>{shift}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === "passengers" && styles.activeTab]}
                        onPress={() => setSelectedTab("passengers")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === "passengers" && styles.activeTabText,
                            ]}
                        >
                            Passengers ({unassignedPassengers.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === "routes" && styles.activeTab]}
                        onPress={() => setSelectedTab("routes")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === "routes" && styles.activeTabText,
                            ]}
                        >
                            Routes ({drivers.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Routes / Drivers List */}
                {selectedTab === "routes"
                    ? drivers.map((driver) => (
                        <View key={driver.id} style={styles.card}>
                            <Text style={styles.driverName}>{driver.name}</Text>
                            <Text style={styles.smallText}>{driver.vehicle}</Text>
                            <Text style={styles.sectionLabel}>Assigned:</Text>

                            {Object.entries(assignments)
                                .filter(([pid, did]) => did === driver.id)
                                .map(([pid]) => {
                                    const passenger = passengers.find((p) => p.id === pid);
                                    return (
                                        <View key={pid} style={styles.assignedBox}>
                                            <Text style={styles.assignedText}>
                                                {passenger?.name} - {passenger?.area} ({passenger?.university})
                                            </Text>
                                        </View>
                                    );
                                })}

                            {/* Map Placeholder */}
                            <View style={styles.mapBox}>
                                <Ionicons name="map-outline" size={24} color="#555" />
                                <Text style={{ color: "#555", marginLeft: 6 }}>
                                    Route map preview
                                </Text>
                            </View>
                        </View>
                    ))
                    : unassignedPassengers.map((p) => (
                        <View key={p.id} style={styles.card}>
                            <Text style={styles.passengerName}>{p.name}</Text>
                            <Text style={styles.smallText}>{p.area}</Text>
                            <Text style={styles.smallText}>{p.university}</Text>

                            {/* Dropdown simulation */}
                            <TouchableOpacity
                                style={styles.assignBtn}
                                onPress={() =>
                                    setOpenPassenger(openPassenger === p.id ? null : p.id)
                                }
                            >
                                <Text style={styles.assignText}>
                                    {"Assign to driver ▼"}
                                </Text>
                            </TouchableOpacity>

                            {/* Dropdown list */}
                            {openPassenger === p.id && (
                                <View style={styles.dropdownList}>
                                    {drivers.map((d) => (
                                        <TouchableOpacity
                                            key={d.id}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setAssignments({ ...assignments, [p.id]: d.id });
                                                setOpenPassenger(null);
                                            }}
                                        >
                                            <Text>
                                                {assignments[p.id] === d.id ? "✅ " : "⬜ "} {d.name} -{" "}
                                                {d.vehicle}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, flexGrow: 1 },
    headerBar: {
        backgroundColor: "#afd826",
        paddingVertical: 14,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        elevation: 4,
    },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
    subHeader: { fontSize: 14, color: "gray", marginBottom: 12 },

    saveBtn: {
        backgroundColor: "#afd826",
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        alignItems: "center",
    },
    saveBtnText: { color: "#000", fontWeight: "bold", fontSize: 16 },

    dropdownBox: { marginBottom: 12 },
    dropdownHeader: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: 4,
        overflow: "hidden",
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    tabs: { flexDirection: "row", marginBottom: 12, borderRadius: 8 },
    tab: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: "#afd826",
        alignItems: "center",
        borderRadius: 8,
        marginHorizontal: 4,
    },
    activeTab: { backgroundColor: "#afd826" },
    tabText: { color: "#555", fontWeight: "600" },
    activeTabText: { color: "#000" },

    card: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 12,
        marginBottom: 14,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#eee",
    },
    driverName: { fontSize: 16, fontWeight: "bold", color: "#333" },
    passengerName: { fontSize: 15, fontWeight: "600", color: "#333" },
    smallText: { color: "#666", marginTop: 2, fontSize: 13 },

    assignBtn: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        alignItems: "center",
    },
    assignText: { color: "#555", fontWeight: "600" },

    sectionLabel: { marginTop: 10, fontWeight: "600", color: "#444" },
    assignedBox: {
        marginTop: 6,
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#f0f8e0",
    },
    assignedText: { fontSize: 13, color: "#333" },

    mapBox: {
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "#fafafa",
    },
});
