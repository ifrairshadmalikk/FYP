import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    FlatList,
    TextInput,
    Image,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function AddDriverSearch({ navigation }) {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all"); // all, pending, accepted
    const [drivers, setDrivers] = useState([
        {
            id: "1",
            name: "Ali Khan",
            mobile: "0300-1234567",
            location: "Lahore",
            status: "pending",
            experience: "3 years",
            vehicle: "Honda Civic 2020",
            rating: "4.5",
            completedRides: 127,
            joinDate: "15 Jan 2024",
            vehicleType: "Sedan"
        },
        {
            id: "2",
            name: "Zara Iqbal",
            mobile: "0312-1234567",
            location: "Karachi",
            status: "accepted",
            experience: "2 years",
            vehicle: "Toyota Corolla 2019",
            rating: "4.8",
            completedRides: 89,
            joinDate: "20 Feb 2024",
            vehicleType: "Sedan"
        },
        {
            id: "3",
            name: "Ahmed Raza",
            mobile: "0333-1234567",
            location: "Islamabad",
            status: "pending",
            experience: "4 years",
            vehicle: "Suzuki Cultus 2021",
            rating: "4.3",
            completedRides: 156,
            joinDate: "10 Mar 2024",
            vehicleType: "Hatchback"
        },
        {
            id: "4",
            name: "Bilal Hussain",
            mobile: "0302-9876543",
            location: "Faisalabad",
            status: "pending",
            experience: "1 year",
            vehicle: "Toyota Prius 2022",
            rating: "4.6",
            completedRides: 67,
            joinDate: "05 Apr 2024",
            vehicleType: "Hybrid"
        },
        {
            id: "5",
            name: "Saima Noor",
            mobile: "0321-9876543",
            location: "Multan",
            status: "accepted",
            experience: "5 years",
            vehicle: "Honda City 2020",
            rating: "4.9",
            completedRides: 203,
            joinDate: "12 Jan 2024",
            vehicleType: "Sedan"
        },
        {
            id: "6",
            name: "Imran Shah",
            mobile: "0345-1239876",
            location: "Peshawar",
            status: "pending",
            experience: "2 years",
            vehicle: "Suzuki Wagon R 2021",
            rating: "4.4",
            completedRides: 94,
            joinDate: "18 Mar 2024",
            vehicleType: "Hatchback"
        },
    ]);

    // Accept driver request
    const handleAccept = (id) => {
        setDrivers((prev) =>
            prev.map((d) =>
                d.id === id ? { ...d, status: "accepted" } : d
            )
        );
    };

    // Delete driver request
    const handleDelete = (id) => {
        setDrivers((prev) => prev.filter((d) => d.id !== id));
    };

    // Navigate to driver profile
    const handleDriverPress = (driver) => {
        navigation.navigate("DriverProfile", { driver });
    };

    // Filter drivers based on search and active tab
    const filteredDrivers = drivers.filter((d) => {
        const matchesSearch =
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.mobile.includes(search) ||
            d.location.toLowerCase().includes(search.toLowerCase()) ||
            d.vehicle.toLowerCase().includes(search.toLowerCase());

        const matchesTab =
            activeTab === "all" ||
            (activeTab === "pending" && d.status === "pending") ||
            (activeTab === "accepted" && d.status === "accepted");

        return matchesSearch && matchesTab;
    });

    const getVehicleIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'sedan': return 'car-sedan';
            case 'hatchback': return 'car-hatchback';
            case 'suv': return 'car-suv';
            case 'hybrid': return 'car-electric';
            default: return 'car';
        }
    };

    const renderDriver = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.card,
                item.status === "accepted" && styles.acceptedCard
            ]}
            onPress={() => handleDriverPress(item)}
            activeOpacity={0.8}
        >
            {/* Driver Header */}
            <View style={styles.cardHeader}>
                <View style={styles.driverInfo}>
                    <Image
                        source={{
                            uri: "https://ui-avatars.com/api/?name=" + encodeURIComponent(item.name) + "&background=afd826&color=fff&size=100&bold=true",
                        }}
                        style={styles.avatar}
                    />
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.rating}>{item.rating}</Text>
                            <Text style={styles.rides}>({item.completedRides} rides)</Text>
                        </View>
                    </View>
                </View>

                <View style={[
                    styles.statusBadge,
                    item.status === "accepted" ? styles.acceptedBadge : styles.pendingBadge
                ]}>
                    <Text style={styles.statusText}>
                        {item.status === "accepted" ? "Approved" : "Pending"}
                    </Text>
                </View>
            </View>

            {/* Driver Details */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                        <Ionicons name="call-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>{item.mobile}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>{item.location}</Text>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                        <MaterialIcons name={getVehicleIcon(item.vehicleType)} size={16} color="#666" />
                        <Text style={styles.detailText}>{item.vehicle}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <FontAwesome5 name="user-clock" size={14} color="#666" />
                        <Text style={styles.detailText}>{item.experience}</Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            {item.status === "pending" ? (
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleAccept(item.id)}
                    >
                        <Ionicons name="checkmark-circle" size={18} color="#fff" />
                        <Text style={styles.acceptButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Ionicons name="close-circle" size={18} color="#fff" />
                        <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.approvedContainer}>
                    <Ionicons name="checkmark-done-circle" size={20} color="#afd826" />
                    <Text style={styles.approvedText}>Driver Approved</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Driver Management</Text>
                    <Text style={styles.headerSubtitle}>{drivers.length} drivers registered</Text>
                </View>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Stats Overview */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{drivers.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {drivers.filter(d => d.status === "pending").length}
                    </Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {drivers.filter(d => d.status === "accepted").length}
                    </Text>
                    <Text style={styles.statLabel}>Approved</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search drivers by name, location, vehicle..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#999"
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch("")}>
                        <Ionicons name="close-circle" size={18} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Tab Filters */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "all" && styles.activeTab]}
                    onPress={() => setActiveTab("all")}
                >
                    <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
                        All Drivers
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "pending" && styles.activeTab]}
                    onPress={() => setActiveTab("pending")}
                >
                    <Text style={[styles.tabText, activeTab === "pending" && styles.activeTabText]}>
                        Pending
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "accepted" && styles.activeTab]}
                    onPress={() => setActiveTab("accepted")}
                >
                    <Text style={[styles.tabText, activeTab === "accepted" && styles.activeTabText]}>
                        Approved
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Driver List */}
            <FlatList
                data={filteredDrivers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={renderDriver}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyTitle}>No drivers found</Text>
                        <Text style={styles.emptyText}>
                            {search ? "Try adjusting your search terms" : "No driver requests available"}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f7f9fb"
    },

    // Header Styles
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#afd826",
        paddingHorizontal: 20,
        paddingVertical: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    backButton: {
        padding: 4,
    },
    headerContent: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
    },
    headerSubtitle: {
        fontSize: 12,
        color: "rgba(255,255,255,0.9)",
        marginTop: 2,
    },
    filterButton: {
        padding: 4,
    },

    // Stats Overview
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        margin: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#E5E7EB",
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

    // Search Bar
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },

    // Tab Filters
    tabContainer: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 8,
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

    // List Container
    listContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    separator: {
        height: 12,
    },

    // Card Styles
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    acceptedCard: {
        borderLeftWidth: 4,
        borderLeftColor: "#afd826",
    },

    // Card Header
    cardHeader: {
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
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "#afd826",
    },
    nameContainer: {
        marginLeft: 12,
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1F2937",
        marginLeft: 4,
        marginRight: 8,
    },
    rides: {
        fontSize: 12,
        color: "#6B7280",
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pendingBadge: {
        backgroundColor: "#FFF9C4",
    },
    acceptedBadge: {
        backgroundColor: "#E8F5E8",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },

    // Details Container
    detailsContainer: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    detailText: {
        fontSize: 14,
        color: "#555",
        marginLeft: 8,
        fontWeight: "500",
    },

    // Actions Container
    actionsContainer: {
        flexDirection: "row",
        gap: 12,
    },
    acceptButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#afd826",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 8,
    },
    rejectButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff6b6b",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 8,
    },
    acceptButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    rejectButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },

    // Approved Container
    approvedContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2ffe6",
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#afd826",
        gap: 8,
    },
    approvedText: {
        color: "#2E7D32",
        fontWeight: "600",
        fontSize: 14,
    },

    // Empty State
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        lineHeight: 20,
    },
});