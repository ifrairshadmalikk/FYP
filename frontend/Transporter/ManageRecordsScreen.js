import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ManageRecordsScreen({ navigation }) {
  const [records, setRecords] = useState([
    { id: 1, type: "Driver", name: "Ali Khan", mobile: "03001234567", cnic: "1234512345671", email: "ali@example.com", password: "Ali@1234" },
    { id: 2, type: "Passenger", name: "Sara Ahmed", mobile: "03111234567", cnic: "3214512345672", email: "sara@example.com", password: "Sara@1234" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
            setRecords((prev) => prev.filter((r) => r.id !== id));
          } 
        }
      ]
    );
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleSave = () => {
    // Validation
    const nameRegex = /^[A-Za-z\s]{1,50}$/;
    const mobileRegex = /^\d{11}$/;
    const cnicRegex = /^\d{13}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;

    if (!nameRegex.test(selectedRecord.name)) return Alert.alert("Invalid Name", "Please enter a valid name (letters only).");
    if (!mobileRegex.test(selectedRecord.mobile)) return Alert.alert("Invalid Mobile", "Mobile number must be exactly 11 digits.");
    if (!cnicRegex.test(selectedRecord.cnic)) return Alert.alert("Invalid CNIC", "CNIC must be exactly 13 digits.");
    if (!emailRegex.test(selectedRecord.email)) return Alert.alert("Invalid Email", "Please enter a valid email.");
    if (!passRegex.test(selectedRecord.password)) return Alert.alert("Invalid Password", "Password must be 8-16 chars with uppercase, digit, special char.");

    setRecords((prev) =>
      prev.map((r) => (r.id === selectedRecord.id ? selectedRecord : r))
    );
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Records</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Records List */}
      <ScrollView style={styles.container}>
        {records.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.recordTitle}>{item.type}: {item.name}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color="#555" style={{ marginRight: 6 }} />
              <Text style={styles.recordSub}>{item.mobile}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="id-card-outline" size={18} color="#555" style={{ marginRight: 6 }} />
              <Text style={styles.recordSub}>{item.cnic}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color="#555" style={{ marginRight: 6 }} />
              <Text style={styles.recordSub}>{item.email}</Text>
            </View>

            {/* Action Row */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconBtn}>
                <Ionicons name="trash" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Edit Modal */}
      {selectedRecord && (
        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit {selectedRecord.type}</Text>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={selectedRecord.name}
                onChangeText={(text) => setSelectedRecord({ ...selectedRecord, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Mobile"
                keyboardType="numeric"
                value={selectedRecord.mobile}
                onChangeText={(text) => setSelectedRecord({ ...selectedRecord, mobile: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="CNIC"
                keyboardType="numeric"
                value={selectedRecord.cnic}
                onChangeText={(text) => setSelectedRecord({ ...selectedRecord, cnic: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={selectedRecord.email}
                onChangeText={(text) => setSelectedRecord({ ...selectedRecord, email: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={selectedRecord.password}
                onChangeText={(text) => setSelectedRecord({ ...selectedRecord, password: text })}
              />

              <View style={styles.modalBtnRow}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#afd826", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  headerBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#afd826", paddingHorizontal: 15, paddingVertical: 12, elevation: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  card: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: "#eee", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3 },
  recordTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  recordSub: { fontSize: 14, color: "#555" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  actionRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8, alignItems: "center" },
  editBtn: { backgroundColor: "#afd826", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, marginRight: 12 },
  editText: { color: "#000", fontWeight: "bold" },
  iconBtn: { padding: 6 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 15, backgroundColor: "#f9f9f9" },
  modalBtnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  saveBtn: { backgroundColor: "#afd826", padding: 12, borderRadius: 8, flex: 1, marginRight: 5 },
  saveText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  cancelBtn: { backgroundColor: "#ccc", padding: 12, borderRadius: 8, flex: 1, marginLeft: 5 },
  cancelText: { color: "#000", fontWeight: "bold", textAlign: "center" },
});
