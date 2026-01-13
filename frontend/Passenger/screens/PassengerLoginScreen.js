// PassengerLoginScreen.js 
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PassengerLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    checkExistingLogin();
  }, []);

  // PassengerLoginScreen.js 
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://192.168.10.8:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password: password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save token to async storage
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.passenger));
        
        Alert.alert("Success", "Login successful!");
        navigation.navigate("PassengerAppNavigation");
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // checkExistingLogin 
  const checkExistingLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await fetch('http://192.168.10.3:5001/api/auth/check', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        if (data.success) {
          navigation.navigate("PassengerAppNavigation");
        } else {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
        }
      }
    } catch (error) {
      console.error('Error checking existing login:', error);
    } finally {
      setCheckingLogin(false);
    }
  };

  // ✅ Handle Forgot Password
  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password recovery feature will be implemented soon. Please contact support if you need immediate assistance.",
      [{ text: "OK" }]
    );
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
    logoContainer: {
      alignItems: "center", 
      marginBottom: 10
    },
    logo: {
      width: 100,
      height: 100,
      backgroundColor: "#fff",
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "#afd826",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    logoImage: {
      width: 60, 
      height: 60
    },
    appName: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#afd826",
      marginTop: 15,
    },
    appSubtitle: {
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
    registerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
      marginBottom: 40
    },
    registerText: {
      color: "#6b7280",
      fontSize: 15,
      fontWeight: "500"
    },
    registerLink: {
      color: "#afd826",
      fontWeight: "700",
      fontSize: 15,
      marginLeft: 4
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa'
    }
  };

  if (checkingLogin) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#afd826" />
        <Text style={{ marginTop: 16, color: '#6b7280' }}>Checking login status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Image
              source={{
                uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
              }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appSubtitle}>Welcome Back</Text>
        </View>
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
            editable={!loading}
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
            editable={!loading}
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login →</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate("PassengerRegistrationScreen")}
            disabled={loading}
          >
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}