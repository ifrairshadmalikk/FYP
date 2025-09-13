import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import styles from "../styles/TransporterStyles";

export default function TransporterRegisterScreen() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zone, setZone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validateTransporter = () => {
    if (!country || !city || !zone) {
      setErrorMsg("Please provide your country, city, and local zone.");
      return;
    }
    if (country.length > 100 || city.length > 100 || zone.length > 100) {
      setErrorMsg("Each field must be less than 100 characters.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("Transporter registered successfully!");
  };

  return (
    <ScrollView style={styles.container}>
      {/* 👇 Image Added */}
      <Image
        source={require("./transporter.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Transporter Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="Country"
        placeholderTextColor="#999"
        value={country}
        onChangeText={setCountry}
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor="#999"
        value={city}
        onChangeText={setCity}
      />

      <TextInput
        style={styles.input}
        placeholder="Zone"
        placeholderTextColor="#999"
        value={zone}
        onChangeText={setZone}
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

      <TouchableOpacity style={styles.submitBtn} onPress={validateTransporter}>
        <Text style={styles.submitText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
