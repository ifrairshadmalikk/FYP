import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HelpSupport() {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>❓ Help & Support</Text>
            <Text>- FAQs available in app</Text>
            <Text>- Contact: support@raahi.com</Text>
            <Text>- Helpline: 111-222-333</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fef2f2",
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
    },
    title: {
        fontWeight: "600",
        marginBottom: 5,
        fontSize: 16,
        color: "#dc2626",
    },
});