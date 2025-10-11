// screens/VanTrackingScreen.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Dimensions,
  RefreshControl,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Constants
const COLORS = {
  primary: "#afd826",
  primaryDark: "#8fb320",
  success: "#28a745",
  warning: "#f39c12",
  danger: "#dc3545",
  white: "#ffffff",
  black: "#111111",
  gray: "#6c757d",
  lightGray: "#f8f9fa",
  border: "#dee2e6",
  background: "#f8f9fa",
};

const VAN_DATA = [
  {
    id: "van1",
    driver: "Ali Raza",
    licensePlate: "KBL-1234",
    contact: "+92-300-1234567",
    latitude: 24.8607,
    longitude: 67.0011,
    timeAtSpot: "5 mins",
    status: "active",
    capacity: 12,
    currentPassengers: 8,
    passengers: [
      { id: "p1", name: "Sara Ahmed", status: "done", pickupTime: "08:15 AM" },
      { id: "p2", name: "Hamza Khan", status: "done", pickupTime: "08:18 AM" },
      { id: "p3", name: "Ayesha Ali", status: "done", pickupTime: "08:22 AM" },
      { id: "p4", name: "Bilal Khan", status: "pending", estimatedTime: "3 min" },
      { id: "p5", name: "Zara Noor", status: "pending", estimatedTime: "5 min" },
      { id: "p6", name: "Ahmed Ali", status: "done", pickupTime: "08:25 AM" },
    ],
  },
  {
    id: "van2",
    driver: "Zara Khan",
    licensePlate: "KBL-5678",
    contact: "+92-300-2345678",
    latitude: 24.8615,
    longitude: 67.0025,
    timeAtSpot: "3 mins",
    status: "active",
    capacity: 12,
    currentPassengers: 7,
    passengers: [
      { id: "p7", name: "Ali Raza", status: "done", pickupTime: "08:10 AM" },
      { id: "p8", name: "Fatima Noor", status: "done", pickupTime: "08:14 AM" },
      { id: "p9", name: "Hassan Ali", status: "done", pickupTime: "08:17 AM" },
      { id: "p10", name: "Iqra Khan", status: "pending", estimatedTime: "2 min" },
      { id: "p11", name: "Omar Farooq", status: "pending", estimatedTime: "4 min" },
      { id: "p12", name: "Sana Malik", status: "done", pickupTime: "08:20 AM" },
    ],
  },
];

