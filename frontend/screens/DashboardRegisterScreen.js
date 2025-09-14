// frontend/screens/DashboardRegisterScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "../styles/DashboardStyles";

export default function DashboardRegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cnic, setCnic] = useState("");
  const [role, setRole] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validateCommon = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setErrorMsg("Invalid email format. Please enter a valid email address.");
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(password)) return setErrorMsg("Password must be 8-16 characters long, with uppercase, digit, and special character.");
    if (password !== confirmPassword) return setErrorMsg("Passwords do not match.");
    if (!/^[A-Za-z ]+$/.test(name)) return setErrorMsg("Please enter a valid name using letters only.");
    if (name.length > 50) return setErrorMsg("Name must be less than 50 characters.");
    if (!/^\d{11}$/.test(mobile)) return setErrorMsg("Mobile number must be exactly 11 digits.");
    if (!/^\d{13}$/.test(cnic)) return setErrorMsg("Please enter a valid CNIC number (13 digits, no dashes).");
    if (!role) return setErrorMsg("Please select a valid user role.");

    setErrorMsg("");

    if (role === "Passenger") navigation.navigate("Passenger Register");
    if (role === "Driver") navigation.navigate("Driver Register");
    if (role === "Transporter") navigation.navigate("Transporter Register");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <Image
        source={{ uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp" }}
        style={{ width: 500, height: 200, alignSelf: "center", marginBottom: -1, marginTop: 18 }}
        resizeMode="contain"
      />

      <Text style={styles.title}>Common Registration</Text>

      {/* For Now Section */}
      <View style={styles.sectionBox}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={mobile}
          onChangeText={setMobile}
        />
        <TextInput
          style={styles.input}
          placeholder="CNIC (13 digits, no dashes)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={cnic}
          onChangeText={setCnic}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* For Next Section */}
      <View style={styles.sectionBox}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Role Picker */}
      <View style={styles.pickerBox}>
        <Picker selectedValue={role} onValueChange={(value) => setRole(value)}>
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Passenger" value="Passenger" />
          <Picker.Item label="Driver" value="Driver" />
          <Picker.Item label="Transporter" value="Transporter" />
        </Picker>
      </View>

      {/* Error Message */}
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={validateCommon}>
        <Text style={styles.submitText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};