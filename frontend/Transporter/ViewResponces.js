import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Dimensions,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart, BarChart } from "react-native-chart-kit";

const { width: screenWidth } = Dimensions.get("window");

export default function ViewResponse({ navigation, route }) {
    const { pollData, isNewPoll } = route.params || {};
    
    // Mock passenger responses data
    const [passengerResponses, setPassengerResponses] = useState([
        {
            id: 1,
            passengerName: "Ali Ahmed",
            network: "Blue Area",
            timeSlot: "Morning Slot",
            responseTime: new Date(2025, 8, 26, 10, 30),
            status: "confirmed"
        },
        {
            id: 2,
            passengerName: "Sara Khan",
            network: "Gulberg", 
            timeSlot: "Evening Slot",
            responseTime: new Date(2025, 8, 26, 11, 15),
            status: "confirmed"
        },
        {
            id: 3,
            passengerName: "Usman Malik",
            network: "Blue Area",
            timeSlot: "Morning Slot", 
            responseTime: new Date(2025, 8, 26, 14, 20),
            status: "confirmed"
        },
        {
            id: 4,
            passengerName: "Fatima Noor",
            network: "DHA",
            timeSlot: "Evening Slot",
            responseTime: new Date(2025, 8, 26, 16, 45),
            status: "pending"
        },
        {
            id: 5,
            passengerName: "Bilal Raza",
            network: "Gulberg",
            timeSlot: "Morning Slot",
            responseTime: new Date(2025, 8, 26, 18, 10),
            status: "confirmed"
        },
        {
            id: 6,
            passengerName: "Ayesha Siddiqui",
            network: "Johar Town",
            timeSlot: "Evening Slot",
            responseTime: new Date(2025, 8, 26, 19, 30),
            status: "cancelled"
        }
    ]);

    const [poll, setPoll] = useState(pollData || {
        id: "1",
        date: new Date(),
        message: "Please select your preferred time slot for tomorrow's transportation.",
        timeSlots: [
            { id: 1, type: "Morning Slot", start: "09:00 AM", end: "11:00 AM", max: 50 },
            { id: 2, type: "Evening Slot", start: "05:00 PM", end: "07:00 PM", max: 50 },
        ],
        networks: [
            { id: 1, name: "Blue Area", passengers: 156, selected: true },
            { id: 2, name: "Gulberg", passengers: 132, selected: true },
            { id: 3, name: "DHA", passengers: 98, selected: true },
            { id: 4, name: "Johar Town", passengers: 87, selected: true },
        ],
        totalPassengers: 473,
        totalCapacity: 100,
        createdAt: new Date(),
        status: "active"
    });

    // Calculate response statistics
    const responseStats = {
        total: passengerResponses.length,
        confirmed: passengerResponses.filter(r => r.status === 'confirmed').length,
        pending: passengerResponses.filter(r => r.status === 'pending').length,
        cancelled: passengerResponses.filter(r => r.status === 'cancelled').length,
    };

    // Time slot distribution
    const timeSlotDistribution = poll.timeSlots.map(slot => ({
        name: slot.type,
        count: passengerResponses.filter(r => r.timeSlot === slot.type).length,
        capacity: slot.max,
        percentage: Math.round((passengerResponses.filter(r => r.timeSlot === slot.type).length / slot.max) * 100)
    }));

    // Network distribution
    const networkDistribution = poll.networks.filter(net => net.selected).map(network => ({
        name: network.name,
        count: passengerResponses.filter(r => r.network === network.name).length,
        total: network.passengers,
        percentage: Math.round((passengerResponses.filter(r => r.network === network.name).length / network.passengers) * 100)
    }));

    // Chart data
    const statusChartData = [
        {
            name: "Confirmed",
            population: responseStats.confirmed,
            color: "#4CAF50",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        },
        {
            name: "Pending",
            population: responseStats.pending,
            color: "#FF9800",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        },
        {
            name: "Cancelled",
            population: responseStats.cancelled,
            color: "#F44336",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        }
    ];

    const timeSlotChartData = {
        labels: timeSlotDistribution.map(ts => ts.name),
        datasets: [
            {
                data: timeSlotDistribution.map(ts => ts.count),
            }
        ]
    };

    // Enhanced Header with Stats
    const Header = () => (
        <View style={styles.headerBar}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Poll Responses</Text>
                <View style={styles.headerStats}>
                    <Text style={styles.headerStat}>
                        📅 {new Date(poll.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.headerStat}>
                        👥 {responseStats.total} responses
                    </Text>
                </View>
            </View>

            <View style={styles.headerActions}>
                <TouchableOpacity 
                    style={styles.headerIconButton}
                    onPress={() => Alert.alert("Refresh", "Responses updated!")}
                >
                    <Ionicons name="refresh" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.headerIconButton}
                    onPress={() => Alert.alert("Share", "Share responses data")}
                >
                    <Ionicons name="share-outline" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Response Status Badge
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            confirmed: { color: '#4CAF50', label: 'Confirmed' },
            pending: { color: '#FF9800', label: 'Pending' },
            cancelled: { color: '#F44336', label: 'Cancelled' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        
        return (
            <View style={[styles.statusBadge, { backgroundColor: config.color }]}>
                <Text style={styles.statusText}>{config.label}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />
            <Header />
            
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {isNewPoll && (
                    <View style={styles.successBanner}>
                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        <Text style={styles.successText}>Poll created successfully! Waiting for passenger responses.</Text>
                    </View>
                )}

                {/* Quick Stats Overview */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{responseStats.total}</Text>
                        <Text style={styles.statLabel}>Total Responses</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{responseStats.confirmed}</Text>
                        <Text style={styles.statLabel}>Confirmed</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#FF9800' }]}>{responseStats.pending}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#F44336' }]}>{responseStats.cancelled}</Text>
                        <Text style={styles.statLabel}>Cancelled</Text>
                    </View>
                </View>

                {/* Response Status Chart */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Response Status</Text>
                    <PieChart
                        data={statusChartData}
                        width={screenWidth - 64}
                        height={160}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                </View>

                {/* Time Slot Distribution */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Time Slot Distribution</Text>
                    {timeSlotDistribution.map((slot, index) => (
                        <View key={index} style={styles.distributionItem}>
                            <View style={styles.distributionHeader}>
                                <Text style={styles.distributionName}>{slot.name}</Text>
                                <Text style={styles.distributionCount}>
                                    {slot.count}/{slot.capacity} ({slot.percentage}%)
                                </Text>
                            </View>
                            <View style={styles.progressBar}>
                                <View 
                                    style={[
                                        styles.progressFill,
                                        { 
                                            width: `${Math.min(slot.percentage, 100)}%`,
                                            backgroundColor: slot.percentage > 80 ? '#F44336' : 
                                                           slot.percentage > 60 ? '#FF9800' : '#4CAF50'
                                        }
                                    ]} 
                                />
                            </View>
                            <Text style={styles.timeRange}>
                                {poll.timeSlots.find(ts => ts.type === slot.name)?.start} - 
                                {poll.timeSlots.find(ts => ts.type === slot.name)?.end}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Network Distribution */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Network Responses</Text>
                    {networkDistribution.map((network, index) => (
                        <View key={index} style={styles.networkStats}>
                            <View style={styles.networkInfo}>
                                <Text style={styles.networkName}>{network.name}</Text>
                                <Text style={styles.networkResponse}>
                                    {network.count} / {network.total} passengers ({network.percentage}%)
                                </Text>
                            </View>
                            <View style={styles.responseBar}>
                                <View 
                                    style={[
                                        styles.responseFill,
                                        { width: `${Math.min(network.percentage, 100)}%` }
                                    ]} 
                                />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Individual Passenger Responses */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Passenger Responses</Text>
                        <Text style={styles.responseCount}>({passengerResponses.length})</Text>
                    </View>
                    
                    {passengerResponses.map((response) => (
                        <View key={response.id} style={styles.responseItem}>
                            <View style={styles.responseHeader}>
                                <Text style={styles.passengerName}>{response.passengerName}</Text>
                                <StatusBadge status={response.status} />
                            </View>
                            <View style={styles.responseDetails}>
                                <View style={styles.responseDetail}>
                                    <Ionicons name="location-outline" size={14} color="#666" />
                                    <Text style={styles.detailText}>{response.network}</Text>
                                </View>
                                <View style={styles.responseDetail}>
                                    <Ionicons name="time-outline" size={14} color="#666" />
                                    <Text style={styles.detailText}>{response.timeSlot}</Text>
                                </View>
                                <View style={styles.responseDetail}>
                                    <Ionicons name="calendar-outline" size={14} color="#666" />
                                    <Text style={styles.detailText}>
                                        {response.responseTime.toLocaleDateString()} at {response.responseTime.toLocaleTimeString()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
                        <Ionicons name="download-outline" size={18} color="#fff" />
                        <Text style={styles.primaryBtnText}>Export Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
                        <Ionicons name="notifications-outline" size={18} color="#666" />
                        <Text style={styles.secondaryBtnText}>Send Reminder</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
    container: { flex: 1, padding: 16 },
    
    // Header Styles
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        height: 70,
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
    headerContent: {
        flex: 1,
        alignItems: "center",
    },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "#fff",
        marginBottom: 2,
    },
    headerStats: {
        flexDirection: "row",
        gap: 12,
    },
    headerStat: {
        fontSize: 12,
        color: "#fff",
        opacity: 0.9,
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    headerIconButton: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
    },
    
    // Success Banner
    successBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5E8",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#4CAF50",
    },
    successText: {
        marginLeft: 8,
        color: "#2E7D32",
        fontWeight: "500",
        flex: 1,
    },
    
    // Stats Grid
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        minWidth: "45%",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        elevation: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#afd826",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
    
    // Cards
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
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    responseCount: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    
    // Distribution Items
    distributionItem: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    distributionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    distributionName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    distributionCount: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666",
    },
    timeRange: {
        fontSize: 12,
        color: "#888",
        marginTop: 4,
    },
    
    // Progress Bars
    progressBar: {
        height: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 4,
    },
    
    // Network Stats
    networkStats: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    networkInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    networkName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    networkResponse: {
        fontSize: 14,
        color: "#666",
    },
    responseBar: {
        height: 6,
        backgroundColor: "#f0f0f0",
        borderRadius: 3,
        overflow: "hidden",
    },
    responseFill: {
        height: "100%",
        backgroundColor: "#afd826",
        borderRadius: 3,
    },
    
    // Response Items
    responseItem: {
        backgroundColor: "#fafafa",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#afd826",
    },
    responseHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    passengerName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    responseDetails: {
        gap: 6,
    },
    responseDetail: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    detailText: {
        fontSize: 14,
        color: "#666",
    },
    
    // Status Badge
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
    },
    
    // Action Buttons
    actionButtons: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },
    actionBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
        borderRadius: 10,
        gap: 8,
    },
    primaryBtn: {
        backgroundColor: "#afd826",
    },
    secondaryBtn: {
        backgroundColor: "#f8f8f8",
        borderWidth: 1,
        borderColor: "#e1e1e1",
    },
    primaryBtnText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 14,
    },
    secondaryBtnText: {
        color: "#666",
        fontWeight: "600",
        fontSize: 14,
    },
});