import React, { useState, useEffect } from "react";
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
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function PassengerList({ navigation, route }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, pending, accepted
  const [passengers, setPassengers] = useState([
    {
      id: "1",
      name: "Ali Raza",
      mobile: "0300-1234567",
      email: "ali.raza@email.com",
      pickup: "Lahore Cantt",
      drop: "Johar Town",
      status: "pending",
      totalRides: 24,
      memberSince: "2023",
      rating: "4.8"
    },
    {
      id: "2",
      name: "Zara Sheikh",
      mobile: "0312-1234567",
      email: "zara.sheikh@email.com",
      pickup: "Karachi Gulshan",
      drop: "Clifton",
      status: "accepted",
      totalRides: 15,
      memberSince: "2024",
      rating: "4.9"
    },
    {
      id: "3",
      name: "Ahmed Khan",
      mobile: "0333-1234567",
      email: "ahmed.khan@email.com",
      pickup: "Faisalabad",
      drop: "Lahore",
      status: "pending",
      totalRides: 32,
      memberSince: "2023",
      rating: "4.7"
    },
    {
      id: "4",
      name: "Hina Malik",
      mobile: "0302-9876543",
      email: "hina.malik@email.com",
      pickup: "Islamabad F-10",
      drop: "Blue Area",
      status: "pending",
      totalRides: 8,
      memberSince: "2024",
      rating: "4.5"
    },
    {
      id: "5",
      name: "Bilal Aslam",
      mobile: "0321-9876543",
      email: "bilal.aslam@email.com",
      pickup: "Rawalpindi Saddar",
      drop: "Bahria Town",
      status: "accepted",
      totalRides: 19,
      memberSince: "2023",
      rating: "4.6"
    },
    {
      id: "6",
      name: "Sara Khan",
      mobile: "0345-1239876",
      email: "sara.khan@email.com",
      pickup: "Multan Cantt",
      drop: "Shah Rukn-e-Alam",
      status: "pending",
      totalRides: 27,
      memberSince: "2023",
      rating: "4.8"
    },
  ]);

  // AddPassenger se aya passenger
  useEffect(() => {
    if (route.params?.newPassenger) {
      setPassengers((prev) => [
        {
          id: Date.now().toString(),
          ...route.params.newPassenger,
          status: "pending",
          email: "new@email.com",
          totalRides: 0,
          memberSince: "2024",
          rating: "5.0"
        },
        ...prev,
      ]);
    }
  }, [route.params?.newPassenger]);

  const handleAccept = (id) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "accepted" } : p))
    );
  };

  const handleReject = (id) => {
    setPassengers((prev) => prev.filter((p) => p.id !== id));
  };

  // Navigate to passenger profile
  const handlePassengerPress = (passenger) => {
    navigation.navigate("PassengerProfile", { passenger });
  };

  // Filter passengers based on search and active tab
  const filteredPassengers = passengers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.pickup.toLowerCase().includes(search.toLowerCase()) ||
      p.drop.toLowerCase().includes(search.toLowerCase()) ||
      p.mobile.includes(search);

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && p.status === "pending") ||
      (activeTab === "accepted" && p.status === "accepted");

    return matchesSearch && matchesTab;
  });

  const renderPassenger = ({ item }) => {
    const fadeAnim = new Animated.Value(1);
    const slideAnim = new Animated.Value(0);

    const rejectWithAnimation = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => handleReject(item.id));
    };

    return (
      <Animated.View
        style={[
          styles.card,
          item.status === "accepted" && styles.acceptedCard,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Passenger Header */}
        <View style={styles.cardHeader}>
          <TouchableOpacity
            style={styles.passengerInfo}
            onPress={() => handlePassengerPress(item)}
          >
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
                <Text style={styles.rides}>({item.totalRides} rides)</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={[
            styles.statusBadge,
            item.status === "accepted" ? styles.acceptedBadge : styles.pendingBadge
          ]}>
            <Text style={styles.statusText}>
              {item.status === "accepted" ? "Approved" : "Pending"}
            </Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactContainer}>
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.contactText}>{item.mobile}</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={16} color="#666" />
            <Text style={styles.contactText}>{item.email}</Text>
          </View>
        </View>

        {/* Route Information */}
        <View style={styles.routeContainer}>
          <View style={styles.routeRow}>
            <View style={styles.routePoint}>
              <MaterialIcons name="my-location" size={16} color="#afd826" />
              <View style={styles.routeDetails}>
                <Text style={styles.routeLabel}>Pickup</Text>
                <Text style={styles.routeValue}>{item.pickup}</Text>
              </View>
            </View>

            <Ionicons name="arrow-forward" size={16} color="#999" style={styles.arrowIcon} />

            <View style={styles.routePoint}>
              <MaterialIcons name="location-on" size={16} color="#ff6b6b" />
              <View style={styles.routeDetails}>
                <Text style={styles.routeLabel}>Drop</Text>
                <Text style={styles.routeValue}>{item.drop}</Text>
              </View>
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
              onPress={rejectWithAnimation}
            >
              <Ionicons name="close-circle" size={18} color="#fff" />
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.approvedContainer}>
            <Ionicons name="checkmark-done-circle" size={20} color="#afd826" />
            <Text style={styles.approvedText}>Request Approved</Text>
          </View>
        )}
      </Animated.View>
    );
  };

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
          <Text style={styles.headerTitle}>Passenger Requests</Text>
          <Text style={styles.headerSubtitle}>{passengers.length} passengers registered</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{passengers.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {passengers.filter(p => p.status === "pending").length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {passengers.filter(p => p.status === "accepted").length}
          </Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search passengers by name, pickup, drop location..."
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
            All Passengers
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

      {/* Passenger List */}
      <FlatList
        data={filteredPassengers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderPassenger}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No passengers found</Text>
            <Text style={styles.emptyText}>
              {search ? "Try adjusting your search terms" : "No passenger requests available"}
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
  passengerInfo: {
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

  // Contact Container
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
    fontWeight: "500",
  },

  // Route Container
  routeContainer: {
    marginBottom: 16,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  routeDetails: {
    marginLeft: 8,
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  routeValue: {
    fontSize: 14,
    color: "#111",
    fontWeight: "600",
  },
  arrowIcon: {
    marginHorizontal: 8,
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