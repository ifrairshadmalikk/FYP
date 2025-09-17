// frontend/screens/TransporterRegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import styles from "../styles/TransporterStyles";

export default function TransporterRegisterScreen({ navigation }) {
  // Common fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Transporter specific
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zone, setZone] = useState("");

  // Messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validateTransporter = () => {
    // --- Common Validations ---
    if (
      !fullName ||
      !mobile ||
      !cnic ||
      !email ||
      !password ||
      !confirmPassword ||
      !country ||
      !city ||
      !zone
    ) {
      setErrorMsg("All fields are required.");
      return;
    }

    // Full Name
    const nameRegex = /^[A-Za-z\s]{1,50}$/;
    if (!nameRegex.test(fullName)) {
      setErrorMsg(
        "Please enter a valid name using letters only. Special characters and digits are not allowed."
      );
      return;
    }

    // Mobile
    if (!/^\d{11}$/.test(mobile)) {
      setErrorMsg(
        "Mobile number must contain digits only and must be exactly 11 digits long."
      );
      return;
    }

    // CNIC
    if (!/^\d{13}$/.test(cnic)) {
      setErrorMsg(
        "Please enter a valid CNIC number consisting of exactly 13 digits and with no dashes."
      );
      return;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Invalid email format. Please enter a valid email address.");
      return;
    }

    // Password
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passRegex.test(password)) {
      setErrorMsg(
        "Password must be 8-16 characters long and contain an uppercase letter, a digit, and a special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    // --- Transporter Specific ---
    const zoneRegex = /^[A-Za-z0-9,\s]{1,100}$/;
    if (
      !zoneRegex.test(country) ||
      !zoneRegex.test(city) ||
      !zoneRegex.test(zone)
    ) {
      setErrorMsg(
        "Country, city, and zone must be 1-100 characters long and may only contain letters, digits, and commas."
      );
      return;
    }

    // ✅ Success
    setErrorMsg("");
    setSuccessMsg("Registered successfully.");
    // TODO: send data to backend API
    setTimeout(() => {
      navigation.navigate("LoginScreen");
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={require("./transporter.png")} style={styles.image} />

      <Text style={styles.title}>Transporter Registration</Text>

      {/* Full Name */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Mobile */}
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="number-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      {/* CNIC */}
      <TextInput
        style={styles.input}
        placeholder="CNIC (13 digits)"
        keyboardType="number-pad"
        value={cnic}
        onChangeText={setCnic}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Country */}
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />

      {/* City */}
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      {/* Zone */}
      <TextInput
        style={styles.input}
        placeholder="Zone"
        value={zone}
        onChangeText={setZone}
      />

      {/* Messages */}
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

      {/* Register Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={validateTransporter}>
        <Text style={styles.submitText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
