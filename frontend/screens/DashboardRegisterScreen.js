import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "../styles/DashboardStyles";

export default function DashboardRegisterScreen({ navigation }) {
  const [role, setRole] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleNext = () => {
    if (!role) {
      setErrorMsg("Please select a valid user role.");
      return;
    }
    setErrorMsg("");

    if (role === "Passenger") navigation.navigate("PassengerApp");
    if (role === "Driver") navigation.navigate("DriverRegister");
    if (role === "Transporter") navigation.navigate("TransporterRegister");
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={{
          uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
        }}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Select Your Role</Text>

      {/* Role Picker */}
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={role}
          onValueChange={(value) => setRole(value)}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Passenger" value="Passenger" />
          <Picker.Item label="Driver" value="Driver" />
          <Picker.Item label="Transporter" value="Transporter" />
        </Picker>
      </View>

      {/* Error Message */}
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      {/* Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleNext}>
        <Text style={styles.submitText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
