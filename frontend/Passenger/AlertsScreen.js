import React from "react";
import { SafeAreaView, Text, View, FlatList } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/PassengerStyles/alertsSyles";

export default function AlertsScreen() {
  const alerts = [
    { id: "a1", type: "arrival", text: "Van arriving in 10 minutes", time: "09:20 AM" },
    { id: "a2", type: "delay", text: "Van delayed due to traffic", time: "08:45 AM" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Alerts</Text>

      <FlatList
        data={alerts}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.alertRow}>
            <Icon name={item.type === "arrival" ? "map-marker" : "exclamation-circle"} size={18} color="#00A86B" />
            <View style={styles.alertInfo}>
              <Text style={styles.alertText}>{item.text}</Text>
              <Text style={styles.alertTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
