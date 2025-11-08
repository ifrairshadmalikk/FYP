// PassengerRegistrationScreen.js
import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator 
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const PassengerRegistrationScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    emergencyContact: "",
    dateOfBirth: ""
  });

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) {
        Alert.alert("Validation Error", "Please fill all required personal details.");
        return false;
      }
      if (!form.email.includes('@')) {
        Alert.alert("Validation Error", "Please enter a valid email address.");
        return false;
      }
      if (form.password.length < 6) {
        Alert.alert("Validation Error", "Password must be at least 6 characters long.");
        return false;
      }
      if (form.password !== form.confirmPassword) {
        Alert.alert("Validation Error", "Passwords do not match.");
        return false;
      }
    } else if (currentStep === 2) {
      if (!form.phone) {
        Alert.alert("Validation Error", "Please fill phone number.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
// handleSubmit فنکشن اپڈیٹ کریں:
const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await fetch('http://192.168.0.109:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email.toLowerCase(),
        password: form.password,
        fullName: form.name,
        phone: form.phone,
        address: form.address,
        emergencyContact: form.emergencyContact,
        dateOfBirth: form.dateOfBirth
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Save token to async storage
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.passenger));
      
      Alert.alert(
        "Registration Successful",
        "Your passenger account has been created successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("PassengerAppNavigation")
          }
        ]
      );
    } else {
      Alert.alert("Registration Error", data.message || "Registration failed");
    }
  } catch (error) {
    console.error('Registration error:', error);
    Alert.alert("Registration Error", "Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};

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
      paddingTop: 60, 
      paddingBottom: 40, 
      paddingHorizontal: 24, 
      backgroundColor: "#afd826", 
      borderBottomLeftRadius: 30, 
      borderBottomRightRadius: 30,
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.15, 
      shadowRadius: 12, 
      elevation: 8,
      marginBottom: 20
    },
    headerTitle: { 
      color: "#fff", 
      fontSize: 28, 
      fontWeight: "800", 
      letterSpacing: 0.5,
      textAlign: "center"
    },
    headerSubtitle: { 
      color: "#f0f9d8", 
      fontSize: 15, 
      marginTop: 8, 
      fontWeight: "500",
      textAlign: "center"
    },
    formContainer: { 
      padding: 24, 
      paddingTop: 20 
    },
    sectionTitle: { 
      fontSize: 20, 
      fontWeight: "700", 
      color: "#1f2937", 
      marginBottom: 20, 
      marginTop: 10, 
      letterSpacing: 0.3 
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
    label: { 
      fontWeight: "600", 
      color: "#374151", 
      marginBottom: 8, 
      fontSize: 14 
    },
    required: { 
      color: "#ef4444", 
      marginLeft: 2 
    },
    input: { 
      fontSize: 16, 
      color: "#111827", 
      paddingVertical: 4 
    },
    buttonContainer: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      marginTop: 25,
      marginBottom: 20
    },
    backButton: { 
      backgroundColor: "#6b7280", 
      paddingVertical: 18, 
      borderRadius: 16, 
      alignItems: "center", 
      flex: 1, 
      marginRight: 10 
    },
    backButtonText: { 
      color: "#fff", 
      fontWeight: "700", 
      fontSize: 16 
    },
    nextButton: { 
      backgroundColor: "#afd826", 
      paddingVertical: 18, 
      borderRadius: 16, 
      alignItems: "center", 
      flex: 1, 
      marginLeft: 10 
    },
    nextButtonText: { 
      color: "#fff", 
      fontWeight: "800", 
      fontSize: 16 
    },
    submitButton: { 
      backgroundColor: "#afd826", 
      paddingVertical: 18, 
      borderRadius: 16, 
      alignItems: "center", 
      marginTop: 20, 
      marginBottom: 20,
      shadowColor: "#afd826", 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 12, 
      elevation: 6 
    },
    submitButtonText: { 
      color: "#fff", 
      fontWeight: "800", 
      fontSize: 18 
    },
    stepIndicator: { 
      flexDirection: 'row', 
      justifyContent: 'center', 
      marginBottom: 10,
      marginTop: 10
    },
    step: { 
      width: 12, 
      height: 12, 
      borderRadius: 6, 
      backgroundColor: '#d1d5db', 
      marginHorizontal: 5 
    },
    activeStep: { 
      backgroundColor: '#afd826' 
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      marginBottom: 30
    },
    loginText: {
      color: "#6b7280",
      fontSize: 15,
      fontWeight: "500"
    },
    loginLink: {
      color: "#afd826",
      fontWeight: "700",
      fontSize: 15,
      marginLeft: 4
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 20,
      marginTop: -5
    },
    forgotPasswordText: {
      color: "#afd826",
      fontWeight: "600",
      fontSize: 14
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Passenger Registration</Text>
        <Text style={styles.headerSubtitle}>Create your account to start your journey</Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={[styles.step, step >= 1 && styles.activeStep]} />
        <View style={[styles.step, step >= 2 && styles.activeStep]} />
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your full name" 
                value={form.name} 
                onChangeText={(text) => handleChange("name", text)} 
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="your.email@example.com" 
                value={form.email} 
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="Create a password (min. 6 characters)" 
                value={form.password} 
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="Confirm your password" 
                value={form.confirmPassword} 
                onChangeText={(text) => handleChange("confirmPassword", text)}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={handleNext}
              disabled={loading}
            >
              <Text style={styles.nextButtonText}>Next →</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="+92 300 1234567" 
                value={form.phone} 
                onChangeText={(text) => handleChange("phone", text)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput 
                style={styles.input} 
                placeholder="DD/MM/YYYY" 
                value={form.dateOfBirth} 
                onChangeText={(text) => handleChange("dateOfBirth", text)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Your complete address" 
                value={form.address} 
                onChangeText={(text) => handleChange("address", text)}
                multiline
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Emergency Contact</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Emergency contact number" 
                value={form.emergencyContact} 
                onChangeText={(text) => handleChange("emergencyContact", text)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={handleBack}
                disabled={loading}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.submitButton, loading && { opacity: 0.7 }]} 
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate("PassengerLoginScreen")}
            disabled={loading}
          >
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PassengerRegistrationScreen;