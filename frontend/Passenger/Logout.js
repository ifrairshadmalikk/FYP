import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Logout() {
  const navigation = useNavigation();

  useEffect(() => {
    // Here you can clear auth tokens, async storage, etc.
    // For now, just navigate back to login screen
    navigation.replace("PassengerLoginScreen");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "bold" },
});
