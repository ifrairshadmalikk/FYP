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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PassengerList({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const passengers = [
    { id: 1, name: "Sara", van: "Van 1", pickup: "Location 1", status: "going", timing: "08:00 - 09:00" },
    { id: 2, name: "Ahmed", van: "Van 2", pickup: "Location 2", status: "not_going", timing: "09:30 - 10:30" },
    { id: 3, name: "Ali", van: "Van 3", pickup: "Location 3", status: "not_confirmed", timing: "10:00 - 11:00" },
    { id: 4, name: "Zara", van: "Van 4", pickup: "Location 4", status: "not_studied", timing: "11:00 - 12:00" },
  ];

  const getStatus = (status) => {
    switch (status) {
      case "going":
        return { text: "Going Tomorrow", color: "#28a745", bg: "#eaf8ee" };
      case "not_going":
        return { text: "Not Going Tomorrow", color: "#dc3545", bg: "#fdeaea" };
      case "not_confirmed":
      case "not_studied":
        return { text: "Not Confirmed Yet", color: "#fd7e14", bg: "#fff4e6" };
      default:
        return { text: "Unknown", color: "#555", bg: "#eee" };
    }
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
    fadeAnim.setValue(0);

    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    setTimeout(() => hideModal(), 2500);
  };

  const hideModal = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() =>
      setModalVisible(false)
    );
  };

  const sendReminder = (passenger) => {
    showModal(`Reminder sent to ${passenger.name}.`);
  };

  const renderItem = ({ item }) => {
    const statusInfo = getStatus(item.status);

    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.infoText}>Van: {item.van}</Text>
        <Text style={styles.infoText}>Pickup: {item.pickup}</Text>
        <Text style={styles.infoText}>Timing: {item.timing}</Text>

        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>

        {(item.status === "not_studied" || item.status === "not_confirmed") && (
          <TouchableOpacity
            style={styles.reminderButton}
            activeOpacity={0.8}
            onPress={() => sendReminder(item)}
          >
            <Text style={styles.reminderButtonText}>Send Confirmation</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Passengers List</Text>
        <View style={{ width: 24 }} />
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
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={hideModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  headerContainer: {
    height: 60,
    backgroundColor: "#afd826",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },

  container: { padding: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  name: { fontSize: 17, fontWeight: "700", color: "#111", marginBottom: 6 },
  infoText: { fontSize: 14, color: "#555", marginBottom: 3 },

  statusBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: { fontSize: 13, fontWeight: "600" },

  reminderButton: {
    marginTop: 12,
    backgroundColor: "#afd826",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  reminderButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  modalContainer: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 14,
    width: "80%",
    alignItems: "center",
    elevation: 6,
  },
  modalText: { fontSize: 16, color: "#333", textAlign: "center", marginBottom: 16 },
  modalButton: {
    backgroundColor: "#afd826",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
