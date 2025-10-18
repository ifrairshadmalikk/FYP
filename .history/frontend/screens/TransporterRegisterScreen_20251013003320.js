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
  ActivityIndicator,
  Dimensions,
  StyleSheet
} from "react-native";

const { width } = Dimensions.get("window");

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 280,
    height: 120,
    marginBottom: 20,
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 16,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#111827",
    borderWidth: 1.5,
    color: "#111827",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    width: "100%",
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    marginBottom: 16,
  },
  error: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
    marginBottom: 16,
  },
  success: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  submitBtn: {
    backgroundColor: "#afd826",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnDisabled: {
    backgroundColor: "#e5f0b5",
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 17,
  },
  loginLink: {
    marginTop: 24,
    alignItems: "center",
  },
  loginText: {
    color: "#6b7280",
    fontSize: 15,
    textAlign: "center",
  },
  loginLinkText: {
    color: "#111827",
    fontWeight: "700",
  },
});