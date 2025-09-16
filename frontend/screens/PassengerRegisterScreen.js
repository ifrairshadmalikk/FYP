import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import styles from "../styles/PassengerStyles";

export default function PassengerRegisterScreen({ navigation }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validatePassenger = () => {
    if (!pickup || !dropoff) {
      setErrorMsg("Pickup and drop-off addresses are required.");
      return;
    }
    if (pickup.length < 20 || dropoff.length < 20) {
      setErrorMsg("Addresses must be at least 20 characters long.");
      return;
    }

    // ✅ Clear errors
    setErrorMsg("");

    // ✅ Navigate to Passenger Transporter Selection Screen
    navigation.navigate("PassengerTransporterSelection");
  };

  return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >      {/* 👇 Responsive Image at top */}
      <Image
        source={{
          uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d9563c66af7dc80df8_image.webp",
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>Passenger Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="Pickup Address"
        placeholderTextColor="#999"
        value={pickup}
        onChangeText={setPickup}
      />

      <TextInput
        style={styles.input}
        placeholder="Dropoff Address"
        placeholderTextColor="#999"
        value={dropoff}
        onChangeText={setDropoff}
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <TouchableOpacity style={styles.submitBtn} onPress={validatePassenger}>
        <Text style={styles.submitText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
