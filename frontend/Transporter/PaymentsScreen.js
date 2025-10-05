import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentsScreen({ navigation }) {
  const [payments, setPayments] = useState([
    {
      id: 1,
      passengerName: "Ahmed Raza",
      driverName: "Ali Khan",
      paymentStatus: true, // true = paid, false = pending
      date: "15 Dec 2023"
    },
    {
      id: 2,
      passengerName: "Bilal Hussain",
      driverName: "Zara Iqbal",
      paymentStatus: false,
      date: "14 Dec 2023"
    },
    {
      id: 3,
      passengerName: "Sara Khan",
      driverName: "Ahmed Raza",
      paymentStatus: true,
      date: "14 Dec 2023"
    },
    {
      id: 4,
      passengerName: "Imran Shah",
      driverName: "Bilal Hussain",
      paymentStatus: false,
      date: "13 Dec 2023"
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("paid");

  // Mark payment as paid
  const markAsPaid = (id) => {
    setPayments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, paymentStatus: true } : item
      )
    );
  };

  // Filter payments based on active filter
  const filteredPayments = payments.filter((item) => {
    return activeFilter === "paid" ? item.paymentStatus : !item.paymentStatus;
  });

  // Calculate stats
  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.paymentStatus).length;
  const pendingPayments = payments.filter(p => !p.paymentStatus).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Passenger Payments</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalPayments}</Text>
          <Text style={styles.statLabel}>Total Payments</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{paidPayments}</Text>
          <Text style={styles.statLabel}>Paid</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{pendingPayments}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeFilter === "paid" && styles.activeTab]}
          onPress={() => setActiveFilter("paid")}
        >
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={activeFilter === "paid" ? "#fff" : "#666"}
          />
          <Text style={[styles.tabText, activeFilter === "paid" && styles.activeTabText]}>
            Paid ({paidPayments})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeFilter === "pending" && styles.activeTab]}
          onPress={() => setActiveFilter("pending")}
        >
          <Ionicons
            name="time"
            size={16}
            color={activeFilter === "pending" ? "#fff" : "#666"}
          />
          <Text style={[styles.tabText, activeFilter === "pending" && styles.activeTabText]}>
            Pending ({pendingPayments})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payments List */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {filteredPayments.map((item) => (
          <View key={item.id} style={[
            styles.card,
            item.paymentStatus && styles.paidCard
          ]}>

            {/* Passenger Info */}
            <View style={styles.passengerInfo}>
              <Ionicons name="person-circle" size={40} color="#afd826" />
              <View style={styles.passengerDetails}>
                <Text style={styles.passengerName}>{item.passengerName}</Text>
                <Text style={styles.driverName}>Driver: {item.driverName}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>

            {/* Payment Status */}
            <View style={styles.statusContainer}>
              {item.paymentStatus ? (
                <View style={styles.paidStatus}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.paidText}>Paid</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.pendingButton}
                  onPress={() => markAsPaid(item.id)}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.pendingButtonText}>Mark as Paid</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {filteredPayments.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="card-outline"
              size={64}
              color="#ccc"
            />
            <Text style={styles.emptyTitle}>
              No {activeFilter} payments
            </Text>
            <Text style={styles.emptyText}>
              {activeFilter === "paid"
                ? "All payments are pending"
                : "No pending payments at the moment"
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f9fb"
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#afd826",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
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
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
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

  // Container
  container: {
    flex: 1,
    padding: 16,
  },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  paidCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#afd826",
  },

  // Passenger Info
  passengerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  passengerDetails: {
    marginLeft: 12,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 2,
  },
  driverName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: "#999",
  },

  // Status Container
  statusContainer: {
    alignItems: "flex-end",
  },
  paidStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  paidText: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 14,
  },
  pendingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#afd826",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  pendingButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
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
  },
});