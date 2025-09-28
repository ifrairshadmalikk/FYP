import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  SafeAreaView,
  Clipboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddPassenger({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("Fixed"); // Fixed یا Custom
  const [monthlyFee, setMonthlyFee] = useState(""); // Fixed Monthly Fee
  const [customPlanType, setCustomPlanType] = useState("Daily"); // Custom Plan type
  const [customFee, setCustomFee] = useState(""); // Custom fee
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const validatePassenger = () => {
    const nameRegex = /^[A-Za-z\s]{1,50}$/;
    if (!nameRegex.test(fullName))
      return setErrorMsg("Please enter a valid name using letters only.");
    if (!/^\d{11}$/.test(mobile))
      return setErrorMsg("Mobile number must be exactly 11 digits.");
    if (!/^\d{13}$/.test(cnic))
      return setErrorMsg("CNIC must be exactly 13 digits.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setErrorMsg("Invalid email format.");
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    if (!passRegex.test(password))
      return setErrorMsg(
        "Password must be 8-16 chars with uppercase, digit, special char."
      );
    if (
      !/^[A-Za-z0-9,\s]{20,100}$/.test(pickup) ||
      !/^[A-Za-z0-9,\s]{20,100}$/.test(drop)
    )
      return setErrorMsg(
        "Pickup/drop must be 20-100 chars, letters/digits/commas only."
      );

    if (subscriptionType === "Fixed") {
      if (!/^\d+$/.test(monthlyFee)) return setErrorMsg("Enter a valid monthly subscription fee.");
    } else if (subscriptionType === "Custom") {
      if (!/^\d+$/.test(customFee))
        return setErrorMsg(`Enter a valid fee for the ${customPlanType} plan.`);
    }

    // If all validation passes
    setErrorMsg("");
    const link = `https://raahi-app.com/invite?token=abcd1234`;
    setInviteLink(link);

    let planText = subscriptionType === "Fixed"
      ? `Monthly Subscription: Rs. ${monthlyFee}`
      : `Custom Plan (${customPlanType}): Rs. ${customFee}`;

    setSuccessMsg(`Passenger added successfully! ${planText}. Invite link generated below.`);
  };

  const copyLink = () => {
    Clipboard.setString(inviteLink);
    Alert.alert("Copied", "Invite link copied to clipboard!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" translucent={false} />

      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Passenger</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="Mobile (11 digits)" keyboardType="numeric" value={mobile} onChangeText={setMobile} />
        <TextInput style={styles.input} placeholder="CNIC (13 digits)" keyboardType="numeric" value={cnic} onChangeText={setCnic} />
        <TextInput style={styles.input} placeholder="Email Address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Pickup Location" value={pickup} onChangeText={setPickup} />
        <TextInput style={styles.input} placeholder="Drop Location" value={drop} onChangeText={setDrop} />

        {/* Subscription Type */}
        <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 10 }}>Subscription Type</Text>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <TouchableOpacity
            style={[
              styles.subscriptionBtn,
              subscriptionType === "Fixed" && { backgroundColor: "#afd826" },
            ]}
            onPress={() => setSubscriptionType("Fixed")}
          >
            <Text style={{ color: subscriptionType === "Fixed" ? "#fff" : "#333" }}>Fixed Monthly Fee</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.subscriptionBtn,
              subscriptionType === "Custom" && { backgroundColor: "#afd826" },
            ]}
            onPress={() => setSubscriptionType("Custom")}
          >
            <Text style={{ color: subscriptionType === "Custom" ? "#fff" : "#333" }}>Custom Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Fixed Monthly Fee */}
        {subscriptionType === "Fixed" && (
          <TextInput
            style={styles.input}
            placeholder="Enter Monthly Subscription Fee"
            keyboardType="numeric"
            value={monthlyFee}
            onChangeText={setMonthlyFee}
          />
        )}

        {/* Custom Plan UI */}
        {subscriptionType === "Custom" && (
          <View>
            <Text style={{ fontSize: 15, marginBottom: 6 }}>Select Plan Type</Text>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              {["Daily", "Weekly", "Monthly"].map((plan) => (
                <TouchableOpacity
                  key={plan}
                  style={[
                    styles.subscriptionBtn,
                    customPlanType === plan && { backgroundColor: "#afd826" },
                  ]}
                  onPress={() => setCustomPlanType(plan)}
                >
                  <Text style={{ color: customPlanType === plan ? "#fff" : "#333" }}>{plan}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${customPlanType} Fee`}
              keyboardType="numeric"
              value={customFee}
              onChangeText={setCustomFee}
            />
          </View>
        )}

        {/* Error / Success Messages */}
        {errorMsg ? (
          <View style={styles.msgBoxError}>
            <Text style={styles.error}>{errorMsg}</Text>
          </View>
        ) : null}
        {successMsg ? (
          <View style={styles.msgBoxSuccess}>
            <Text style={styles.success}>{successMsg}</Text>
            {inviteLink && (
              <TouchableOpacity style={styles.linkBox} onPress={copyLink}>
                <Text style={styles.linkText}>{inviteLink}</Text>
                <Ionicons name="copy-outline" size={18} color="#28a745" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {/* Save Button */}
        <TouchableOpacity style={styles.btn} onPress={validatePassenger}>
          <Text style={styles.btnText}>Save Passenger</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#afd826", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  headerBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#afd826", paddingHorizontal: 15, paddingVertical: 12, elevation: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: "#f9f9f9", fontSize: 15 },
  btn: { backgroundColor: "#afd826", padding: 15, borderRadius: 10, marginTop: 10, shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3 },
  btnText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  msgBoxError: { backgroundColor: "#ffe6e6", borderRadius: 8, padding: 10, marginBottom: 10 },
  msgBoxSuccess: { backgroundColor: "#e6ffed", borderRadius: 8, padding: 10, marginBottom: 10 },
  error: { color: "#d9534f", fontSize: 14 },
  success: { color: "#28a745", fontSize: 14, marginBottom: 6 },
  linkBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0fff4", padding: 8, borderRadius: 8 },
  linkText: { color: "#28a745", fontSize: 14 },
  subscriptionBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", marginRight: 10, alignItems: "center", backgroundColor: "#f9f9f9" },
});
