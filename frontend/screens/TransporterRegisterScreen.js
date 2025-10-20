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
  Modal,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function TransporterRegisterScreen({ navigation }) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zone, setZone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const pickImage = async (source) => {
    setImageModalVisible(false);
    
    let result;
    if (source === 'camera') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        Alert.alert("Permission Required", "Camera access is needed to take photos.");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    } else {
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!galleryPermission.granted) {
        Alert.alert("Permission Required", "Gallery access is needed to select photos.");
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    }

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImageModalVisible(false);
  };

  const validate = () => {
    setErrorMsg("");

    if (!fullName.trim() || !companyName.trim() || !phone.trim() || !country.trim() || !city.trim() || !zone.trim() || !email.trim() || !password || !confirmPassword) {
      return setErrorMsg("All fields are required.");
    }

    const nameRegex = /^[A-Za-z ]{2,50}$/;
    if (!nameRegex.test(fullName)) {
      return setErrorMsg("Full name must be 2-50 characters long and contain only letters and spaces.");
    }

    const phoneRegex = /^[0-9+]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return setErrorMsg("Please enter a valid phone number (10-15 digits).");
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
        "Password must be 8-16 characters and contain an uppercase letter, a digit, and a special character."
      );
    }
    if (password !== confirmPassword) return setErrorMsg("Passwords do not match.");

    if (!profileImage) {
      return setErrorMsg("Please upload a profile image.");
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Registered successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("TransporterLogin");
          },
        },
      ]);
    }, 1500);
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
      marginBottom: 30,
      alignItems: "center"
    },
    logo: {
      width: 70,
      height: 70,
      marginBottom: 16,
      borderRadius: 35,
      backgroundColor: "#fff",
      padding: 8
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
      fontSize: 14,
      marginTop: 8,
      fontWeight: "500",
      textAlign: "center"
    },
    formContainer: { 
      paddingHorizontal: 24,
      paddingBottom: 40
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
    profileImageContainer: {
      alignItems: "center",
      marginBottom: 24
    },
    profileImageWrapper: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "#e5e7eb",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
      borderWidth: 3,
      borderColor: "#afd826",
      overflow: "hidden"
    },
    profileImage: {
      width: "100%",
      height: "100%",
      borderRadius: 60,
    },
    uploadButton: {
      backgroundColor: "#afd826",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 8
    },
    uploadButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 14
    },
    errorContainer: {
      backgroundColor: "#fee2e2",
      padding: 12,
      borderRadius: 12,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: "#dc2626"
    },
    errorText: {
      color: "#dc2626",
      fontSize: 14,
      fontWeight: "500"
    },
    registerButton: { 
      backgroundColor: "#afd826", 
      paddingVertical: 18, 
      borderRadius: 16, 
      alignItems: "center", 
      marginBottom: 24,
      shadowColor: "#afd826",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
      flexDirection: "row",
      justifyContent: "center",
      gap: 8
    },
    registerButtonText: { 
      color: "#fff", 
      fontWeight: "800", 
      fontSize: 18,
      letterSpacing: 0.5
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
      marginBottom: 40
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 40
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111827",
      textAlign: "center",
      marginBottom: 20
    },
    modalOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f3f4f6"
    },
    modalOptionText: {
      fontSize: 16,
      color: "#374151",
      fontWeight: "500",
      marginLeft: 12
    },
    cancelButton: {
      backgroundColor: "#f3f4f6",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 16
    },
    cancelButtonText: {
      color: "#374151",
      fontWeight: "600",
      fontSize: 16
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Transporter Registration</Text>
        <Text style={styles.headerSubtitle}>Create your transporter account</Text>
      </View>

      <ScrollView 
        style={styles.formContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Image Upload */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity 
            style={styles.profileImageWrapper}
            onPress={() => setImageModalVisible(true)}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Ionicons name="camera" size={40} color="#9ca3af" />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => setImageModalVisible(true)}
          >
            <Ionicons name={profileImage ? "sync" : "cloud-upload"} size={16} color="#fff" />
            <Text style={styles.uploadButtonText}>
              {profileImage ? "Change Photo" : "Upload Photo"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor="#9ca3af"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />
        </View>

        {/* Company Name */}
        <Text style={styles.label}>Company Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your company name"
            placeholderTextColor="#9ca3af"
            value={companyName}
            onChangeText={setCompanyName}
            style={styles.input}
          />
        </View>

        {/* Phone */}
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your phone number"
            placeholderTextColor="#9ca3af"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        {/* Country */}
        <Text style={styles.label}>Country</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your country"
            placeholderTextColor="#9ca3af"
            value={country}
            onChangeText={setCountry}
            style={styles.input}
          />
        </View>

        {/* City */}
        <Text style={styles.label}>City</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your city"
            placeholderTextColor="#9ca3af"
            value={city}
            onChangeText={setCity}
            style={styles.input}
          />
        </View>

        {/* Zone */}
        <Text style={styles.label}>Local Zone</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your local zone"
            placeholderTextColor="#9ca3af"
            value={zone}
            onChangeText={setZone}
            style={styles.input}
          />
        </View>

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your email address"
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
            placeholder="Create a password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Confirm your password"
            placeholderTextColor="#9ca3af"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Error Message */}
        {errorMsg ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Register Button */}
        <TouchableOpacity
          onPress={validate}
          style={styles.registerButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="person-add" size={20} color="#fff" />
          )}
          <Text style={styles.registerButtonText}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("TransporterLogin")}>
            <Text style={styles.loginLink}>Login Here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={imageModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Profile Photo</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => pickImage('camera')}
            >
              <Ionicons name="camera" size={24} color="#374151" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => pickImage('gallery')}
            >
              <Ionicons name="image" size={24} color="#374151" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            {profileImage && (
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={removeImage}
              >
                <Ionicons name="trash" size={24} color="#dc2626" />
                <Text style={[styles.modalOptionText, { color: "#dc2626" }]}>Remove Photo</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setImageModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}