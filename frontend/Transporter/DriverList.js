import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

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

  async getCurrentLocation() {
    try {
      // Get approximate Islamabad location
      return {
        latitude: 33.6844,
        longitude: 73.0479,
        address: "Islamabad, Pakistan"
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  },

  async getDistanceFromUniversity(location) {
    try {
      const university = await this.getGeocodeFromAddress("Riphah International University I-14 Islamabad") || {
        latitude: 33.6462,
        longitude: 72.9834
      };

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location.latitude},${location.longitude}&destinations=${university.latitude},${university.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.rows && data.rows[0] && data.rows[0].elements[0]) {
        const element = data.rows[0].elements[0];
        if (element.status === 'OK') {
          return element.distance?.text || 'Unknown';
        }
      }
      return 'Unknown';
    } catch (error) {
      console.error('Error getting distance:', error);
      return 'Unknown';
    }
  },

  async getETAFromUniversity(location) {
    try {
      const university = await this.getGeocodeFromAddress("Riphah International University I-14 Islamabad") || {
        latitude: 33.6462,
        longitude: 72.9834
      };

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location.latitude},${location.longitude}&destinations=${university.latitude},${university.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.rows && data.rows[0] && data.rows[0].elements[0]) {
        const element = data.rows[0].elements[0];
        if (element.status === 'OK') {
          return element.duration?.text || 'Unknown';
        }
      }
      return 'Unknown';
    } catch (error) {
      console.error('Error getting ETA:', error);
      return 'Unknown';
    }
  }
};

