import React, { useState } from "react";
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

export default function CreateDailyPoll({ navigation }) {
    const [step, setStep] = useState(1);
    const [progress] = useState(new Animated.Value(25));

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
            max: 50,
            startTime: new Date(2025, 8, 27, 9, 0),
            endTime: new Date(2025, 8, 27, 11, 0)
        },
    ]);
    const [networks, setNetworks] = useState([
        { id: 1, name: "Blue Area", passengers: 156, selected: false },
        { id: 2, name: "Gulberg", passengers: 132, selected: false },
        { id: 3, name: "DHA", passengers: 98, selected: false },
        { id: 4, name: "Johar Town", passengers: 87, selected: false },
    ]);

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
            max: 50,
            startTime: new Date(2025, 8, 27, 12, 0),
            endTime: new Date(2025, 8, 27, 14, 0)
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

    // Submit poll and navigate to View Response
    const submitPoll = () => {
        const selectedNetworks = networks.filter(net => net.selected);
        
        if (selectedNetworks.length === 0) {
            Alert.alert("No Networks Selected", "Please select at least one network.");
            return;
        }

        if (timeSlots.length === 0) {
            Alert.alert("No Time Slots", "Please add at least one time slot.");
            return;
        }

        // Prepare poll data to send to View Response screen
        const pollData = {
            id: Date.now().toString(),
            date: pollDate,
            message: pollMessage,
            timeSlots: timeSlots,
            networks: selectedNetworks,
            totalPassengers: selectedNetworks.reduce((sum, net) => sum + net.passengers, 0),
            totalCapacity: timeSlots.reduce((sum, slot) => sum + slot.max, 0),
            createdAt: new Date(),
            status: "active"
        };

        Alert.alert(
            "Confirm Poll",
            "Are you sure you want to send this poll to selected networks?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Send Poll", 
                    onPress: () => {
                        // Navigate to ViewResponse screen with the poll data
                        navigation.navigate('ViewResponse', { 
                            pollData: pollData,
                            isNewPoll: true 
                        });
                    }
                }
            ]
        );
    };

    // Custom Header
    const Header = ({ title }) => (
        <View style={styles.headerBar}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.headerButton} />
        </View>
    );

    // Progress Bar
    const ProgressBar = () => (
        <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
                <Text style={styles.progressText}>Basic Info</Text>
                <Text style={styles.progressText}>Time Slots</Text>
                <Text style={styles.progressText}>Networks</Text>
                <Text style={styles.progressText}>Summary</Text>
            </View>
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
        </View>
    );

    // Step 1: Basic Information
    const renderBasicInfo = () => (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Poll Information</Text>
            
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
                numberOfLines={4}
                value={pollMessage}
                onChangeText={setPollMessage}
                placeholder="Enter your poll message here..."
            />

            <TouchableOpacity 
                style={[styles.btn, styles.btnPrimary]} 
                onPress={() => handleNext(2)}
            >
                <Text style={styles.btnText}>Next: Time Slots</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>
        </View>
    );

    // Step 2: Time Slots
    const renderTimeSlots = () => (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Time Slots Configuration</Text>
            
            <View style={styles.slotsContainer}>
                {timeSlots.map((slot) => (
                    <View key={slot.id} style={styles.slotCard}>
                        <View style={styles.slotHeader}>
                            <Text style={styles.slotTitle}>Time Slot</Text>
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => removeTimeSlot(slot.id)}
                            >
                                <Ionicons name="trash-outline" size={20} color="#ff4444" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.slotLabel}>Slot Name</Text>
                        <TextInput
                            style={styles.input}
                            value={slot.type}
                            onChangeText={(text) => {
                                setTimeSlots(timeSlots.map(s => 
                                    s.id === slot.id ? { ...s, type: text } : s
                                ));
                            }}
                            placeholder="e.g., Morning Slot, Evening Slot"
                        />

                        <View style={styles.timeRow}>
                            <View style={styles.timeInputContainer}>
                                <Text style={styles.slotLabel}>Start Time</Text>
                                <TextInput
                                    style={styles.input}
                                    value={slot.start}
                                    onChangeText={(text) => {
                                        setTimeSlots(timeSlots.map(s => 
                                            s.id === slot.id ? { ...s, start: text } : s
                                        ));
                                    }}
                                    placeholder="09:00 AM"
                                />
                            </View>
                            <View style={styles.timeInputContainer}>
                                <Text style={styles.slotLabel}>End Time</Text>
                                <TextInput
                                    style={styles.input}
                                    value={slot.end}
                                    onChangeText={(text) => {
                                        setTimeSlots(timeSlots.map(s => 
                                            s.id === slot.id ? { ...s, end: text } : s
                                        ));
                                    }}
                                    placeholder="11:00 AM"
                                />
                            </View>
                        </View>

                        <Text style={styles.slotLabel}>Maximum Passengers</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={String(slot.max)}
                            onChangeText={(text) => {
                                const numValue = parseInt(text) || 0;
                                setTimeSlots(timeSlots.map(s => 
                                    s.id === slot.id ? { ...s, max: numValue } : s
                                ));
                            }}
                            placeholder="50"
                        />
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={addNewTimeSlot}
            >
                <Ionicons name="add-circle-outline" size={20} color="#2a7" />
                <Text style={styles.addButtonText}>Add Another Time Slot</Text>
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
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Step 3: Networks
    const renderNetworks = () => {
        const selectedCount = networks.filter(net => net.selected).length;
        
        return (
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Select Networks</Text>
                
                <View style={styles.networkHeader}>
                    <Text style={styles.networkSubtitle}>
                        {selectedCount} of {networks.length} networks selected
                    </Text>
                    <View style={styles.networkActions}>
                        <TouchableOpacity 
                            style={styles.networkActionBtn}
                            onPress={selectAllNetworks}
                        >
                            <Text style={styles.networkActionText}>Select All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.networkActionBtn}
                            onPress={deselectAllNetworks}
                        >
                            <Text style={styles.networkActionText}>Clear All</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.networksList}>
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
                                    {network.passengers} passengers
                                </Text>
                            </View>
                            <View style={[
                                styles.checkbox,
                                network.selected && styles.checkboxSelected
                            ]}>
                                {network.selected && (
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

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
                        <Ionicons name="arrow-forward" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // Step 4: Summary
    const renderSummary = () => {
        const selectedNetworks = networks.filter(net => net.selected);
        const totalPassengers = selectedNetworks.reduce((sum, net) => sum + net.passengers, 0);
        const totalCapacity = timeSlots.reduce((sum, slot) => sum + slot.max, 0);

        return (
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Poll Summary</Text>

                {/* Quick Stats */}
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{selectedNetworks.length}</Text>
                        <Text style={styles.statLabel}>Networks</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{totalPassengers}</Text>
                        <Text style={styles.statLabel}>Passengers</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{timeSlots.length}</Text>
                        <Text style={styles.statLabel}>Time Slots</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{totalCapacity}</Text>
                        <Text style={styles.statLabel}>Total Capacity</Text>
                    </View>
                </View>

                {/* Poll Details */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>📅 Poll Date</Text>
                    <Text style={styles.summaryContent}>{formatDate(pollDate)}</Text>
                </View>

                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>💬 Poll Message</Text>
                    <Text style={styles.summaryContent}>{pollMessage}</Text>
                </View>

                {/* Selected Networks */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>🌐 Selected Networks</Text>
                    {selectedNetworks.length === 0 ? (
                        <Text style={styles.noSelection}>No networks selected</Text>
                    ) : (
                        selectedNetworks.map((network) => (
                            <View key={network.id} style={styles.networkSummaryItem}>
                                <Text style={styles.networkSummaryName}>{network.name}</Text>
                                <Text style={styles.networkSummaryPassengers}>
                                    {network.passengers} passengers
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                {/* Time Slots */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>⏰ Time Slots</Text>
                    {timeSlots.map((slot, index) => (
                        <View key={slot.id} style={styles.timeSlotSummary}>
                            <Text style={styles.timeSlotName}>{slot.type}</Text>
                            <Text style={styles.timeSlotTime}>
                                {slot.start} - {slot.end}
                            </Text>
                            <Text style={styles.timeSlotCapacity}>
                                Capacity: {slot.max} passengers
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Navigation */}
                <View style={styles.navigationRow}>
                    <TouchableOpacity
                        style={[styles.btn, styles.btnSecondary]}
                        onPress={() => handlePrevious(3)}
                    >
                        <Ionicons name="arrow-back" size={20} color="#666" />
                        <Text style={styles.btnTextSecondary}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnSuccess]} 
                        onPress={submitPoll}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.btnTextSuccess}>Send Poll & View Response</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />
            <Header title="Create Daily Poll" />
            <ProgressBar />
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {step === 1 && renderBasicInfo()}
                {step === 2 && renderTimeSlots()}
                {step === 3 && renderNetworks()}
                {step === 4 && renderSummary()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, flexGrow: 1 },

    // Header
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        height: 60,
        backgroundColor: "#afd826",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "#fff",
        textAlign: "center",
    },

    // Progress Bar
    progressContainer: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    progressLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    progressText: {
        fontSize: 10,
        fontWeight: "500",
        color: "#666",
        textAlign: "center",
        flex: 1,
    },
    progressBar: {
        height: 6,
        backgroundColor: "#f0f0f0",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#afd826",
        borderRadius: 3,
    },

    // Cards & Layout
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 20,
        color: "#222",
    },

    // Inputs
    label: {
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 6,
        color: "#444",
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 10,
        padding: 12,
        backgroundColor: "#fafafa",
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    dateInput: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 10,
        padding: 12,
        backgroundColor: "#fafafa",
    },
    dateText: {
        fontSize: 16,
        color: "#333",
    },

    // Buttons
    btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
        borderRadius: 10,
        marginTop: 15,
        flex: 1,
        marginHorizontal: 5,
    },
    btnPrimary: {
        backgroundColor: "#afd826",
    },
    btnSecondary: {
        backgroundColor: "#f8f8f8",
        borderWidth: 1,
        borderColor: "#e1e1e1",
    },
    btnSuccess: {
        backgroundColor: "#28a745",
    },
    btnText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
        marginRight: 8,
    },
    btnTextSecondary: {
        color: "#666",
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 8,
    },
    btnTextSuccess: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 8,
    },

    // Time Slots
    slotsContainer: {
        marginBottom: 16,
    },
    slotCard: {
        borderWidth: 1,
        borderColor: "#e8e8e8",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        backgroundColor: "#fefefe",
    },
    slotHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    slotTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    deleteBtn: {
        padding: 4,
    },
    timeRow: {
        flexDirection: "row",
        gap: 12,
    },
    timeInputContainer: {
        flex: 1,
    },
    slotLabel: {
        fontWeight: "600",
        marginTop: 8,
        marginBottom: 4,
        color: "#555",
        fontSize: 13,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f9ff",
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#e1f5fe",
        borderStyle: "dashed",
    },
    addButtonText: {
        color: "#2a7",
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 8,
    },

    // Networks
    networkHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    networkSubtitle: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    networkActions: {
        flexDirection: "row",
        gap: 12,
    },
    networkActionBtn: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    networkActionText: {
        color: "#afd826",
        fontWeight: "600",
        fontSize: 12,
    },
    networksList: {
        gap: 8,
    },
    networkItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        backgroundColor: "#fafafa",
    },
    networkItemSelected: {
        backgroundColor: "#f2ffe0",
        borderColor: "#afd826",
    },
    networkInfo: {
        flex: 1,
    },
    networkName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 2,
    },
    networkPassengers: {
        fontSize: 14,
        color: "#666",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxSelected: {
        backgroundColor: "#afd826",
        borderColor: "#afd826",
    },

    // Summary
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    statItem: {
        alignItems: "center",
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#afd826",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
    summarySection: {
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    summaryContent: {
        fontSize: 15,
        color: "#555",
        lineHeight: 20,
    },
    noSelection: {
        color: "#999",
        fontStyle: "italic",
    },
    networkSummaryItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    networkSummaryName: {
        fontSize: 15,
        color: "#444",
    },
    networkSummaryPassengers: {
        fontSize: 14,
        color: "#666",
    },
    timeSlotSummary: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    timeSlotName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        marginBottom: 2,
    },
    timeSlotTime: {
        fontSize: 14,
        color: "#666",
        marginBottom: 2,
    },
    timeSlotCapacity: {
        fontSize: 13,
        color: "#888",
    },

    // Navigation
    navigationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
});