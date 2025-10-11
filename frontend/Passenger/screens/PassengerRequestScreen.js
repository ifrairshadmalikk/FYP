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

export default function PassengerRequestScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [transporterModalVisible, setTransporterModalVisible] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [transporters, setTransporters] = useState([]);

  // ✅ Fetch transporters list (mock data for demonstration)
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

  // ✅ Show transporter selection after basic info is filled
  const handleRegisterInitial = () => {
    if (!fullName || !email || !phone) {
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

  // ✅ Final registration with selected transporter
  const handleFinalRegistration = () => {
    if (!selectedTransporter) {
      Alert.alert("Error", "Please select a transporter");
      return;
    }

    // ✅ Send request to selected transporter
    Alert.alert(
      "Registration Request Sent",
      `Your account request has been sent to ${selectedTransporter.name} for approval. You'll receive an email/SMS with an invite link once approved.`,
      [
        {
          text: "OK",
          onPress: () => {
            setTransporterModalVisible(false);
            // Reset form
            setFullName("");
            setEmail("");
            setPhone("");
            setSelectedTransporter(null);
          }
        }
      ]
    );
  };

  // ✅ Navigate to Login Screen - FIXED
  const handleNavigateToLogin = () => {
    console.log("Navigating to login...");
    navigation.navigate("PassengerLogin");
  };

  // ✅ Handle Invite Link - FIXED (Add this function)
  const handleInviteLink = () => {
    setInviteModalVisible(true);
  };

  // ✅ Verify Invite Link - FIXED (Add this function)
  const verifyInviteLink = () => {
    if (inviteLink.startsWith("https://raahi.com/invite/passenger/")) {
      Alert.alert("Success", "Your invite link is valid!");
      setInviteModalVisible(false);
      setInviteLink("");
      // Navigate to main app
      navigation.navigate("PassengerAppNavigation");
    } else {
      Alert.alert("Invalid Link", "Please enter a valid invite link received from your transporter.");
    }
  };

  // ✅ Render transporter item
  const renderTransporterItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.transporterItem,
        selectedTransporter?.id === item.id && styles.selectedTransporterItem
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
        <Text style={{ color: "#555", fontSize: 14 }}>
          Passenger Portal
        </Text>
      </View>

      {/* ✅ Card Container */}
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
          Welcome to Raahi Van Services
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          Send request to transporter to get started
        </Text>

        {/* ✅ Register Button - Main Action */}
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => setRegisterModalVisible(true)}
        >
          <Text style={[styles.registerText, { color: "#afd826" }]}>
            Send Request to Transporter
          </Text>
        </TouchableOpacity>

        {/* ✅ Divider */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 15,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "#090909ff" }} />
          <Text style={{ marginHorizontal: 10, color: "#000000ff" }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#000000ff" }} />
        </View>

        {/* ✅ Login Button for Existing Users */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleNavigateToLogin}
        >
          <Text style={[styles.loginText, { color: "#fff" }]}>
            Already Have an Account?
          </Text>
          <Text style={[styles.loginSubText, { color: "#fff" }]}>
            Click here to login
          </Text>
        </TouchableOpacity>

        {/* ✅ Add Invite Link Option */}
        <TouchableOpacity
          style={styles.inviteBtn}
          onPress={handleInviteLink}
        >
          <Text style={[styles.inviteText, { color: "#666" }]}>
            Have an Invite Link?
          </Text>
          <Text style={[styles.inviteSubText, { color: "#afd826" }]}>
            Click here to access dashboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Footer */}
      <Text
        style={{
          marginTop: 20,
          color: "#888",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        Secure and reliable Raahi service
      </Text>

      {/* ✅ How it works section */}
      <View style={styles.howItWorks}>
        <Text style={styles.howItWorksTitle}>How it works:</Text>
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Send request to transporter</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Transporter approves your request</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Receive invite link via email/SMS</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>Use invite link to access dashboard</Text>
          </View>
        </View>
      </View>

      {/* ✅ Registration Modal - Basic Info */}
      <Modal visible={registerModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Send Request to Transporter</Text>
            <Text style={styles.modalDesc}>
              Fill your details to send registration request
            </Text>

            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Full Name *"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />

            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Email Address *"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Phone Number *"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 20 }]}
              onPress={handleRegisterInitial}
            >
              <Text style={styles.primaryBtnText}>Next - Choose Transporter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtn, { marginTop: 10 }]}
              onPress={() => setRegisterModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Transporter Selection Modal */}
      <Modal visible={transporterModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { height: '80%' }]}>
            <Text style={styles.modalTitle}>Select Transporter</Text>
            <Text style={styles.modalDesc}>
              Choose a transporter to send your registration request
            </Text>

            {selectedTransporter && (
              <View style={styles.selectedTransporterBox}>
                <Text style={styles.selectedText}>Selected: {selectedTransporter.name}</Text>
              </View>
            )}

            <FlatList
              data={transporters}
              renderItem={renderTransporterItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.transporterList}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 20 }]}
              onPress={handleFinalRegistration}
            >
              <Text style={styles.primaryBtnText}>Send Request to Transporter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtn, { marginTop: 10 }]}
              onPress={() => setTransporterModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Invite Link Modal */}
      <Modal visible={inviteModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter Invite Link</Text>
            <Text style={styles.modalDesc}>
              Paste the invite link received from your transporter
            </Text>

            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="https://raahi.com/invite/passenger/..."
              value={inviteLink}
              onChangeText={setInviteLink}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 20 }]}
              onPress={verifyInviteLink}
            >
              <Text style={styles.primaryBtnText}>Access Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtn, { marginTop: 10 }]}
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