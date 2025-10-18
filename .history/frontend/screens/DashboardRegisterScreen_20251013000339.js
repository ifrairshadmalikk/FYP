import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "../styles/DashboardStyles";

const { width } = Dimensions.get("window");

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
            onError={() => console.log("Failed to load logo")}
          />
          <Text style={styles.title}>Select Your Role</Text>
          <Text style={styles.subtitle}>
            Choose how you want to experience our platform
          </Text>
        </View>

        {/* Role Selection Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Account Type</Text>
          </View>

          {/* Role Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>I want to join as:</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                testID="role-picker"
                style={styles.picker}
                dropdownIconColor="#111827"
              >
                <Picker.Item label="Select your role" value="" />
                <Picker.Item label="🚗 Passenger" value="Passenger" />
                <Picker.Item label="👨‍💼 Driver" value="Driver" />
                <Picker.Item label="🏢 Transporter" value="Transporter" />
              </Picker>
            </View>
          </View>

          {/* Role Description */}
          {role && (
            <View style={styles.roleDescription}>
              <Text style={styles.roleDescriptionText}>
                {role === "Passenger" && "Book rides and travel with comfort and safety"}
                {role === "Driver" && "Drive passengers and grow your earnings"}
                {role === "Transporter" && "Manage fleet operations and scale your business"}
              </Text>
            </View>
          )}

          {/* Error Message */}
          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={styles.error} testID="error-message">
                ⚠️ {errorMsg}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Action Section */}
        <View style={styles.actionSection}>
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
              {role ? `Continue as ${role}` : 'Select Role to Continue'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.helpText}>
            You can modify your role preferences later in settings
          </Text>
        </View>
      </View>
    </View>
  );
}