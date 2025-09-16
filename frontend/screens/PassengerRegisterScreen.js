import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PassengerProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    cnic: "",
    role: "",
    pickup: "",
    dropoff: "",
    status: "",
    image: "https://randomuser.me/api/portraits/women/79.jpg", // ladki ki image
  });

  useEffect(() => {
    (async () => {
      try {
        const savedName = await AsyncStorage.getItem("name");
        const savedEmail = await AsyncStorage.getItem("email");
        const savedMobile = await AsyncStorage.getItem("mobile");
        const savedCnic = await AsyncStorage.getItem("cnic");
        const savedRole = await AsyncStorage.getItem("role");
        const savedPickup = await AsyncStorage.getItem("pickup");
        const savedDropoff = await AsyncStorage.getItem("dropoff");
        const savedStatus = await AsyncStorage.getItem("attendanceStatus");

        setProfile({
          ...profile,
          name: savedName || "Hanzla",
          email: savedEmail || "hanzlaalvi9@gmail.com",
          mobile: savedMobile || "03001234567",
          cnic: savedCnic || "1234512345671",
          role: savedRole || "Passenger",
          pickup: savedPickup || "N/A",
          dropoff: savedDropoff || "N/A",
          status: savedStatus || "Pending",
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const getStatusColor = () => {
    if (profile.status === "Yes - Traveling") return "#afd826";
    if (profile.status === "No - Not Traveling") return "#f87171";
    return "#f59e0b"; // Pending
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: profile.image }} style={styles.image} />
      </View>

      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.role}>{profile.role}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profile.email}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Mobile:</Text>
        <Text style={styles.value}>{profile.mobile}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>CNIC:</Text>
        <Text style={styles.value}>{profile.cnic}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Pickup Address:</Text>
        <Text style={styles.value}>{profile.pickup}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Dropoff Address:</Text>
        <Text style={styles.value}>{profile.dropoff}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Travel Status:</Text>
        <Text style={[styles.value, { color: getStatusColor(), fontWeight: "700" }]}>
          {profile.status}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: "#afd826",
    borderRadius: 80,
    padding: 5,
    marginBottom: 15,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  role: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: { fontWeight: "600", color: "#333", marginBottom: 3 },
  value: { fontSize: 16, color: "#111" },
});