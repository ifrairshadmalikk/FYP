// screens/TransporterLoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import styles from "../styles/DashboardStyles";

export default function TransporterLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = () => {
    if (!email || !password)
      return setErrorMsg(
        "Email is required. Please enter your registered email address."
      );

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return setErrorMsg("Invalid email format. Please enter a valid email address.");

    
    if (email === "transporter@test.com" && password === "Test@1234") {
      setErrorMsg("");
      alert("Login successful.");
      navigation.navigate("TransporterDashboard");
    } else {
      setErrorMsg("Invalid email or password. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password recovery link will be sent to your registered email."
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <Image
        source={{
          uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
        }}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Transporter Login</Text>

      <Text
        style={{
          textAlign: "center",
          color: "#555",
          marginBottom: 25,
          fontSize: 15,
        }}
      >
        Login using your registered{" "}
        <Text style={{ fontWeight: "bold" }}>Transporter account</Text>.
      </Text>

      <View style={styles.sectionBox}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <TouchableOpacity style={styles.submitBtn} onPress={handleLogin}>
        <Text style={styles.submitText}>Login</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={{ textAlign: "center", color: "#007bff", marginTop: 15 }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Register Link */}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ color: "#555" }}>
          Don’t have an account?{" "}
          <Text
            style={{ color: "#007bff", fontWeight: "bold" }}
            onPress={() => navigation.navigate("TransporterRegister")}
          >
            Register Here
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
