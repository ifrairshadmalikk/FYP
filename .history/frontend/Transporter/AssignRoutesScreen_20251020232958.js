import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Dimensions,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AssignRoutesScreen({ navigation }) {
    const [selectedTab, setSelectedTab] = useState("drivers");
    const [selectedShift, setSelectedShift] = useState("morning");
    const [assignments, setAssignments] = useState({});
    const [showMap, setShowMap] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [driverLocations, setDriverLocations] = useState({});
    const [estimatedTimes, setEstimatedTimes] = useState({});

    // Islamabad coordinates for map
    const ISLAMABAD_REGION = {
        latitude: 33.6844,
        longitude: 73.0479,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
    };

    // Riphah University coordinates
    const RIPHAH_UNIVERSITY = {
        latitude: 33.6462,
        longitude: 72.9834,
        name: "Riphah University",
        address: "Al-Mizan II, I-14, Islamabad"
    };

    // Drivers with their specific route sectors and starting points
    const drivers = [
        { 
            id: "1", 
            name: "Ahmed Khan", 
            vehicle: "Toyota Hiace", 
            capacity: 12,
            currentLoad: 0,
            routeSector: "Blue Area Sector",
            routeRadius: ["F-7", "F-8", "Blue Area", "Jinnah Super"],
            color: "#3498DB",
            startLocation: { latitude: 33.7245, longitude: 73.0903 }, // F-8 Markaz
            routeColor: "#3498DB"
        },
        { 
            id: "2", 
            name: "Hassan Ali", 
            vehicle: "Suzuki Every", 
            capacity: 8,
            currentLoad: 0,
            routeSector: "Gulberg Sector",
            routeRadius: ["Gulberg III", "Gulberg IV", "Main Boulevard", "Kalma Chowk"],
            color: "#27AE60",
            startLocation: { latitude: 33.7000, longitude: 73.0667 }, // Gulberg
            routeColor: "#27AE60"
        },
        { 
            id: "3", 
            name: "Ali Raza", 
            vehicle: "Suzuki Bolan", 
            capacity: 6,
            currentLoad: 0,
            routeSector: "DHA Sector", 
            routeRadius: ["DHA Phase 1", "DHA Phase 2", "DHA Phase 3", "Y-Block"],
            color: "#E74C3C",
            startLocation: { latitude: 33.6667, longitude: 73.0333 }, // DHA
            routeColor: "#E74C3C"
        },
        { 
            id: "4", 
            name: "Usman Malik", 
            vehicle: "Toyota Corolla", 
            capacity: 4,
            currentLoad: 0,
            routeSector: "Johar Town Sector",
            routeRadius: ["Johar Town", "Wapda Town", "Model Town", "Faisal Town"],
            color: "#F39C12",
            startLocation: { latitude: 33.6500, longitude: 73.1167 }, // Johar Town
            routeColor: "#F39C12"
        },
    ];

    // Passengers with actual coordinates for map stops
    const passengers = [
        // Blue Area Sector Passengers
        { 
            id: "p1", 
            name: "Ahmad Ali", 
            area: "F-8 Markaz", 
            sector: "Blue Area Sector",
            university: "Riphah University",
            pickupTime: "8:15 AM",
            driverSector: "Blue Area Sector",
            coordinates: { latitude: 33.7245, longitude: 73.0903 },
            stopOrder: 1
        },
        { 
            id: "p2", 
            name: "Sara Khan", 
            area: "Blue Area", 
            sector: "Blue Area Sector",
            university: "Riphah University", 
            pickupTime: "8:00 AM",
            driverSector: "Blue Area Sector",
            coordinates: { latitude: 33.7210, longitude: 73.0830 },
            stopOrder: 2
        },
        { 
            id: "p3", 
            name: "Bilal Ahmed", 
            area: "Jinnah Super", 
            sector: "Blue Area Sector",
            university: "Riphah University",
            pickupTime: "8:30 AM",
            driverSector: "Blue Area Sector",
            coordinates: { latitude: 33.7180, longitude: 73.0780 },
            stopOrder: 3
        },

        // Gulberg Sector Passengers
        { 
            id: "p4", 
            name: "Faisal Khan", 
            area: "Gulberg III", 
            sector: "Gulberg Sector",
            university: "Riphah University",
            pickupTime: "8:30 AM",
            driverSector: "Gulberg Sector",
            coordinates: { latitude: 33.7000, longitude: 73.0667 },
            stopOrder: 1
        },
        { 
            id: "p5", 
            name: "Hina Shah", 
            area: "Main Boulevard", 
            sector: "Gulberg Sector", 
            university: "Riphah University",
            pickupTime: "8:45 AM",
            driverSector: "Gulberg Sector",
            coordinates: { latitude: 33.6950, longitude: 73.0630 },
            stopOrder: 2
        },
        { 
            id: "p6", 
            name: "Kamran Ali", 
            area: "Kalma Chowk", 
            sector: "Gulberg Sector",
            university: "Riphah University",
            pickupTime: "8:15 AM",
            driverSector: "Gulberg Sector",
            coordinates: { latitude: 33.6900, longitude: 73.0600 },
            stopOrder: 3
        },

        // DHA Sector Passengers
        { 
            id: "p7", 
            name: "Zainab Noor", 
            area: "DHA Phase 2", 
            sector: "DHA Sector",
            university: "Riphah University",
            pickupTime: "8:20 AM",
            driverSector: "DHA Sector",
            coordinates: { latitude: 33.6667, longitude: 73.0333 },
            stopOrder: 1
        },
        { 
            id: "p8", 
            name: "Omar Farooq", 
            area: "Y-Block", 
            sector: "DHA Sector",
            university: "Riphah University",
            pickupTime: "8:35 AM",
            driverSector: "DHA Sector",
            coordinates: { latitude: 33.6630, longitude: 73.0300 },
            stopOrder: 2
        },
        { 
            id: "p9", 
            name: "Fatima Raza", 
            area: "DHA Phase 1", 
            sector: "DHA Sector",
            university: "Riphah University",
            pickupTime: "8:10 AM",
            driverSector: "DHA Sector",
            coordinates: { latitude: 33.6700, longitude: 73.0360 },
            stopOrder: 3
        },

        // Johar Town Sector Passengers
        { 
            id: "p10", 
            name: "Usman Sheikh", 
            area: "Johar Town", 
            sector: "Johar Town Sector",
            university: "Riphah University",
            pickupTime: "8:25 AM",
            driverSector: "Johar Town Sector",
            coordinates: { latitude: 33.6500, longitude: 73.1167 },
            stopOrder: 1
        },
        { 
            id: "p11", 
            name: "Ayesha Malik", 
            area: "Wapda Town", 
            sector: "Johar Town Sector",
            university: "Riphah University",
            pickupTime: "8:40 AM",
            driverSector: "Johar Town Sector",
            coordinates: { latitude: 33.6450, longitude: 73.1200 },
            stopOrder: 2
        },
        { 
            id: "p12", 
            name: "Haris Ahmed", 
            area: "Model Town", 
            sector: "Johar Town Sector",
            university: "Riphah University",
            pickupTime: "8:50 AM",
            driverSector: "Johar Town Sector",
            coordinates: { latitude: 33.6400, longitude: 73.1250 },
            stopOrder: 3
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
        arrivalTime: "9:00 AM",
        coordinates: RIPHAH_UNIVERSITY
    };

    // Simulate real-time driver locations
    useEffect(() => {
        const interval = setInterval(() => {
            const newLocations = {};
            drivers.forEach(driver => {
                const assignedPassengers = getAssignedPassengersForDriver(driver.id);
                if (assignedPassengers.length > 0) {
                    // Simulate driver moving between stops
                    const progress = Math.min((Date.now() % 60000) / 60000, 0.8);
                    const currentStopIndex = Math.floor(progress * assignedPassengers.length);
                    const currentPassenger = assignedPassengers[currentStopIndex];
                    
                    if (currentPassenger) {
                        newLocations[driver.id] = {
                            ...currentPassenger.coordinates,
                            heading: `Heading to ${currentPassenger.name}`,
                            speed: "25 km/h"
                        };
                    }
                } else {
                    // Driver at starting point if no assignments
                    newLocations[driver.id] = {
                        ...driver.startLocation,
                        heading: "Waiting for assignments",
                        speed: "0 km/h"
                    };
                }
            });
            setDriverLocations(newLocations);
        }, 3000);

        return () => clearInterval(interval);
    }, [assignments]);

    // Calculate estimated times
    useEffect(() => {
        const newEstimatedTimes = {};
        drivers.forEach(driver => {
            const assignedPassengers = getAssignedPassengersForDriver(driver.id);
            if (assignedPassengers.length > 0) {
                const totalStops = assignedPassengers.length;
                const baseTime = 15; // 15 minutes per stop
                const totalTime = totalStops * baseTime;
                newEstimatedTimes[driver.id] = {
                    totalTime: `${totalTime} min`,
                    arrivalTime: `~${8 + Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')} AM`
                };
            } else {
                newEstimatedTimes[driver.id] = {
                    totalTime: "0 min",
                    arrivalTime: "Not assigned"
                };
            }
        });
        setEstimatedTimes(newEstimatedTimes);
    }, [assignments]);

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
        const assigned = passengers.filter(p => assignments[p.id] === driverId);
        // Sort by stop order for route planning
        return assigned.sort((a, b) => a.stopOrder - b.stopOrder);
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

    // Generate route coordinates for a driver
    const getDriverRoute = (driverId) => {
        const driver = drivers.find(d => d.id === driverId);
        const assignedPassengers = getAssignedPassengersForDriver(driverId);
        
        if (assignedPassengers.length === 0) return [];

        const route = [driver.startLocation];
        assignedPassengers.forEach(passenger => {
            route.push(passenger.coordinates);
        });
        route.push(RIPHAH_UNIVERSITY);
        
        return route;
    };

    const sectorStats = getSectorStats();

    // Render Map View
    const renderMapView = () => (
        <View style={styles.mapContainer}>
            <View style={styles.mapHeader}>
                <TouchableOpacity 
                    style={styles.backToAssignments}
                    onPress={() => setShowMap(false)}
                >
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                    <Text style={styles.backToAssignmentsText}>Back to Assignments</Text>
                </TouchableOpacity>
                <Text style={styles.mapTitle}>Live Routes Overview</Text>
                <View style={styles.mapLegend}>
                    {drivers.map(driver => (
                        <View key={driver.id} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: driver.color }]} />
                            <Text style={styles.legendText}>{driver.routeSector}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <MapView
                style={styles.map}
                initialRegion={ISLAMABAD_REGION}
                showsUserLocation={false}
                showsTraffic={true}
            >
                {/* Destination Marker */}
                <Marker
                    coordinate={RIPHAH_UNIVERSITY}
                    title="Riphah University"
                    description="Final Destination"
                >
                    <View style={styles.destinationMarker}>
                        <Ionicons name="school" size={24} color="#fff" />
                    </View>
                </Marker>

                {/* Driver Routes and Stops */}
                {drivers.map(driver => {
                    const assignedPassengers = getAssignedPassengersForDriver(driver.id);
                    const routeCoordinates = getDriverRoute(driver.id);
                    const driverLocation = driverLocations[driver.id];

                    return (
                        <View key={driver.id}>
                            {/* Route Line */}
                            {routeCoordinates.length > 1 && (
                                <Polyline
                                    coordinates={routeCoordinates}
                                    strokeColor={driver.routeColor}
                                    strokeWidth={4}
                                    lineDashPattern={[10, 10]}
                                />
                            )}

                            {/* Passenger Stops */}
                            {assignedPassengers.map((passenger, index) => (
                                <Marker
                                    key={passenger.id}
                                    coordinate={passenger.coordinates}
                                    title={`Stop ${index + 1}: ${passenger.name}`}
                                    description={`Pickup: ${passenger.pickupTime}`}
                                >
                                    <View style={[styles.stopMarker, { backgroundColor: driver.color }]}>
                                        <Text style={styles.stopNumber}>{index + 1}</Text>
                                    </View>
                                </Marker>
                            ))}

                            {/* Driver Current Location */}
                            {driverLocation && (
                                <Marker
                                    coordinate={driverLocation}
                                    title={`${driver.name} - ${driver.vehicle}`}
                                    description={driverLocation.heading}
                                >
                                    <View style={[styles.driverMarker, { backgroundColor: driver.color }]}>
                                        <Ionicons name="car-sport" size={16} color="#fff" />
                                    </View>
                                </Marker>
                            )}
                        </View>
                    );
                })}
            </MapView>

            {/* Driver Info Panel */}
            <View style={styles.driverInfoPanel}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {drivers.map(driver => {
                        const assignedCount = getDriverAssignments(driver.id);
                        const estimatedTime = estimatedTimes[driver.id];
                        const driverLocation = driverLocations[driver.id];

                        return (
                            <View key={driver.id} style={[styles.driverInfoCard, { borderLeftColor: driver.color }]}>
                                <Text style={styles.driverInfoName}>{driver.name}</Text>
                                <Text style={styles.driverInfoSector}>{driver.routeSector}</Text>
                                <Text style={styles.driverInfoStats}>
                                    {assignedCount}/{driver.capacity} passengers
                                </Text>
                                <Text style={styles.driverInfoTime}>
                                    ETA: {estimatedTime?.arrivalTime}
                                </Text>
                                {driverLocation && (
                                    <Text style={styles.driverInfoLocation}>
                                        📍 {driverLocation.heading}
                                    </Text>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );

    if (showMap) {
        return renderMapView();
    }

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
                    <TouchableOpacity 
                        style={styles.viewMapButton}
                        onPress={() => setShowMap(true)}
                    >
                        <Ionicons name="map" size={18} color="#3498DB" />
                        <Text style={styles.viewMapText}>View Map</Text>
                    </TouchableOpacity>
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

                    <TouchableOpacity 
                        style={styles.liveViewButton}
                        onPress={() => setShowMap(true)}
                    >
                        <Ionicons name="navigate" size={18} color="#fff" />
                        <Text style={styles.liveViewText}>Live View</Text>
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
                            const estimatedTime = estimatedTimes[driver.id];
                            const driverLocation = driverLocations[driver.id];
                            
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
                                                {driverLocation && (
                                                    <Text style={styles.driverStatus}>
                                                        🚗 {driverLocation.heading} • {driverLocation.speed}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <View style={styles.driverStats}>
                                            <View style={[
                                                styles.capacityBadge,
                                                assignedCount >= driver.capacity && styles.fullBadge
                                            ]}>
                                                <Text style={styles.capacityText}>
                                                    {assignedCount}/{driver.capacity}
                                                </Text>
                                            </View>
                                            {estimatedTime && (
                                                <Text style={styles.etaText}>
                                                    ETA: {estimatedTime.arrivalTime}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    {/* Route Preview */}
                                    {assignedPassengers.length > 0 && (
                                        <View style={styles.routePreview}>
                                            <Text style={styles.routePreviewTitle}>Route Stops:</Text>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                <View style={styles.routeStops}>
                                                    <View style={[styles.routeStop, styles.startStop]}>
                                                        <Text style={styles.stopText}>Start</Text>
                                                    </View>
                                                    {assignedPassengers.map((passenger, index) => (
                                                        <View key={passenger.id} style={styles.routeStopContainer}>
                                                            <View style={styles.routeLine} />
                                                            <View style={[styles.routeStop, { backgroundColor: driver.color }]}>
                                                                <Text style={styles.stopText}>{index + 1}</Text>
                                                            </View>
                                                            <Text style={styles.passengerStopName}>{passenger.name}</Text>
                                                        </View>
                                                    ))}
                                                    <View style={styles.routeStopContainer}>
                                                        <View style={styles.routeLine} />
                                                        <View style={[styles.routeStop, styles.endStop]}>
                                                            <Ionicons name="school" size={12} color="#fff" />
                                                        </View>
                                                        <Text style={styles.passengerStopName}>Riphah Uni</Text>
                                                    </View>
                                                </View>
                                            </ScrollView>
                                        </View>
                                    )}

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
    viewMapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    viewMapText: {
        color: '#3498DB',
        fontWeight: '600',
        fontSize: 12,
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
    liveViewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3498DB',
        padding: 12,
        borderRadius: 10,
        gap: 6,
        flex: 1,
    },
    liveViewText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
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
    driverStatus: {
        fontSize: 11,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 2,
    },
    driverStats: {
        alignItems: 'flex-end',
        gap: 4,
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
    etaText: {
        fontSize: 11,
        color: '#3498DB',
        fontWeight: '600',
    },
    routePreview: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    routePreviewTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    routeStops: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    routeStopContainer: {
        alignItems: 'center',
        gap: 4,
    },
    routeLine: {
        width: 20,
        height: 2,
        backgroundColor: '#ddd',
    },
    routeStop: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startStop: {
        backgroundColor: '#27AE60',
    },
    endStop: {
        backgroundColor: '#E74C3C',
    },
    stopText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    passengerStopName: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        maxWidth: 60,
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

    // Map View Styles
    mapContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapHeader: {
        backgroundColor: '#afd826',
        padding: 16,
        paddingTop: 50,
    },
    backToAssignments: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    backToAssignmentsText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    mapTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
    },
    mapLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    map: {
        width: screenWidth,
        height: screenHeight * 0.7,
    },
    destinationMarker: {
        backgroundColor: '#E74C3C',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    stopMarker: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    stopNumber: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    driverMarker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    driverInfoPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    driverInfoCard: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        marginRight: 12,
        minWidth: 180,
    },
    driverInfoName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    driverInfoSector: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    driverInfoStats: {
        fontSize: 11,
        color: '#afd826',
        fontWeight: '600',
        marginBottom: 2,
    },
    driverInfoTime: {
        fontSize: 11,
        color: '#3498DB',
        fontWeight: '600',
        marginBottom: 2,
    },
    driverInfoLocation: {
        fontSize: 10,
        color: '#888',
        fontStyle: 'italic',
    },
});