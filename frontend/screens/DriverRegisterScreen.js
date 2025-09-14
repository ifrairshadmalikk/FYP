// screens/DriverRegisterScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import styles from "../styles/DriverStyles.js";

export default function DriverRegisterScreen({ navigation }) {  // ✅ navigation add
  const [licenseNo, setLicenseNo] = useState("");
  const [location, setLocation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validateDriver = () => {
    if (!licenseNo || !location) {
      setErrorMsg("All fields are required.");
      return;
    }
    if (!/^[A-Za-z]{1,}-\d{4,}$/.test(licenseNo)) {
      setErrorMsg("Enter a valid license number e.g. LHR-12345678");
      return;
    }
    if (location.length < 20) {
      setErrorMsg("Location must be at least 20 characters long.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("Driver registered successfully!");

    // ✅ Navigate to DriverTransporterSelectionScreen
    navigation.navigate("DriverTransporterSelection");
  };

  return (
    <ScrollView style={styles.container}>
      {/* 👇 Image Added */}
      <Image
        source={{
          uri: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRUGAfyIRqRuM2wrxJKjZcSJw_xHizryOzIFp0f_DWVveuR1HSY",
        }}
        style={{ width: "100%", height: 180, marginBottom: 20, borderRadius: 10, marginTop: 80 }}
        resizeMode="cover"
      />

      <Text style={styles.title}>Driver Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="License Number"
        placeholderTextColor="#999"
        value={licenseNo}
        onChangeText={setLicenseNo}
      />

      <TextInput
        style={styles.input}
        placeholder="Current Location"
        placeholderTextColor="#999"
        value={location}
        onChangeText={setLocation}
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

      <TouchableOpacity style={styles.submitBtn} onPress={validateDriver}>
        <Text style={styles.submitText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
