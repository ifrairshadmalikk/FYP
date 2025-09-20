import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Dummy backend
const fetchTodayRoute = () => {
  const today = new Date().toISOString().split("T")[0];
  const routes = {
    "2025-09-20": {
      routeName: "Van #12 – Morning School Route",
      driver: {
        name: "Ahmed Khan",
        vehicle: "Van #12",
        phone: "+92 300 1234567",
        image: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
        status: "Available",
        availableFrom: "07:00 AM",
        availableTo: "02:00 PM",
      },
      passengers: [
        { id: "1", name: "Ali Raza", pickup: "Street 12, Model Town", dropoff: "City School" },
        { id: "2", name: "Sara Ahmed", pickup: "Block F, Johar Town", dropoff: "Beaconhouse School" },
      ],
    },
  };
  return routes[today] || null;
};

// Simulate sending availability notification to transporter
const sendAvailabilityToTransporter = (status, from, to) => {
  Alert.alert(
    "Availability Sent",
    `Status: ${status}\nFrom: ${from || "-"}\nTo: ${to || "-"}\nNotification sent to Transporter`
  );
};

export default function DriverDashboard({ navigation }) {
  const [todayRoute, setTodayRoute] = useState(null);
  const [tempAvailability, setTempAvailability] = useState("Available");
  const [confirmedAvailability, setConfirmedAvailability] = useState("Available");
  const [availableFrom, setAvailableFrom] = useState("07:00 AM");
  const [availableTo, setAvailableTo] = useState("02:00 PM");
  const [tempFrom, setTempFrom] = useState("07:00 AM");
  const [tempTo, setTempTo] = useState("02:00 PM");
  const [isFromPickerVisible, setFromPickerVisible] = useState(false);
  const [isToPickerVisible, setToPickerVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const todayDate = new Date().toDateString();

  useEffect(() => {
    const route = fetchTodayRoute();
    setTodayRoute(route);
    if (route) {
      setConfirmedAvailability(route.driver.status);
      setTempAvailability(route.driver.status);
      setAvailableFrom(route.driver.availableFrom);
      setAvailableTo(route.driver.availableTo);
      setTempFrom(route.driver.availableFrom);
      setTempTo(route.driver.availableTo);
    }
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours % 12 || 12}:${minutes < 10 ? '0'+minutes : minutes} ${hours < 12 ? 'AM' : 'PM'}`;
  };

  const handleFromConfirm = (date) => {
    setTempFrom(formatTime(date));
    setFromPickerVisible(false);
  };

  const handleToConfirm = (date) => {
    setTempTo(formatTime(date));
    setToPickerVisible(false);
  };

  const confirmAvailability = () => {
    setConfirmedAvailability(tempAvailability);
    setAvailableFrom(tempAvailability === "Available" ? tempFrom : null);
    setAvailableTo(tempAvailability === "Available" ? tempTo : null);
    sendAvailabilityToTransporter(tempAvailability, tempAvailability === "Available" ? tempFrom : null, tempAvailability === "Available" ? tempTo : null);
    setConfirmVisible(false);
  };

  const renderPassenger = ({ item }) => (
    <View style={styles.passengerCard}>
      <View style={styles.passengerInfo}>
        <Text style={styles.passengerName}>{item.name}</Text>
        <Text style={styles.passengerText}>Pickup: {item.pickup}</Text>
        <Text style={styles.passengerText}>Drop-off: {item.dropoff}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Driver Dashboard</Text>
          <Text style={styles.headerDate}>{todayDate}</Text>
        </View>

        {todayRoute ? (
          <>
            {/* Driver Profile */}
            <View style={styles.card}>
              <View style={styles.profileRow}>
                <Image source={{ uri: todayRoute.driver.image }} style={styles.profileImg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.driverName}>{todayRoute.driver.name}</Text>
                  <Text style={styles.driverSub}>Vehicle: {todayRoute.driver.vehicle}</Text>
                  <Text style={styles.driverSub}>Contact: {todayRoute.driver.phone}</Text>
                  <Text style={styles.confirmedStatus}>Current Status: {confirmedAvailability}</Text>
                </View>
              </View>

              {/* Availability Section */}
              {!confirmVisible ? (
                <TouchableOpacity style={styles.confirmBtn} onPress={() => setConfirmVisible(true)}>
                  <Text style={styles.confirmBtnText}>Confirm Your Availability</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ marginTop: 12 }}>
                  <View style={styles.availabilityBox}>
                    <TouchableOpacity
                      style={[styles.statusBtn, tempAvailability === "Available" && styles.statusActive]}
                      onPress={() => setTempAvailability("Available")}
                    >
                      <Text style={styles.statusBtnText}>Available</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.statusBtn, tempAvailability === "Not Available" && styles.statusInactive]}
                      onPress={() => setTempAvailability("Not Available")}
                    >
                      <Text style={styles.statusBtnText}>Not Available</Text>
                    </TouchableOpacity>
                  </View>

                  {tempAvailability === "Available" && (
                    <View style={styles.timeRow}>
                      <TouchableOpacity onPress={() => setFromPickerVisible(true)} style={styles.timeBtn}>
                        <Text style={styles.timeText}>{tempFrom}</Text>
                      </TouchableOpacity>
                      <Text style={{ marginHorizontal: 8, color: "#555" }}>–</Text>
                      <TouchableOpacity onPress={() => setToPickerVisible(true)} style={styles.timeBtn}>
                        <Text style={styles.timeText}>{tempTo}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <TouchableOpacity style={styles.finalConfirmBtn} onPress={confirmAvailability}>
                    <Text style={styles.finalConfirmText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Route Info */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Assigned Route</Text>
              <Text style={styles.routeName}>{todayRoute.routeName}</Text>
            </View>

            {/* Scheduled Passengers */}
            <Text style={styles.sectionLabel}>     Scheduled Passengers</Text>
            <FlatList
              data={todayRoute.passengers}
              renderItem={renderPassenger}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 100 }}
            />

            {/* Start Route Button */}
            <TouchableOpacity style={styles.startBtn} onPress={() => navigation.navigate("VanTrackingdriver")}>
              <Text style={styles.startBtnText}>Start Route</Text>
            </TouchableOpacity>

          </>
        ) : (
          <View style={styles.noRouteBox}>
            <Text style={styles.noRouteText}>No route assigned for today</Text>
          </View>
        )}

        {/* DateTime Pickers */}
        <DateTimePickerModal
          isVisible={isFromPickerVisible}
          mode="time"
          onConfirm={handleFromConfirm}
          onCancel={() => setFromPickerVisible(false)}
        />
        <DateTimePickerModal
          isVisible={isToPickerVisible}
          mode="time"
          onConfirm={handleToConfirm}
          onCancel={() => setToPickerVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#afd826", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: { padding: 16, backgroundColor: "#afd826", justifyContent: "center", alignItems: "center", elevation: 4 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#fff" },
  headerDate: { fontSize: 14, color: "#fff", marginTop: 4 },

  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginHorizontal: 16, marginTop: 16, elevation: 3 },
  profileRow: { flexDirection: "row", alignItems: "center" },
  profileImg: { width: 70, height: 70, borderRadius: 35 },
  driverName: { fontSize: 18, fontWeight: "700", color: "#000" },
  driverSub: { fontSize: 14, color: "#555", marginTop: 2 },
  confirmedStatus: { marginTop: 6, fontSize: 14, fontWeight: "600", color: "#2C7A7B" },

  confirmBtn: { marginTop: 12, padding: 10, borderRadius: 8, backgroundColor: "#afd826", alignItems: "center" },
  confirmBtnText: { color: "#fff", fontWeight: "600" },

  availabilityBox: { flexDirection: "row", marginTop: 10 },
  statusBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginRight: 8, backgroundColor: "#aaa" },
  statusActive: { backgroundColor: "#afd826" },
  statusInactive: { backgroundColor: "#c0392b" },
  statusBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  timeRow: { flexDirection: "row", marginTop: 8 },
  timeBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "#eee", borderRadius: 6 },
  timeText: { fontSize: 13, color: "#333" },
  finalConfirmBtn: { marginTop: 10, backgroundColor: "#afd826", padding: 10, borderRadius: 6, alignItems: "center" },
  finalConfirmText: { color: "#fff", fontWeight: "600" },

  sectionLabel: { fontSize: 15, fontWeight: "600", color: "#222", marginBottom: 8 },
  routeName: { fontSize: 16, fontWeight: "600", color: "#000" },

  passengerCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, padding: 14, marginHorizontal: 16, marginBottom: 10, elevation: 2, borderLeftWidth: 4, borderColor: "#afd826" },
  passengerInfo: { flex: 1 },
  passengerName: { fontSize: 16, fontWeight: "600", color: "#000" },
  passengerText: { fontSize: 14, color: "#333", marginTop: 2 },

  startBtn: { backgroundColor: "#afd826", padding: 16, borderRadius: 12, alignItems: "center", marginHorizontal: 16, marginBottom: 20, elevation: 3 },
  startBtnText: { color: "#000", fontWeight: "700", fontSize: 16 },

  noRouteBox: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  noRouteText: { fontSize: 16, color: "#555" },
});
