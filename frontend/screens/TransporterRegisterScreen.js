// screens/TransporterRegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import styles from "../styles/DashboardStyles";

export default function TransporterRegisterScreen({ navigation }) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zone, setZone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    // clear old messages
    setErrorMsg("");
    setSuccessMsg("");

    // required
    if (!country.trim() || !city.trim() || !zone.trim() || !email.trim() || !password || !confirmPassword) {
      return setErrorMsg("All fields are required.");
    }

    // country/city/zone validation: letters, digits, commas, spaces, 1-100 chars
    const textRegex = /^[A-Za-z0-9, ]{1,100}$/;
    if (!textRegex.test(country) || !textRegex.test(city) || !textRegex.test(zone)) {
      return setErrorMsg(
        "Country, city, and zone must be 1-100 characters long and may only contain letters, digits, commas and spaces."
      );
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setErrorMsg("Invalid email format. Please enter a valid email address.");

    // password validation (8-16, uppercase, digit, special char)
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(password)) {
      return setErrorMsg(
        "Password must be 8-16 chars and contain an uppercase letter, a digit, and a special character."
      );
    }
    if (password !== confirmPassword) return setErrorMsg("Passwords do not match.");

    // simulate registration call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Registered successfully!");
      // show alert and navigate to login
      Alert.alert("Success", "Registered successfully!", [
        {
          text: "OK",
          onPress: () => {
            // navigate to TransporterLogin (make sure this screen is registered in your navigator)
            navigation.navigate("TransporterLogin");
          },
        },
      ]);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Image
          source={{
            uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
          }}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Transporter Registration</Text>

        <View style={styles.sectionBox}>
          <TextInput
            style={styles.input}
            placeholder="Country"
            placeholderTextColor="#999"
            value={country}
            onChangeText={setCountry}
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="Local Zone"
            placeholderTextColor="#999"
            value={zone}
            onChangeText={setZone}
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            returnKeyType="done"
          />
        </View>

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
        {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

        <TouchableOpacity
          style={[styles.submitBtn, loading ? { opacity: 0.7 } : null]}
          onPress={validate}
          disabled={loading}
        >
          <Text style={styles.submitText}>{loading ? "Registering..." : "Register"}</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          onPress={() => {
          
            navigation.navigate("TransporterLogin");
          }}
        >
          <Text style={{ marginTop: 18, textAlign: "center", color: "#007bff", fontWeight: "600" }}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
