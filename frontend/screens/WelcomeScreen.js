// frontend/screens/WelcomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styles/OnboardingStyles";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.welcomeContainer}>
      {/* Logo */}
      <Image
        source={require("./Raahi_Logo.png")} 
        style={styles.welcomeLogo}
        resizeMode="contain"
      />

      {/* Title 
      <Text style={styles.welcomeTitle}>Welcome to Raahi</Text>
        */}
      {/* Button */}
      <TouchableOpacity
        style={styles.welcomeButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.startButton}>Sign Up / Login</Text>
      </TouchableOpacity>
    </View>
  );
}