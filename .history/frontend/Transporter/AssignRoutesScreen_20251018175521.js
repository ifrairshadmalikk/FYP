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

export default function AssignRoutesScreen({ navigation }) {
    const [selectedTab, setSelectedTab] = useState("drivers");
    const [selectedShift, setSelectedShift] = useState("morning");
    const [assignments, setAssignments] = useState({});

    const drivers = [
        { 
            id: "1", 
            name: "Ahmed Khan", 
            vehicle: "Toyota Hiace", 
            capacity: 12,
            currentLoad: 0
        },
        { 
            id: "2", 
            name: "Hassan Ali", 
            vehicle: "Suzuki Every", 
            capacity: 8,
            currentLoad: 0
        },
        { 
            id: "3", 
            name: "Ali Raza", 
            vehicle: "Suzuki Bolan", 
            capacity: 6,
            currentLoad: 0
        },
    ];

    const passengers = [
        { 
            id: "p1", 
            name: "Ahmad Ali", 
            area: "F-8 Markaz", 
            university: "LUMS",
            pickupTime: "8:15 AM"
        },
        { 
            id: "p2", 
            name: "Faisal Khan", 
            area: "DHA Phase 5", 
            university: "UCP",
            pickupTime: "8:30 AM"
        },
        { 
            id: "p3", 
            name: "Hassan Sheikh", 
            area: "Jinnah Super", 
            university: "FAST",
            pickupTime: "8:45 AM"
        },
    ];

    const shifts = [
        { id: "morning", name: " Morning", time: "8:00 - 10:00 AM" },
        { id: "afternoon", name: "☀️ Afternoon", time: "1:00 - 3:00 PM" },
        { id: "evening", name: "🌆 Evening", time: "4:00 - 6:00 PM" },
    ];

    // Calculate assignments count for each driver
    const getDriverAssignments = (driverId) => {
        return Object.values(assignments).filter(id => id === driverId).length;
    };

    // Get unassigned passengers
    const unassignedPassengers = passengers.filter(p => !assignments[p.id]);

    // Quick assign function
    const quickAssign = (passengerId, driverId) => {
        setAssignments(prev => ({
            ...prev,
            [passengerId]: driverId
        }));
    };

    // Remove assignment
    const removeAssignment = (passengerId) => {
        const newAssignments = { ...assignments };
        delete newAssignments[passengerId];
        setAssignments(newAssignments);
    };

    // Auto-assign all unassigned
    const autoAssignAll = () => {
        const newAssignments = { ...assignments };
        let availableDrivers = [...drivers];
        
        unassignedPassengers.forEach(passenger => {
            if (availableDrivers.length > 0) {
                // Find driver with least assignments
                const driver = availableDrivers.reduce((prev, current) => 
                    getDriverAssignments(prev.id) < getDriverAssignments(current.id) ? prev : current
                );
                newAssignments[passenger.id] = driver.id;
            }
        });
        
        setAssignments(newAssignments);
        alert("🚀 All passengers auto-assigned!");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />

            {/* Header with Back and Save */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.navigate('TransporterDashboard')}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Dashboard</Text>
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Assign Routes</Text>
                
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={() => {
                        console.log("Assignments saved:", assignments);
                        alert("✅ Routes saved successfully!");
                    }}
                >
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Quick Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{passengers.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{unassignedPassengers.length}</Text>
                        <Text style={styles.statLabel}>Unassigned</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {passengers.length - unassignedPassengers.length}
                        </Text>
                        <Text style={styles.statLabel}>Assigned</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity 
                        style={styles.autoAssignButton}
                        onPress={autoAssignAll}
                    >
                        <Ionicons name="flash" size={18} color="#fff" />
                        <Text style={styles.autoAssignText}>Auto Assign All</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.clearAllButton}
                        onPress={() => {
                            setAssignments({});
                            alert("🗑️ All assignments cleared!");
                        }}
                    >
                        <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
                        <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                {/* Shift Selection */}
                <View style={styles.shiftSection}>
                    <Text style={styles.sectionTitle}>Select Shift</Text>
                    <View style={styles.shiftButtons}>
                        {shifts.map(shift => (
                            <TouchableOpacity
                                key={shift.id}
                                style={[
                                    styles.shiftButton,
                                    selectedShift === shift.id && styles.selectedShift
                                ]}
                                onPress={() => setSelectedShift(shift.id)}
                            >
                                <Text style={[
                                    styles.shiftName,
                                    selectedShift === shift.id && styles.selectedShiftText
                                ]}>
                                    {shift.name}
                                </Text>
                                <Text style={[
                                    styles.shiftTime,
                                    selectedShift === shift.id && styles.selectedShiftText
                                ]}>
                                    {shift.time}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Main Content Tabs */}
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === "drivers" && styles.activeTab]}
                        onPress={() => setSelectedTab("drivers")}
                    >
                        <Ionicons 
                            name="car-sport" 
                            size={20} 
                            color={selectedTab === "drivers" ? "#fff" : "#666"} 
                        />
                        <Text style={[
                            styles.tabText,
                            selectedTab === "drivers" && styles.activeTabText
                        ]}>
                            Drivers ({drivers.length})
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === "passengers" && styles.activeTab]}
                        onPress={() => setSelectedTab("passengers")}
                    >
                        <Ionicons 
                            name="people" 
                            size={20} 
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

                {/* Drivers View */}
                {selectedTab === "drivers" && (
                    <View style={styles.content}>
                        {drivers.map(driver => {
                            const assignedCount = getDriverAssignments(driver.id);
                            const assignedPassengers = passengers.filter(p => assignments[p.id] === driver.id);
                            
                            return (
                                <View key={driver.id} style={styles.driverCard}>
                                    <View style={styles.driverHeader}>
                                        <View style={styles.driverInfo}>
                                            <View style={styles.driverAvatar}>
                                                <Ionicons name="person" size={20} color="#afd826" />
                                            </View>
                                            <View>
                                                <Text style={styles.driverName}>{driver.name}</Text>
                                                <Text style={styles.driverVehicle}>{driver.vehicle}</Text>
                                                <Text style={styles.driverCapacity}>
                                                    Capacity: {assignedCount}/{driver.capacity}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={[
                                            styles.capacityBadge,
                                            assignedCount >= driver.capacity && styles.fullBadge
                                        ]}>
                                            <Text style={styles.capacityText}>
                                                {assignedCount}/{driver.capacity}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Assigned Passengers */}
                                    {assignedPassengers.length > 0 ? (
                                        <View style={styles.assignedList}>
                                            {assignedPassengers.map(passenger => (
                                                <View key={passenger.id} style={styles.assignedItem}>
                                                    <View style={styles.passengerInfo}>
                                                        <Text style={styles.passengerName}>
                                                            {passenger.name}
                                                        </Text>
                                                        <Text style={styles.passengerDetails}>
                                                            {passenger.area} • {passenger.pickupTime}
                                                        </Text>
                                                    </View>
                                                    <TouchableOpacity 
                                                        style={styles.removeButton}
                                                        onPress={() => removeAssignment(passenger.id)}
                                                    >
                                                        <Ionicons name="close" size={16} color="#ff6b6b" />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    ) : (
                                        <Text style={styles.noAssignment}>No passengers assigned</Text>
                                    )}

                                    {/* Quick Assign Buttons */}
                                    {unassignedPassengers.length > 0 && assignedCount < driver.capacity && (
                                        <View style={styles.quickAssignSection}>
                                            <Text style={styles.quickAssignTitle}>Quick Assign:</Text>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                <View style={styles.quickAssignButtons}>
                                                    {unassignedPassengers.map(passenger => (
                                                        <TouchableOpacity
                                                            key={passenger.id}
                                                            style={styles.quickAssignBtn}
                                                            onPress={() => quickAssign(passenger.id, driver.id)}
                                                        >
                                                            <Text style={styles.quickAssignText}>
                                                                {passenger.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Passengers View */}
                {selectedTab === "passengers" && (
                    <View style={styles.content}>
                        {unassignedPassengers.map(passenger => (
                            <View key={passenger.id} style={styles.passengerCard}>
                                <View style={styles.passengerHeader}>
                                    <View style={styles.passengerAvatar}>
                                        <Ionicons name="person-circle" size={24} color="#afd826" />
                                    </View>
                                    <View style={styles.passengerInfo}>
                                        <Text style={styles.passengerName}>{passenger.name}</Text>
                                        <Text style={styles.passengerLocation}>{passenger.area}</Text>
                                        <Text style={styles.passengerUniversity}>{passenger.university}</Text>
                                        <Text style={styles.pickupTime}>🕒 {passenger.pickupTime}</Text>
                                    </View>
                                </View>

                                {/* Driver Selection */}
                                <View style={styles.driverSelection}>
                                    <Text style={styles.assignTitle}>Assign to:</Text>
                                    <View style={styles.driverOptions}>
                                        {drivers.map(driver => {
                                            const assignedCount = getDriverAssignments(driver.id);
                                            const isAvailable = assignedCount < driver.capacity;
                                            
                                            return (
                                                <TouchableOpacity
                                                    key={driver.id}
                                                    style={[
                                                        styles.driverOption,
                                                        !isAvailable && styles.driverOptionDisabled
                                                    ]}
                                                    onPress={() => isAvailable && quickAssign(passenger.id, driver.id)}
                                                    disabled={!isAvailable}
                                                >
                                                    <Text style={styles.driverOptionText}>
                                                        {driver.name} ({assignedCount}/{driver.capacity})
                                                    </Text>
                                                    {!isAvailable && (
                                                        <Text style={styles.fullText}>FULL</Text>
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
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
        backgroundColor: "#f8f9fa",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#afd826",
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 4,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    backText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 4,
        fontSize: 14,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 8,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#afd826',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    autoAssignButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#afd826',
        padding: 12,
        borderRadius: 10,
        gap: 8,
    },
    autoAssignText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    clearAllButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ff6b6b',
        gap: 6,
    },
    clearAllText: {
        color: '#ff6b6b',
        fontWeight: '600',
        fontSize: 14,
    },
    shiftSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    shiftButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    shiftButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    selectedShift: {
        backgroundColor: '#afd826',
        borderColor: '#afd826',
    },
    shiftName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    shiftTime: {
        fontSize: 12,
        color: '#666',
    },
    selectedShiftText: {
        color: '#fff',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 4,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 6,
    },
    activeTab: {
        backgroundColor: '#afd826',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
    },
    content: {
        gap: 12,
    },
    driverCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    driverHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    driverAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f8e0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    driverName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    driverVehicle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    driverCapacity: {
        fontSize: 12,
        color: '#888',
    },
    capacityBadge: {
        backgroundColor: '#f0f8e0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    fullBadge: {
        backgroundColor: '#ffebee',
    },
    capacityText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#afd826',
    },
    assignedList: {
        gap: 8,
        marginBottom: 12,
    },
    assignedItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    passengerInfo: {
        flex: 1,
    },
    passengerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    passengerDetails: {
        fontSize: 12,
        color: '#666',
    },
    removeButton: {
        padding: 4,
    },
    noAssignment: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        padding: 12,
    },
    quickAssignSection: {
        marginTop: 8,
    },
    quickAssignTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    quickAssignButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    quickAssignBtn: {
        backgroundColor: '#afd826',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    quickAssignText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    passengerCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    passengerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    passengerAvatar: {
        // Icon handles the styling
    },
    passengerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    passengerLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    passengerUniversity: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    pickupTime: {
        fontSize: 12,
        color: '#afd826',
        fontWeight: '500',
    },
    driverSelection: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    assignTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    driverOptions: {
        gap: 8,
    },
    driverOption: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    driverOptionDisabled: {
        backgroundColor: '#f5f5f5',
        opacity: 0.6,
    },
    driverOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    fullText: {
        fontSize: 10,
        color: '#ff6b6b',
        fontWeight: '600',
        marginTop: 4,
    },
});