import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Safety() {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>🛡 Safety</Text>
            <Text>- SOS Button available during rides</Text>
            <Text>- Emergency contact: 1122</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ecfdf5",
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
    },
    title: { fontWeight: "600", marginBottom: 5, fontSize: 16, color: "#059669" },
});
