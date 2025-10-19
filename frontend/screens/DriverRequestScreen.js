import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ScrollView,
  FlatList,
} from "react-native";

export default function DriverRequestScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [transporterModalVisible, setTransporterModalVisible] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [transporters, setTransporters] = useState([]);

  // ✅ Mock Transporters
  useEffect(() => {
    const mockTransporters = [
      { id: 1, name: "City Transport Services", email: "city@transport.com", phone: "+1234567890" },
      { id: 2, name: "Metro Van Pool", email: "metro@vanpool.com", phone: "+1234567891" },
      { id: 3, name: "Express Commuters", email: "express@commute.com", phone: "+1234567892" },
      { id: 4, name: "Safe Ride Transport", email: "saferide@transport.com", phone: "+1234567893" },
      { id: 5, name: "Urban Mobility Solutions", email: "urban@mobility.com", phone: "+1234567894" },
    ];
    setTransporters(mockTransporters);
  }, []);

  // ✅ Validate and show transporter selection
  const handleRegisterInitial = () => {
    if (!fullName || !email || !phone || !license || !vehicleNo) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }
    setRegisterModalVisible(false);
    setTransporterModalVisible(true);
  };

  // ✅ Final Registration
  const handleFinalRegistration = () => {
    if (!selectedTransporter) {
      Alert.alert("Error", "Please select a transporter");
      return;
    }
    Alert.alert(
      "Registration Request Sent",
      `Your driver request has been sent to ${selectedTransporter.name} for approval. You'll be notified via email/SMS once approved.`,
      [
        {
          text: "OK",
          onPress: () => {
            setTransporterModalVisible(false);
            setFullName("");
            setEmail("");
            setPhone("");
            setLicense("");
            setVehicleNo("");
            setSelectedTransporter(null);
          },
        },
      ]
    );
  };

  const handleNavigateToLogin = () => {
    navigation.navigate("DriverLogin");
  };

  const handleInviteLink = () => {
    setInviteModalVisible(true);
  };

  const verifyInviteLink = () => {
    if (inviteLink.startsWith("https://raahi.com/invite/driver/")) {
      Alert.alert("Success", "Your invite link is valid!");
      setInviteModalVisible(false);
      setInviteLink("");
      navigation.navigate("DriverAppNavigation");
    } else {
      Alert.alert("Invalid Link", "Please enter a valid invite link received from your transporter.");
    }
  };

  const renderTransporterItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.transporterItem,
        selectedTransporter?.id === item.id && styles.selectedTransporterItem,
      ]}
      onPress={() => setSelectedTransporter(item)}
    >
      <Text style={styles.transporterName}>{item.name}</Text>
      <Text style={styles.transporterContact}>Email: {item.email}</Text>
      <Text style={styles.transporterContact}>Phone: {item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F9FAFB",
      }}
    >
      {/* ✅ Logo */}
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <View
          style={{
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
          }}
        >
          <Image
            source={{
              uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
            }}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </View>

        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#afd826",
            marginTop: 15,
          }}
        >
          RAAHI
        </Text>
        <Text style={{ color: "#555", fontSize: 14 }}>Driver Portal</Text>
      </View>

      {/* ✅ Main Card */}
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 5,
          }}
        >
          Join Raahi as a Driver
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          Send request to your transporter to get started
        </Text>

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => setRegisterModalVisible(true)}
        >
          <Text style={[styles.registerText, { color: "#afd826" }]}>
            Send Request to Transporter
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 15,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "#000" }} />
          <Text style={{ marginHorizontal: 10, color: "#000" }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#000" }} />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleNavigateToLogin}>
          <Text style={[styles.loginText, { color: "#fff" }]}>
            Already Have an Account?
          </Text>
          <Text style={[styles.loginSubText, { color: "#fff" }]}>
            Click here to login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inviteBtn} onPress={handleInviteLink}>
          <Text style={[styles.inviteText, { color: "#666" }]}>
            Have an Invite Link?
          </Text>
          <Text style={[styles.inviteSubText, { color: "#afd826" }]}>
            Click here to access dashboard
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          marginTop: 20,
          color: "#888",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        Safe. Reliable. Professional Raahi Service.
      </Text>

      {/* ✅ Registration Modal */}
      <Modal visible={registerModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Driver Registration</Text>
            <Text style={styles.modalDesc}>Fill your details to join Raahi</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address *"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="License Number *"
              value={license}
              onChangeText={setLicense}
            />
            <TextInput
              style={styles.input}
              placeholder="Vehicle Number *"
              value={vehicleNo}
              onChangeText={setVehicleNo}
            />

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleRegisterInitial}
            >
              <Text style={styles.primaryBtnText}>Next - Choose Transporter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setRegisterModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Transporter Modal */}
      <Modal visible={transporterModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { height: "80%" }]}>
            <Text style={styles.modalTitle}>Select Transporter</Text>
            <Text style={styles.modalDesc}>Choose your transporter</Text>

            <FlatList
              data={transporters}
              renderItem={renderTransporterItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.transporterList}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleFinalRegistration}
            >
              <Text style={styles.primaryBtnText}>Send Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setTransporterModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Invite Modal */}
      <Modal visible={inviteModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter Invite Link</Text>
            <Text style={styles.modalDesc}>
              Paste the invite link received from your transporter
            </Text>

            <TextInput
              style={styles.input}
              placeholder="https://raahi.com/invite/driver/..."
              value={inviteLink}
              onChangeText={setInviteLink}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={verifyInviteLink}
            >
              <Text style={styles.primaryBtnText}>Access Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setInviteModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = {
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#F5F5F5",
  },
  primaryBtn: {
    backgroundColor: "#afd826",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  registerBtn: {
    borderWidth: 2,
    borderColor: "#afd826",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  loginBtn: {
    backgroundColor: "#afd826",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  inviteBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loginSubText: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 4,
  },
  inviteText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  inviteSubText: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 4,
  },
  registerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelBtn: {
    backgroundColor: "#d9534f",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  modalDesc: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  transporterList: {
    maxHeight: 300,
    marginTop: 10,
  },
  transporterItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#F9F9F9",
  },
  selectedTransporterItem: {
    borderColor: "#afd826",
    backgroundColor: "#f8ffde",
    borderWidth: 2,
  },
  transporterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  transporterContact: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  selectedTransporterBox: {
    backgroundColor: "#afd826",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  howItWorks: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "100%",
  },
  howItWorksTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  stepContainer: {
    marginTop: 10,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#afd826",
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "600",
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
};