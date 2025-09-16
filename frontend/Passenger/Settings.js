import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Settings() {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>⚙ Settings</Text>
            <Text>- Change password</Text>
            <Text>- Update contact info</Text>
            <Text>- Manage notifications</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#eef2ff",
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
    },
    title: { fontWeight: "600", marginBottom: 5, fontSize: 16, color: "#4f46e5" },
});
