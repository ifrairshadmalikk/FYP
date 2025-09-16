import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Notifications() {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>🔔 Notifications</Text>
            <Text>- Van delayed by 5 minutes</Text>
            <Text>- Payment reminder: due tomorrow</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff8e1",
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
    },
    title: { fontWeight: "600", marginBottom: 5, fontSize: 16, color: "#f59e0b" },
});
