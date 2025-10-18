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
  ActivityIndicator
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
    setErrorMsg("");
    setSuccessMsg("");

    if (!country.trim() || !city.trim() || !zone.trim() || !email.trim() || !password || !confirmPassword) {
      return setErrorMsg("All fields are required.");
    }

    const textRegex = /^[A-Za-z0-9, ]{1,100}$/;
    if (!textRegex.test(country) || !textRegex.test(city) || !textRegex.test(zone)) {
      return setErrorMsg(
        "Country, city, and zone must be 1-100 characters long and may only contain letters, digits, commas and spaces."
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setErrorMsg("Invalid email format. Please enter a valid email address.");

    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(password)) {
      return setErrorMsg(
        "Password must be 8-16 chars and contain an uppercase letter, a digit, and a special character."
      );
    }
    if (password !== confirmPassword) return setErrorMsg("Passwords do not match.");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Registered successfully!");
      Alert.alert("Success", "Registered successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("TransporterLogin");
          },
        },
      ]);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image
            source={{
              uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
            }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Transporter Registration</Text>
          <Text style={styles.subtitle}>Create your transporter account</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formCard}>
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

        {/* Messages */}
        {errorMsg ? (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{errorMsg}</Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={styles.successContainer}>
            <Text style={styles.success}>{successMsg}</Text>
          </View>
        ) : null}

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={validate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("TransporterLogin")}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLinkText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}