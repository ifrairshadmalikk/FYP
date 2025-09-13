// frontend/screens/Onboarding3.js
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../styles/OnboardingStyles";

export default function Onboarding3({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn.prod.website-files.com/66a7a451e7a3d53c26040949/66a7cef9b350f8c3d9b2b6f3_illustration-2%402x.png",
        }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Book with Ease</Text>
      <Text style={styles.subtitle}>
        Once you’ve found your route, finalize your ride details and enjoy secure payment and low fares.
      </Text>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("Welcome")}
      >
        <Text style={styles.nextText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
