// frontend/screens/Onboarding1.js
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../styles/OnboardingStyles";

export default function Onboarding1({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRq4KRd5ejqsp0TzN6ICmojGUlBlJIH53z6sz_Da5Mpa4nrwNXi",
        }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Carpooling Reinvented</Text>
      <Text style={styles.subtitle}>
        Welcome to Raahi! We connect drivers and passengers for economical and friendly journeys.
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate("Welcome")}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate("Onboarding2")}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
