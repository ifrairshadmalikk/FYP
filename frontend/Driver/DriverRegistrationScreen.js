// DriverRegistrationScreen.js - Updated with approval flow
import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { authAPI } from "./apiService";

const DriverRegistrationScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    licenseNumber: "",
    vehicleType: "",
    vehicleNumber: "",
    capacity: "",
    experience: "",
    address: "",
    profileImage: ""
  });

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const pickImage = async (field) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access gallery is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setForm({ ...form, [field]: result.assets[0].uri });
    }
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!form.name || !form.email || !form.password || !form.phone) {
        Alert.alert("Validation Error", "Please fill all required personal details.");
        return false;
      }
      if (form.password.length < 6) {
        Alert.alert("Validation Error", "Password must be at least 6 characters long.");
        return false;
      }
    } else if (currentStep === 2) {
      if (!form.licenseNumber || !form.vehicleType || !form.vehicleNumber) {
        Alert.alert("Validation Error", "Please fill all license and vehicle details.");
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await authAPI.register(form);
      
      if (response.success) {
        Alert.alert(
          "Registration Submitted Successfully!",
          "Your driver registration has been submitted. You will receive an email notification once the transporter approves your account.",
        
        );
      } else {
        Alert.alert("Registration Error", response.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      Alert.alert("Registration Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    header: { 
      paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, 
      backgroundColor: "#afd826", borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
      shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8
    },
    headerTitle: { color: "#fff", fontSize: 28, fontWeight: "800", letterSpacing: 0.5 },
    headerSubtitle: { color: "#f0f9d8", fontSize: 15, marginTop: 8, fontWeight: "500" },
    formContainer: { padding: 24, paddingTop: 32 },
    sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1f2937", marginBottom: 16, marginTop: 24, letterSpacing: 0.3 },
    inputContainer: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 18, paddingVertical: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: "#f3f4f6" },
    label: { fontWeight: "600", color: "#374151", marginBottom: 8, fontSize: 14 },
    required: { color: "#ef4444", marginLeft: 2 },
    input: { fontSize: 16, color: "#111827", paddingVertical: 4 },
    uploadButton: { backgroundColor: "#fff", paddingVertical: 18, borderRadius: 16, alignItems: "center", marginBottom: 12, borderWidth: 2, borderColor: "#afd826", borderStyle: "dashed" },
    uploadButtonText: { color: "#afd826", fontWeight: "700", fontSize: 16 },
    uploadedImage: { width: 80, height: 80, borderRadius: 12, marginBottom: 12 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    backButton: { backgroundColor: "#6b7280", paddingVertical: 18, borderRadius: 16, alignItems: "center", flex: 1, marginRight: 10 },
    backButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    nextButton: { backgroundColor: "#afd826", paddingVertical: 18, borderRadius: 16, alignItems: "center", flex: 1, marginLeft: 10 },
    nextButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
    submitButton: { backgroundColor: "#afd826", paddingVertical: 18, borderRadius: 16, alignItems: "center", marginTop: 20, shadowColor: "#afd826", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
    submitButtonText: { color: "#fff", fontWeight: "800", fontSize: 18 },
    stepIndicator: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
    step: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#d1d5db', marginHorizontal: 5 },
    activeStep: { backgroundColor: '#afd826' },
    approvalNote: { 
      backgroundColor: '#f0f9d8', 
      padding: 16, 
      borderRadius: 12, 
      marginTop: 20,
      borderLeftWidth: 4,
      borderLeftColor: '#afd826'
    },
    approvalNoteText: { 
      color: '#374151', 
      fontSize: 14, 
      textAlign: 'center',
      fontWeight: '500'
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Registration</Text>
        <Text style={styles.headerSubtitle}>Join our driver network today</Text>
      </View>

      <View style={styles.stepIndicator}>
        <View style={[styles.step, step >= 1 && styles.activeStep]} />
        <View style={[styles.step, step >= 2 && styles.activeStep]} />
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="John Doe" 
                value={form.name} 
                onChangeText={(text) => handleChange("name", text)} 
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="john.doe@example.com" 
                value={form.email} 
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="••••••" 
                value={form.password} 
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="+92 300 1234567" 
                value={form.phone} 
                onChangeText={(text) => handleChange("phone", text)}
                keyboardType="phone-pad"
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
              />
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.sectionTitle}>Vehicle & License Information</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>License Number <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="ABC-123456" 
                value={form.licenseNumber} 
                onChangeText={(text) => handleChange("licenseNumber", text)} 
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vehicle Type <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="Car/Van/Bus" 
                value={form.vehicleType} 
                onChangeText={(text) => handleChange("vehicleType", text)} 
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vehicle Number <Text style={styles.required}>*</Text></Text>
              <TextInput 
                style={styles.input} 
                placeholder="ABC-123" 
                value={form.vehicleNumber} 
                onChangeText={(text) => handleChange("vehicleNumber", text)} 
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Capacity</Text>
              <TextInput 
                style={styles.input} 
                placeholder="8" 
                value={form.capacity} 
                onChangeText={(text) => handleChange("capacity", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Experience</Text>
              <TextInput 
                style={styles.input} 
                placeholder="5 years" 
                value={form.experience} 
                onChangeText={(text) => handleChange("experience", text)} 
              />
            </View>

            {/* Approval Process Note */}
            <View style={styles.approvalNote}>
              <Text style={styles.approvalNoteText}>
                📝 Note: Your registration will be reviewed by the transporter. 
                You will receive an email notification once your account is approved.
              </Text>
            </View>
          </>
        )}

        {step === 1 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
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
                <Text style={styles.submitButtonText}>Submit Registration</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DriverRegistrationScreen;