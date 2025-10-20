import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    FlatList,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PassengerDataList({ navigation, route }) {
    const { passengers, title, poll } = route.params || {};
    
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name"); // name, network, timeSlot, time

    // Filter passengers based on search query
    const filteredPassengers = passengers.filter(passenger =>
        passenger.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passenger.network.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passenger.timeSlot.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort passengers
    const sortedPassengers = [...filteredPassengers].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.passengerName.localeCompare(b.passengerName);
            case 'network':
                return a.network.localeCompare(b.network);
            case 'timeSlot':
                return a.timeSlot.localeCompare(b.timeSlot);
            case 'time':
                return new Date(b.responseTime) - new Date(a.responseTime);
            default:
                return 0;
        }
    });

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#4CAF50';
            case 'pending': return '#FF9800';
            case 'cancelled': return '#F44336';
            default: return '#666';
        }
    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed': return 'Confirmed';
            case 'pending': return 'Pending';
            case 'cancelled': return 'Cancelled';
            default: return 'Unknown';
        }
    };

    // Render passenger item
    const renderPassengerItem = ({ item, index }) => (
        <View style={[
            styles.passengerItem,
            index % 2 === 0 ? styles.evenItem : styles.oddItem
        ]}>
            <View style={styles.passengerHeader}>
                <View style={styles.nameContainer}>
                    <Text style={styles.passengerName}>{item.passengerName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                    </View>
                </View>
                <Text style={styles.responseTime}>
                    {item.responseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>

            <View style={styles.passengerDetails}>
                <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.network}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.timeSlot}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                        {item.responseTime.toLocaleDateString()}
                    </Text>
                </View>
            </View>
        </View>
    );

    // Header
    const Header = () => (
        <View style={styles.headerBar}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>{title}</Text>
                <Text style={styles.headerSubtitle}>
                    {sortedPassengers.length} passengers
                </Text>
            </View>

            <View style={styles.headerButton} />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />
            <Header />
            
            <View style={styles.container}>
                {/* Search and Filter Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search passengers..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#999"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery("")}>
                                <Ionicons name="close-circle" size={20} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="filter" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Sort Options */}
                <View style={styles.sortContainer}>
                    <Text style={styles.sortLabel}>Sort by:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.sortOptions}>
                            <TouchableOpacity 
                                style={[styles.sortOption, sortBy === 'name' && styles.sortOptionActive]}
                                onPress={() => setSortBy('name')}
                            >
                                <Text style={[styles.sortOptionText, sortBy === 'name' && styles.sortOptionTextActive]}>
                                    Name
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.sortOption, sortBy === 'network' && styles.sortOptionActive]}
                                onPress={() => setSortBy('network')}
                            >
                                <Text style={[styles.sortOptionText, sortBy === 'network' && styles.sortOptionTextActive]}>
                                    Network
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.sortOption, sortBy === 'timeSlot' && styles.sortOptionActive]}
                                onPress={() => setSortBy('timeSlot')}
                            >
                                <Text style={[styles.sortOptionText, sortBy === 'timeSlot' && styles.sortOptionTextActive]}>
                                    Time Slot
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.sortOption, sortBy === 'time' && styles.sortOptionActive]}
                                onPress={() => setSortBy('time')}
                            >
                                <Text style={[styles.sortOptionText, sortBy === 'time' && styles.sortOptionTextActive]}>
                                    Response Time
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>

                {/* Passenger List */}
                {sortedPassengers.length > 0 ? (
                    <FlatList
                        data={sortedPassengers}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPassengerItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateText}>
                            {searchQuery ? 'No passengers found' : 'No passengers available'}
                        </Text>
                        <Text style={styles.emptyStateSubtext}>
                            {searchQuery ? 'Try adjusting your search' : 'Passengers will appear here once they respond'}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
    container: { flex: 1, padding: 16 },
    
    // Header
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
    headerSubtitle: {
        fontSize: 12,
        color: "#fff",
        opacity: 0.9,
    },
    
    // Search and Filter
    searchContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    filterButton: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
    },
    
    // Sort Options
    sortContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 12,
    },
    sortLabel: {
        fontSize: 14,
        color: "#666",
        fontWeight: "600",
    },
    sortOptions: {
        flexDirection: "row",
        gap: 8,
    },
    sortOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
    },
    sortOptionActive: {
        backgroundColor: "#afd826",
    },
    sortOptionText: {
        fontSize: 12,
        color: "#666",
        fontWeight: "600",
    },
    sortOptionTextActive: {
        color: "#fff",
    },
    
    // List Content
    listContent: {
        paddingBottom: 20,
    },
    
    // Passenger Items
    passengerItem: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#afd826",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    evenItem: {
        backgroundColor: "#fff",
    },
    oddItem: {
        backgroundColor: "#fafafa",
    },
    passengerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    nameContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    passengerName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
    },
    responseTime: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
    },
    passengerDetails: {
        gap: 6,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: "#666",
    },
    
    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    emptyStateText: {
        fontSize: 18,
        color: "#666",
        marginTop: 16,
        textAlign: "center",
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: "#999",
        marginTop: 8,
        textAlign: "center",
    },
});