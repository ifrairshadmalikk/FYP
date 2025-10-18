import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function PassengerList({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [expandedPassenger, setExpandedPassenger] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const passengers = [
    {
      id: 1,
      name: "Sara Khan",
      van: "Van 1",
      pickup: "Gulshan-e-Iqbal",
      status: "going",
      timing: "08:00 - 09:00",
      mobile: "0300-1234567",
      address: "House 123, Street 45",
      totalRides: 24
    },
    {
      id: 2,
      name: "Ahmed Raza",
      van: "Van 2",
      pickup: "Defence Phase 5",
      status: "not_going",
      timing: "09:30 - 10:30",
      mobile: "0312-9876543",
      address: "Apartment 7-B, Bahria Town",
      totalRides: 15
    },
    {
      id: 3,
      name: "Ali Hassan",
      van: "Van 3",
      pickup: "Clifton Block 2",
      status: "not_confirmed",
      timing: "10:00 - 11:00",
      mobile: "0333-4567890",
      address: "Flat 302, DHA Phase 6",
      totalRides: 32
    },
    {
      id: 4,
      name: "Zara Sheikh",
      van: "Van 4",
      pickup: "North Nazimabad",
      status: "not_studied",
      timing: "11:00 - 12:00",
      mobile: "0321-5551234",
      address: "House 78, Sector 11",
      totalRides: 8
    },
    {
      id: 5,
      name: "Bilal Ahmed",
      van: "Van 1",
      pickup: "Gulistan-e-Johar",
      status: "going",
      timing: "08:00 - 09:00",
      mobile: "0300-7778889",
      address: "Block 15, Main Boulevard",
      totalRides: 19
    },
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case "going":
        return {
          text: "Confirmed",
          color: "#4CAF50",
          bg: "#E8F5E8",
          icon: "checkmark-circle"
        };
      case "not_going":
        return {
          text: "Not Going",
          color: "#FF6B6B",
          bg: "#FFE6E6",
          icon: "close-circle"
        };
      case "not_confirmed":
        return {
          text: "Pending",
          color: "#FFA726",
          bg: "#FFF3E0",
          icon: "time"
        };
      case "not_studied":
        return {
          text: "Not Responded",
          color: "#9E9E9E",
          bg: "#F5F5F5",
          icon: "help-circle"
        };
      default:
        return {
          text: "Unknown",
          color: "#555",
          bg: "#eee",
          icon: "help"
        };
    }
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
    fadeAnim.setValue(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();

    setTimeout(() => hideModal(), 2500);
  };

  const hideModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => setModalVisible(false));
  };

  const sendReminder = (passenger) => {
    showModal(`📧 Reminder sent to ${passenger.name}`);
  };

  const togglePassenger = (passengerId) => {
    setExpandedPassenger(expandedPassenger === passengerId ? null : passengerId);
  };

  const renderItem = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          expandedPassenger === item.id && styles.expandedCard
        ]}
        activeOpacity={0.8}
        onPress={() => togglePassenger(item.id)}
      >
        {/* Passenger Header */}
        <View style={styles.cardHeader}>
          <View style={styles.passengerInfo}>
            <Image
              source={{
                uri: "https://ui-avatars.com/api/?name=" + encodeURIComponent(item.name) + "&background=afd826&color=fff&size=100&bold=true",
              }}
              style={styles.avatar}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.rideInfo}>
                <Ionicons name="car" size={12} color="#666" />
                <Text style={styles.vanText}>{item.van}</Text>
                <Text style={styles.ridesCount}>{item.totalRides} rides</Text>
              </View>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Ionicons
              name={statusInfo.icon}
              size={14}
              color={statusInfo.color}
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.basicInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons name="location-on" size={14} color="#666" />
              <Text style={styles.infoText}>{item.pickup}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.infoText}>{item.timing}</Text>
            </View>
          </View>
        </View>

        {/* Expanded Details */}
        {expandedPassenger === item.id && (
          <View style={styles.expandedSection}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Mobile</Text>
                <Text style={styles.detailValue}>{item.mobile}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue} numberOfLines={2}>{item.address}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              {(item.status === "not_studied" || item.status === "not_confirmed") && (
                <TouchableOpacity
                  style={styles.reminderButton}
                  onPress={() => sendReminder(item)}
                >
                  <Ionicons name="notifications" size={16} color="#fff" />
                  <Text style={styles.reminderButtonText}>Send Reminder</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={16} color="#afd826" />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Expand Icon */}
        <View style={styles.expandIcon}>
          <Ionicons
            name={expandedPassenger === item.id ? "chevron-up" : "chevron-down"}
            size={20}
            color="#afd826"
          />
        </View>
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Passengers Management</Text>
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
            {passengers.filter(p => p.status === "going").length}
          </Text>
          <Text style={styles.statLabel}>Confirmed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {passengers.filter(p => p.status === "not_going").length}
          </Text>
          <Text style={styles.statLabel}>Not Going</Text>
        </View>
      </View>

      <FlatList
        data={passengers}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* Custom Animated Modal */}
      {modalVisible && (
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={hideModal}>
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
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
    padding: 16,
    paddingBottom: 30
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
  rideInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  vanText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  ridesCount: {
    fontSize: 11,
    color: "#999",
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
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
  reminderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#afd826",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  reminderButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  callButton: {
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
  callButtonText: {
    color: "#afd826",
    fontWeight: "600",
    fontSize: 14,
  },

  // Expand Icon
  expandIcon: {
    alignItems: "center",
    marginTop: 8,
  },

  // Modal Styles
  modalContainer: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 16,
    fontWeight: "600"
  },
  modalButton: {
    backgroundColor: "#afd826",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16
  },
});