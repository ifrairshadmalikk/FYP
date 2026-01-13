import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Alert,
    Animated,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyDiZhjAhYniDLe4Ndr1u87NdDfIdZS6SME";

// Google Maps Service
const googleMapsService = {
    async getGeocodeFromAddress(address) {
        try {
            const encodedAddress = encodeURIComponent(address);
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            
            if (data.results && data.results[0]) {
                const location = data.results[0].geometry.location;
                return {
                    latitude: location.lat,
                    longitude: location.lng,
                    address: data.results[0].formatted_address,
                };
            }
            return null;
        } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
        }
    },

    async getRouteWithWaypoints(waypoints) {
        try {
            if (waypoints.length < 2) return [];
            
            const origin = `${waypoints[0].latitude},${waypoints[0].longitude}`;
            const destination = `${waypoints[waypoints.length-1].latitude},${waypoints[waypoints.length-1].longitude}`;
            
            let waypointsParam = '';
            if (waypoints.length > 2) {
                const viaPoints = waypoints.slice(1, -1).map(wp => 
                    `${wp.latitude},${wp.longitude}`
                ).join('|');
                waypointsParam = `&waypoints=${viaPoints}`;
            }
            
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypointsParam}&key=${GOOGLE_MAPS_API_KEY}&mode=driving`
            );
            
            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
                const points = data.routes[0].overview_polyline.points;
                return this.decodePolyline(points);
            }
            return [];
        } catch (error) {
            console.error('Error fetching route:', error);
            return [];
        }
    },

    decodePolyline(encoded) {
        let points = [];
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;

        while (index < len) {
            let b, shift = 0, result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            points.push({
                latitude: lat * 1e-5,
                longitude: lng * 1e-5,
            });
        }
        
        return points;
    },

    async getDistanceAndETA(origin, destination) {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}&mode=driving`
            );
            
            const data = await response.json();
            
            if (data.rows && data.rows[0] && data.rows[0].elements[0]) {
                const element = data.rows[0].elements[0];
                if (element.status === 'OK') {
                    return {
                        distance: element.distance?.text || 'Unknown',
                        duration: element.duration?.text || 'Unknown'
                    };
                }
            }
            return null;
        } catch (error) {
            console.error('Error fetching distance:', error);
            return null;
        }
    }
};

