// screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import styles from "../styles/DashboardStyles";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  // ✅ Invite Link Verification
  const verifyInviteLink = () => {
    if (inviteLink.startsWith("https://myapp.com/invite/")) {
      setInviteModalVisible(false);
      Alert.alert("Verified", "Your invite link is valid!");
      navigation.navigate("DriverRegister", { token: inviteLink });
    } else {
      Alert.alert("Invalid Link", "Please enter a valid invite link.");
    }
  };

  const handleLogin = () => {
    if (email && password) {
      navigation.navigate("DriverDashboard");
    } else {
      Alert.alert("Error", "Please enter email & password");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
      }}
    >
      {/* App Logo */}
      <Image
        source={{
          uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
        }}
        style={{ width: 120, height: 120, marginBottom: 20 }}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 15 }}>
        Driver Login
      </Text>

      {/* Guidance Message */}
      <Text
        style={{
          textAlign: "center",
          color: "#444",
          fontSize: 15,
          lineHeight: 22,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
      >
        Please login using the credentials shared by your Transporter.
      </Text>

      {/* Input Fields */}
      <View style={{ width: "100%", marginBottom: 20 }}>
        <TextInput
          style={[styles.input, { marginBottom: 15 }]}
          placeholder="Email Address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.submitBtn, { width: "100%", marginBottom: 25 }]}
        onPress={handleLogin}
      >
        <Text style={styles.submitText}>Login</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 25,
          width: "100%",
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
        <Text style={{ marginHorizontal: 10, color: "#999" }}>or</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
      </View>

      {/* Invite Link Button */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          {
            width: "100%",
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#007bff",
          },
        ]}
        onPress={() => setInviteModalVisible(true)}
      >
        <Text style={[styles.submitText, { color: "#007bff" }]}>
          Login with Invite Link
        </Text>
      </TouchableOpacity>

      {/* Invite Modal */}
      <Modal visible={inviteModalVisible} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 6,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Paste Invite Link
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#666",
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Please paste the invite link you received from your transporter.
              We’ll verify it before continuing.
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  borderWidth: 1,
                  borderColor: "#ddd",
                  width: "100%",
                  marginBottom: 15,
                },
              ]}
              placeholder="Enter your invite link"
              value={inviteLink}
              onChangeText={setInviteLink}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.submitBtn, { width: "100%", marginBottom: 10 }]}
              onPress={verifyInviteLink}
            >
              <Text style={styles.submitText}>Verify & Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: "#aaa", width: "100%" },
              ]}
              onPress={() => setInviteModalVisible(false)}
            >
              <Text style={styles.submitText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
