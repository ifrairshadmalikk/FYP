import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "../styles/DashboardStyles";

export default function DashboardRegisterScreen({ navigation }) {
  const [role, setRole] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleNext = () => {
    if (!role) {
      setErrorMsg("Please select your role to continue");
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
        setErrorMsg("Please select a valid role");
        break;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
            }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome to RideShare</Text>
          <Text style={styles.subtitle}>Get started by choosing your role</Text>
        </View>

        {/* Role Selection Card */}
        <View style={styles.roleCard}>
          <Text style={styles.cardTitle}>How would you like to use our app?</Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select your role</Text>
            <View style={[styles.pickerWrapper, role && styles.pickerActive]}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
                dropdownIconColor="#111827"
              >
                <Picker.Item label="I want to..." value="" />
                <Picker.Item label="Book rides as Passenger" value="Passenger" />
                <Picker.Item label="Drive as a Driver" value="Driver" />
                <Picker.Item label="Manage as Transporter" value="Transporter" />
              </Picker>
            </View>
          </View>

          {/* Role Benefits */}
          {role && (
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>
                {role === "Passenger" ? "🚖 Passenger Benefits" :
                  role === "Driver" ? "👨‍💼 Driver Benefits" :
                    "🏢 Transporter Benefits"}
              </Text>
              <Text style={styles.benefitsText}>
                {role === "Passenger" ? "• Safe & comfortable rides\n• Affordable pricing\n• 24/7 availability\n• Multiple payment options" :
                  role === "Driver" ? "• Flexible working hours\n• Competitive earnings\n• Rider matching\n• Easy payments" :
                    "• Fleet management\n• Driver coordination\n• Business analytics\n• Growth opportunities"}
              </Text>
            </View>
          )}

          {/* Error Message */}
          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            role ? styles.buttonActive : styles.buttonDisabled
          ]}
          onPress={handleNext}
          disabled={!role}
        >
          <Text style={styles.buttonText}>
            {role ? `Continue as ${role}` : 'Select Role to Continue'}
          </Text>
        </TouchableOpacity>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          You can change your role anytime in settings
        </Text>
      </View>
    </ScrollView>
  );
}