export default function CreateDailyPoll({ navigation }) {
    const [step, setStep] = useState(1);
    const [progress] = useState(new Animated.Value(25));
    const [loading, setLoading] = useState(false);

    // States
    const [pollDate, setPollDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pollMessage, setPollMessage] = useState(
        "Please select your preferred time slot for tomorrow's transportation."
    );
    const [timeSlots, setTimeSlots] = useState([
        { 
            id: 1, 
            type: "Morning Slot", 
            start: "09:00 AM", 
            end: "11:00 AM", 
            max: 50
        },
    ]);

    // Networks with addresses for Google Maps
    const [networks, setNetworks] = useState([
        { 
            id: 1, 
            name: "Blue Area", 
            address: "Blue Area Islamabad",
            passengers: 156, 
            selected: false,
            coordinates: null
        },
        { 
            id: 2, 
            name: "Gulberg", 
            address: "Gulberg Lahore",
            passengers: 132, 
            selected: false,
            coordinates: null
        },
        { 
            id: 3, 
            name: "DHA", 
            address: "DHA Phase 5 Lahore",
            passengers: 98, 
            selected: false,
            coordinates: null
        },
        { 
            id: 4, 
            name: "Johar Town", 
            address: "Johar Town Lahore",
            passengers: 87, 
            selected: false,
            coordinates: null
        },
    ]);

    // Load coordinates on mount
    useEffect(() => {
        loadNetworkCoordinates();
    }, []);

    const loadNetworkCoordinates = async () => {
        setLoading(true);
        try {
            const updatedNetworks = await Promise.all(
                networks.map(async (network) => {
                    const coords = await googleMapsService.getGeocodeFromAddress(network.address);
                    return {
                        ...network,
                        coordinates: coords || { latitude: 33.6844, longitude: 73.0479 }
                    };
                })
            );
            setNetworks(updatedNetworks);
        } catch (error) {
            console.error('Error loading coordinates:', error);
        } finally {
            setLoading(false);
        }
    };

    // Progress Animation
    const updateProgress = (newStep) => {
        Animated.timing(progress, {
            toValue: (newStep / 4) * 100,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleNext = (nextStep) => {
        setStep(nextStep);
        updateProgress(nextStep);
    };

    const handlePrevious = (prevStep) => {
        setStep(prevStep);
        updateProgress(prevStep);
    };

    // Date formatting
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    };

    // Add new time slot
    const addNewTimeSlot = () => {
        const newSlot = {
            id: Date.now(),
            type: "New Slot",
            start: "12:00 PM",
            end: "02:00 PM",
            max: 50
        };
        setTimeSlots([...timeSlots, newSlot]);
    };

    // Remove time slot
    const removeTimeSlot = (id) => {
        if (timeSlots.length > 1) {
            setTimeSlots(timeSlots.filter(slot => slot.id !== id));
        } else {
            Alert.alert("Cannot Remove", "At least one time slot is required.");
        }
    };

    // Update time slot
    const updateTimeSlot = (id, field, value) => {
        setTimeSlots(timeSlots.map(slot => 
            slot.id === id ? { ...slot, [field]: value } : slot
        ));
    };

    // Toggle network selection
    const toggleNetwork = (id) => {
        setNetworks(networks.map(net => 
            net.id === id ? { ...net, selected: !net.selected } : net
        ));
    };

    // Select all networks
    const selectAllNetworks = () => {
        setNetworks(networks.map(net => ({ ...net, selected: true })));
    };

    // Deselect all networks
    const deselectAllNetworks = () => {
        setNetworks(networks.map(net => ({ ...net, selected: false })));
    };

    // Generate routes using Google Maps API
    const generateRoutes = async (selectedNetworks) => {
        setLoading(true);
        try {
            const routes = [];
            
            // University destination (Riphah University)
            const universityAddress = await googleMapsService.getGeocodeFromAddress(
                "Riphah International University I-14 Islamabad"
            ) || { latitude: 33.6462, longitude: 72.9834 };

            for (const network of selectedNetworks) {
                if (network.coordinates) {
                    // Get route from network to university
                    const route = await googleMapsService.getRouteWithWaypoints([
                        network.coordinates,
                        universityAddress
                    ]);

                    // Get distance and ETA
                    const distanceData = await googleMapsService.getDistanceAndETA(
                        network.coordinates,
                        universityAddress
                    );

                    routes.push({
                        networkId: network.id,
                        networkName: network.name,
                        startPoint: network.coordinates,
                        destination: universityAddress,
                        route: route,
                        distance: distanceData?.distance || "Unknown",
                        duration: distanceData?.duration || "Unknown",
                        totalPassengers: network.passengers
                    });
                }
            }

            return routes;
        } catch (error) {
            console.error('Error generating routes:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Generate realistic mock responses
    const generateMockResponses = async (pollData) => {
        const responses = [];
        const names = [
            "Ali Ahmed", "Sara Khan", "Usman Malik", "Fatima Noor", 
            "Bilal Raza", "Ayesha Siddiqui", "Omar Farooq", "Zainab Ali"
        ];
        
        const selectedNetworks = pollData.networks;
        const timeSlots = pollData.timeSlots;
        
        // Generate responses with actual coordinates
        for (const network of selectedNetworks) {
            const responseCount = Math.floor((network.passengers * (0.3 + Math.random() * 0.4)));
            
            for (let i = 0; i < responseCount; i++) {
                const randomTimeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
                
                // Get random coordinates near network location
                const offsetLat = (Math.random() - 0.5) * 0.01; // ±0.005 degrees
                const offsetLng = (Math.random() - 0.5) * 0.01;
                
                const responseTime = new Date();
                responseTime.setHours(responseTime.getHours() - Math.floor(Math.random() * 24));
                responseTime.setMinutes(Math.floor(Math.random() * 60));
                
                const randomName = names[Math.floor(Math.random() * names.length)];
                const rand = Math.random();
                let status;
                if (rand > 0.7) status = 'confirmed';
                else if (rand > 0.4) status = 'pending';
                else status = 'cancelled';
                
                responses.push({
                    id: `${network.id}-${i}-${Date.now()}`,
                    passengerName: randomName,
                    network: network.name,
                    address: network.address,
                    coordinates: network.coordinates ? {
                        latitude: network.coordinates.latitude + offsetLat,
                        longitude: network.coordinates.longitude + offsetLng
                    } : { latitude: 33.6844, longitude: 73.0479 },
                    timeSlot: randomTimeSlot.type,
                    responseTime: responseTime,
                    status: status,
                    pickupTime: randomTimeSlot.start
                });
            }
        }
        
        return responses;
    };

    // Submit poll and navigate to View Response
    const submitPoll = async () => {
        const selectedNetworks = networks.filter(net => net.selected);
        
        if (selectedNetworks.length === 0) {
            Alert.alert("No Networks Selected", "Please select at least one network.");
            return;
        }

        if (timeSlots.length === 0) {
            Alert.alert("No Time Slots", "Please add at least one time slot.");
            return;
        }

        setLoading(true);

        try {
            // Generate routes using Google Maps API
            const routes = await generateRoutes(selectedNetworks);

            // Prepare poll data
            const pollData = {
                id: Date.now().toString(),
                date: pollDate.toISOString(),
                message: pollMessage,
                timeSlots: timeSlots,
                networks: selectedNetworks,
                routes: routes,
                totalPassengers: selectedNetworks.reduce((sum, net) => sum + net.passengers, 0),
                totalCapacity: timeSlots.reduce((sum, slot) => sum + slot.max, 0),
                createdAt: new Date().toISOString(),
                status: "active"
            };

            // Generate mock responses
            const passengerResponses = await generateMockResponses(pollData);

            Alert.alert(
                "Poll Ready",
                `Send to ${selectedNetworks.length} networks with ${pollData.totalPassengers} passengers?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { 
                        text: "Send Poll", 
                        onPress: () => {
                            navigation.navigate('ViewResponse', { 
                                pollData: pollData,
                                passengerResponses: passengerResponses,
                                isNewPoll: true 
                            });
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('Error submitting poll:', error);
            Alert.alert("Error", "Failed to create poll. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Render Basic Info
    const renderBasicInfo = () => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Poll Information</Text>
                <Text style={styles.cardSubtitle}>Set basic poll details</Text>
            </View>
            
            <Text style={styles.label}>Poll Date</Text>
            <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.dateText}>{formatDate(pollDate)}</Text>
                <Ionicons name="calendar" size={20} color="#666" />
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={pollDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setPollDate(selectedDate);
                    }}
                    minimumDate={new Date()}
                />
            )}

            <Text style={styles.label}>Poll Message</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
                value={pollMessage}
                onChangeText={setPollMessage}
                placeholder="Enter poll message..."
                placeholderTextColor="#999"
            />

            <TouchableOpacity 
                style={[styles.btn, styles.btnPrimary]} 
                onPress={() => handleNext(2)}
            >
                <Text style={styles.btnText}>Next: Time Slots</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    // Render Time Slots
    const renderTimeSlots = () => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Time Slots</Text>
                <Text style={styles.cardSubtitle}>Configure time slots</Text>
            </View>
            
            {timeSlots.map((slot) => (
                <View key={slot.id} style={styles.slotCard}>
                    <View style={styles.slotHeader}>
                        <Text style={styles.slotTitle}>Slot</Text>
                        <TouchableOpacity onPress={() => removeTimeSlot(slot.id)}>
                            <Ionicons name="trash" size={20} color="#E74C3C" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        value={slot.type}
                        onChangeText={(text) => updateTimeSlot(slot.id, 'type', text)}
                        placeholder="Slot Name"
                    />

                    <View style={styles.timeRow}>
                        <View style={styles.timeInputContainer}>
                            <Text style={styles.slotLabel}>Start</Text>
                            <TextInput
                                style={styles.input}
                                value={slot.start}
                                onChangeText={(text) => updateTimeSlot(slot.id, 'start', text)}
                                placeholder="09:00 AM"
                            />
                        </View>
                        <View style={styles.timeInputContainer}>
                            <Text style={styles.slotLabel}>End</Text>
                            <TextInput
                                style={styles.input}
                                value={slot.end}
                                onChangeText={(text) => updateTimeSlot(slot.id, 'end', text)}
                                placeholder="11:00 AM"
                            />
                        </View>
                        <View style={styles.timeInputContainer}>
                            <Text style={styles.slotLabel}>Max</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(slot.max)}
                                onChangeText={(text) => updateTimeSlot(slot.id, 'max', parseInt(text) || 0)}
                                placeholder="50"
                            />
                        </View>
                    </View>
                </View>
            ))}

            <TouchableOpacity
                style={styles.addButton}
                onPress={addNewTimeSlot}
            >
                <Ionicons name="add-circle" size={20} color="#afd826" />
                <Text style={styles.addButtonText}>Add Slot</Text>
            </TouchableOpacity>

            <View style={styles.navigationRow}>
                <TouchableOpacity
                    style={[styles.btn, styles.btnSecondary]}
                    onPress={() => handlePrevious(1)}
                >
                    <Ionicons name="arrow-back" size={20} color="#666" />
                    <Text style={styles.btnTextSecondary}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.btn, styles.btnPrimary]} 
                    onPress={() => handleNext(3)}
                >
                    <Text style={styles.btnText}>Next: Networks</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Render Networks
    const renderNetworks = () => {
        const selectedCount = networks.filter(net => net.selected).length;
        const totalPassengers = networks.filter(net => net.selected).reduce((sum, net) => sum + net.passengers, 0);
        
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Select Networks</Text>
                    <Text style={styles.cardSubtitle}>Choose networks for poll</Text>
                </View>
                
                <View style={styles.networkHeader}>
                    <Text style={styles.networkSubtitle}>
                        {selectedCount} networks selected • {totalPassengers} passengers
                    </Text>
                    <View style={styles.networkActions}>
                        <TouchableOpacity onPress={selectAllNetworks}>
                            <Text style={styles.networkActionText}>Select All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={deselectAllNetworks}>
                            <Text style={styles.networkActionText}>Clear All</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {networks.map((network) => (
                    <TouchableOpacity
                        key={network.id}
                        style={[
                            styles.networkItem,
                            network.selected && styles.networkItemSelected
                        ]}
                        onPress={() => toggleNetwork(network.id)}
                    >
                        <View style={styles.networkInfo}>
                            <Text style={styles.networkName}>{network.name}</Text>
                            <Text style={styles.networkPassengers}>
                                {network.passengers} passengers • {network.address}
                            </Text>
                        </View>
                        <View style={[
                            styles.checkbox,
                            network.selected && styles.checkboxSelected
                        ]}>
                            {network.selected && <Ionicons name="checkmark" size={16} color="#fff" />}
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={styles.navigationRow}>
                    <TouchableOpacity
                        style={[styles.btn, styles.btnSecondary]}
                        onPress={() => handlePrevious(2)}
                    >
                        <Ionicons name="arrow-back" size={20} color="#666" />
                        <Text style={styles.btnTextSecondary}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnPrimary]} 
                        onPress={() => handleNext(4)}
                    >
                        <Text style={styles.btnText}>Next: Summary</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // Render Summary
    const renderSummary = () => {
        const selectedNetworks = networks.filter(net => net.selected);
        const totalPassengers = selectedNetworks.reduce((sum, net) => sum + net.passengers, 0);
        const totalCapacity = timeSlots.reduce((sum, slot) => sum + slot.max, 0);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Poll Summary</Text>
                    <Text style={styles.cardSubtitle}>Review before sending</Text>
                </View>
                
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Date & Message</Text>
                    <Text style={styles.summaryText}>📅 {formatDate(pollDate)}</Text>
                    <Text style={styles.summaryText}>💬 {pollMessage}</Text>
                </View>

                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Time Slots</Text>
                    {timeSlots.map(slot => (
                        <Text key={slot.id} style={styles.summaryText}>
                            ⏰ {slot.type}: {slot.start} - {slot.end} (Max: {slot.max})
                        </Text>
                    ))}
                </View>

                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Selected Networks</Text>
                    {selectedNetworks.map(network => (
                        <Text key={network.id} style={styles.summaryText}>
                            📍 {network.name}: {network.passengers} passengers
                            {network.coordinates && (
                                <Text style={styles.coordinatesText}>
                                    {"\n"}📍 Coordinates: {network.coordinates.latitude.toFixed(4)}, {network.coordinates.longitude.toFixed(4)}
                                </Text>
                            )}
                        </Text>
                    ))}
                </View>

                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Totals</Text>
                    <Text style={styles.summaryText}>👥 Total Passengers: {totalPassengers}</Text>
                    <Text style={styles.summaryText}>🚐 Total Capacity: {totalCapacity}</Text>
                    <Text style={styles.summaryText}>
                        🎯 Coverage: {((totalCapacity / totalPassengers) * 100).toFixed(1)}%
                    </Text>
                </View>

                <View style={styles.navigationRow}>
                    <TouchableOpacity
                        style={[styles.btn, styles.btnSecondary]}
                        onPress={() => handlePrevious(3)}
                    >
                        <Ionicons name="arrow-back" size={20} color="#666" />
                        <Text style={styles.btnTextSecondary}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnPrimary]} 
                        onPress={submitPoll}
                        disabled={loading}
                    >
                        {loading ? (
                            <Text style={styles.btnText}>Creating Poll...</Text>
                        ) : (
                            <>
                                <Text style={styles.btnText}>Create Poll</Text>
                                <Ionicons name="checkmark" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Daily Poll</Text>
                <View style={{width: 24}} />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <Animated.View 
                        style={[
                            styles.progressFill,
                            { width: progress.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%']
                            }) }
                        ]} 
                    />
                </View>
                <View style={styles.progressLabels}>
                    <Text style={[styles.progressText, step >= 1 && styles.progressTextActive]}>Basic</Text>
                    <Text style={[styles.progressText, step >= 2 && styles.progressTextActive]}>Time</Text>
                    <Text style={[styles.progressText, step >= 3 && styles.progressTextActive]}>Network</Text>
                    <Text style={[styles.progressText, step >= 4 && styles.progressTextActive]}>Summary</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
                {step === 1 && renderBasicInfo()}
                {step === 2 && renderTimeSlots()}
                {step === 3 && renderNetworks()}
                {step === 4 && renderSummary()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    progressContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#afd826',
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    progressText: {
        fontSize: 12,
        color: '#999',
    },
    progressTextActive: {
        color: '#afd826',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#333',
        marginBottom: 12,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    dateText: {
        fontSize: 14,
        color: '#333',
    },
    slotCard: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    slotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    slotTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    slotLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeInputContainer: {
        flex: 1,
        marginRight: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 2,
        borderColor: '#afd826',
        borderStyle: 'dashed',
        borderRadius: 8,
        marginBottom: 16,
    },
    addButtonText: {
        fontSize: 14,
        color: '#afd826',
        fontWeight: '500',
        marginLeft: 8,
    },
    networkHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    networkSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    networkActions: {
        flexDirection: 'row',
        gap: 12,
    },
    networkActionText: {
        fontSize: 12,
        color: '#afd826',
        fontWeight: '500',
    },
    networkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 8,
    },
    networkItemSelected: {
        borderColor: '#afd826',
        backgroundColor: '#f8fdf0',
    },
    networkInfo: {
        flex: 1,
    },
    networkName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    networkPassengers: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#afd826',
        borderColor: '#afd826',
    },
    summarySection: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    summaryText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    coordinatesText: {
        fontSize: 12,
        color: '#999',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    navigationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 120,
        justifyContent: 'center',
    },
    btnPrimary: {
        backgroundColor: '#afd826',
    },
    btnSecondary: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    btnText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
        marginRight: 8,
    },
    btnTextSecondary: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        marginLeft: 8,
    },
});