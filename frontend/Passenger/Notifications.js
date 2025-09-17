import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
} from "react-native";

export default function Notifications() {
    const [selected, setSelected] = useState(null);

    // Sample data
    const [notifications, setNotifications] = useState([
        { id: "1", text: "Van delayed by 5 minutes", time: "2m ago", icon: "⏱", details: "The van scheduled for 8:00 AM is delayed by 5 minutes.", read: false },
        { id: "2", text: "Van will arrive at 8:30 AM tomorrow", time: "1h ago", icon: "🚐", details: "Tomorrow’s van timing is updated to 8:30 AM sharp.", read: false },
        { id: "3", text: "Your seat has been confirmed", time: "Yesterday", icon: "✅", details: "You have a confirmed seat for tomorrow’s trip.", read: true },
        { id: "4", text: "Van route updated: Stop #3 changed", time: "2d ago", icon: "🛣", details: "Stop #3 has been shifted to Main Street for convenience.", read: true },
    ]);

    // Handle click
    const handleSelect = (item) => {
        setSelected(item);
        // Mark as read
        setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
        );
    };

    // Render notification item
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, !item.read && styles.unreadCard]}
            activeOpacity={0.8}
            onPress={() => handleSelect(item)}
        >
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
                <Text style={styles.message}>{item.text}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />

            {/* Modal for details */}
            <Modal
                visible={!!selected}
                transparent
                animationType="slide"
                onRequestClose={() => setSelected(null)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>
                            {selected?.icon} {selected?.text}
                        </Text>
                        <Text style={styles.modalDetails}>{selected?.details}</Text>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setSelected(null)}
                        >
                            <Text style={{ color: "#fff", fontWeight: "600" }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 15 },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    unreadCard: {
        backgroundColor: "#f5ffe6", // halka green shade for new notifications
    },
    icon: {
        fontSize: 26,
        marginRight: 12,
    },
    message: {
        fontSize: 15,
        fontWeight: "500",
        color: "#222",
    },
    time: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 50,
        backgroundColor: "#afd826", // primary highlight
        marginLeft: 10,
    },

    // Modal
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 14,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
        color: "#222",
    },
    modalDetails: {
        fontSize: 15,
        color: "#444",
        marginBottom: 20,
    },
    closeBtn: {
        backgroundColor: "#afd826",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
});