import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function HistoryScreen() {
    const history = [
        { id: "1", date: "12 Feb", pickup: "Gulshan", drop: "University" },
        { id: "2", date: "11 Feb", pickup: "Gulshan", drop: "University" },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>📜 Ride History</Text>
            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.date}</Text>
                        <Text>{item.pickup} → {item.drop}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    heading: { fontSize: 20, fontWeight: "700", marginBottom: 15, color: "#111" },
    listItem: {
        padding: 12,
        backgroundColor: "#f9fafb",
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        marginBottom: 8,
    },
});
