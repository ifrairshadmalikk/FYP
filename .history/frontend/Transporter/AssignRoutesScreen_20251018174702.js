import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function AssignRoutesScreen() {
    const [selectedTab, setSelectedTab] = useState("routes");
    const [selectedShift, setSelectedShift] = useState("8:00 - 10:00 AM");
    const [shiftOpen, setShiftOpen] = useState(false);
    const [openPassenger, setOpenPassenger] = useState(null);
    const [assignments, setAssignments] = useState({});

    const drivers = [
        { id: "1", name: "Ahmed Khan", vehicle: "Toyota Hiace", rating: "4.8", completedRides: 127 },
        { id: "2", name: "Hassan Ali", vehicle: "Suzuki Every", rating: "4.6", completedRides: 89 },
        { id: "3", name: "Ali Raza", vehicle: "Suzuki Bolan", rating: "4.9", completedRides: 156 },
    ];

    const passengers = [
        { id: "p1", name: "Ahmad Ali", area: "F-8 Markaz", university: "LUMS University", pickupTime: "8:15 AM" },
        { id: "p2", name: "Faisal Khan", area: "DHA Phase 5", university: "UCP University", pickupTime: "8:30 AM" },
        { id: "p3", name: "Hassan Sheikh", area: "Jinnah Super", university: "FAST University", pickupTime: "8:45 AM" },
        { id: "p4", name: "Sara Ahmed", area: "Bahria Town", university: "PU University", pickupTime: "9:00 AM" },
    ];

    const shifts = ["8:00 - 10:00 AM", "10:00 - 12:00 PM", "1:00 - 3:00 PM", "3:00 - 5:00 PM"];

    const unassignedPassengers = passengers.filter((p) => !assignments[p.id]);

    const getAssignedPassengersCount = (driverId) => {
        return Object.values(assignments).filter(id => id === driverId).length;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Route Assignment</Text>
                    <Text style={styles.headerSubtitle}>Manage driver-passenger assignments</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{drivers.length}</Text>
                        <Text style={styles.statLabel}>Drivers</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{passengers.length}</Text>
                        <Text style={styles.statLabel}>Passengers</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{unassignedPassengers.length}</Text>
                        <Text style={styles.statLabel}>Unassigned</Text>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                        console.log("All Assignments Saved:", assignments);
                        alert("🎉 All assignments saved successfully!");
                    }}
                >
                    <Ionicons name="save-outline" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Save All Assignments</Text>
                </TouchableOpacity>

                {/* Shift Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Shift</Text>
                    <View style={styles.shiftContainer}>
                        {shifts.map((shift, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.shiftOption,
                                    selectedShift === shift && styles.selectedShift
                                ]}
                                onPress={() => setSelectedShift(shift)}
                            >
                                <Ionicons 
                                    name="time-outline" 
                                    size={16} 
                                    color={selectedShift === shift ? "#fff" : "#afd826"} 
                                />
                                <Text style={[
                                    styles.shiftText,
                                    selectedShift === shift && styles.selectedShiftText
                                ]}>
                                    {shift}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === "routes" && styles.activeTab]}
                        onPress={() => setSelectedTab("routes")}
                    >
                        <Ionicons 
                            name="map-outline" 
                            size={18} 
                            color={selectedTab === "routes" ? "#fff" : "#666"} 
                        />
                        <Text style={[
                            styles.tabText,
                            selectedTab === "routes" && styles.activeTabText
                        ]}>
                            Drivers & Routes ({drivers.length})
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === "passengers" && styles.activeTab]}
                        onPress={() => setSelectedTab("passengers")}
                    >
                        <Ionicons 
                            name="people-outline" 
                            size={18} 
                            color={selectedTab === "passengers" ? "#fff" : "#666"} 
                        />
                        <Text style={[
                            styles.tabText,
                            selectedTab === "passengers" && styles.activeTabText
                        ]}>
                            Passengers ({unassignedPassengers.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {selectedTab === "routes" ? (
                    <View style={styles.contentSection}>
                        {drivers.map((driver) => (
                            <View key={driver.id} style={styles.driverCard}>
                                <View style={styles.driverHeader}>
                                    <View style={styles.driverInfo}>
                                        <View style={styles.avatar}>
                                            <Text style={styles.avatarText}>
                                                {driver.name.split(' ').map(n => n[0]).join('')}
                                            </Text>
                                        </View>
                                        <View style={styles.driverDetails}>
                                            <Text style={styles.driverName}>{driver.name}</Text>
                                            <View style={styles.driverMeta}>
                                                <Text style={styles.vehicleText}>{driver.vehicle}</Text>
                                                <View style={styles.ratingContainer}>
                                                    <Ionicons name="star" size={14} color="#FFD700" />
                                                    <Text style={styles.rating}>{driver.rating}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.assignmentBadge}>
                                        <Text style={styles.assignmentCount}>
                                            {getAssignedPassengersCount(driver.id)}
                                        </Text>
                                        <Text style={styles.assignmentLabel}>Assigned</Text>
                                    </View>
                                </View>

                                {/* Assigned Passengers */}
                                <View style={styles.assignedSection}>
                                    <Text style={styles.sectionLabel}>Assigned Passengers:</Text>
                                    {Object.entries(assignments)
                                        .filter(([pid, did]) => did === driver.id)
                                        .map(([pid]) => {
                                            const passenger = passengers.find((p) => p.id === pid);
                                            return (
                                                <View key={pid} style={styles.assignedPassenger}>
                                                    <View style={styles.passengerDot} />
                                                    <View style={styles.passengerInfo}>
                                                        <Text style={styles.passengerName}>
                                                            {passenger?.name}
                                                        </Text>
                                                        <Text style={styles.passengerDetails}>
                                                            {passenger?.area} • {passenger?.pickupTime}
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    
                                    {getAssignedPassengersCount(driver.id) === 0 && (
                                        <Text style={styles.noAssignmentText}>No passengers assigned yet</Text>
                                    )}
                                </View>

                                {/* Route Map Preview */}
                                <View style={styles.mapPreview}>
                                    <Ionicons name="map-outline" size={24} color="#afd826" />
                                    <Text style={styles.mapText}>Route Map Preview</Text>
                                    <Text style={styles.mapSubtext}>View optimized route for {selectedShift}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.contentSection}>
                        {unassignedPassengers.map((passenger) => (
                            <View key={passenger.id} style={styles.passengerCard}>
                                <View style={styles.passengerHeader}>
                                    <View style={styles.passengerInfo}>
                                        <View style={styles.passengerAvatar}>
                                            <Text style={styles.passengerAvatarText}>
                                                {passenger.name.split(' ').map(n => n[0]).join('')}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.passengerName}>{passenger.name}</Text>
                                            <Text style={styles.passengerLocation}>{passenger.area}</Text>
                                            <Text style={styles.passengerUniversity}>{passenger.university}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.timeBadge}>
                                        <Ionicons name="time-outline" size={12} color="#fff" />
                                        <Text style={styles.timeText}>{passenger.pickupTime}</Text>
                                    </View>
                                </View>

                                {/* Assign Driver */}
                                <TouchableOpacity
                                    style={styles.assignButton}
                                    onPress={() => setOpenPassenger(openPassenger === passenger.id ? null : passenger.id)}
                                >
                                    <Ionicons name="car-sport-outline" size={18} color="#afd826" />
                                    <Text style={styles.assignButtonText}>Assign to Driver</Text>
                                    <Ionicons 
                                        name={openPassenger === passenger.id ? "chevron-up" : "chevron-down"} 
                                        size={16} 
                                        color="#afd826" 
                                    />
                                </TouchableOpacity>

                                {/* Drivers List */}
                                {openPassenger === passenger.id && (
                                    <View style={styles.driversList}>
                                        <Text style={styles.driversListTitle}>Available Drivers</Text>
                                        {drivers.map((driver) => (
                                            <TouchableOpacity
                                                key={driver.id}
                                                style={[
                                                    styles.driverOption,
                                                    assignments[passenger.id] === driver.id && styles.selectedDriverOption
                                                ]}
                                                onPress={() => {
                                                    setAssignments({ ...assignments, [passenger.id]: driver.id });
                                                    setOpenPassenger(null);
                                                }}
                                            >
                                                <View style={styles.driverOptionInfo}>
                                                    <Ionicons 
                                                        name={assignments[passenger.id] === driver.id ? "checkmark-circle" : "ellipse-outline"} 
                                                        size={20} 
                                                        color={assignments[passenger.id] === driver.id ? "#afd826" : "#ccc"} 
                                                    />
                                                    <View style={styles.driverOptionDetails}>
                                                        <Text style={styles.driverOptionName}>{driver.name}</Text>
                                                        <Text style={styles.driverOptionVehicle}>{driver.vehicle}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.driverStats}>
                                                    <Text style={styles.driverRating}>⭐ {driver.rating}</Text>
                                                    <Text style={styles.driverRides}>{driver.completedRides} rides</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    header: {
        backgroundColor: "#afd826",
        paddingHorizontal: 20,
        paddingVertical: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.9)",
    },
    container: {
        padding: 16,
        paddingBottom: 30,
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "700",
        color: "#afd826",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
    },
    statDivider: {
        width: 1,
        backgroundColor: "#E5E7EB",
        marginHorizontal: 8,
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#afd826",
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 20,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2D3748",
        marginBottom: 12,
    },
    shiftContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    shiftOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#afd826",
        backgroundColor: "#fff",
        gap: 6,
        minWidth: width * 0.4,
    },
    selectedShift: {
        backgroundColor: "#afd826",
    },
    shiftText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#afd826",
    },
    selectedShiftText: {
        color: "#fff",
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },
    activeTab: {
        backgroundColor: "#afd826",
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
    },
    activeTabText: {
        color: "#fff",
    },
    contentSection: {
        gap: 12,
    },
    driverCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    driverHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    driverInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#E8F4E8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#afd826",
    },
    driverDetails: {
        flex: 1,
    },
    driverName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2D3748",
        marginBottom: 2,
    },
    driverMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    vehicleText: {
        fontSize: 14,
        color: "#666",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    rating: {
        fontSize: 12,
        fontWeight: "600",
        color: "#2D3748",
    },
    assignmentBadge: {
        alignItems: "center",
        backgroundColor: "#F0F8E0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    assignmentCount: {
        fontSize: 16,
        fontWeight: "700",
        color: "#afd826",
    },
    assignmentLabel: {
        fontSize: 10,
        color: "#666",
        fontWeight: "500",
    },
    assignedSection: {
        marginBottom: 16,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4A5568",
        marginBottom: 8,
    },
    assignedPassenger: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#F7FAFC",
    },
    passengerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#afd826",
        marginRight: 12,
    },
    passengerInfo: {
        flex: 1,
    },
    passengerName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2D3748",
        marginBottom: 2,
    },
    passengerDetails: {
        fontSize: 12,
        color: "#718096",
    },
    noAssignmentText: {
        fontSize: 14,
        color: "#A0AEC0",
        fontStyle: "italic",
        textAlign: "center",
        paddingVertical: 12,
    },
    mapPreview: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#F7FAFC",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        gap: 8,
    },
    mapText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2D3748",
    },
    mapSubtext: {
        fontSize: 12,
        color: "#718096",
        marginLeft: 'auto',
    },
    passengerCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    passengerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    passengerInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    passengerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#E8F4E8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    passengerAvatarText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#afd826",
    },
    passengerName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2D3748",
        marginBottom: 2,
    },
    passengerLocation: {
        fontSize: 14,
        color: "#666",
        marginBottom: 2,
    },
    passengerUniversity: {
        fontSize: 12,
        color: "#718096",
    },
    timeBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#afd826",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    timeText: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "500",
    },
    assignButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 10,
        backgroundColor: "#F7FAFC",
    },
    assignButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2D3748",
        marginLeft: 8,
        flex: 1,
    },
    driversList: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        overflow: "hidden",
    },
    driversListTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4A5568",
        padding: 12,
        backgroundColor: "#F7FAFC",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    driverOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F7FAFC",
    },
    selectedDriverOption: {
        backgroundColor: "#F0F8E0",
    },
    driverOptionInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
    },
    driverOptionDetails: {
        flex: 1,
    },
    driverOptionName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2D3748",
        marginBottom: 2,
    },
    driverOptionVehicle: {
        fontSize: 12,
        color: "#718096",
    },
    driverStats: {
        alignItems: "flex-end",
    },
    driverRating: {
        fontSize: 12,
        fontWeight: "600",
        color: "#2D3748",
        marginBottom: 2,
    },
    driverRides: {
        fontSize: 10,
        color: "#718096",
    },
});