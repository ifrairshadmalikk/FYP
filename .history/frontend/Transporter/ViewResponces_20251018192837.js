import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ViewResponse({ navigation, route }) {
    const { pollData, isNewPoll } = route.params || {};
    const [poll, setPoll] = useState(pollData || {
        id: "1",
        date: new Date(),
        message: "Please select your preferred time slot for tomorrow's transportation.",
        timeSlots: [
            { id: 1, type: "Morning Slot", start: "09:00 AM", end: "11:00 AM", max: 50, responses: 45 },
            { id: 2, type: "Evening Slot", start: "05:00 PM", end: "07:00 PM", max: 50, responses: 38 },
        ],
        networks: [
            { id: 1, name: "Blue Area", passengers: 156, selected: true, responses: 120 },
            { id: 2, name: "Gulberg", passengers: 132, selected: true, responses: 98 },
        ],
        totalPassengers: 288,
        totalCapacity: 100,
        createdAt: new Date(),
        status: "active"
    });

    // Enhanced Header with Stats
    const Header = () => (
        <View style={styles.headerBar}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Poll Responses</Text>
                <View style={styles.headerStats}>
                    <Text style={styles.headerStat}>
                        📅 {new Date(poll.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.headerStat}>
                        👥 {poll.networks.reduce((sum, net) => sum + net.responses, 0)} responses
                    </Text>
                </View>
            </View>

            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerIconButton}>
                    <Ionicons name="refresh" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIconButton}>
                    <Ionicons name="share-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIconButton}>
                    <Ionicons name="ellipsis-vertical" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />
            <Header />
            
            <ScrollView style={styles.container}>
                {isNewPoll && (
                    <View style={styles.successBanner}>
                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        <Text style={styles.successText}>Poll created successfully!</Text>
                    </View>
                )}
                
                {/* Poll response content will go here */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Response Overview</Text>
                    <Text>Total Responses: 83</Text>
                    {/* Add your response charts and data here */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
    container: { flex: 1, padding: 16 },
    
    // Header Styles
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        height: 70,
        backgroundColor: "#afd826",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerContent: {
        flex: 1,
        alignItems: "center",
    },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "#fff",
        marginBottom: 2,
    },
    headerStats: {
        flexDirection: "row",
        gap: 12,
    },
    headerStat: {
        fontSize: 12,
        color: "#fff",
        opacity: 0.9,
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    headerIconButton: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
    },
    
    // Success Banner
    successBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5E8",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#4CAF50",
    },
    successText: {
        marginLeft: 8,
        color: "#2E7D32",
        fontWeight: "500",
    },
    
    // Cards
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    
    // Status Badge (for alternative header)
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginTop: 4,
    },
    statusText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
    },
});