export default function DriverList({ navigation }) {
  const [expandedDriver, setExpandedDriver] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [search, setSearch] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial drivers data with addresses for Google Maps
  const initialDrivers = [
    {
      id: 1,
      name: "Ali Khan",
      availability: "09:00 - 17:00",
      isAvailableToday: true,
      vehicle: "Honda Civic 2020",
      rating: "4.8",
      completedRides: 127,
      experience: "3 years",
      mobile: "0300-1234567",
      vehicleType: "Sedan",
      address: "Blue Area Islamabad"
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
      mobile: "0312-9876543",
      vehicleType: "Sedan",
      address: "Gulberg Lahore"
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
      mobile: "0333-1234567",
      vehicleType: "Hatchback",
      address: "DHA Phase 5 Lahore"
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
      mobile: "0300-5551234",
      vehicleType: "Hybrid",
      address: "Johar Town Lahore"
    },
  ];

  // Load driver coordinates from Google Maps
  useEffect(() => {
    loadDriverCoordinates();
  }, []);

  const loadDriverCoordinates = async () => {
    setLoading(true);
    try {
      const driversWithCoords = await Promise.all(
        initialDrivers.map(async (driver) => {
          const location = await googleMapsService.getGeocodeFromAddress(driver.address) || 
            await googleMapsService.getCurrentLocation();
          
          const distance = await googleMapsService.getDistanceFromUniversity(location);
          const eta = await googleMapsService.getETAFromUniversity(location);

          return {
            ...driver,
            location,
            distanceFromUniversity: distance,
            etaToUniversity: eta
          };
        })
      );
      setDrivers(driversWithCoords);
    } catch (error) {
      console.error('Error loading driver data:', error);
      setDrivers(initialDrivers);
    } finally {
      setLoading(false);
    }
  };

  // Check if filters are active
  const isFilterActive = selectedStatus !== "all" || selectedRating !== "all";

  // Clear all filters
  const clearFilters = () => {
    setSelectedStatus("all");
    setSelectedRating("all");
    setSearch("");
  };

  // Filter drivers
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      search === "" ||
      driver.name.toLowerCase().includes(search.toLowerCase()) ||
      driver.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      driver.mobile.includes(search);

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "available" && driver.isAvailableToday) ||
      (selectedStatus === "offline" && !driver.isAvailableToday);

    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "4.5+" && parseFloat(driver.rating) >= 4.5) ||
      (selectedRating === "4.7+" && parseFloat(driver.rating) >= 4.7) ||
      (selectedRating === "4.8+" && parseFloat(driver.rating) >= 4.8);

    return matchesSearch && matchesStatus && matchesRating;
  });

  const toggleDriver = (driverId) => {
    setExpandedDriver(expandedDriver === driverId ? null : driverId);
  };

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType?.toLowerCase()) {
      case 'sedan': return 'car-sedan';
      case 'hatchback': return 'car-hatchback';
      case 'suv': return 'car-suv';
      case 'hybrid': return 'car-electric';
      default: return 'car';
    }
  };

  // View driver on map
  const viewOnMap = (driver) => {
    navigation.navigate('VanTracking', {
      drivers: [{
        ...driver,
        currentLocation: driver.location,
        route: [driver.location, { latitude: 33.6462, longitude: 72.9834 }]
      }]
    });
  };

  // Filter Modal
  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Drivers</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>📊 Status</Text>
            {["all", "available", "offline"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterOption,
                  selectedStatus === status && styles.selectedFilterOption
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedStatus === status && styles.selectedFilterOptionText
                ]}>
                  {status === "all" ? "All Status" : 
                   status === "available" ? "🟢 Available" : "🔴 Offline"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>⭐ Rating</Text>
            {["all", "4.5+", "4.7+", "4.8+"].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.filterOption,
                  selectedRating === rating && styles.selectedFilterOption
                ]}
                onPress={() => setSelectedRating(rating)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedRating === rating && styles.selectedFilterOptionText
                ]}>
                  {rating === "all" ? "All Ratings" : rating}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.applyButtonText}>Show Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Drivers</Text>
          <Text style={styles.headerSubtitle}>{filteredDrivers.length} drivers</Text>
        </View>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Ionicons name="options" size={20} color="#fff" />
          {isFilterActive && <View style={styles.filterIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Stats */}
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
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search drivers..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Drivers List */}
      <ScrollView style={styles.container}>
        {filteredDrivers.map((driver) => (
          <TouchableOpacity
            key={driver.id}
            style={styles.card}
            onPress={() => toggleDriver(driver.id)}
          >
            <View style={styles.cardHeader}>
              <Image
                source={{ uri: `https://ui-avatars.com/api/?name=${driver.name}&background=afd826&color=fff` }}
                style={styles.avatar}
              />
              <View style={styles.nameContainer}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.rating}>⭐ {driver.rating} ({driver.completedRides} rides)</Text>
              </View>
              <View style={[
                styles.availabilityBadge,
                driver.isAvailableToday ? styles.availableBadge : styles.offlineBadge
              ]}>
                <Text style={styles.availabilityText}>
                  {driver.isAvailableToday ? "🟢 Available" : "🔴 Offline"}
                </Text>
              </View>
            </View>

            <View style={styles.basicInfo}>
              <Text style={styles.infoText}>
                <MaterialIcons name={getVehicleIcon(driver.vehicleType)} size={14} /> {driver.vehicle}
              </Text>
              <Text style={styles.infoText}>
                <Ionicons name="time-outline" size={14} /> {driver.availability}
              </Text>
            </View>

            {expandedDriver === driver.id && (
              <View style={styles.expandedSection}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Experience</Text>
                  <Text style={styles.detailValue}>{driver.experience}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mobile</Text>
                  <Text style={styles.detailValue}>{driver.mobile}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{driver.address}</Text>
                </View>
                {driver.distanceFromUniversity && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Distance to Riphah</Text>
                    <Text style={styles.detailValue}>{driver.distanceFromUniversity}</Text>
                  </View>
                )}
                {driver.etaToUniversity && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>ETA to Riphah</Text>
                    <Text style={styles.detailValue}>{driver.etaToUniversity}</Text>
                  </View>
                )}

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.contactButton}>
                    <Ionicons name="call-outline" size={16} color="#fff" />
                    <Text style={styles.contactButtonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.mapButton} onPress={() => viewOnMap(driver)}>
                    <Ionicons name="map-outline" size={16} color="#fff" />
                    <Text style={styles.mapButtonText}>View on Map</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.expandIcon}>
              <Ionicons
                name={expandedDriver === driver.id ? "chevron-up" : "chevron-down"}
                size={20}
                color="#afd826"
              />
            </View>
          </TouchableOpacity>
        ))}

        {filteredDrivers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#E2E8F0" />
            <Text style={styles.emptyTitle}>No Drivers Found</Text>
          </View>
        )}
      </ScrollView>

      <FilterModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7f9fb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#afd826",
    padding: 16,
  },
  headerContent: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  headerSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.9)" },
  filterIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "700", color: "#afd826" },
  statLabel: { fontSize: 12, color: "#666" },
  statDivider: { width: 1, backgroundColor: "#E5E7EB" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 14 },
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  nameContainer: { flex: 1, marginLeft: 12 },
  driverName: { fontSize: 16, fontWeight: "700" },
  rating: { fontSize: 12, color: "#666" },
  availabilityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  availableBadge: { backgroundColor: "#4CAF50" },
  offlineBadge: { backgroundColor: "#FF6B6B" },
  availabilityText: { fontSize: 10, color: "#fff" },
  basicInfo: { flexDirection: "row", marginTop: 8, justifyContent: "space-between" },
  infoText: { fontSize: 12, color: "#666" },
  expandedSection: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#eee" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  detailLabel: { fontSize: 12, color: "#666" },
  detailValue: { fontSize: 12, color: "#333", fontWeight: "500" },
  actionButtons: { flexDirection: "row", marginTop: 12, gap: 8 },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#afd826",
    padding: 8,
    borderRadius: 6,
    gap: 4,
  },
  contactButtonText: { color: "#fff", fontSize: 12 },
  mapButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498DB",
    padding: 8,
    borderRadius: 6,
    gap: 4,
  },
  mapButtonText: { color: "#fff", fontSize: 12 },
  expandIcon: { alignItems: "center", marginTop: 8 },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyTitle: { fontSize: 16, color: "#666", marginTop: 12 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  filterSection: { marginBottom: 16 },
  filterLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  filterOption: { padding: 12, borderRadius: 8, backgroundColor: "#f0f0f0", marginBottom: 8 },
  selectedFilterOption: { backgroundColor: "#afd826" },
  filterOptionText: { fontSize: 14 },
  selectedFilterOptionText: { color: "#fff" },
  modalActions: { flexDirection: "row", marginTop: 20, gap: 12 },
  clearButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  clearButtonText: { textAlign: "center", color: "#666" },
  applyButton: { flex: 2, padding: 12, borderRadius: 8, backgroundColor: "#afd826" },
  applyButtonText: { textAlign: "center", color: "#fff" },
});