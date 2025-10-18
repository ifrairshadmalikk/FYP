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
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image
            source={{
              uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
            }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Select Your Role</Text>
          <Text style={styles.subtitle}>Choose how you want to use our platform</Text>
        </View>

        {/* Role Selection */}
        <View style={styles.roleSection}>
          <Text style={styles.label}>Select Role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Choose your role" value="" />
              <Picker.Item label="Passenger" value="Passenger" />
              <Picker.Item label="Driver" value="Driver" />
              <Picker.Item label="Transporter" value="Transporter" />
            </Picker>
          </View>

          {/* Role Hint */}
          {role && (
            <Text style={styles.roleHint}>
              {role === "Passenger" ? "Book rides and travel comfortably" :
                role === "Driver" ? "Drive and earn with your vehicle" :
                  "Manage your transport business"}
            </Text>
          )}
        </View>

        {/* Error Message */}
        {errorMsg ? (
          <Text style={styles.error} testID="error-message">
            {errorMsg}
          </Text>
        ) : null}

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            !role && styles.submitBtnDisabled
          ]}
          onPress={handleNext}
          disabled={!role}
          testID="next-button"
        >
          <Text style={styles.submitText}>
            Continue as {role || "..."}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}