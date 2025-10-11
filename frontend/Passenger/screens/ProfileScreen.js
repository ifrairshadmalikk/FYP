import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ScrollView, 
    TouchableOpacity,
    StatusBar 
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PassengerProfile({ navigation }) {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        mobile: "",
        cnic: "",
        role: "",
        pickup: "",
        dropoff: "",
        status: "",
        image: "https://randomuser.me/api/portraits/women/79.jpg",
    });

    useEffect(() => {
        (async () => {
            try {
                const savedName = await AsyncStorage.getItem("name");
                const savedEmail = await AsyncStorage.getItem("email");
                const savedMobile = await AsyncStorage.getItem("mobile");
                const savedCnic = await AsyncStorage.getItem("cnic");
                const savedRole = await AsyncStorage.getItem("role");
                const savedPickup = await AsyncStorage.getItem("pickup");
                const savedDropoff = await AsyncStorage.getItem("dropoff");
                const savedStatus = await AsyncStorage.getItem("attendanceStatus");

                setProfile({
                    ...profile,
                    name: savedName || "Hanzla",
                    email: savedEmail || "hanzlaalvi9@gmail.com",
                    mobile: savedMobile || "03001234567",
                    cnic: savedCnic || "1234512345671",
                    role: savedRole || "Passenger",
                    pickup: savedPickup || "N/A",
                    dropoff: savedDropoff || "N/A",
                    status: savedStatus || "Pending",
                });
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const getStatusColor = () => {
        if (profile.status === "Yes - Traveling") return "#A1D826";
        if (profile.status === "No - Not Traveling") return "#FF6B6B";
        return "#FFA500"; // Pending
    };

    const getStatusIcon = () => {
        if (profile.status === "Yes - Traveling") return "checkmark-circle";
        if (profile.status === "No - Not Traveling") return "close-circle";
        return "time";
    };

    const InfoCard = ({ icon, label, value, isStatus = false }) => (
        <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
                <View style={styles.iconContainer}>
                    <Icon name={icon} size={20} color="#A1D826" />
                </View>
                <Text style={styles.cardLabel}>{label}</Text>
            </View>
            <Text style={[
                styles.cardValue,
                isStatus && { color: getStatusColor(), fontWeight: "700" }
            ]}>
                {value}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#A1D826" barStyle="light-content" />
            
            {/* Header */}
            <LinearGradient
                colors={['#A1D826', '#8BC220']}
                style={styles.header}
            >
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Icon name="pencil-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Image Section */}
                <View style={styles.profileSection}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: profile.image }} style={styles.image} />
                        <View style={styles.onlineIndicator} />
                    </View>
                    
                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.role}>{profile.role}</Text>
                    
                    {/* Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
                        <Icon 
                            name={getStatusIcon()} 
                            size={16} 
                            color={getStatusColor()} 
                        />
                        <Text style={[styles.statusText, { color: getStatusColor() }]}>
                            {profile.status}
                        </Text>
                    </View>
                </View>

                {/* Info Cards - One per row */}
                <View style={styles.infoContainer}>
                    <InfoCard 
                        icon="mail-outline" 
                        label="Email Address" 
                        value={profile.email}
                    />
                    
                    <InfoCard 
                        icon="call-outline" 
                        label="Mobile Number" 
                        value={profile.mobile}
                    />
                    
                    <InfoCard 
                        icon="card-outline" 
                        label="CNIC Number" 
                        value={profile.cnic}
                    />
                    
                    <InfoCard 
                        icon="navigate-outline" 
                        label="Travel Status" 
                        value={profile.status}
                        isStatus={true}
                    />
                    
                    <InfoCard 
                        icon="location-outline" 
                        label="Pickup Address" 
                        value={profile.pickup}
                    />
                    
                    <InfoCard 
                        icon="flag-outline" 
                        label="Dropoff Address" 
                        value={profile.dropoff}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        padding: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        padding: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    profileSection: {
        alignItems: 'center',
        padding: 25,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 25,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#A1D826',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#A1D826',
        borderWidth: 3,
        borderColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
        textAlign: 'center',
    },
    role: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 15,
        textAlign: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(161, 216, 38, 0.3)',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    infoContainer: {
        padding: 20,
        paddingTop: 10,
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 15,
        minHeight: 90,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f9e8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7f8c8d',
    },
    cardValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2c3e50',
        lineHeight: 22,
    },
});