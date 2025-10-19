import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image 
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const DriverRegistrationScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // Step 1: Personal, 2: License, 3: Vehicle
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    cnicNumber: "",
    licenseNumber: "",
    licenseFile: "",
    cnicFile: "",
    profilePic: "",
    vehicleModel: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleYear: "",
    vehicleOwnershipProof: ""
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

  const handleNext = () => {
    // Step validations
    if (step === 1) {
      if (!form.fullName || !form.email || !form.phone) {
        Alert.alert("Validation Error", "Please fill all required personal details.");
        return;
      }
    } else if (step === 2) {
      if (!form.licenseNumber || !form.licenseFile || !form.cnicFile) {
        Alert.alert("Validation Error", "Please fill license number and upload files.");
        return;
      }
    } else if (step === 3) {
      if (!form.vehicleModel || !form.vehicleNumber || !form.vehicleType || !form.vehicleYear || !form.vehicleOwnershipProof) {
        Alert.alert("Validation Error", "Please fill all vehicle details and upload ownership proof.");
        return;
      }
    }
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    Alert.alert(
      "Registration Submitted",
      "Your request is pending approval. You will be notified once approved."
    );
    navigation.navigate("DriverLogin");
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
    submitButton: { backgroundColor: "#afd826", paddingVertical: 18, borderRadius: 16, alignItems: "center", marginTop: 20, shadowColor: "#afd826", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
    submitButtonText: { color: "#fff", fontWeight: "800", fontSize: 18 }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Registration</Text>
        <Text style={styles.headerSubtitle}>Join our driver network today</Text>
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
              <TextInput style={styles.input} placeholder="John Doe" value={form.fullName} onChangeText={(text) => handleChange("fullName", text)} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
              <TextInput style={styles.input} placeholder="john.doe@example.com" value={form.email} onChangeText={(text) => handleChange("email", text)} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
              <TextInput style={styles.input} placeholder="+92 300 1234567" value={form.phone} onChangeText={(text) => handleChange("phone", text)} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Profile Picture</Text>
              {form.profilePic && <Image source={{ uri: form.profilePic }} style={styles.uploadedImage} />}
              <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage("profilePic")}>
                <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.sectionTitle}>License & CNIC Upload</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Driving License Number <Text style={styles.required}>*</Text></Text>
              <TextInput style={styles.input} placeholder="ABC-123456" value={form.licenseNumber} onChangeText={(text) => handleChange("licenseNumber", text)} />
            </View>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage("licenseFile")}>
              <Text style={styles.uploadButtonText}>{form.licenseFile ? "✓ License Uploaded" : "📄 Upload License"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage("cnicFile")}>
              <Text style={styles.uploadButtonText}>{form.cnicFile ? "✓ CNIC Uploaded" : "📄 Upload CNIC"}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vehicle Model <Text style={styles.required}>*</Text></Text>
              <TextInput style={styles.input} placeholder="Honda Civic 2020" value={form.vehicleModel} onChangeText={(text) => handleChange("vehicleModel", text)} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vehicle Registration Number <Text style={styles.required}>*</Text></Text>
              <TextInput style={styles.input} placeholder="ABC-123" value={form.vehicleNumber} onChangeText={(text) => handleChange("vehicleNumber", text)} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vehicle Type <Text style={styles.required}>*</Text></Text>
              <TextInput style={styles.input} placeholder="Car/Van/Bus" value={form.vehicleType} onChangeText={(text) => handleChange("vehicleType", text)} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vehicle Year <Text style={styles.required}>*</Text></Text>
              <TextInput style={styles.input} placeholder="2020" value={form.vehicleYear} onChangeText={(text) => handleChange("vehicleYear", text)} />
            </View>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage("vehicleOwnershipProof")}>
              <Text style={styles.uploadButtonText}>{form.vehicleOwnershipProof ? "✓ Ownership Proof Uploaded" : "📄 Upload Ownership Proof"}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
          <Text style={styles.submitButtonText}>{step < 3 ? "Next →" : "Submit Registration"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DriverRegistrationScreen;
