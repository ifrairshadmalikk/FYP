import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function DriverList({ navigation }) {
  const [expandedDriver, setExpandedDriver] = useState(null);

  const [drivers] = useState([
    {
      id: 1,
      name: "Ali Khan",
      availability: "09:00 - 17:00",
      isAvailableToday: true,
      vehicle: "Honda Civic 2020",
      rating: "4.8",
      completedRides: 127,
      experience: "3 years",
      mobile: "0300-1234567"
    },
    {
      id: 2,
      name: "Zara Iqbal",
      availability: "10:00 - 18:00",
      isAvailableToday: false,
      vehicle: "Toyota Corolla 2019",
      rating: "4.9",
      completedRides: 89,
      experience: "2 years",
      mobile: "0312-9876543"
    },
    {
      id: 3,
      name: "Ahmed Raza",
      availability: "08:00 - 16:00",
      isAvailableToday: true,
      vehicle: "Suzuki Cultus 2021",
      rating: "4.7",
      completedRides: 156,
      experience: "4 years",
      mobile: "0333-1234567"
    },
    {
      id: 4,
      name: "Bilal Hussain",
      availability: "07:00 - 15:00",
      isAvailableToday: true,
      vehicle: "Toyota Prius 2022",
      rating: "4.6",
      completedRides: 67,
      experience: "1 year",
      mobile: "0300-5551234"
    },
  ]);

  const toggleDriver = (driverId) => {
    setExpandedDriver(expandedDriver === driverId ? null : driverId);
  };

  const getVehicleIcon = (vehicle) => {
    if (vehicle.includes('Civic') || vehicle.includes('Corolla') || vehicle.includes('City')) return 'car-sedan';
    if (vehicle.includes('Cultus') || vehicle.includes('Wagon')) return 'car-hatchback';
    if (vehicle.includes('Prius')) return 'car-electric';
    return 'car';
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
          <Text style={styles.headerTitle}>Drivers Management</Text>
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
            {drivers.filter(d => d.isAvailableToday).length}
          </Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {drivers.filter(d => !d.isAvailableToday).length}
          </Text>
          <Text style={styles.statLabel}>Offline</Text>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {drivers.map((driver) => (
          <TouchableOpacity
            key={driver.id}
            style={[
              styles.card,
              expandedDriver === driver.id && styles.expandedCard
            ]}
            activeOpacity={0.8}
            onPress={() => toggleDriver(driver.id)}
          >
            {/* Driver Header */}
            <View style={styles.cardHeader}>
              <View style={styles.driverInfo}>
                <Image
                  source={{
                    uri: "https://ui-avatars.com/api/?name=" + encodeURIComponent(driver.name) + "&background=afd826&color=fff&size=100&bold=true",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.nameContainer}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{driver.rating}</Text>
                    <Text style={styles.rides}>({driver.completedRides} rides)</Text>
                  </View>
                </View>
              </View>

              <View style={[
                styles.availabilityBadge,
                driver.isAvailableToday ? styles.availableBadge : styles.offlineBadge
              ]}>
                <Ionicons
                  name={driver.isAvailableToday ? "checkmark-circle" : "time"}
                  size={12}
                  color="#fff"
                />
                <Text style={styles.availabilityText}>
                  {driver.isAvailableToday ? "Available" : "Offline"}
                </Text>
              </View>
            </View>

            {/* Basic Info */}
            <View style={styles.basicInfo}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialIcons name={getVehicleIcon(driver.vehicle)} size={16} color="#666" />
                  <Text style={styles.infoText}>{driver.vehicle}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{driver.availability}</Text>
                </View>
              </View>
            </View>

            {/* Expanded Details */}
            {expandedDriver === driver.id && (
              <View style={styles.expandedSection}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Experience</Text>
                    <Text style={styles.detailValue}>{driver.experience}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Mobile</Text>
                    <Text style={styles.detailValue}>{driver.mobile}</Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.contactButton}>
                    <Ionicons name="call-outline" size={16} color="#fff" />
                    <Text style={styles.contactButtonText}>Call Driver</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.messageButton}>
                    <Ionicons name="chatbubble-outline" size={16} color="#afd826" />
                    <Text style={styles.messageButtonText}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Expand/Collapse Icon */}
            <View style={styles.expandIcon}>
              <Ionicons
                name={expandedDriver === driver.id ? "chevron-up" : "chevron-down"}
                size={20}
                color="#afd826"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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

  // Container
  container: {
    flex: 1,
    padding: 16,
  },

  // Card Styles
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  expandedCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#afd826",
  },

  // Card Header
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
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
  driverName: {
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
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  availableBadge: {
    backgroundColor: "#4CAF50",
  },
  offlineBadge: {
    backgroundColor: "#FF6B6B",
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  // Basic Info
  basicInfo: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },

  // Expanded Section
  expandedSection: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#111",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#afd826",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#afd826",
    gap: 6,
  },
  messageButtonText: {
    color: "#afd826",
    fontWeight: "600",
    fontSize: 14,
  },

  // Expand Icon
  expandIcon: {
    alignItems: "center",
    marginTop: 8,
  },
});