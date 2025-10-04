import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  Alert,
  Image,
  TextInput,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons, Entypo, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const fetchTodayRoute = () => ({
  routeName: "Van #12 – Morning School Route",
  driver: {
    name: "Ahmed Khan",
    vehicle: "Van #12",
    phone: "+92 300 1234567",
  },
  passengers: [
    { id: "1", name: "Ali Raza", pickup: "Street 12, Model Town", dropoff: "City School" },
    { id: "2", name: "Sara Ahmed", pickup: "Block F, Johar Town", dropoff: "Beaconhouse School" },
  ],
});

export default function DriverDashboard({ navigation }) {
  const [route, setRoute] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [screen, setScreen] = useState("dashboard");
  const [profileImage, setProfileImage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [slots, setSlots] = useState([
    { id: "1", time: "6:00 AM - 9:00 AM" },
    { id: "2", time: "12:00 PM - 3:00 PM" },
  ]);
  const [newSlot, setNewSlot] = useState("");

  const sidebarAnim = useState(new Animated.Value(-width * 0.7))[0];

  useEffect(() => {
    setRoute(fetchTodayRoute());
  }, []);

  const toggleSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: showSidebar ? -width * 0.7 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setShowSidebar(!showSidebar);
  };

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission Required", "Please allow access to your gallery to upload an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const handleAddSlot = () => {
    if (!newSlot.trim()) return;
    setSlots([...slots, { id: Date.now().toString(), time: newSlot }]);
    setNewSlot("");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => navigation.replace("Login") },
    ]);
  };

  // ✅ Corrected Availability Logic
  const confirmAvailability = (status) => {
    const message = status
      ? "You are now marked as Available. You can now add your available time slots."
      : "You are now marked as Not Available.";
    Alert.alert("Availability Updated", message);
  };

  const toggleAvailability = () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    confirmAvailability(newStatus);
  };

  // ✅ Notification Sending Function
  const sendNotification = () => {
    const statusText = isAvailable ? "Available" : "Not Available";
    Alert.alert(
      "Notification Sent",
      `Your ${statusText} status has been notified to the transporter.`
    );
  };

  const renderPassenger = ({ item }) => (
    <View style={styles.passengerCard}>
      <FontAwesome5 name="user-graduate" size={22} color="#AFD826" style={{ marginRight: 10 }} />
      <View style={styles.passengerInfo}>
        <Text style={styles.passengerName}>{item.name}</Text>
        <Text style={styles.passengerText}>Pickup: {item.pickup}</Text>
        <Text style={styles.passengerText}>Drop-off: {item.dropoff}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#AFD826" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {screen === "dashboard" ? "Dashboard" : "Availability"}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      {/* SIDEBAR */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.sidebarHeader}>
            <TouchableOpacity onPress={pickImage} style={styles.profileContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImg} />
              ) : (
                <Ionicons name="person-circle-outline" size={80} color="#AFD826" />
              )}
              <View style={styles.editIcon}>
                <Ionicons name="pencil" size={18} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.sidebarName}>Ahmed Khan</Text>
            <Text style={styles.sidebarRole}>Driver</Text>
          </View>

          <View style={styles.sidebarMenu}>
            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={() => {
                setScreen("dashboard");
                toggleSidebar();
              }}
            >
              <Ionicons name="speedometer-outline" size={22} color="#000" />
              <Text style={styles.sidebarText}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={() => {
                setScreen("availability");
                toggleSidebar();
              }}
            >
              <Ionicons name="time-outline" size={22} color="#000" />
              <Text style={styles.sidebarText}>Availability</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
              <MaterialIcons name="logout" size={22} color="red" />
              <Text style={[styles.sidebarText, { color: "red" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      {/* MAIN CONTENT */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 100 }}>
        {screen === "dashboard" ? (
          route ? (
            <>
              <View style={styles.card}>
                <View style={styles.profileRow}>
                  <Ionicons name="person-circle-outline" size={60} color="#AFD826" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.driverName}>{route.driver.name}</Text>
                    <Text style={styles.driverSub}>Vehicle: {route.driver.vehicle}</Text>
                    <Text style={styles.driverSub}>Contact: {route.driver.phone}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionLabel}>Assigned Route</Text>
                <Text style={styles.routeName}>{route.routeName}</Text>
              </View>

              <Text style={[styles.sectionLabel, { marginLeft: 20 }]}>Scheduled Passengers</Text>
              <FlatList
                data={route.passengers}
                renderItem={renderPassenger}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />

              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => navigation.navigate("VanTrackingdriver")}
              >
                <Text style={styles.startBtnText}>Start Route</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.noRouteBox}>
              <Text style={styles.noRouteText}>No route assigned for today</Text>
            </View>
          )
        ) : (
          <View style={{ flex: 1 }}>
            {/* ✅ Availability Section */}
            <View style={styles.availabilityHeader}>
              <Text style={styles.sectionLabel}>Confirm your Availability:</Text>

              <Text style={styles.statusText}>
                Status:{" "}
                <Text style={{ fontWeight: "bold", color: isAvailable ? "green" : "red" }}>
                  {isAvailable ? "Available" : "Not Available"}
                </Text>
              </Text>

              <View style={styles.switchContainer}>
                <Text style={{ fontSize: 16, marginRight: 10 }}></Text>
                <Switch
                  value={isAvailable}
                  onValueChange={toggleAvailability}
                  trackColor={{ false: "#FF5252", true: "#AFD826" }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            {/* ✅ Show slots only when Available */}
            {isAvailable && (
              <View style={styles.slotSection}>
                <Text style={[styles.sectionLabel, { marginBottom: 10 }]}>
                  Add Your Available Time Slots
                </Text>
                <View style={styles.addSlotContainer}>
                  <TextInput
                    placeholder="e.g. 5:00 PM - 8:00 PM"
                    value={newSlot}
                    onChangeText={setNewSlot}
                    style={styles.slotInput}
                  />
                  <TouchableOpacity style={styles.addBtn} onPress={handleAddSlot}>
                    <Entypo name="plus" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>

                {slots.map((slot) => (
                  <View key={slot.id} style={styles.slotBox}>
                    <Entypo name="clock" size={18} color="#AFD826" />
                    <Text style={styles.slotText}>{slot.time}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* ✅ Notification Button (for both Available & Not Available) */}
            <TouchableOpacity style={styles.notifyBtn} onPress={sendNotification}>
              <Text style={styles.notifyBtnText}>Send Notification to Transporter</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#AFD826",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#AFD826",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  // ✅ Header text now aligned right
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "left",
    flex: 1,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  // ✅ Dashboard Cards: consistent spacing
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  profileRow: { flexDirection: "row", alignItems: "center" },
  driverName: { fontSize: 18, fontWeight: "700", color: "#000" },
  driverSub: { fontSize: 14, color: "#555", marginTop: 2 },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  routeName: { fontSize: 16, fontWeight: "600", color: "#000" },

  // ✅ Passenger card spacing improved
  passengerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 10,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderColor: "#AFD826",
  },

  passengerInfo: { flex: 1 },
  passengerName: { fontSize: 16, fontWeight: "600", color: "#000" },
  passengerText: { fontSize: 14, color: "#333", marginTop: 2 },

  startBtn: {
    backgroundColor: "#AFD826",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
    elevation: 3,
  },
  startBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  noRouteBox: { justifyContent: "center", alignItems: "center", marginTop: 50 },
  noRouteText: { fontSize: 16, color: "#555" },

  // ✅ Sidebar improved — profile area lower
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 8,
    borderRightWidth: 1,
    borderColor: "#ddd",
  },
  sidebarHeader: {
    alignItems: "center",
    paddingVertical: 50, // ⬅️ increased from 30 to bring profile lower
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  profileContainer: { position: "relative" },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 4,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#AFD826",
  },
  sidebarName: { fontSize: 16, fontWeight: "700", color: "#000", marginTop: 6 },
  sidebarRole: { fontSize: 13, color: "#666" },
  sidebarMenu: { marginTop: 15 },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 20,
  },
  sidebarText: { fontSize: 16, color: "#000" },

  availabilityHeader: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 3,
    marginBottom: 10,
  },
  statusText: { fontSize: 16, marginTop: 6 },

  slotSection: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  slotBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    elevation: 2,
  },
  slotText: { marginLeft: 10, fontSize: 15, color: "#333" },
  addSlotContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  slotInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    elevation: 2,
  },
  addBtn: {
    backgroundColor: "#AFD826",
    borderRadius: 10,
    marginLeft: 8,
    padding: 10,
    elevation: 3,
  },

  // ✅ Notification button (unchanged)
  notifyBtn: {
    backgroundColor: "#AFD826",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
    elevation: 3,
  },
  notifyBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
