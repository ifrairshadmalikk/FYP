// screens/LoginScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import styles from "../styles/DashboardStyles"; // Reuse same style for consistency

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteToken, setInviteToken] = useState(null);

  // ✅ get token from deep link
  useEffect(() => {
    if (route.params?.token) {
      setInviteToken(route.params.token);
    }
  }, [route.params]);

  const handleLogin = () => {
    if (inviteToken) {
      // ✅ invite flow
      console.log("Driver invited with token:", inviteToken);
      navigation.navigate("DriverRegister", { token: inviteToken });
    } else {
      // ✅ normal login flow
      navigation.navigate("Dashboard");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 👇 App Logo */}
      <Image
        source={{
          uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
        }}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Driver Login</Text>

      {/* Guidance Message */}
      <Text style={{ textAlign: "center", color: "#444", marginBottom: 25, fontSize: 15, lineHeight: 22 }}>
        Please login using the credentials shared by your Transporter.{"\n"}
        Or, if you received an <Text style={{ fontWeight: "bold", color: "#ff6600" }}>invite link</Text>, 
        simply continue with that.
      </Text>

      {/* Input Fields */}
      <View style={styles.sectionBox}>
        <TextInput
          style={styles.input}
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

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleLogin}>
        <Text style={styles.submitText}>Login</Text>
      </TouchableOpacity>

      {/* Invite Token Info */}
      {inviteToken && (
        <View style={{ marginTop: 20, padding: 12, backgroundColor: "#e6ffed", borderRadius: 8 }}>
          <Text style={{ color: "#2e7d32", textAlign: "center", fontWeight: "600" }}>
            Invite link detected. Continue your registration.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
