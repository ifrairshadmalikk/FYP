// frontend/screens/Onboarding2.js
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../styles/OnboardingStyles";

export default function Onboarding2({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://assets.isu.pub/document-structure/240501104036-20d008535a46339c2bd73f69e9affcc8/v1/9032b539ca5af15bf8591e0f03f688fe.jpeg", 
        }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Find or Publish a Trip</Text>
      <Text style={styles.subtitle}>
        Search routes by entering your departure, destination, and date
        or publish your own route so others can join.
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
          onPress={() => navigation.navigate("Onboarding3")}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
