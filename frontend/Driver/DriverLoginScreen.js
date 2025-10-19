import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from "react-native";

const DriverLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    Alert.alert("Success", "Logged in successfully!");
    navigation.navigate("Driver");
  };

  const styles = {
    container: { 
      flex: 1, 
      backgroundColor: "#f8f9fa" 
    },
    header: { 
      paddingTop: 80,
      paddingBottom: 60,
      paddingHorizontal: 24,
      backgroundColor: "#afd826",
      borderBottomLeftRadius: 30, 
      borderBottomRightRadius: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 40
    },
    headerTitle: { 
      color: "#fff", 
      fontSize: 32, 
      fontWeight: "800",
      letterSpacing: 0.5,
      textAlign: "center"
    },
    headerSubtitle: {
      color: "#f0f9d8",
      fontSize: 16,
      marginTop: 8,
      fontWeight: "500",
      textAlign: "center"
    },
    formContainer: { 
      paddingHorizontal: 24
    },
    label: { 
      fontWeight: "600", 
      color: "#374151", 
      marginBottom: 8,
      fontSize: 14,
      letterSpacing: 0.2
    },
    inputContainer: { 
      backgroundColor: "#fff", 
      borderRadius: 16, 
      paddingHorizontal: 18, 
      paddingVertical: 16, 
      marginBottom: 16, 
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06, 
      shadowRadius: 8, 
      elevation: 3,
      borderWidth: 1,
      borderColor: "#f3f4f6"
    },
    input: { 
      fontSize: 16, 
      color: "#111827"
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 24,
      marginTop: -8
    },
    forgotPasswordText: {
      color: "#afd826",
      fontWeight: "600",
      fontSize: 14
    },
    loginButton: { 
      backgroundColor: "#afd826", 
      paddingVertical: 18, 
      borderRadius: 16, 
      alignItems: "center", 
      marginBottom: 24,
      shadowColor: "#afd826",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6
    },
    loginButtonText: { 
      color: "#fff", 
      fontWeight: "800", 
      fontSize: 18,
      letterSpacing: 0.5
    },
    signupContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
      marginBottom: 40
    },
    signupText: {
      color: "#6b7280",
      fontSize: 15,
      fontWeight: "500"
    },
    signupLink: {
      color: "#afd826",
      fontWeight: "700",
      fontSize: 15,
      marginLeft: 4
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 32
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: "#e5e7eb"
    },
    dividerText: {
      marginHorizontal: 16,
      color: "#9ca3af",
      fontSize: 14,
      fontWeight: "500"
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome Back</Text>
        <Text style={styles.headerSubtitle}>Login to your driver account</Text>
      </View>

      <ScrollView 
        style={styles.formContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => Alert.alert("Forgot Password", "Password recovery flow.")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login →</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Sign Up */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("DriverRegistration")}>
            <Text style={styles.signupLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default DriverLoginScreen;