import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";

export default function HelpSupport({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>❓ Help & Support</Text>

            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("FAQs")}>
                <Text style={styles.optionText}>📖 FAQs</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.option}
                onPress={() => Linking.openURL("mailto:support@raahi.com")}
            >
                <Text style={styles.optionText}>✉️ support@raahi.com</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.option}
                onPress={() => Linking.openURL("tel:111222333")}
            >
                <Text style={styles.optionText}>📞 Helpline: 111-222-333</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fefefc",
        padding: 20,
        borderRadius: 12,
        margin: 10,
        elevation: 3,
    },
    header: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
        color: "#afd826", // primary color
    },
    option: {
        backgroundColor: "#f5f5f5",
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
    },
    optionText: {
        fontSize: 16,
        color: "#374151",
        fontWeight: "500",
    },
});