import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    FlatList,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddDriverSearch({ navigation }) {
    const [search, setSearch] = useState("");
    const [drivers, setDrivers] = useState([
        { id: "1", name: "Ali Khan", mobile: "03001234567", location: "Lahore", status: "pending" },
        { id: "2", name: "Zara Iqbal", mobile: "03121234567", location: "Karachi", status: "pending" },
        { id: "3", name: "Ahmed Raza", mobile: "03331234567", location: "Islamabad", status: "pending" },
        { id: "4", name: "Bilal Hussain", mobile: "03029876543", location: "Faisalabad", status: "pending" },
        { id: "5", name: "Saima Noor", mobile: "03219876543", location: "Multan", status: "pending" },
        { id: "6", name: "Imran Shah", mobile: "03451239876", location: "Peshawar", status: "pending" },
    ]);

    // Accept driver request
    const handleAccept = (id) => {
        setDrivers((prev) =>
            prev.map((d) =>
                d.id === id ? { ...d, status: "accepted" } : d
            )
        );
    };

    // Delete driver request
    const handleDelete = (id) => {
        setDrivers((prev) => prev.filter((d) => d.id !== id));
    };

    // Filtered drivers based on search
    const filteredDrivers = drivers.filter(
        (d) =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.mobile.includes(search) ||
            d.location.toLowerCase().includes(search.toLowerCase())
    );

    const renderDriver = ({ item }) => (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.subInfo}>📞 {item.mobile}</Text>
                <Text style={styles.subInfo}>📍 {item.location}</Text>
            </View>

            {item.status === "pending" ? (
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => handleAccept(item.id)}
                    >
                        <Text style={styles.btnText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Text style={styles.btnText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.acceptedBox}>
                    <Ionicons name="checkmark-circle" size={18} color="#afd826" />
                    <Text style={styles.acceptedText}>Accepted</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />

            {/* Header */}
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Driver Requests</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 6 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search drivers..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Driver Requests */}
            <FlatList
                data={filteredDrivers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
                renderItem={renderDriver}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.noResult}>No driver requests.</Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f7f9fb" },

    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#afd826",
        paddingHorizontal: 15,
        height: 58,
        elevation: 3,
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        margin: 15,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#333",
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    name: { fontSize: 16, fontWeight: "600", color: "#111", marginBottom: 4 },
    subInfo: { fontSize: 13, color: "#555", marginBottom: 2 },

    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    acceptBtn: {
        backgroundColor: "#afd826",
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    deleteBtn: {
        backgroundColor: "#ff4d4d",
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    btnText: { color: "#fff", fontSize: 13, fontWeight: "600" },

    acceptedBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2ffe6",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    acceptedText: { marginLeft: 6, color: "#5a9d2f", fontWeight: "600", fontSize: 13 },

    noResult: {
        textAlign: "center",
        marginTop: 30,
        color: "#888",
        fontSize: 14,
    },
});
