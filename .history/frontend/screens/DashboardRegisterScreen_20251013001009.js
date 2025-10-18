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

    switch (role) {
      case "Driver":
        navigation.navigate("DriverRegister");
        break;
      case "Transporter":
        navigation.navigate("TransporterRegister");
        break;
      case "Passenger":
        navigation.navigate("PassengerLoginScreen");
        break;
      default:
        setErrorMsg("Invalid role selected. Please try again.");
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerBox}>
        {/* Logo */}
        <Image
          source={{
            uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
          }}
          style={styles.logo}
          resizeMode="contain"
          onError={() => console.log("Failed to load logo")}
        />

        <Text style={styles.title}>Select Your Role</Text>

        {/* Role Picker */}
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            testID="role-picker"
          >
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="Passenger" value="Passenger" />
            <Picker.Item label="Driver" value="Driver" />
            <Picker.Item label="Transporter" value="Transporter" />
          </Picker>
        </View>

        {/* Error Message */}
        {errorMsg ? (
          <Text style={styles.error} testID="error-message">
            {errorMsg}
          </Text>
        ) : null}

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            !role && styles.submitBtnDisabled
          ]}
          onPress={handleNext}
          disabled={!role}
          testID="next-button"
        >
          <Text style={styles.submitText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}