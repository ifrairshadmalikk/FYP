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
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";

const { width: screenWidth } = Dimensions.get("window");

export default function ViewResponse({ navigation, route }) {
    const { pollData, passengerResponses: initialResponses, isNewPoll } = route.params || {};
    
    const [refreshing, setRefreshing] = useState(false);
    const [passengerResponses, setPassengerResponses] = useState(initialResponses || []);
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

    // Simulate real-time response updates
    useEffect(() => {
        if (isNewPoll) {
            // Simulate new responses coming in
            const interval = setInterval(() => {
                setPassengerResponses(prev => {
                    if (prev.length >= poll.totalPassengers) {
                        clearInterval(interval);
                        return prev;
                    }
                    
                    const newResponse = generateNewResponse(prev.length + 1);
                    return [...prev, newResponse];
                });
            }, 3000); // New response every 3 seconds

            return () => clearInterval(interval);
        }
    }, [isNewPoll, poll.totalPassengers]);

    const generateNewResponse = (id) => {
        const names = ["Ahmed Raza", "Sanaullah Khan", "Muhammad Usman", "Fatima Batool", "Bilal Ahmed", "Ayesha Noor", "Omar Hayat", "Zainab Shah"];
        const networks = poll.networks.filter(net => net.selected).map(net => net.name);
        const timeSlots = poll.timeSlots.map(ts => ts.type);
        const statuses = ["confirmed", "pending"];
        
        return {
            id: Date.now() + id,
            passengerName: names[Math.floor(Math.random() * names.length)],
            network: networks[Math.floor(Math.random() * networks.length)],
            timeSlot: timeSlots[Math.floor(Math.random() * timeSlots.length)],
            responseTime: new Date(),
            status: statuses[Math.floor(Math.random() * statuses.length)]
        };
    };

    // Calculate response statistics
    const responseStats = {
        total: passengerResponses.length,
        confirmed: passengerResponses.filter(r => r.status === 'confirmed').length,
        pending: passengerResponses.filter(r => r.status === 'pending').length,
        cancelled: passengerResponses.filter(r => r.status === 'cancelled').length,
        responseRate: Math.round((passengerResponses.length / poll.totalPassengers) * 100)
    };

    // Time slot distribution
    const timeSlotDistribution = poll.timeSlots.map(slot => ({
        name: slot.type,
        count: passengerResponses.filter(r => r.timeSlot === slot.type).length,
        capacity: slot.max,
        percentage: Math.round((passengerResponses.filter(r => r.timeSlot === slot.type).length / slot.max) * 100),
        timeRange: `${slot.start} - ${slot.end}`
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

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            setRefreshing(false);
            Alert.alert("Refreshed", "Responses updated successfully!");
        }, 1000);
    };

    const handleSendReminder = () => {
        Alert.alert(
            "Send Reminder",
            `Send reminder to ${poll.totalPassengers - responseStats.total} passengers who haven't responded yet?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Send", 
                    onPress: () => {
                        Alert.alert("Success", "Reminders sent successfully!");
                    }
                }
            ]
        );
    };

    const handleExportData = () => {
        Alert.alert("Export Data", "Poll responses exported successfully!", [
            { text: "OK" }
        ]);
    };

    // Enhanced Header with Stats
    const Header = () => (
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.menuButton}
                >
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Poll Responses</Text>
                    <View style={styles.headerStats}>
                        <Text style={styles.headerStat}>
                            📅 {new Date(poll.date).toLocaleDateString()}
                        </Text>
                        <Text style={styles.headerStat}>
                            👥 {responseStats.responseRate}% Response Rate
                        </Text>
                    </View>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity 
                        style={styles.headerIconButton}
                        onPress={onRefresh}
                    >
                        <Ionicons name="refresh" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    // Response Status Badge
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            confirmed: { color: '#4CAF50', label: 'Confirmed', icon: 'checkmark-circle' },
            pending: { color: '#FF9800', label: 'Pending', icon: 'time' },
            cancelled: { color: '#F44336', label: 'Cancelled', icon: 'close-circle' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        
        return (
            <View style={[styles.statusBadge, { backgroundColor: config.color }]}>
                <Ionicons name={config.icon} size={12} color="#fff" />
                <Text style={styles.statusText}>{config.label}</Text>
            </View>
        );
    };

    // Progress Bar Component
    const ProgressBar = ({ percentage, color, height = 8 }) => (
        <View style={[styles.progressBar, { height }]}>
            <View 
                style={[
                    styles.progressFill,
                    { 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: color
                    }
                ]} 
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />
            <Header />
            
            <ScrollView 
                style={styles.container} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {isNewPoll && (
                    <View style={styles.successBanner}>
                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        <View style={styles.successContent}>
                            <Text style={styles.successText}>Poll sent successfully!</Text>
                            <Text style={styles.successSubtext}>
                                {responseStats.total} responses received • {responseStats.responseRate}% response rate
                            </Text>
                        </View>
                        <View style={styles.liveIndicator}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                    </View>
                )}

                {/* Quick Stats Overview */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="people" size={20} color="#afd826" />
                        </View>
                        <Text style={styles.statNumber}>{responseStats.total}</Text>
                        <Text style={styles.statLabel}>Total Responses</Text>
                        <Text style={styles.statSubtext}>of {poll.totalPassengers}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="checkmark-done" size={20} color="#4CAF50" />
                        </View>
                        <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{responseStats.confirmed}</Text>
                        <Text style={styles.statLabel}>Confirmed</Text>
                        <ProgressBar percentage={(responseStats.confirmed / responseStats.total) * 100} color="#4CAF50" height={4} />
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="time" size={20} color="#FF9800" />
                        </View>
                        <Text style={[styles.statNumber, { color: '#FF9800' }]}>{responseStats.pending}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                        <ProgressBar percentage={(responseStats.pending / responseStats.total) * 100} color="#FF9800" height={4} />
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="trending-up" size={20} color="#afd826" />
                        </View>
                        <Text style={styles.statNumber}>{responseStats.responseRate}%</Text>
                        <Text style={styles.statLabel}>Response Rate</Text>
                        <ProgressBar percentage={responseStats.responseRate} color="#afd826" height={4} />
                    </View>
                </View>

                {/* Response Status Chart */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Response Status</Text>
                        <Text style={styles.cardSubtitle}>Real-time response distribution</Text>
                    </View>
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
                    <View style={styles.chartLegend}>
                        {statusChartData.map((item, index) => (
                            <View key={index} style={styles.legendItem}>
                                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                <Text style={styles.legendText}>{item.name}: {item.population}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Time Slot Distribution */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Time Slot Distribution</Text>
                        <Text style={styles.cardSubtitle}>Passenger preferences by time</Text>
                    </View>
                    {timeSlotDistribution.map((slot, index) => (
                        <View key={index} style={styles.distributionItem}>
                            <View style={styles.distributionHeader}>
                                <View>
                                    <Text style={styles.distributionName}>{slot.name}</Text>
                                    <Text style={styles.timeRange}>{slot.timeRange}</Text>
                                </View>
                                <Text style={styles.distributionCount}>
                                    {slot.count}/{slot.capacity} ({slot.percentage}%)
                                </Text>
                            </View>
                            <ProgressBar 
                                percentage={slot.percentage} 
                                color={slot.percentage > 80 ? '#F44336' : slot.percentage > 60 ? '#FF9800' : '#4CAF50'}
                            />
                            <View style={styles.capacityInfo}>
                                <Text style={styles.capacityText}>
                                    {slot.capacity - slot.count} seats remaining
                                </Text>
                                {slot.percentage > 80 && (
                                    <Text style={styles.warningText}>Almost Full!</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Network Distribution */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Network Responses</Text>
                        <Text style={styles.cardSubtitle}>Response rate by network</Text>
                    </View>
                    {networkDistribution.map((network, index) => (
                        <View key={index} style={styles.networkStats}>
                            <View style={styles.networkInfo}>
                                <View>
                                    <Text style={styles.networkName}>{network.name}</Text>
                                    <Text style={styles.networkResponse}>
                                        {network.count} responses • {network.percentage}% response rate
                                    </Text>
                                </View>
                                <View style={styles.networkPercentage}>
                                    <Text style={styles.percentageText}>{network.percentage}%</Text>
                                </View>
                            </View>
                            <ProgressBar percentage={network.percentage} color="#afd826" />
                        </View>
                    ))}
                </View>

                {/* Individual Passenger Responses */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Passenger Responses</Text>
                            <Text style={styles.sectionSubtitle}>Latest responses from passengers</Text>
                        </View>
                        <Text style={styles.responseCount}>({passengerResponses.length})</Text>
                    </View>
                    
                    {passengerResponses.slice(-6).reverse().map((response) => (
                        <View key={response.id} style={styles.responseItem}>
                            <View style={styles.responseHeader}>
                                <View style={styles.passengerInfo}>
                                    <Text style={styles.passengerName}>{response.passengerName}</Text>
                                    <Text style={styles.responseNetwork}>{response.network}</Text>
                                </View>
                                <StatusBadge status={response.status} />
                            </View>
                            <View style={styles.responseDetails}>
                                <View style={styles.responseDetail}>
                                    <Ionicons name="time-outline" size={14} color="#666" />
                                    <Text style={styles.detailText}>{response.timeSlot}</Text>
                                </View>
                                <View style={styles.responseDetail}>
                                    <Ionicons name="calendar-outline" size={14} color="#666" />
                                    <Text style={styles.detailText}>
                                        {response.responseTime.toLocaleTimeString()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                    
                    {passengerResponses.length > 6 && (
                        <TouchableOpacity style={styles.viewAllButton}>
                            <Text style={styles.viewAllText}>View All Responses</Text>
                            <Ionicons name="chevron-forward" size={16} color="#afd826" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.primaryBtn]}
                        onPress={handleExportData}
                    >
                        <Ionicons name="download-outline" size={18} color="#fff" />
                        <Text style={styles.primaryBtnText}>Export Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.secondaryBtn]}
                        onPress={handleSendReminder}
                    >
                        <Ionicons name="notifications-outline" size={18} color="#666" />
                        <Text style={styles.secondaryBtnText}>Send Reminder</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#afd826" },
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    
    // Header Styles
    header: {
        backgroundColor: "#afd826",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    menuButton: {
        padding: 8,
    },
    headerContent: {
        flex: 1,
        alignItems: "center",
    },
    headerTitle: { 
        fontSize: 20,
        fontWeight: "800", 
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
    },
    headerIconButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    
    // Success Banner
    successBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5E8",
        padding: 16,
        borderRadius: 12,
        margin: 16,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#4CAF50",
    },
    successContent: {
        flex: 1,
        marginLeft: 12,
    },
    successText: {
        color: "#2E7D32",
        fontWeight: "700",
        fontSize: 16,
    },
    successSubtext: {
        color: "#4CAF50",
        fontSize: 12,
        marginTop: 2,
    },
    liveIndicator: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF5252",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#fff",
        marginRight: 4,
    },
    liveText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
    },
    
    // Stats Grid
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        padding: 16,
        paddingBottom: 8,
    },
    statCard: {
        flex: 1,
        minWidth: "45%",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F8F9FA",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "800",
        color: "#afd826",
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: "#7F8C8D",
        fontWeight: "600",
    },
    statSubtext: {
        fontSize: 10,
        color: "#BDC3C7",
        marginTop: 2,
    },
    
    // Cards
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardHeader: {
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#2C3E50",
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#7F8C8D",
        fontWeight: "500",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#2C3E50",
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "#7F8C8D",
        marginTop: 2,
    },
    responseCount: {
        fontSize: 14,
        color: "#afd826",
        fontWeight: "700",
    },
    
    // Chart Legend
    chartLegend: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
        flexWrap: "wrap",
        gap: 12,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 12,
        color: "#7F8C8D",
    },
    
    // Distribution Items
    distributionItem: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ECF0F1",
    },
    distributionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    distributionName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C3E50",
    },
    timeRange: {
        fontSize: 12,
        color: "#7F8C8D",
        marginTop: 2,
    },
    distributionCount: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2C3E50",
    },
    capacityInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    capacityText: {
        fontSize: 12,
        color: "#7F8C8D",
    },
    warningText: {
        fontSize: 11,
        color: "#F44336",
        fontWeight: "600",
    },
    
    // Progress Bars
    progressBar: {
        height: 8,
        backgroundColor: "#ECF0F1",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 4,
    },
    
    // Network Stats
    networkStats: {
        marginBottom: 20,
    },
    networkInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    networkName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C3E50",
    },
    networkResponse: {
        fontSize: 12,
        color: "#7F8C8D",
        marginTop: 2,
    },
    networkPercentage: {
        backgroundColor: "#F2FFE0",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    percentageText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#afd826",
    },
    
    // Response Items
    responseItem: {
        backgroundColor: "#F8F9FA",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#afd826",
    },
    responseHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    passengerInfo: {
        flex: 1,
    },
    passengerName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C3E50",
        marginBottom: 2,
    },
    responseNetwork: {
        fontSize: 12,
        color: "#7F8C8D",
        fontWeight: "500",
    },
    responseDetails: {
        flexDirection: "row",
        gap: 16,
    },
    responseDetail: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    detailText: {
        fontSize: 12,
        color: "#7F8C8D",
    },
    
    // View All Button
    viewAllButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        backgroundColor: "#F8F9FA",
        borderRadius: 10,
        marginTop: 8,
    },
    viewAllText: {
        color: "#afd826",
        fontWeight: "600",
        fontSize: 14,
        marginRight: 4,
    },
    
    // Status Badge
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },
    
    // Action Buttons
    actionButtons: {
        flexDirection: "row",
        gap: 12,
        padding: 16,
        paddingTop: 0,
        marginBottom: 24,
    },
    actionBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    primaryBtn: {
        backgroundColor: "#afd826",
    },
    secondaryBtn: {
        backgroundColor: "#F8F9FA",
        borderWidth: 1,
        borderColor: "#E1E8ED",
    },
    primaryBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    secondaryBtnText: {
        color: "#7F8C8D",
        fontWeight: "600",
        fontSize: 14,
    },
});