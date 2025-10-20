import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    TextInput,
    Modal,
    Alert,
    Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PassengerProfile({ navigation, route }) {
    const { passenger: initialPassenger } = route.params || {};
    
    const [passenger, setPassenger] = useState(initialPassenger || {
        id: "P001",
        name: "Ali Ahmed",
        mobile: "+92 300 1234567",
        email: "ali.ahmed@email.com",
        status: "accepted",
        pickup: "Blue Area, Islamabad",
        drop: "DHA Phase 2, Islamabad",
        totalRides: 45,
        memberSince: "2023",
        rating: 4.8,
        emergencyContact: "+92 300 7654321",
        address: "House 123, Street 45, Islamabad",
        preferences: {
            music: true,
            ac: true,
            conversation: false,
            smoking: false
        },
        paymentMethods: ["Cash", "Credit Card"]
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ ...passenger });
    const [showSettings, setShowSettings] = useState(false);
    const [showRideHistory, setShowRideHistory] = useState(false);

    const getStatusColor = (status) => {
        const colors = {
            accepted: "#28a745",
            pending: "#ffc107",
            blocked: "#dc3545",
            inactive: "#6c757d"
        };
        return colors[status] || "#6c757d";
    };

    const getStatusText = (status) => {
        const texts = {
            accepted: "Active",
            pending: "Pending",
            blocked: "Blocked",
            inactive: "Inactive"
        };
        return texts[status] || "Unknown";
    };

    const handleSave = () => {
        setPassenger(editForm);
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
    };

    const handleStatusChange = (newStatus) => {
        Alert.alert(
            "Change Status",
            `Are you sure you want to change status to ${getStatusText(newStatus)}?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Confirm", 
                    onPress: () => {
                        const updatedPassenger = { ...passenger, status: newStatus };
                        setPassenger(updatedPassenger);
                        setEditForm(updatedPassenger);
                    }
                }
            ]
        );
    };

    const togglePreference = (preference) => {
        setEditForm({
            ...editForm,
            preferences: {
                ...editForm.preferences,
                [preference]: !editForm.preferences[preference]
            }
        });
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Passenger",
            "Are you sure you want to delete this passenger? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: () => {
                        navigation.goBack();
                        Alert.alert("Success", "Passenger deleted successfully!");
                    }
                }
            ]
        );
    };

    const RideHistoryModal = () => (
        <Modal visible={showRideHistory} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Ride History</Text>
                        <TouchableOpacity onPress={() => setShowRideHistory(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {[
                            { id: 1, date: "2024-01-15", from: "Blue Area", to: "DHA Phase 2", fare: "Rs 250", rating: 5 },
                            { id: 2, date: "2024-01-14", from: "Gulberg", to: "Model Town", fare: "Rs 180", rating: 4 },
                            { id: 3, date: "2024-01-12", from: "Johar Town", to: "Emporium", fare: "Rs 300", rating: 5 },
                            { id: 4, date: "2024-01-10", from: "DHA", to: "Airport", fare: "Rs 450", rating: 4 },
                            { id: 5, date: "2024-01-08", from: "Model Town", to: "Liberty", fare: "Rs 200", rating: 5 },
                        ].map(ride => (
                            <View key={ride.id} style={styles.rideItem}>
                                <View style={styles.rideHeader}>
                                    <Text style={styles.rideDate}>{ride.date}</Text>
                                    <Text style={styles.rideFare}>{ride.fare}</Text>
                                </View>
                                <View style={styles.rideRoute}>
                                    <View style={styles.routePoint}>
                                        <Ionicons name="location-outline" size={14} color="#28a745" />
                                        <Text style={styles.routeText}>{ride.from}</Text>
                                    </View>
                                    <View style={styles.routePoint}>
                                        <Ionicons name="flag-outline" size={14} color="#dc3545" />
                                        <Text style={styles.routeText}>{ride.to}</Text>
                                    </View>
                                </View>
                                <View style={styles.rideFooter}>
                                    <View style={styles.rating}>
                                        <Ionicons name="star" size={14} color="#FFD700" />
                                        <Text style={styles.ratingText}>{ride.rating}</Text>
                                    </View>
                                    <Text style={styles.rideStatus}>Completed</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    const SettingsModal = () => (
        <Modal visible={showSettings} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Passenger Settings</Text>
                        <TouchableOpacity onPress={() => setShowSettings(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {/* Notification Settings */}
                        <View style={styles.settingSection}>
                            <Text style={styles.settingSectionTitle}>Notifications</Text>
                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Ride Updates</Text>
                                <Switch value={true} onValueChange={() => {}} />
                            </View>
                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Promotional</Text>
                                <Switch value={false} onValueChange={() => {}} />
                            </View>
                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Payment Reminders</Text>
                                <Switch value={true} onValueChange={() => {}} />
                            </View>
                        </View>

                        {/* Privacy Settings */}
                        <View style={styles.settingSection}>
                            <Text style={styles.settingSectionTitle}>Privacy</Text>
                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Share Location</Text>
                                <Switch value={true} onValueChange={() => {}} />
                            </View>
                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Show in Ratings</Text>
                                <Switch value={true} onValueChange={() => {}} />
                            </View>
                        </View>

                        {/* Danger Zone */}
                        <View style={styles.settingSection}>
                            <Text style={styles.settingSectionTitle}>Danger Zone</Text>
                            <TouchableOpacity style={styles.dangerButton} onPress={handleDelete}>
                                <Ionicons name="trash-outline" size={20} color="#dc3545" />
                                <Text style={styles.dangerButtonText}>Delete Passenger Account</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />

            {/* Header */}
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Passenger Profile</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={() => setShowSettings(true)}>
                        <Ionicons name="settings-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <Image
                        source={{
                            uri: "https://ui-avatars.com/api/?name=" + encodeURIComponent(passenger.name) + "&background=afd826&color=fff&size=200",
                        }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>
                        {isEditing ? (
                            <TextInput
                                style={styles.editInput}
                                value={editForm.name}
                                onChangeText={(text) => setEditForm({...editForm, name: text})}
                                placeholder="Full Name"
                            />
                        ) : (
                            passenger.name
                        )}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(passenger.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(passenger.status)}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    {!isEditing ? (
                        <>
                            <TouchableOpacity 
                                style={styles.editButton}
                                onPress={() => setIsEditing(true)}
                            >
                                <Ionicons name="create-outline" size={18} color="#fff" />
                                <Text style={styles.editButtonText}>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.historyButton}
                                onPress={() => setShowRideHistory(true)}
                            >
                                <Ionicons name="time-outline" size={18} color="#fff" />
                                <Text style={styles.historyButtonText}>Ride History</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity 
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Ionicons name="checkmark-outline" size={18} color="#fff" />
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={() => {
                                    setIsEditing(false);
                                    setEditForm({...passenger});
                                }}
                            >
                                <Ionicons name="close-outline" size={18} color="#666" />
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Contact Information */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Mobile:</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.editInput}
                                value={editForm.mobile}
                                onChangeText={(text) => setEditForm({...editForm, mobile: text})}
                                placeholder="Mobile Number"
                                keyboardType="phone-pad"
                            />
                        ) : (
                            <Text style={styles.infoValue}>{passenger.mobile}</Text>
                        )}
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Email:</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.editInput}
                                value={editForm.email}
                                onChangeText={(text) => setEditForm({...editForm, email: text})}
                                placeholder="Email Address"
                                keyboardType="email-address"
                            />
                        ) : (
                            <Text style={styles.infoValue}>{passenger.email}</Text>
                        )}
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="alert-circle-outline" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Emergency:</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.editInput}
                                value={editForm.emergencyContact}
                                onChangeText={(text) => setEditForm({...editForm, emergencyContact: text})}
                                placeholder="Emergency Contact"
                            />
                        ) : (
                            <Text style={styles.infoValue}>{passenger.emergencyContact}</Text>
                        )}
                    </View>
                </View>

                {/* Ride Information */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Current Ride Request</Text>

                    <View style={styles.routeContainer}>
                        <View style={styles.routePoint}>
                            <Ionicons name="location-outline" size={16} color="#28a745" />
                            <View style={styles.routeDetails}>
                                <Text style={styles.routeLabel}>Pickup Location</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.editInput}
                                        value={editForm.pickup}
                                        onChangeText={(text) => setEditForm({...editForm, pickup: text})}
                                        placeholder="Pickup Location"
                                    />
                                ) : (
                                    <Text style={styles.routeValue}>{passenger.pickup}</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.routeDivider} />

                        <View style={styles.routePoint}>
                            <Ionicons name="flag-outline" size={16} color="#dc3545" />
                            <View style={styles.routeDetails}>
                                <Text style={styles.routeLabel}>Drop Location</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.editInput}
                                        value={editForm.drop}
                                        onChangeText={(text) => setEditForm({...editForm, drop: text})}
                                        placeholder="Drop Location"
                                    />
                                ) : (
                                    <Text style={styles.routeValue}>{passenger.drop}</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Passenger Preferences */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Ride Preferences</Text>
                    {Object.entries(passenger.preferences).map(([key, value]) => (
                        <View key={key} style={styles.preferenceItem}>
                            <Text style={styles.preferenceLabel}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Text>
                            {isEditing ? (
                                <Switch
                                    value={editForm.preferences[key]}
                                    onValueChange={() => togglePreference(key)}
                                />
                            ) : (
                                <Ionicons 
                                    name={value ? "checkmark-circle" : "close-circle"} 
                                    size={24} 
                                    color={value ? "#28a745" : "#dc3545"} 
                                />
                            )}
                        </View>
                    ))}
                </View>

                {/* Passenger Stats */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Passenger Statistics</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{passenger.totalRides}</Text>
                            <Text style={styles.statLabel}>Total Rides</Text>
                        </View>

                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{passenger.rating}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>

                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{passenger.memberSince}</Text>
                            <Text style={styles.statLabel}>Member Since</Text>
                        </View>
                    </View>
                </View>

                {/* Status Management */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Account Status</Text>
                    <View style={styles.statusButtons}>
                        {["accepted", "pending", "blocked", "inactive"].map(status => (
                            <TouchableOpacity
                                key={status}
                                style={[
                                    styles.statusButton,
                                    passenger.status === status && styles.statusButtonActive,
                                    { borderColor: getStatusColor(status) }
                                ]}
                                onPress={() => handleStatusChange(status)}
                            >
                                <Text style={[
                                    styles.statusButtonText,
                                    { color: getStatusColor(status) },
                                    passenger.status === status && styles.statusButtonTextActive
                                ]}>
                                    {getStatusText(status)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Modals */}
            <RideHistoryModal />
            <SettingsModal />
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
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff"
    },
    headerActions: {
        flexDirection: "row",
        gap: 15,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    profileHeader: {
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: "#afd826",
        marginBottom: 12,
    },
    profileName: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111",
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    editButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 10,
        gap: 8,
    },
    historyButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#6f42c1",
        padding: 12,
        borderRadius: 10,
        gap: 8,
    },
    saveButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#28a745",
        padding: 12,
        borderRadius: 10,
        gap: 8,
    },
    cancelButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        borderWidth: 1,
        borderColor: "#dee2e6",
        padding: 12,
        borderRadius: 10,
        gap: 8,
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    historyButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    cancelButtonText: {
        color: "#666",
        fontWeight: "600",
        fontSize: 14,
    },
    infoSection: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingVertical: 4,
    },
    infoLabel: {
        fontSize: 14,
        color: "#666",
        marginLeft: 8,
        marginRight: 8,
        width: 80,
    },
    infoValue: {
        fontSize: 14,
        color: "#111",
        fontWeight: "600",
        flex: 1,
    },
    editInput: {
        fontSize: 14,
        color: "#111",
        fontWeight: "600",
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#afd826",
        paddingVertical: 4,
    },
    routeContainer: {
        marginTop: 8,
    },
    routePoint: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    routeDetails: {
        marginLeft: 12,
        flex: 1,
    },
    routeLabel: {
        fontSize: 12,
        color: "#666",
        marginBottom: 2,
    },
    routeValue: {
        fontSize: 14,
        color: "#111",
        fontWeight: "600",
    },
    routeDivider: {
        width: 2,
        height: 20,
        backgroundColor: "#ddd",
        marginLeft: 7,
        marginBottom: 8,
    },
    preferenceItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    preferenceLabel: {
        fontSize: 14,
        color: "#111",
        fontWeight: "500",
    },
    statsSection: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statCard: {
        alignItems: "center",
        flex: 1,
        padding: 12,
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#afd826",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
    statusButtons: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    statusButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
        backgroundColor: "#fff",
    },
    statusButtonActive: {
        backgroundColor: "#afd826",
    },
    statusButtonText: {
        fontSize: 12,
        fontWeight: "600",
    },
    statusButtonTextActive: {
        color: "#fff",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "80%",
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
    },
    rideItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    rideHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    rideDate: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111",
    },
    rideFare: {
        fontSize: 14,
        fontWeight: "700",
        color: "#28a745",
    },
    rideRoute: {
        marginBottom: 8,
    },
    routePoint: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    routeText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 8,
    },
    rideFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rating: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111",
    },
    rideStatus: {
        fontSize: 12,
        color: "#28a745",
        fontWeight: "600",
        backgroundColor: "#e8f5e8",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    settingSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    settingSectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    settingLabel: {
        fontSize: 14,
        color: "#111",
        fontWeight: "500",
    },
    dangerButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "#ffe6e6",
        borderRadius: 10,
        gap: 8,
        marginTop: 8,
    },
    dangerButtonText: {
        color: "#dc3545",
        fontWeight: "600",
        fontSize: 14,
    },
});