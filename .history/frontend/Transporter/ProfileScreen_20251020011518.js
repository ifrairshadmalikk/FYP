import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
    const navigation = useNavigation();

    const driverProfile = {
        name: "Ali Ahmed",
        role: "Transport Manager",
        phone: "+92 300 1234567",
        email: "ali.ahmed@raahi.com",
        experience: "5 years",
        rating: 4.8,
        totalRoutes: 12,
        completedTrips: 2450,
        joinedDate: "March 2019",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="create-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <Image
                        source={{ uri: driverProfile.avatar }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{driverProfile.name}</Text>
                    <Text style={styles.role}>{driverProfile.role}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={20} color="#F39C12" />
                        <Text style={styles.rating}>{driverProfile.rating}</Text>
                    </View>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="business" size={24} color="#3498DB" />
                        <Text style={styles.statNumber}>{driverProfile.totalRoutes}</Text>
                        <Text style={styles.statLabel}>Routes</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="checkmark-done" size={24} color="#27AE60" />
                        <Text style={styles.statNumber}>{driverProfile.completedTrips}</Text>
                        <Text style={styles.statLabel}>Trips</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="time" size={24} color="#F39C12" />
                        <Text style={styles.statNumber}>{driverProfile.experience}</Text>
                        <Text style={styles.statLabel}>Experience</Text>
                    </View>
                </View>

                {/* Personal Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <Ionicons name="call-outline" size={20} color="#7F8C8D" />
                            <Text style={styles.infoLabel}>Phone</Text>
                            <Text style={styles.infoValue}>{driverProfile.phone}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="mail-outline" size={20} color="#7F8C8D" />
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{driverProfile.email}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="calendar-outline" size={20} color="#7F8C8D" />
                            <Text style={styles.infoLabel}>Joined</Text>
                            <Text style={styles.infoValue}>{driverProfile.joinedDate}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.actionsCard}>
                        {[
                            { icon: "lock-closed-outline", label: "Change Password", color: "#E74C3C" },
                            { icon: "notifications-outline", label: "Notification Settings", color: "#3498DB" },
                            { icon: "shield-checkmark-outline", label: "Privacy & Security", color: "#27AE60" },
                            { icon: "help-circle-outline", label: "Help & Support", color: "#F39C12" },
                        ].map((action, index) => (
                            <TouchableOpacity key={index} style={styles.actionItem}>
                                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                                    <Ionicons name={action.icon} size={20} color={action.color} />
                                </View>
                                <Text style={styles.actionText}>{action.label}</Text>
                                <Ionicons name="chevron-forward" size={18} color="#7F8C8D" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        backgroundColor: "#afd826",
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 4,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
    },
    editButton: {
        padding: 8,
    },
    scrollContent: {
        flex: 1,
        padding: 16,
    },
    profileHeader: {
        alignItems: "center",
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
        borderWidth: 3,
        borderColor: "#afd826",
    },
    name: {
        fontSize: 24,
        fontWeight: "700",
        color: "#2C3E50",
        marginBottom: 4,
    },
    role: {
        fontSize: 16,
        color: "#7F8C8D",
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF9E7",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    rating: {
        fontSize: 14,
        fontWeight: "600",
        color: "#F39C12",
        marginLeft: 4,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginHorizontal: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#ECF0F1",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2C3E50",
        marginVertical: 8,
    },
    statLabel: {
        fontSize: 12,
        color: "#7F8C8D",
        fontWeight: "500",
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2C3E50",
        marginBottom: 16,
    },
    infoCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#ECF0F1",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F8F9FA",
    },
    infoLabel: {
        fontSize: 14,
        color: "#7F8C8D",
        marginLeft: 12,
        marginRight: 'auto',
        width: 80,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: "500",
        color: "#2C3E50",
    },
    actionsCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#ECF0F1",
    },
    actionItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F8F9FA",
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        color: "#2C3E50",
    },
});