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
      routeName: "Van #12 – City School Morning Pickup",
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

export default function DriverDashboard({ navigation }) {
  const [todayRoute, setTodayRoute] = useState(null);
  const [availability, setAvailability] = useState("Available");
  const [availableFrom, setAvailableFrom] = useState("07:00 AM");
  const [availableTo, setAvailableTo] = useState("02:00 PM");
  const [isFromPickerVisible, setFromPickerVisible] = useState(false);
  const [isToPickerVisible, setToPickerVisible] = useState(false);

  const todayDate = new Date().toDateString();

  useEffect(() => {
    const route = fetchTodayRoute();
    setTodayRoute(route);
    if (route) {
      setAvailability(route.driver.status);
      setAvailableFrom(route.driver.availableFrom);
      setAvailableTo(route.driver.availableTo);
    }
  }, []);

  const showFromPicker = () => setFromPickerVisible(true);
  const hideFromPicker = () => setFromPickerVisible(false);
  const showToPicker = () => setToPickerVisible(true);
  const hideToPicker = () => setToPickerVisible(false);

  const handleFromConfirm = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formatted = `${hours % 12 || 12}:${minutes < 10 ? '0'+minutes : minutes} ${hours < 12 ? 'AM' : 'PM'}`;
    setAvailableFrom(formatted);
    hideFromPicker();
  };

  const handleToConfirm = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formatted = `${hours % 12 || 12}:${minutes < 10 ? '0'+minutes : minutes} ${hours < 12 ? 'AM' : 'PM'}`;
    setAvailableTo(formatted);
    hideToPicker();
  };

  const confirmAvailability = () => {
    Alert.alert(
      "Availability Confirmed",
      `You are now ${availability}\nFrom ${availableFrom} to ${availableTo}`,
      [{ text: "OK" }]
    );
    // TODO: send notification to transporter
  };

  const renderPassenger = ({ item }) => (
    <View style={styles.passengerCard}>
      <View style={styles.passengerInfo}>
        <Text style={styles.passengerName}>{item.name}</Text>
        <Text style={styles.text}>Pickup: {item.pickup}</Text>
        <Text style={styles.text}>Drop-off: {item.dropoff}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Driver Dashboard</Text>
        </View>

        {todayRoute ? (
          <>
            {/* Driver Profile */}
            <View style={styles.profileCard}>
              <Image source={{ uri: todayRoute.driver.image }} style={styles.profileImg} />
              <View style={styles.profileInfo}>
                <Text style={styles.driverName}>{todayRoute.driver.name}</Text>
                <Text style={styles.driverSub}>Vehicle: {todayRoute.driver.vehicle}</Text>
                <Text style={styles.driverSub}>Contact: {todayRoute.driver.phone}</Text>

                {/* Availability */}
                <View style={styles.availabilityBox}>
                  <TouchableOpacity
                    style={[styles.statusBtn, availability === "Available" && styles.statusActive]}
                    onPress={() => setAvailability("Available")}
                  >
                    <Text style={styles.statusBtnText}>Available</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.statusBtn, availability === "Not Available" && styles.statusInactive]}
                    onPress={() => setAvailability("Not Available")}
                  >
                    <Text style={styles.statusBtnText}>Not Available</Text>
                  </TouchableOpacity>
                </View>

                {availability === "Available" && (
                  <View style={{ flexDirection: "row", marginTop: 6 }}>
                    <TouchableOpacity onPress={showFromPicker} style={styles.timeBtn}>
                      <Text style={styles.timeText}>{availableFrom}</Text>
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 8, color: "#555" }}>–</Text>
                    <TouchableOpacity onPress={showToPicker} style={styles.timeBtn}>
                      <Text style={styles.timeText}>{availableTo}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity style={styles.confirmBtn} onPress={confirmAvailability}>
                  <Text style={styles.confirmBtnText}>Confirm Availability</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* DateTime Pickers */}
            <DateTimePickerModal
              isVisible={isFromPickerVisible}
              mode="time"
              onConfirm={handleFromConfirm}
              onCancel={hideFromPicker}
            />
            <DateTimePickerModal
              isVisible={isToPickerVisible}
              mode="time"
              onConfirm={handleToConfirm}
              onCancel={hideToPicker}
            />

            {/* Route Info */}
            <View style={styles.routeCard}>
              <Text style={styles.mainTitle}>{todayRoute.routeName}</Text>
              <Text style={styles.subText}>{todayDate}</Text>
            </View>

            {/* Passenger List */}
            <Text style={styles.sectionTitle}>Scheduled Passengers</Text>
            <FlatList
              data={todayRoute.passengers}
              renderItem={renderPassenger}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 90 }}
            />

            {/* Start Route */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("VanTrackingdriver")}
            >
              <Text style={styles.buttonText}>Start Route</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.noRouteBox}>
            <Text style={styles.noRouteText}>No route assigned for today</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#afd826", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  headerBar: { paddingVertical: 16, paddingHorizontal: 20, backgroundColor: "#afd826", elevation: 5, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#fff" },

  profileCard: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 12, elevation: 3 },
  profileImg: { width: 70, height: 70, borderRadius: 35 },
  profileInfo: { flex: 1, marginLeft: 12 },
  driverName: { fontSize: 18, fontWeight: "700", color: "#000" },
  driverSub: { fontSize: 14, color: "#555", marginTop: 2 },

  availabilityBox: { flexDirection: "row", marginTop: 10 },
  statusBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginRight: 8, backgroundColor: "#aaa" },
  statusActive: { backgroundColor: "#afd826" },
  statusInactive: { backgroundColor: "#c0392b" },
  statusBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  timeBtn: { paddingVertical: 4, paddingHorizontal: 10, backgroundColor: "#eee", borderRadius: 6 },
  timeText: { fontSize: 13, color: "#333" },
  confirmBtn: { marginTop: 8, backgroundColor: "#afd826", padding: 10, borderRadius: 8, alignItems: "center" },
  confirmBtnText: { color: "#000", fontWeight: "700" },

  routeCard: { marginHorizontal: 16, marginVertical: 16, padding: 16, backgroundColor: "#fff", borderRadius: 12, elevation: 2, borderWidth: 1, borderColor: "#afd826", alignItems: "center" },
  mainTitle: { fontSize: 17, fontWeight: "700", color: "#000" },
  subText: { fontSize: 14, color: "#555", marginTop: 4 },

  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#222", marginHorizontal: 16, marginBottom: 8 },

  passengerCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, padding: 14, marginHorizontal: 16, marginBottom: 10, elevation: 2, borderLeftWidth: 4, borderColor: "#afd826" },
  passengerInfo: { flex: 1 },
  passengerName: { fontSize: 16, fontWeight: "600", color: "#000" },
  text: { fontSize: 14, color: "#333", marginTop: 2 },

  button: { backgroundColor: "#afd826", padding: 16, borderRadius: 12, alignItems: "center", marginHorizontal: 16, marginBottom: 20, elevation: 3 },
  buttonText: { color: "#000", fontWeight: "700", fontSize: 16 },

  noRouteBox: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  noRouteText: { fontSize: 16, color: "#555" },
});
