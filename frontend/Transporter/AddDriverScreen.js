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
  Clipboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddDriverScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [license, setLicense] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Fixed"); // Fixed or Contract
  const [salary, setSalary] = useState(""); // For Fixed
  const [hourlyRate, setHourlyRate] = useState(""); // For Contract
  const [hoursPerMonth, setHoursPerMonth] = useState(""); // For Contract
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const validateDriver = () => {
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
    if (!/^[A-Za-z0-9-]+$/.test(license))
      return setErrorMsg("Enter a valid license e.g. LHR-12345678.");
    if (!/^[A-Za-z0-9,\s]{20,100}$/.test(location))
      return setErrorMsg(
        "Location must be 20-100 chars, letters/digits/commas only."
      );

    // Employment validation
    if (employmentType === "Fixed") {
      if (!/^\d+$/.test(salary)) return setErrorMsg("Enter a valid fixed salary.");
    } else {
      if (!/^\d+$/.test(hourlyRate)) return setErrorMsg("Enter a valid hourly rate.");
      if (!/^\d+$/.test(hoursPerMonth)) return setErrorMsg("Enter valid hours per month.");
    }

    // If all validation passes
    setErrorMsg("");

    // Salary calculation
    let finalSalary;
    if (employmentType === "Fixed") {
      finalSalary = parseInt(salary);
    } else {
      finalSalary = parseInt(hourlyRate) * parseInt(hoursPerMonth);
    }

    const link = `https://raahi-app.com/invite?token=abcd1234`;
    setInviteLink(link);
    setSuccessMsg(
      `Driver added successfully! Calculated Salary: Rs. ${finalSalary}. Invite link generated below.`
    );
  };

  const copyLink = () => {
    Clipboard.setString(inviteLink);
    Alert.alert("Copied", "Invite link copied to clipboard!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
        <Text style={styles.headerTitle}>Add Driver</Text>
        <View style={{ width: 24 }} />
      </View>

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
          placeholder="License No. (LHR-12345678)"
          value={license}
          onChangeText={setLicense}
        />
        <TextInput
          style={styles.input}
          placeholder="Current Location"
          value={location}
          onChangeText={setLocation}
        />

        {/* Employment Type */}
        <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 10 }}>
          Employment Type
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <TouchableOpacity
            style={[
              styles.employmentBtn,
              employmentType === "Fixed" && { backgroundColor: "#afd826" },
            ]}
            onPress={() => setEmploymentType("Fixed")}
          >
            <Text style={{ color: employmentType === "Fixed" ? "#fff" : "#333" }}>
              Fixed Salary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.employmentBtn,
              employmentType === "Contract" && { backgroundColor: "#afd826" },
            ]}
            onPress={() => setEmploymentType("Contract")}
          >
            <Text style={{ color: employmentType === "Contract" ? "#fff" : "#333" }}>
              Contract-Based
            </Text>
          </TouchableOpacity>
        </View>

        {/* Salary Input */}
        {employmentType === "Fixed" ? (
          <TextInput
            style={styles.input}
            placeholder="Enter Fixed Salary"
            keyboardType="numeric"
            value={salary}
            onChangeText={setSalary}
          />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Hourly Rate"
              keyboardType="numeric"
              value={hourlyRate}
              onChangeText={setHourlyRate}
            />
            <TextInput
              style={styles.input}
              placeholder="Hours Per Month"
              keyboardType="numeric"
              value={hoursPerMonth}
              onChangeText={setHoursPerMonth}
            />
          </>
        )}

        {/* Error / Success Messages */}
        {errorMsg ? (
          <View style={styles.msgBoxError}>
            <Text style={styles.error}>{errorMsg}</Text>
          </View>
        ) : null}
        {successMsg ? (
          <View style={styles.msgBoxSuccess}>
            <Text style={styles.success}>{successMsg}</Text>
            {inviteLink ? (
              <TouchableOpacity style={styles.linkBox} onPress={copyLink}>
                <Text style={styles.linkText}>{inviteLink}</Text>
                <Ionicons
                  name="copy-outline"
                  size={18}
                  color="#28a745"
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {/* Save Button */}
        <TouchableOpacity style={styles.btn} onPress={validateDriver}>
          <Text style={styles.btnText}>Save Driver</Text>
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
  success: { color: "#28a745", fontSize: 14, marginBottom: 6 },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fff4",
    padding: 8,
    borderRadius: 8,
  },
  linkText: {
    color: "#28a745",
    fontSize: 14,
  },
  employmentBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
});
