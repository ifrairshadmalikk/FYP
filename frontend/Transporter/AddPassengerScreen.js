import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function AddPassengerScreen() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validatePassenger = () => {
    const nameRegex = /^[A-Za-z\s]{1,50}$/;
    if (!nameRegex.test(fullName)) return setErrorMsg("Please enter a valid name using letters only.");
    if (!/^\d{11}$/.test(mobile)) return setErrorMsg("Mobile number must be exactly 11 digits.");
    if (!/^\d{13}$/.test(cnic)) return setErrorMsg("CNIC must be exactly 13 digits.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setErrorMsg("Invalid email format.");
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    if (!passRegex.test(password)) return setErrorMsg("Password must be 8-16 chars with uppercase, digit, special char.");
    if (!/^[A-Za-z0-9,\s]{20,100}$/.test(pickup) || !/^[A-Za-z0-9,\s]{20,100}$/.test(drop))
      return setErrorMsg("Pickup/drop must be 20-100 chars, letters/digits/commas only.");
    setErrorMsg(""); setSuccessMsg("Passenger added successfully!");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Passenger</Text>
      <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName}/>
      <TextInput style={styles.input} placeholder="Mobile" keyboardType="numeric" value={mobile} onChangeText={setMobile}/>
      <TextInput style={styles.input} placeholder="CNIC" keyboardType="numeric" value={cnic} onChangeText={setCnic}/>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}/>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}/>
      <TextInput style={styles.input} placeholder="Pickup Location" value={pickup} onChangeText={setPickup}/>
      <TextInput style={styles.input} placeholder="Drop Location" value={drop} onChangeText={setDrop}/>
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}
      <TouchableOpacity style={styles.btn} onPress={validatePassenger}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 20 }, title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
  btn: { backgroundColor: "#28a745", padding: 15, borderRadius: 8 }, btnText: { color: "#fff", textAlign: "center" },
  error: { color: "red", marginBottom: 10 }, success: { color: "green", marginBottom: 10 },
});
