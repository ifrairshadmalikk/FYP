// PassengerScreens/HomeScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/PassengerStyles/homeStyles";

export default function HomeScreen({ navigation }) {
  const [confirmed, setConfirmed] = useState(null);
  const [isDriverArrived, setIsDriverArrived] = useState(false);

  const paymentStatus = "paid";
  const nextRideTime = "08:30 AM";
  const driverName = "Muhammad Ali";
  const vanNumber = "VAN-001";
  const estimatedArrival = "10 min";

  return (
    <SafeAreaView style={styles.container}>
      {/* ====== Header ====== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.headerButton}>
          <Icon name="bars" size={25} color="#ffffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Passenger Dashboard</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={[styles.headerButton, { marginRight: 10 }]}
        >
          <Icon name="user-circle-o" size={25} color="#ffffffff" />
        </TouchableOpacity>
      </View>

      {/* ====== Arrival Alert Banner ====== */}
      {isDriverArrived && (
        <View style={{ backgroundColor: "#fff3cd", padding: 10, marginTop: 10, borderRadius: 6 }}>
          <Text style={{ color: "#856404", fontWeight: "500" }}>
            🚐 Your driver has arrived! Please proceed to the pickup point.
          </Text>
        </View>
      )}

      {/* ====== Active Trip Card ====== */}
      <View style={[styles.card, { borderLeftWidth: 6, borderLeftColor: "#afd826", marginTop: 20 }]}>
        <Text style={styles.cardTitle}>Current Trip</Text>
        <Text style={styles.cardLine}>
          {vanNumber} • Driver: {driverName}
        </Text>
        <Text style={styles.smallText}>Status: On Route • ETA: {estimatedArrival}</Text>

        <TouchableOpacity
          style={[styles.trackButton, { backgroundColor: "#afd826" }]}
          onPress={() => navigation.navigate("TrackVanScreen")}
        >
          <Icon name="map-marker" size={16} color="white" />
          <Text style={styles.trackText}> View Live Location</Text>
        </TouchableOpacity>
      </View>

      {/* ====== Next Ride card ====== */}
      <View style={[styles.card, { borderLeftWidth: 6, borderLeftColor: "#afd826", marginTop: 15 }]}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Next Ride</Text>
          <Text style={styles.cardTime}>{nextRideTime}</Text>
        </View>

        <Text style={styles.cardLine}>
          {vanNumber} • Driver: {driverName}
        </Text>

        <TouchableOpacity
          style={[styles.trackButton, { backgroundColor: "#afd826" }]}
          onPress={() => navigation.navigate("TrackVanScreen")}
        >
          <Icon name="map-marker" size={16} color="white" />
          <Text style={styles.trackText}> Track Van</Text>
        </TouchableOpacity>
      </View>

      {/* ====== Payment card ====== */}
      <View style={[styles.card, { borderLeftWidth: 6, borderLeftColor: "#afd826", marginTop: 15 }]}>
        <Text style={styles.cardTitle}>Payment</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.cardLine}>
            {paymentStatus === "paid" ? "Paid ✓" : "Pending ✗"}
          </Text>
          <Text style={styles.smallText}>PKR 15,000 / month</Text>
        </View>
      </View>

      {/* ====== Tomorrow's Travel card ====== */}
      <View style={[styles.card, { borderLeftWidth: 6, borderLeftColor: "#afd826", marginTop: 15 }]}>
        <Text style={styles.cardTitle}>Tomorrow's Travel</Text>

        {confirmed === null ? (
          <View style={styles.confirmRow}>
            <TouchableOpacity
              style={[styles.buttonGreen, { backgroundColor: "#afd826" }]}
              onPress={() => setConfirmed(true)}
            >
              <Icon name="check" size={16} color="white" />
              <Text style={styles.buttonText}> Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonRed, { backgroundColor: "#ff0800ff" }]}
              onPress={() => setConfirmed(false)}
            >
              <Icon name="times" size={16} color="white" />
              <Text style={styles.buttonText}> No</Text>
            </TouchableOpacity>
          </View>
        ) : confirmed ? (
          <View style={styles.confirmedRow}>
            <Icon name="check-circle" size={18} color="#afd826" />
            <Text style={styles.confirmedText}> Confirmed for tomorrow</Text>
          </View>
        ) : (
          <View style={styles.confirmedRow}>
            <Icon name="times-circle" size={18} color="#ff251eff" />
            <Text style={[styles.confirmedText, { color: "#ff0901ff" }]}>
              Not traveling tomorrow
            </Text>
          </View>
        )}

        <Text style={styles.hintText}>Please respond by 12:00 PM</Text>
      </View>

      {/* ====== Quick Actions ====== */}
      <View style={[styles.quickRow, { marginTop: 20 }]}>
        <TouchableOpacity
          style={[styles.quickBtn, { borderColor: "#afd826" }]}
          onPress={() => navigation.navigate("History")}
        >
          <Icon name="history" size={18} color="#afd826" />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.quickText, { color: "#000" }]}> Ride History</Text>
            <Text style={styles.muted}>View past rides</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickBtn, { borderColor: "#afd826" }]}
          onPress={() => Alert.alert("Contact Driver", "Calling Muhammad Ali...")}
        >
          <Icon name="phone" size={18} color="#afd826" />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.quickText, { color: "#000" }]}> Support</Text>
            <Text style={styles.muted}>Contact Driver</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
