import React, { useState } from "react";
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
    Modal,
    TextInput,
    Alert,
    Switch,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
    const navigation = useNavigation();

    const [driverProfile, setDriverProfile] = useState({
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
        address: "House 123, Street 45, Islamabad",
        licenseNumber: "PK123456789",
        vehicleType: "Hiace Van"
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ ...driverProfile });
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [loading, setLoading] = useState(false);

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        rideUpdates: true,
        promotions: false,
        securityAlerts: true,
        paymentReminders: true,
        systemUpdates: false
    });

    // Privacy settings
    const [privacySettings, setPrivacySettings] = useState({
        shareLocation: true,
        showInRatings: true,
        profileVisibility: "public",
        dataCollection: true
    });

    // Change password states
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const toggleNotification = (setting) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const togglePrivacy = (setting) => {
        setPrivacySettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleSaveProfile = () => {
        setLoading(true);
        setTimeout(() => {
            setDriverProfile(editForm);
            setIsEditing(false);
            setLoading(false);
            Alert.alert("Success", "Profile updated successfully!");
        }, 1000);
    };

    const handleChangePassword = () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            Alert.alert("Error", "Please fill all password fields.");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            Alert.alert("Error", "New passwords do not match.");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowChangePassword(false);
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            Alert.alert("Success", "Password changed successfully!");
        }, 1500);
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permissionResult.granted) {
            Alert.alert("Permission Required", "Sorry, we need camera roll permissions to make this work!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setEditForm({
                ...editForm,
                avatar: result.assets[0].uri
            });
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Logout", 
                    style: "destructive",
                    onPress: () => {
                        // Navigate to login screen
                        navigation.navigate("TransporterLogin");
                    }
                }
            ]
        );
    };

    const ChangePasswordModal = () => (
        <Modal visible={showChangePassword} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        <TouchableOpacity onPress={() => setShowChangePassword(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Current Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter current password"
                            secureTextEntry
                            value={passwordForm.currentPassword}
                            onChangeText={(text) => setPasswordForm({...passwordForm, currentPassword: text})}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new password"
                            secureTextEntry
                            value={passwordForm.newPassword}
                            onChangeText={(text) => setPasswordForm({...passwordForm, newPassword: text})}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Confirm New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm new password"
                            secureTextEntry
                            value={passwordForm.confirmPassword}
                            onChangeText={(text) => setPasswordForm({...passwordForm, confirmPassword: text})}
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.saveButton, loading && { opacity: 0.7 }]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Ionicons name="lock-closed" size={20} color="#fff" />
                        )}
                        <Text style={styles.saveButtonText}>
                            {loading ? "Updating..." : "Change Password"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const NotificationsModal = () => (
        <Modal visible={showNotifications} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Notification Settings</Text>
                        <TouchableOpacity onPress={() => setShowNotifications(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {Object.entries(notificationSettings).map(([key, value]) => (
                        <View key={key} style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>
                                    {key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </Text>
                                <Text style={styles.settingDescription}>
                                    Receive notifications about {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
                                </Text>
                            </View>
                            <Switch
                                value={value}
                                onValueChange={() => toggleNotification(key)}
                                trackColor={{ false: "#f0f0f0", true: "#afd826" }}
                                thumbColor={value ? "#fff" : "#f4f3f4"}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </Modal>
    );

    const PrivacyModal = () => (
        <Modal visible={showPrivacy} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Privacy & Security</Text>
                        <TouchableOpacity onPress={() => setShowPrivacy(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {Object.entries(privacySettings).map(([key, value]) => (
                        <View key={key} style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>
                                    {key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </Text>
                                <Text style={styles.settingDescription}>
                                    {key === 'shareLocation' ? 'Share your location for better service' :
                                     key === 'showInRatings' ? 'Display your profile in driver ratings' :
                                     key === 'profileVisibility' ? 'Control who can see your profile' :
                                     'Allow data collection for service improvement'}
                                </Text>
                            </View>
                            {typeof value === 'boolean' ? (
                                <Switch
                                    value={value}
                                    onValueChange={() => togglePrivacy(key)}
                                    trackColor={{ false: "#f0f0f0", true: "#afd826" }}
                                    thumbColor={value ? "#fff" : "#f4f3f4"}
                                />
                            ) : (
                                <Text style={styles.settingValue}>{value}</Text>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </Modal>
    );

    const HelpModal = () => (
        <Modal visible={showHelp} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Help & Support</Text>
                        <TouchableOpacity onPress={() => setShowHelp(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.helpSection}>
                        <Text style={styles.helpTitle}>Contact Support</Text>
                        <Text style={styles.helpText}>Email: support@raahi.com</Text>
                        <Text style={styles.helpText}>Phone: +92 51 1234567</Text>
                        <Text style={styles.helpText}>Available 24/7</Text>
                    </View>

                    <View style={styles.helpSection}>
                        <Text style={styles.helpTitle}>FAQ</Text>
                        <Text style={styles.helpText}>• How to reset password?</Text>
                        <Text style={styles.helpText}>• How to update profile?</Text>
                        <Text style={styles.helpText}>• Payment issues?</Text>
                    </View>

                    <TouchableOpacity style={styles.contactButton}>
                        <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                        <Text style={styles.contactButtonText}>Live Chat Support</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => setIsEditing(!isEditing)}
                >
                    <Ionicons 
                        name={isEditing ? "close-outline" : "create-outline"} 
                        size={24} 
                        color="#fff" 
                    />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <TouchableOpacity onPress={isEditing ? pickImage : null}>
                        <Image
                            source={{ uri: isEditing ? editForm.avatar : driverProfile.avatar }}
                            style={styles.avatar}
                        />
                        {isEditing && (
                            <View style={styles.editPhotoBadge}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>
                    
                    {isEditing ? (
                        <View style={styles.editNameContainer}>
                            <TextInput
                                style={styles.editNameInput}
                                value={editForm.name}
                                onChangeText={(text) => setEditForm({...editForm, name: text})}
                                placeholder="Full Name"
                            />
                            <TextInput
                                style={styles.editRoleInput}
                                value={editForm.role}
                                onChangeText={(text) => setEditForm({...editForm, role: text})}
                                placeholder="Role"
                            />
                        </View>
                    ) : (
                        <>
                            <Text style={styles.name}>{driverProfile.name}</Text>
                            <Text style={styles.role}>{driverProfile.role}</Text>
                        </>
                    )}
                    
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={20} color="#F39C12" />
                        <Text style={styles.rating}>{driverProfile.rating}</Text>
                    </View>

                    {isEditing && (
                        <TouchableOpacity 
                            style={[styles.saveButton, loading && { opacity: 0.7 }]}
                            onPress={handleSaveProfile}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Ionicons name="checkmark" size={20} color="#fff" />
                            )}
                            <Text style={styles.saveButtonText}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Text>
                        </TouchableOpacity>
                    )}
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
                        {[
                            { icon: "call-outline", label: "Phone", value: "phone", editable: true },
                            { icon: "mail-outline", label: "Email", value: "email", editable: true },
                            { icon: "calendar-outline", label: "Joined", value: "joinedDate", editable: false },
                            { icon: "location-outline", label: "Address", value: "address", editable: true },
                            { icon: "card-outline", label: "License", value: "licenseNumber", editable: true },
                            { icon: "car-outline", label: "Vehicle", value: "vehicleType", editable: true },
                        ].map((item, index) => (
                            <View key={index} style={styles.infoItem}>
                                <Ionicons name={item.icon} size={20} color="#7F8C8D" />
                                <Text style={styles.infoLabel}>{item.label}</Text>
                                {isEditing && item.editable ? (
                                    <TextInput
                                        style={styles.editInfoInput}
                                        value={editForm[item.value]}
                                        onChangeText={(text) => setEditForm({...editForm, [item.value]: text})}
                                        placeholder={`Enter ${item.label.toLowerCase()}`}
                                    />
                                ) : (
                                    <Text style={styles.infoValue}>
                                        {isEditing ? editForm[item.value] : driverProfile[item.value]}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.actionsCard}>
                        {[
                            { icon: "lock-closed-outline", label: "Change Password", color: "#E74C3C", action: () => setShowChangePassword(true) },
                            { icon: "notifications-outline", label: "Notification Settings", color: "#3498DB", action: () => setShowNotifications(true) },
                            { icon: "shield-checkmark-outline", label: "Privacy & Security", color: "#27AE60", action: () => setShowPrivacy(true) },
                            { icon: "help-circle-outline", label: "Help & Support", color: "#F39C12", action: () => setShowHelp(true) },
                            { icon: "log-out-outline", label: "Logout", color: "#95a5a6", action: handleLogout },
                        ].map((action, index) => (
                            <TouchableOpacity key={index} style={styles.actionItem} onPress={action.action}>
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

            {/* Modals */}
            <ChangePasswordModal />
            <NotificationsModal />
            <PrivacyModal />
            <HelpModal />
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
    editPhotoBadge: {
        position: 'absolute',
        bottom: 10,
        right: -5,
        backgroundColor: '#afd826',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
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
    editNameContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    editNameInput: {
        fontSize: 24,
        fontWeight: "700",
        color: "#2C3E50",
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#afd826',
        marginBottom: 4,
        paddingHorizontal: 8,
    },
    editRoleInput: {
        fontSize: 16,
        color: "#7F8C8D",
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#afd826',
        paddingHorizontal: 8,
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
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#afd826',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 12,
        gap: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
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
        elevation: 2,
        borderWidth: 1,
        borderColor: "#ECF0F1",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
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
    editInfoInput: {
        fontSize: 14,
        fontWeight: "500",
        color: "#2C3E50",
        borderBottomWidth: 1,
        borderBottomColor: '#afd826',
        paddingVertical: 4,
        flex: 1,
        textAlign: 'right',
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2C3E50",
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2C3E50",
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        color: "#7F8C8D",
    },
    settingValue: {
        fontSize: 14,
        color: "#afd826",
        fontWeight: "600",
    },
    helpSection: {
        marginBottom: 20,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C3E50",
        marginBottom: 8,
    },
    helpText: {
        fontSize: 14,
        color: "#7F8C8D",
        marginBottom: 4,
    },
    contactButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#afd826",
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginTop: 16,
    },
    contactButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});