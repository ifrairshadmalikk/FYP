import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddPassengerScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validatePassenger = () => {
    const nameRegex = /^[A-Za-z\s]{1,50}$/;
    if (!nameRegex.test(fullName))
      return setErrorMsg("Please enter a valid name using letters only.");
    if (!/^\d{11}$/.test(mobile))
      return setErrorMsg("Mobile number must be exactly 11 digits.");
    if (!/^\d{13}$/.test(cnic))
      return setErrorMsg("CNIC must be exactly 13 digits.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setErrorMsg("Invalid email format.");
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    if (!passRegex.test(password))
      return setErrorMsg(
        "Password must be 8-16 chars with uppercase, digit, special char."
      );
    if (
      !/^[A-Za-z0-9,\s]{20,100}$/.test(pickup) ||
      !/^[A-Za-z0-9,\s]{20,100}$/.test(drop)
    )
      return setErrorMsg(
        "Pickup/drop must be 20-100 chars, letters/digits/commas only."
      );

    setErrorMsg("");
    setSuccessMsg("✅ Passenger added successfully!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Status Bar */}
      <StatusBar
        backgroundColor="#afd826"
        barStyle="light-content"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Passenger</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Content */}
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile (11 digits)"
          keyboardType="numeric"
          value={mobile}
          onChangeText={setMobile}
        />
        <TextInput
          style={styles.input}
          placeholder="CNIC (13 digits)"
          keyboardType="numeric"
          value={cnic}
          onChangeText={setCnic}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Pickup Location"
          value={pickup}
          onChangeText={setPickup}
        />
        <TextInput
          style={styles.input}
          placeholder="Drop Location"
          value={drop}
          onChangeText={setDrop}
        />

        {/* Error / Success Messages */}
        {errorMsg ? (
          <View style={styles.msgBoxError}>
            <Text style={styles.error}>{errorMsg}</Text>
          </View>
        ) : null}
        {successMsg ? (
          <View style={styles.msgBoxSuccess}>
            <Text style={styles.success}>{successMsg}</Text>
          </View>
        ) : null}

        {/* Save Button */}
        <TouchableOpacity style={styles.btn} onPress={validatePassenger}>
          <Text style={styles.btnText}>Save Passenger</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#afd826",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#afd826",
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
  },
  btn: {
    backgroundColor: "#afd826",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  msgBoxError: {
    backgroundColor: "#ffe6e6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  msgBoxSuccess: {
    backgroundColor: "#e6ffed",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  error: { color: "#d9534f", fontSize: 14 },
  success: { color: "#28a745", fontSize: 14 },
});
