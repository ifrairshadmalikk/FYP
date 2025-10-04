import React from "react";
import { SafeAreaView, Text, View, FlatList } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/PassengerStyles/historyStyles";

export default function HistoryScreen() {
  const rides = [
    { id: "1", date: "15-12-2024", time: "08:30 AM", status: "completed", pickup: "Block 13D" },
    { id: "2", date: "14-12-2024", time: "08:30 AM", status: "completed", pickup: "Block 13D" },
    { id: "3", date: "13-12-2024", time: "08:30 AM", status: "missed", pickup: "Block 13D" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ride History</Text>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Icon
              name={item.status === "completed" ? "check-circle" : "times-circle"}
              size={18}
              color={item.status === "completed" ? "green" : "red"}
            />
            <View style={styles.info}>
              <Text style={styles.date}>{item.date} • {item.time}</Text>
              <Text style={styles.place}>{item.pickup} • {item.status}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
