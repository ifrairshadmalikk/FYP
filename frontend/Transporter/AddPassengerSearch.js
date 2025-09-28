import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    FlatList,
    TextInput,
    Image,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PassengerList({ navigation, route }) {
    const [search, setSearch] = useState("");
    const [passengers, setPassengers] = useState([
        { id: "1", name: "Ali Raza", pickup: "Lahore Cantt", drop: "Johar Town", status: "pending" },
        { id: "2", name: "Zara Sheikh", pickup: "Karachi Gulshan", drop: "Clifton", status: "pending" },
        { id: "3", name: "Ahmed Khan", pickup: "Faisalabad", drop: "Lahore", status: "pending" },
        { id: "4", name: "Hina Malik", pickup: "Islamabad F-10", drop: "Blue Area", status: "pending" },
        { id: "5", name: "Bilal Aslam", pickup: "Rawalpindi Saddar", drop: "Bahria Town", status: "pending" },
        { id: "6", name: "Sara Khan", pickup: "Multan Cantt", drop: "Shah Rukn-e-Alam", status: "pending" },
    ]);

    // AddPassenger se aya passenger
    useEffect(() => {
        if (route.params?.newPassenger) {
            setPassengers((prev) => [
                { id: Date.now().toString(), ...route.params.newPassenger, status: "pending" },
                ...prev,
            ]);
        }
    }, [route.params?.newPassenger]);

    const handleAccept = (id) => {
        setPassengers((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: "accepted" } : p))
        );
    };

    const handleReject = (id) => {
        setPassengers((prev) => prev.filter((p) => p.id !== id));
    };

    const filteredPassengers = passengers.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.pickup.toLowerCase().includes(search.toLowerCase()) ||
            p.drop.toLowerCase().includes(search.toLowerCase())
    );

    const renderPassenger = ({ item }) => {
        const fadeAnim = new Animated.Value(1);
        const slideAnim = new Animated.Value(0);

        const rejectWithAnimation = () => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -50,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => handleReject(item.id));
        };

        return (
            <Animated.View
                style={[
                    styles.card,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateX: slideAnim }],
                    },
                ]}
            >
                {/* Avatar */}
                <Image
                    source={{
                        uri: "https://ui-avatars.com/api/?name=" + encodeURIComponent(item.name),
                    }}
                    style={styles.avatar}
                />

                {/* Info */}
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.subInfo}>
                        {item.pickup} → {item.drop}
                    </Text>
                </View>

                {/* Actions */}
                {item.status === "pending" ? (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.btn, styles.acceptBtn]}
                            onPress={() => handleAccept(item.id)}
                        >
                            <Text style={styles.btnText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.rejectBtn]}
                            onPress={rejectWithAnimation}
                        >
                            <Text style={styles.rejectText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.acceptedText}>Accepted ✓</Text>
                )}
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />

            {/* Header */}
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Passenger Requests</Text>
                <View style={{ width: 22 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search passengers..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Requests List */}
            <FlatList
                data={filteredPassengers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingVertical: 10 }}
                renderItem={renderPassenger}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#f2f2f2" }} />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No passenger requests found.</Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fff" },

    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#afd826",
        paddingHorizontal: 15,
        height: 58,
        elevation: 2,
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },

    searchBar: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fafafa",
    },
    searchInput: {
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 40,
        fontSize: 14,
        color: "#333",
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#fff",
    },
    avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
    name: { fontSize: 15, fontWeight: "600", color: "#111" },
    subInfo: { fontSize: 13, color: "#666", marginTop: 2 },

    actions: { flexDirection: "row", alignItems: "center" },
    btn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginLeft: 6,
    },
    acceptBtn: { backgroundColor: "#afd826" }, // app theme
    rejectBtn: { backgroundColor: "#f0f0f0" },

    btnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
    rejectText: { color: "#333", fontWeight: "600", fontSize: 13 },

    acceptedText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#28a745",
        marginLeft: 10,
    },

    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#888",
        fontSize: 14,
    },
});
