// PassengerLoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
} from "react-native";

export default function PassengerLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle Login
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
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // For demo - always success
      navigation.navigate("PassengerAppNavigation");
    }, 1500);
  };

  // ✅ Handle Invite Link Login
  const handleInviteLinkLogin = () => {
    if (!inviteLink) {
      Alert.alert("Error", "Please enter invite link");
      return;
    }

    if (inviteLink.startsWith("https://raahi.com/invite/passenger/")) {
      Alert.alert("Success", "Login successful with invite link!");
      setInviteModalVisible(false);
      setInviteLink("");
      navigation.navigate("PassengerAppNavigation", { token: inviteLink });
    } else {
      Alert.alert("Invalid Link", "Please enter a valid invite link");
    }
  };

  // ✅ Navigate back to Request Screen
  const handleNavigateToRequest = () => {
    navigation.navigate("PassengerRequestScreen");
  };

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
          Passenger Login
        </Text>
      </View>

      {/* ✅ Login Card */}
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
          Welcome Back
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          Login to your account
        </Text>

        {/* ✅ Email */}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* ✅ Password */}
        <TextInput
          style={[styles.input, { marginTop: 15 }]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* ✅ Login Button */}
        <TouchableOpacity 
          style={[styles.primaryBtn, { marginTop: 20 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? "Logging in..." : "Login to Dashboard"}
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

        {/* ✅ Invite Link Login */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => setInviteModalVisible(true)}
        >
          <Text style={styles.secondaryBtnText}>Login with Invite Link</Text>
        </TouchableOpacity>

        {/* ✅ Register Link - FIXED NAVIGATION */}
        <TouchableOpacity
          style={[styles.registerBtn, { marginTop: 10 }]}
          onPress={handleNavigateToRequest}
        >
          <Text style={styles.registerBtnText}>
            Don't have an account? Send Request
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Invite Link Modal */}
      <Modal visible={inviteModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Login with Invite Link</Text>
            <Text style={styles.modalDesc}>
              Enter the invite link received from your transporter
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
              onPress={handleInviteLinkLogin}
            >
              <Text style={styles.primaryBtnText}>Login with Link</Text>
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
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  registerBtn: {
    borderWidth: 2,
    borderColor: "#afd826",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  registerBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#afd826",
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
};