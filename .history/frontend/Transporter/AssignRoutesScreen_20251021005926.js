import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    Dimensions,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AssignRoutesScreen({ navigation }) {
    const [selectedTab, setSelectedTab] = useState("drivers");
    const [selectedShift, setSelectedShift] = useState("morning");
    const [assignments, setAssignments] = useState({});
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [driverLocations, setDriverLocations] = useState({});
    const [estimatedTimes, setEstimatedTimes] = useState({});
    const [showDriverRouteModal, setShowDriverRouteModal] = useState(false);

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
            id: "driver-1", 
            name: "Ahmed Khan", 
            vehicle: "Toyota Hiace", 
            capacity: 12,
            currentLoad: 0,
            routeSector: "Blue Area Sector",
            routeRadius: ["F-7", "F-8", "Blue Area", "Jinnah Super"],
            color: "#3498DB",
            startLocation: { latitude: 33.7245, longitude: 73.0903 },
            routeColor: "#3498DB",
            contact: "+92-300-1234567",
            rating: 4.8
        },
        { 
            id: "driver-2", 
            name: "Hassan Ali", 
            vehicle: "Suzuki Every", 
            capacity: 8,
            currentLoad: 0,
            routeSector: "Gulberg Sector",
            routeRadius: ["Gulberg III", "Gulberg IV", "Main Boulevard", "Kalma Chowk"],
            color: "#27AE60",
            startLocation: { latitude: 33.7000, longitude: 73.0667 },
            routeColor: "#27AE60",
            contact: "+92-300-2345678",
            rating: 4.6
        },
        { 
            id: "driver-3", 
            name: "Ali Raza", 
            vehicle: "Suzuki Bolan", 
            capacity: 6,
            currentLoad: 0,
            routeSector: "DHA Sector", 
            routeRadius: ["DHA Phase 1", "DHA Phase 2", "DHA Phase 3", "Y-Block"],
            color: "#E74C3C",
            startLocation: { latitude: 33.6667, longitude: 73.0333 },
            routeColor: "#E74C3C",
            contact: "+92-300-3456789",
            rating: 4.9
        },
        { 
            id: "driver-4", 
            name: "Usman Malik", 
            vehicle: "Toyota Corolla", 
            capacity: 4,
            currentLoad: 0,
            routeSector: "Johar Town Sector",
            routeRadius: ["Johar Town", "Wapda Town", "Model Town", "Faisal Town"],
            color: "#F39C12",
            startLocation: { latitude: 33.6500, longitude: 73.1167 },
            routeColor: "#F39C12",
            contact: "+92-300-4567890",
            rating: 4.7
        },
    ];

    // Passengers with actual coordinates for map stops
    const passengers = [
        // Blue Area Sector Passengers
        { 
            id: "blue-p1", 
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
            id: "blue-p2", 
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
            id: "blue-p3", 
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
            id: "gulberg-p1", 
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
            id: "gulberg-p2", 
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
            id: "gulberg-p3", 
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
            id: "dha-p1", 
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
            id: "dha-p2", 
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
            id: "dha-p3", 
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
            id: "johar-p1", 
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
            id: "johar-p2", 
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
            id: "johar-p3", 
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
        { id: "shift-morning", name: "Morning", time: "8:00 - 10:00 AM" },
        { id: "shift-afternoon", name: "Afternoon", time: "1:00 - 3:00 PM" },
        { id: "shift-evening", name: "Evening", time: "4:00 - 6:00 PM" },
    ];

    // Common destination for all drivers
    const commonDestination = {
        name: "Riphah University",
        location: "Al-Mizan II, I-14, Islamabad",
        arrivalTime: "9:00 AM",
        coordinates: RIPHAH_UNIVERSITY
    };

    // Simulate real-time driver locations - useCallback lagayein
    useEffect(() => {
        const interval = setInterval(() => {
            const newLocations = {};
            drivers.forEach(driver => {
                const assignedPassengers = getAssignedPassengersForDriver(driver.id);
                if (assignedPassengers.length > 0) {
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

    // Calculate estimated times - useCallback lagayein
    useEffect(() => {
        const newEstimatedTimes = {};
        drivers.forEach(driver => {
            const assignedPassengers = getAssignedPassengersForDriver(driver.id);
            if (assignedPassengers.length > 0) {
                const totalStops = assignedPassengers.length;
                const baseTime = 15;
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

    const getDriverAssignments = useCallback((driverId) => {
        return Object.values(assignments).filter(id => id === driverId).length;
    }, [assignments]);

    const getPassengersForDriverSector = useCallback((driverSector) => {
        return passengers.filter(p => p.driverSector === driverSector && !assignments[p.id]);
    }, [assignments]);

    const getAssignedPassengersForDriver = useCallback((driverId) => {
        const assigned = passengers.filter(p => assignments[p.id] === driverId);
        return assigned.sort((a, b) => a.stopOrder - b.stopOrder);
    }, [assignments]);

    const unassignedPassengers = passengers.filter(p => !assignments[p.id]);

    const quickAssign = useCallback((passengerId, driverId) => {
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
    }, []);

    const removeAssignment = useCallback((passengerId) => {
        setAssignments(prev => {
            const newAssignments = { ...prev };
            delete newAssignments[passengerId];
            return newAssignments;
        });
    }, []);

    const autoAssignAll = useCallback(() => {
        setAssignments(prev => {
            const newAssignments = { ...prev };
            
            drivers.forEach(driver => {
                const sectorPassengers = getPassengersForDriverSector(driver.routeSector);
                sectorPassengers.forEach(passenger => {
                    if (getDriverAssignments(driver.id) < driver.capacity) {
                        newAssignments[passenger.id] = driver.id;
                    }
                });
            });
            
            return newAssignments;
        });
        setShowActionsMenu(false);
        alert("🚀 All passengers auto-assigned to their sector drivers!");
    }, [getDriverAssignments, getPassengersForDriverSector]);

    const clearAllAssignments = useCallback(() => {
        setAssignments({});
        setShowActionsMenu(false);
        alert("🗑️ All assignments cleared!");
    }, []);

    const handleSave = useCallback(() => {
        console.log("Assignments saved:", assignments);
        setShowActionsMenu(false);
        alert("✅ Routes saved successfully!");
    }, [assignments]);

    const getSectorStats = useCallback(() => {
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
    }, [assignments]);

    const getDriverRoute = useCallback((driverId) => {
        const driver = drivers.find(d => d.id === driverId);
        const assignedPassengers = getAssignedPassengersForDriver(driverId);
        
        if (assignedPassengers.length === 0) return [];

        const route = [driver.startLocation];
        assignedPassengers.forEach(passenger => {
            route.push(passenger.coordinates);
        });
        route.push(RIPHAH_UNIVERSITY);
        
        return route;
    }, [getAssignedPassengersForDriver]);

    const handleViewLiveTracking = useCallback(() => {
        setShowActionsMenu(false);
        navigation.navigate('VanTracking', { 
            drivers: drivers.map(driver => ({
                ...driver,
                assignedPassengers: getAssignedPassengersForDriver(driver.id),
                currentLocation: driverLocations[driver.id] || driver.startLocation
            }))
        });
    }, [navigation, drivers, getAssignedPassengersForDriver, driverLocations]);

    const handleViewDriverRoute = useCallback((driver) => {
        setSelectedDriver(driver);
        setShowDriverRouteModal(true);
    }, []);

    const sectorStats = getSectorStats();

    // Individual Driver Route Modal
    const DriverRouteModal = () => (
        <Modal
            visible={showDriverRouteModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowDriverRouteModal(false)}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => setShowDriverRouteModal(false)}
                    >
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>
                        {selectedDriver?.name}'s Complete Route
                    </Text>
                    <View style={styles.headerButton} />
                </View>

                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={ISLAMABAD_REGION}
                        showsUserLocation={false}
                    >
                        {/* Destination Marker */}
                        <Marker
                            key="destination-university"
                            coordinate={RIPHAH_UNIVERSITY}
                            title="Riphah University"
                            description="Final Destination"
                        >
                            <View style={styles.destinationMarker}>
                                <Ionicons name="school" size={20} color="#fff" />
                            </View>
                        </Marker>

                        {/* Driver Route */}
                        {selectedDriver && (
                            <>
                                <Polyline
                                    key={`polyline-${selectedDriver.id}`}
                                    coordinates={getDriverRoute(selectedDriver.id)}
                                    strokeColor={selectedDriver.routeColor}
                                    strokeWidth={5}
                                    lineDashPattern={[10, 10]}
                                />
                                
                                {/* Start Point */}
                                <Marker
                                    key={`start-${selectedDriver.id}`}
                                    coordinate={selectedDriver.startLocation}
                                    title="Start Point"
                                    description={`${selectedDriver.name}'s starting location`}
                                >
                                    <View style={[styles.startMarker, { backgroundColor: selectedDriver.color }]}>
                                        <Ionicons name="play" size={16} color="#fff" />
                                    </View>
                                </Marker>

                                {/* Passenger Stops */}
                                {getAssignedPassengersForDriver(selectedDriver?.id).map((passenger, index) => (
                                    <Marker
                                        key={`marker-${selectedDriver.id}-${passenger.id}-${index}`}
                                        coordinate={passenger.coordinates}
                                        title={`Stop ${index + 1}: ${passenger.name}`}
                                        description={`Pickup: ${passenger.pickupTime}`}
                                    >
                                        <View style={[styles.stopMarker, { backgroundColor: selectedDriver?.color }]}>
                                            <Text style={styles.stopNumber}>{index + 1}</Text>
                                        </View>
                                    </Marker>
                                ))}

                                {/* Current Driver Location */}
                                {driverLocations[selectedDriver.id] && (
                                    <Marker
                                        key={`current-${selectedDriver.id}`}
                                        coordinate={driverLocations[selectedDriver.id]}
                                        title={`${selectedDriver.name} - Current Location`}
                                        description={driverLocations[selectedDriver.id].heading}
                                    >
                                        <View style={[styles.driverMarker, { backgroundColor: selectedDriver.color }]}>
                                            <Ionicons name="car-sport" size={16} color="#fff" />
                                        </View>
                                    </Marker>
                                )}
                            </>
                        )}
                    </MapView>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.routeDetails}>
                        <Text style={styles.routeSectionTitle}>Route Information</Text>
                        <View style={styles.routeInfo}>
                            <View style={styles.routeInfoItem}>
                                <Ionicons name="car" size={20} color="#3498DB" />
                                <Text style={styles.routeInfoText}>
                                    {selectedDriver?.vehicle}
                                </Text>
                            </View>
                            <View style={styles.routeInfoItem}>
                                <Ionicons name="people" size={20} color="#27AE60" />
                                <Text style={styles.routeInfoText}>
                                    {getDriverAssignments(selectedDriver?.id)}/{selectedDriver?.capacity} passengers
                                </Text>
                            </View>
                            <View style={styles.routeInfoItem}>
                                <Ionicons name="time" size={20} color="#F39C12" />
                                <Text style={styles.routeInfoText}>
                                    {estimatedTimes[selectedDriver?.id]?.totalTime} total
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.stopsList}>
                        <Text style={styles.routeSectionTitle}>Pickup Stops Sequence</Text>
                        <View style={styles.stopItem}>
                            <View style={[styles.stopNumber, styles.startStop]}>
                                <Ionicons name="play" size={16} color="#fff" />
                            </View>
                            <View style={styles.stopInfo}>
                                <Text style={styles.stopName}>Start Point</Text>
                                <Text style={styles.stopAddress}>{selectedDriver?.routeSector}</Text>
                                <Text style={styles.stopTime}>🕒 8:00 AM</Text>
                            </View>
                        </View>

                        {getAssignedPassengersForDriver(selectedDriver?.id).map((passenger, index) => (
                            <View key={`stop-${passenger.id}-${index}`} style={styles.stopItem}>
                                <View style={[styles.stopNumber, { backgroundColor: selectedDriver?.color }]}>
                                    <Text style={styles.stopNumberText}>{index + 1}</Text>
                                </View>
                                <View style={styles.stopInfo}>
                                    <Text style={styles.stopName}>{passenger.name}</Text>
                                    <Text style={styles.stopAddress}>{passenger.area}</Text>
                                    <Text style={styles.stopTime}>🕒 {passenger.pickupTime}</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.removeStopButton}
                                    onPress={() => {
                                        removeAssignment(passenger.id);
                                        setShowDriverRouteModal(false);
                                    }}
                                >
                                    <Ionicons name="close-circle" size={20} color="#ff6b6b" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <View style={styles.stopItem}>
                            <View style={[styles.stopNumber, styles.endStop]}>
                                <Ionicons name="school" size={16} color="#fff" />
                            </View>
                            <View style={styles.stopInfo}>
                                <Text style={styles.stopName}>Riphah University</Text>
                                <Text style={styles.stopAddress}>Final Destination</Text>
                                <Text style={styles.stopTime}>🕒 {estimatedTimes[selectedDriver?.id]?.arrivalTime}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );

    // Actions Menu Modal
    const ActionsMenuModal = () => (
        <Modal
            visible={showActionsMenu}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowActionsMenu(false)}
        >
            <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowActionsMenu(false)}
            >
                <View style={styles.actionsMenu}>
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={handleSave}
                    >
                        <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
                        <Text style={styles.menuItemText}>Save Routes</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={autoAssignAll}
                    >
                        <Ionicons name="flash" size={20} color="#F39C12" />
                        <Text style={styles.menuItemText}>Auto Assign All</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={clearAllAssignments}
                    >
                        <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                        <Text style={styles.menuItemText}>Clear All</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={handleViewLiveTracking}
                    >
                        <Ionicons name="navigate" size={20} color="#3498DB" />
                        <Text style={styles.menuItemText}>Live Tracking</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />

            {/* Header */}
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
                    style={styles.menuButton}
                    onPress={() => setShowActionsMenu(true)}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.container} 
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
            >
                {/* Common Destination Banner */}
                <View style={styles.destinationBanner}>
                    <View style={styles.destinationIcon}>
                        <Ionicons name="school" size={28} color="#fff" />
                    </View>
                    <View style={styles.destinationInfo}>
                        <Text style={styles.destinationName}>{commonDestination.name}</Text>
                        <Text style={styles.destinationLocation}>{commonDestination.location}</Text>
                        <Text style={styles.arrivalTime}>Arrival: {commonDestination.arrivalTime}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.viewMapButton}
                        onPress={handleViewLiveTracking}
                    >
                        <Ionicons name="navigate" size={18} color="#3498DB" />
                        <Text style={styles.viewMapText}>Live Track</Text>
                    </TouchableOpacity>
                </View>

                {/* Sector-wise Statistics */}
                <View style={styles.sectorStats}>
                    <Text style={styles.sectionTitle}>Sector-wise Assignment</Text>
                    <View style={styles.statsGrid}>
                        {Object.entries(sectorStats).map(([sector, stats], index) => (
                            <View key={`sector-${sector}-${index}`} style={[styles.sectorStatCard, { borderLeftColor: stats.color }]}>
                                <Text style={styles.sectorName}>{sector}</Text>
                                <View style={styles.sectorNumbers}>
                                    <Text style={styles.sectorAssigned}>{stats.assigned}</Text>
                                    <Text style={styles.sectorSeparator}>/</Text>
                                    <Text style={styles.sectorTotal}>{stats.total}</Text>
                                </View>
                                <Text style={styles.sectorLabel}>assigned</Text>
                                <View style={styles.progressBar}>
                                    <View 
                                        style={[
                                            styles.progressFill, 
                                            { 
                                                width: `${(stats.assigned / stats.total) * 100}%`,
                                                backgroundColor: stats.color
                                            }
                                        ]} 
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>


                {/* Shift Selection */}
                <View style={styles.shiftSection}>
                    <Text style={styles.sectionTitle}>Select Shift</Text>
                    <View style={styles.shiftButtons}>
                        {shifts.map(shift => (
                            <TouchableOpacity
                                key={`shift-${shift.id}`}
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
                                <View key={`driver-card-${driver.id}`} style={[styles.driverCard, { borderLeftColor: driver.color }]}>
                                    <View style={styles.driverHeader}>
                                        <View style={styles.driverInfo}>
                                            <View style={[styles.driverAvatar, { backgroundColor: `${driver.color}20` }]}>
                                                <Ionicons name="person" size={20} color={driver.color} />
                                            </View>
                                            <View style={styles.driverDetails}>
                                                <View style={styles.driverNameRow}>
                                                    <Text style={styles.driverName}>{driver.name}</Text>
                                                    <View style={styles.ratingBadge}>
                                                        <Ionicons name="star" size={12} color="#FFD700" />
                                                        <Text style={styles.ratingText}>{driver.rating}</Text>
                                                    </View>
                                                </View>
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
                                            <View style={styles.routePreviewHeader}>
                                                <Text style={styles.routePreviewTitle}>Route Stops</Text>
                                                <TouchableOpacity 
                                                    style={styles.viewRouteButton}
                                                    onPress={() => handleViewDriverRoute(driver)}
                                                >
                                                    <Text style={styles.viewRouteText}>View Full Route</Text>
                                                    <Ionicons name="chevron-forward" size={16} color="#3498DB" />
                                                </TouchableOpacity>
                                            </View>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                <View style={styles.routeStops}>
                                                    <View style={[styles.routeStop, styles.startStop]}>
                                                        <Text style={styles.stopText}>Start</Text>
                                                    </View>
                                                    {assignedPassengers.map((passenger, index) => (
                                                        <View key={`route-stop-${passenger.id}-${index}`} style={styles.routeStopContainer}>
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
                                                <View key={`assigned-${passenger.id}`} style={styles.assignedItem}>
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
                                                            key={`quick-assign-${passenger.id}`}
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
                                <View key={`passenger-card-${passenger.id}`} style={styles.passengerCard}>
                                    <View style={styles.passengerHeader}>
                                        <View style={styles.passengerAvatar}>
                                            <Ionicons name="person-circle" size={32} color="#afd826" />
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
                                                    key={`driver-option-${driver.id}-${passenger.id}`}
                                                    style={styles.driverOption}
                                                    onPress={() => quickAssign(passenger.id, driver.id)}
                                                >
                                                    <View style={[styles.driverColor, { backgroundColor: driver.color }]} />
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

            {/* Modals */}
            <ActionsMenuModal />
            <DriverRouteModal />
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
    menuButton: {
        padding: 8,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    destinationBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3498DB',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    destinationIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    destinationInfo: {
        flex: 1,
    },
    destinationName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    destinationLocation: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 4,
    },
    arrivalTime: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.8,
        fontWeight: '600',
    },
    viewMapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    viewMapText: {
        color: '#3498DB',
        fontWeight: '600',
        fontSize: 14,
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
        gap: 12,
    },
    sectorStatCard: {
        flex: 1,
        minWidth: '48%',
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
    sectorName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    sectorNumbers: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    sectorAssigned: {
        fontSize: 24,
        fontWeight: '700',
        color: '#afd826',
    },
    sectorSeparator: {
        fontSize: 16,
        color: '#666',
        marginHorizontal: 4,
    },
    sectorTotal: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    sectorLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    quickStats: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
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
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginVertical: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    shiftSection: {
        marginBottom: 20,
    },
    shiftButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    shiftButton: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedShift: {
        backgroundColor: '#afd826',
        borderColor: '#afd826',
        shadowColor: '#afd826',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    shiftName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
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
        borderRadius: 12,
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
        gap: 8,
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
        gap: 16,
    },
    driverCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    driverHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
        gap: 16,
    },
    driverAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    driverDetails: {
        flex: 1,
    },
    driverNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    driverName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        gap: 2,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#F39C12',
    },
    driverVehicle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    driverSector: {
        fontSize: 12,
        fontWeight: '600',
        color: '#afd826',
        marginBottom: 4,
    },
    routeRadius: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    driverStatus: {
        fontSize: 11,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
    },
    driverStats: {
        alignItems: 'flex-end',
        gap: 8,
    },
    capacityBadge: {
        backgroundColor: '#f0f8e0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    fullBadge: {
        backgroundColor: '#ffebee',
    },
    capacityText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#afd826',
    },
    etaText: {
        fontSize: 12,
        color: '#3498DB',
        fontWeight: '600',
    },
    routePreview: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    routePreviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    routePreviewTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    viewRouteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewRouteText: {
        color: '#3498DB',
        fontWeight: '600',
        fontSize: 14,
    },
    routeStops: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    routeStopContainer: {
        alignItems: 'center',
        gap: 8,
    },
    routeLine: {
        width: 30,
        height: 2,
        backgroundColor: '#ddd',
    },
    routeStop: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    startStop: {
        backgroundColor: '#27AE60',
    },
    endStop: {
        backgroundColor: '#E74C3C',
    },
    stopText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    passengerStopName: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
        maxWidth: 70,
    },
    assignedList: {
        gap: 12,
        marginBottom: 16,
    },
    assignedItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    passengerInfo: {
        flex: 1,
    },
    passengerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    passengerDetails: {
        fontSize: 12,
        color: '#666',
    },
    removeButton: {
        padding: 6,
    },
    noAssignment: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    quickAssignSection: {
        marginTop: 8,
    },
    quickAssignTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    quickAssignButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    quickAssignBtn: {
        backgroundColor: '#afd826',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    quickAssignText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    passengerCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    passengerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    passengerAvatar: {
        // Icon handles the styling
    },
    passengerName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    passengerLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    passengerSector: {
        fontSize: 12,
        color: '#afd826',
        fontWeight: '600',
        marginBottom: 4,
    },
    pickupTime: {
        fontSize: 12,
        color: '#3498DB',
        fontWeight: '500',
    },
    driverSelection: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 16,
    },
    assignTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    driverOptions: {
        gap: 12,
    },
    driverOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    driverColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    driverOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    noDriversText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 20,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionsMenu: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    modalContent: {
        flex: 1,
    },
    mapContainer: {
        height: 300,
        margin: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    map: {
        flex: 1,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    startMarker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    stopMarker: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    stopNumber: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    driverMarker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    routeDetails: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    routeSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    routeInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    routeInfoItem: {
        alignItems: 'center',
        gap: 8,
    },
    routeInfoText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    stopsList: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    stopItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        gap: 16,
    },
    stopNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startStop: {
        backgroundColor: '#27AE60',
    },
    endStop: {
        backgroundColor: '#E74C3C',
    },
    stopNumberText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    stopInfo: {
        flex: 1,
    },
    stopName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    stopAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    stopTime: {
        fontSize: 12,
        color: '#3498DB',
        fontWeight: '500',
    },
    removeStopButton: {
        padding: 4,
    },
    headerButton: {
        width: 40,
    },
});