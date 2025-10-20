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

    // Drivers with their specific route sectors
    const drivers = [
        { 
            id: "1", 
            name: "Ahmed Khan", 
            vehicle: "Toyota Hiace", 
            capacity: 12,
            currentLoad: 0,
            routeSector: "Blue Area Sector",
            routeRadius: ["F-7", "F-8", "Blue Area", "Jinnah Super"],
            color: "#3498DB"
        },
        { 
            id: "2", 
            name: "Hassan Ali", 
            vehicle: "Suzuki Every", 
            capacity: 8,
            currentLoad: 0,
            routeSector: "Gulberg Sector",
            routeRadius: ["Gulberg III", "Gulberg IV", "Main Boulevard", "Kalma Chowk"],
            color: "#27AE60"
        },
        { 
            id: "3", 
            name: "Ali Raza", 
            vehicle: "Suzuki Bolan", 
            capacity: 6,
            currentLoad: 0,
            routeSector: "DHA Sector", 
            routeRadius: ["DHA Phase 1", "DHA Phase 2", "DHA Phase 3", "Y-Block"],
            color: "#E74C3C"
        },
        { 
            id: "4", 
            name: "Usman Malik", 
            vehicle: "Toyota Corolla", 
            capacity: 4,
            currentLoad: 0,
            routeSector: "Johar Town Sector",
            routeRadius: ["Johar Town", "Wapda Town", "Model Town", "Faisal Town"],
            color: "#F39C12"
        },
    ];

    // Passengers grouped by sectors/areas that match driver routes
    const passengers = [
        // Blue Area Sector Passengers
        { 
            id: "p1", 
            name: "Ahmad Ali", 
            area: "F-8 Markaz", 
            sector: "Blue Area Sector",
            university: "Riphah University",
            pickupTime: "8:15 AM",
            driverSector: "Blue Area Sector"
        },
        { 
            id: "p2", 
            name: "Sara Khan", 
            area: "Blue Area", 
            sector: "Blue Area Sector",
            university: "Riphah University", 
            pickupTime: "8:00 AM",
            driverSector: "Blue Area Sector"
        },
        { 
            id: "p3", 
            name: "Bilal Ahmed", 
            area: "Jinnah Super", 
            sector: "Blue Area Sector",
            university: "Riphah University",
            pickupTime: "8:30 AM",
            driverSector: "Blue Area Sector"
        },

        // Gulberg Sector Passengers
        { 
            id: "p4", 
            name: "Faisal Khan", 
            area: "Gulberg III", 
            sector: "Gulberg Sector",
            university: "Riphah University",
            pickupTime: "8:30 AM",
            driverSector: "Gulberg Sector"
        },
        { 
            id: "p5", 
            name: "Hina Shah", 
            area: "Main Boulevard", 
            sector: "Gulberg Sector", 
            university: "Riphah University",
            pickupTime: "8:45 AM",
            driverSector: "Gulberg Sector"
        },
        { 
            id: "p6", 
            name: "Kamran Ali", 
            area: "Kalma Chowk", 
            sector: "Gulberg Sector",
            university: "Riphah University",
            pickupTime: "8:15 AM",
            driverSector: "Gulberg Sector"
        },

        // DHA Sector Passengers
        { 
            id: "p7", 
            name: "Zainab Noor", 
            area: "DHA Phase 2", 
            sector: "DHA Sector",
            university: "Riphah University",
            pickupTime: "8:20 AM",
            driverSector: "DHA Sector"
        },
        { 
            id: "p8", 
            name: "Omar Farooq", 
            area: "Y-Block", 
            sector: "DHA Sector",
            university: "Riphah University",
            pickupTime: "8:35 AM",
            driverSector: "DHA Sector"
        },
        { 
            id: "p9", 
            name: "Fatima Raza", 
            area: "DHA Phase 1", 
            sector: "DHA Sector",
            university: "Riphah University",
            pickupTime: "8:10 AM",
            driverSector: "DHA Sector"
        },

        // Johar Town Sector Passengers
        { 
            id: "p10", 
            name: "Usman Sheikh", 
            area: "Johar Town", 
            sector: "Johar Town Sector",
            university: "Riphah University",
            pickupTime: "8:25 AM",
            driverSector: "Johar Town Sector"
        },
        { 
            id: "p11", 
            name: "Ayesha Malik", 
            area: "Wapda Town", 
            sector: "Johar Town Sector",
            university: "Riphah University",
            pickupTime: "8:40 AM",
            driverSector: "Johar Town Sector"
        },
        { 
            id: "p12", 
            name: "Haris Ahmed", 
            area: "Model Town", 
            sector: "Johar Town Sector",
            university: "Riphah University",
            pickupTime: "8:50 AM",
            driverSector: "Johar Town Sector"
        },
    ];

    const shifts = [
        { id: "morning", name: " Morning", time: "8:00 - 10:00 AM" },
        { id: "afternoon", name: " Afternoon", time: "1:00 - 3:00 PM" },
        { id: "evening", name: "Evening", time: "4:00 - 6:00 PM" },
    ];

    // Common destination for all drivers
    const commonDestination = {
        name: "Riphah University",
        location: "Al-Mizan II, I-14, Islamabad",
        arrivalTime: "9:00 AM"
    };

    // Calculate assignments count for each driver
    const getDriverAssignments = (driverId) => {
        return Object.values(assignments).filter(id => id === driverId).length;
    };

    // Get passengers for specific driver's sector
    const getPassengersForDriverSector = (driverSector) => {
        return passengers.filter(p => p.driverSector === driverSector && !assignments[p.id]);
    };

    // Get assigned passengers for a driver
    const getAssignedPassengersForDriver = (driverId) => {
        return passengers.filter(p => assignments[p.id] === driverId);
    };

    // Get all unassigned passengers
    const unassignedPassengers = passengers.filter(p => !assignments[p.id]);

    // Quick assign function - only allows assignment within same sector
    const quickAssign = (passengerId, driverId) => {
        const passenger = passengers.find(p => p.id === passengerId);
        const driver = drivers.find(d => d.id === driverId);
        
        if (passenger && driver && passenger.driverSector === driver.routeSector) {
            setAssignments(prev => ({
                ...prev,
                [passengerId]: driverId
            }));
        } else {
            alert(`❌ Cannot assign! ${passenger.name} is not in ${driver.routeSector}`);
        }
    };

    // Remove assignment
    const removeAssignment = (passengerId) => {
        const newAssignments = { ...assignments };
        delete newAssignments[passengerId];
        setAssignments(newAssignments);
    };

    // Auto-assign all unassigned within their sectors
    const autoAssignAll = () => {
        const newAssignments = { ...assignments };
        
        drivers.forEach(driver => {
            const sectorPassengers = getPassengersForDriverSector(driver.routeSector);
            sectorPassengers.forEach(passenger => {
                if (getDriverAssignments(driver.id) < driver.capacity) {
                    newAssignments[passenger.id] = driver.id;
                }
            });
        });
        
        setAssignments(newAssignments);
        alert("🚀 All passengers auto-assigned to their sector drivers!");
    };

    // Get sector-wise statistics
    const getSectorStats = () => {
        const stats = {};
        drivers.forEach(driver => {
            const sectorPassengers = passengers.filter(p => p.driverSector === driver.routeSector);
            const assignedInSector = sectorPassengers.filter(p => assignments[p.id]).length;
            stats[driver.routeSector] = {
                total: sectorPassengers.length,
                assigned: assignedInSector,
                unassigned: sectorPassengers.length - assignedInSector,
                color: driver.color
            };
        });
        return stats;
    };

    const sectorStats = getSectorStats();

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
                </TouchableOpacity>
                
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Assign Routes</Text>
                    <Text style={styles.headerSubtitle}>All routes to {commonDestination.name}</Text>
                </View>
                
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
                {/* Common Destination Banner */}
                <View style={styles.destinationBanner}>
                    <Ionicons name="school" size={24} color="#fff" />
                    <View style={styles.destinationInfo}>
                        <Text style={styles.destinationName}>{commonDestination.name}</Text>
                        <Text style={styles.destinationLocation}>{commonDestination.location}</Text>
                        <Text style={styles.arrivalTime}>Arrival: {commonDestination.arrivalTime}</Text>
                    </View>
                </View>

                {/* Sector-wise Statistics */}
                <View style={styles.sectorStats}>
                    <Text style={styles.sectionTitle}>Sector-wise Assignment</Text>
                    <View style={styles.statsGrid}>
                        {Object.entries(sectorStats).map(([sector, stats]) => (
                            <View key={sector} style={[styles.sectorStatCard, { borderLeftColor: stats.color }]}>
                                <Text style={styles.sectorName}>{sector}</Text>
                                <View style={styles.sectorNumbers}>
                                    <Text style={styles.sectorAssigned}>{stats.assigned}</Text>
                                    <Text style={styles.sectorSeparator}>/</Text>
                                    <Text style={styles.sectorTotal}>{stats.total}</Text>
                                </View>
                                <Text style={styles.sectorLabel}>assigned</Text>
                            </View>
                        ))}
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
                            Unassigned ({unassignedPassengers.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Drivers View */}
                {selectedTab === "drivers" && (
                    <View style={styles.content}>
                        {drivers.map(driver => {
                            const assignedCount = getDriverAssignments(driver.id);
                            const assignedPassengers = getAssignedPassengersForDriver(driver.id);
                            const availablePassengers = getPassengersForDriverSector(driver.routeSector);
                            
                            return (
                                <View key={driver.id} style={[styles.driverCard, { borderLeftColor: driver.color }]}>
                                    <View style={styles.driverHeader}>
                                        <View style={styles.driverInfo}>
                                            <View style={[styles.driverAvatar, { backgroundColor: `${driver.color}20` }]}>
                                                <Ionicons name="person" size={20} color={driver.color} />
                                            </View>
                                            <View style={styles.driverDetails}>
                                                <Text style={styles.driverName}>{driver.name}</Text>
                                                <Text style={styles.driverVehicle}>{driver.vehicle}</Text>
                                                <Text style={styles.driverSector}>{driver.routeSector}</Text>
                                                <Text style={styles.routeRadius}>
                                                    📍 {driver.routeRadius.join(", ")}
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
                                        <Text style={styles.noAssignment}>No passengers assigned in {driver.routeSector}</Text>
                                    )}

                                    {/* Quick Assign Buttons */}
                                    {availablePassengers.length > 0 && assignedCount < driver.capacity && (
                                        <View style={styles.quickAssignSection}>
                                            <Text style={styles.quickAssignTitle}>Available in {driver.routeSector}:</Text>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                <View style={styles.quickAssignButtons}>
                                                    {availablePassengers.map(passenger => (
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
                        {unassignedPassengers.map(passenger => {
                            const availableDrivers = drivers.filter(driver => 
                                driver.routeSector === passenger.driverSector && 
                                getDriverAssignments(driver.id) < driver.capacity
                            );
                            
                            return (
                                <View key={passenger.id} style={styles.passengerCard}>
                                    <View style={styles.passengerHeader}>
                                        <View style={styles.passengerAvatar}>
                                            <Ionicons name="person-circle" size={24} color="#afd826" />
                                        </View>
                                        <View style={styles.passengerInfo}>
                                            <Text style={styles.passengerName}>{passenger.name}</Text>
                                            <Text style={styles.passengerLocation}>{passenger.area}</Text>
                                            <Text style={styles.passengerSector}>{passenger.sector}</Text>
                                            <Text style={styles.pickupTime}>🕒 {passenger.pickupTime}</Text>
                                        </View>
                                    </View>

                                    {/* Driver Selection */}
                                    <View style={styles.driverSelection}>
                                        <Text style={styles.assignTitle}>Assign to {passenger.driverSector} Driver:</Text>
                                        <View style={styles.driverOptions}>
                                            {availableDrivers.map(driver => (
                                                <TouchableOpacity
                                                    key={driver.id}
                                                    style={styles.driverOption}
                                                    onPress={() => quickAssign(passenger.id, driver.id)}
                                                >
                                                    <Text style={styles.driverOptionText}>
                                                        {driver.name} ({getDriverAssignments(driver.id)}/{driver.capacity})
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                            {availableDrivers.length === 0 && (
                                                <Text style={styles.noDriversText}>
                                                    No available drivers in {passenger.driverSector}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
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
        padding: 8,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.9,
        marginTop: 2,
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
    destinationBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3498DB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    destinationInfo: {
        flex: 1,
    },
    destinationName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 2,
    },
    destinationLocation: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 2,
    },
    arrivalTime: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.8,
    },
    sectorStats: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sectorStatCard: {
        flex: 1,
        minWidth: '48%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    sectorName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    sectorNumbers: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    sectorAssigned: {
        fontSize: 18,
        fontWeight: '700',
        color: '#afd826',
    },
    sectorSeparator: {
        fontSize: 14,
        color: '#666',
        marginHorizontal: 2,
    },
    sectorTotal: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    sectorLabel: {
        fontSize: 10,
        color: '#888',
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
        borderLeftWidth: 4,
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
        alignItems: 'flex-start',
        flex: 1,
        gap: 12,
    },
    driverAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    driverDetails: {
        flex: 1,
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
    driverSector: {
        fontSize: 12,
        fontWeight: '600',
        color: '#afd826',
        marginBottom: 2,
    },
    routeRadius: {
        fontSize: 11,
        color: '#888',
        fontStyle: 'italic',
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
    passengerSector: {
        fontSize: 12,
        color: '#afd826',
        fontWeight: '600',
        marginBottom: 2,
    },
    pickupTime: {
        fontSize: 12,
        color: '#3498DB',
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
    driverOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    noDriversText: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 12,
    },
});