export default function VanTrackingScreen({ navigation }) {
  const [vans, setVans] = useState(VAN_DATA);
  const [selectedVan, setSelectedVan] = useState(VAN_DATA[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 24.861,
    longitude: 67.002,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const mapRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Fake live update with more realistic movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVans((prev) =>
        prev.map((van) => ({
          ...van,
          latitude: van.latitude + (Math.random() - 0.5) * 0.0002,
          longitude: van.longitude + (Math.random() - 0.5) * 0.0002,
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSelectVan = useCallback((van) => {
    setSelectedVan(van);
    mapRef.current?.animateToRegion(
      {
        latitude: van.latitude,
        longitude: van.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      500
    );
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return COLORS.success;
      case "inactive": return COLORS.gray;
      case "maintenance": return COLORS.danger;
      default: return COLORS.warning;
    }
  };

  const renderVanSelector = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.vanSelectorItem,
        selectedVan?.id === item.id && styles.vanSelectorItemSelected,
      ]}
      onPress={() => handleSelectVan(item)}
    >
      <View style={styles.vanSelectorContent}>
        <Text style={[
          styles.vanSelectorText,
          selectedVan?.id === item.id && styles.vanSelectorTextSelected,
        ]}>
          {item.driver}
        </Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: getStatusColor(item.status) }
        ]} />
      </View>
    </TouchableOpacity>
  );

  const renderPassengerItem = ({ item }) => (
    <View style={[
      styles.passengerItem,
      item.status === "done" && styles.passengerItemPicked,
    ]}>
      <View style={styles.passengerInfo}>
        <Text style={styles.passengerName}>{item.name}</Text>
        <Text style={styles.passengerTime}>
          {item.status === "done" ? `Picked at ${item.pickupTime}` : `ETA: ${item.estimatedTime}`}
        </Text>
      </View>
      <View style={[
        styles.statusBadge,
        item.status === "done" ? styles.statusBadgeSuccess : styles.statusBadgePending,
      ]}>
        <Ionicons
          name={item.status === "done" ? "checkmark-circle" : "time"}
          size={16}
          color={COLORS.white}
        />
        <Text style={styles.statusBadgeText}>
          {item.status === "done" ? "Picked" : "Pending"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Transport Monitor</Text>
          <Text style={styles.headerSubtitle}>Live Vehicle Tracking</Text>
        </View>

      </View>

      {/* Van Selector */}
      <Animated.View
        style={[
          styles.vanSelectorContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.sectionTitle}>Active Vehicles</Text>
        <FlatList
          data={vans}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vanSelectorList}
          renderItem={renderVanSelector}
        />
      </Animated.View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={mapRegion}
          showsUserLocation={true}
          showsCompass={true}
          showsTraffic={false}
        >
          {vans.map((van) => (
            <Marker
              key={van.id}
              coordinate={{ latitude: van.latitude, longitude: van.longitude }}
              title={van.driver}
              description={`License: ${van.licensePlate}`}
              onPress={() => handleSelectVan(van)}
            >
              <View style={[
                styles.markerContainer,
                selectedVan?.id === van.id && styles.markerContainerSelected,
              ]}>
                <Ionicons
                  name="car"
                  size={20}
                  color={selectedVan?.id === van.id ? COLORS.white : COLORS.primary}
                />
                <View style={[
                  styles.markerBadge,
                  { backgroundColor: selectedVan?.id === van.id ? COLORS.white : COLORS.primary }
                ]}>
                  <Text style={[
                    styles.markerBadgeText,
                    { color: selectedVan?.id === van.id ? COLORS.primary : COLORS.white }
                  ]}>
                    {van.currentPassengers}/{van.capacity}
                  </Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Info Panel */}
      {selectedVan && (
        <Animated.View
          style={[
            styles.infoPanel,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.infoPanelHeader}>
            <View>
              <Text style={styles.infoPanelTitle}>{selectedVan.driver}</Text>
              <Text style={styles.infoPanelSubtitle}>
                License: {selectedVan.licensePlate} • Contact: {selectedVan.contact}
              </Text>
            </View>
            <View style={[
              styles.vanStatus,
              { backgroundColor: getStatusColor(selectedVan.status) }
            ]}>
              <Text style={styles.vanStatusText}>
                {selectedVan.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {selectedVan.passengers.filter(p => p.status === "done").length}
              </Text>
              <Text style={styles.statLabel}>Picked Up</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {selectedVan.passengers.filter(p => p.status === "pending").length}
              </Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedVan.timeAtSpot}</Text>
              <Text style={styles.statLabel}>Current Stop</Text>
            </View>
          </View>

          <Text style={styles.passengersTitle}>Passenger List</Text>
          <FlatList
            data={selectedVan.passengers}
            keyExtractor={(item) => item.id}
            renderItem={renderPassengerItem}
            showsVerticalScrollIndicator={false}
            style={styles.passengersList}
            contentContainerStyle={styles.passengersListContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerButton: {
    padding: 4,
  },
  headerTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  vanSelectorContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray,
    marginLeft: 16,
    marginBottom: 8,
  },
  vanSelectorList: {
    paddingHorizontal: 16,
  },
  vanSelectorItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  vanSelectorItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  vanSelectorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  vanSelectorText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
    marginRight: 6,
  },
  vanSelectorTextSelected: {
    color: COLORS.white,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  markerContainerSelected: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.1 }],
  },
  markerBadge: {
    marginLeft: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  markerBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  infoPanel: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    maxHeight: SCREEN_HEIGHT * 0.35,
  },
  infoPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoPanelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 4,
  },
  infoPanelSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
  },
  vanStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vanStatusText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  passengersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 12,
  },
  passengersList: {
    flex: 1,
  },
  passengersListContent: {
    paddingBottom: 8,
  },
  passengerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  passengerItemPicked: {
    backgroundColor: "#e8f5e8",
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 2,
  },
  passengerTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeSuccess: {
    backgroundColor: COLORS.success,
  },
  statusBadgePending: {
    backgroundColor: COLORS.warning,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.white,
    marginLeft: 4,
  },
});