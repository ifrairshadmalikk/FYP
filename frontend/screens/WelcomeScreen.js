// frontend/screens/WelcomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/OnboardingStyles";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeTitle}>Welcome to Raahi</Text>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate("Register Dashboard")}
      >
        <Text style={styles.startText}>Sign Up / Login</Text>
      </TouchableOpacity>
    </View>
  );
}
