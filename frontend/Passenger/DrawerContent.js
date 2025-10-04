// PassengerScreens/DrawerContent.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/PassengerStyles/drawerStyles";

export default function DrawerContent(props) {
  const { navigation } = props;
  const [activeItem, setActiveItem] = useState("Home");

  const navigateTo = (screenName) => {
    setActiveItem(screenName);
    navigation.navigate(screenName);
    navigation.closeDrawer();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== Header ===== */}
      <View style={styles.header}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>AH</Text>
        </View>
        <View>
          <Text style={styles.name}>Ahmed Hassan</Text>
          <Text style={styles.email}>ahmed@example.com</Text>
        </View>
      </View>

      {/* ===== Menu ===== */}
      <ScrollView style={{ marginTop: 20 }}>
        {[
          { name: "Home", icon: "home", screen: "Home" },
          { name: "Ride History", icon: "history", screen: "History" },
          { name: "Profile", icon: "user", screen: "Profile" },
          { name: "Alerts", icon: "bell", screen: "Alerts" },
          { name: "Track Van", icon: "map-marker", screen: "TrackVanScreen" },
        ].map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.item,
              activeItem === item.screen && styles.activeItem,
            ]}
            onPress={() => navigateTo(item.screen)}
            activeOpacity={0.7}
          >
            <Icon
              name={item.icon}
              size={18}
              color={activeItem === item.screen ? "#afd826" : "#333"}
            />
            <Text
              style={[
                styles.itemText,
                activeItem === item.screen && styles.activeText,
              ]}
            >
              {" "}
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}

        {/* ===== Logout ===== */}
        <TouchableOpacity
          style={[styles.item, { marginTop: 10 }]}
          onPress={() => {
            navigation.replace("PassengerLoginScreen");
            navigation.closeDrawer();
          }}
          activeOpacity={0.7}
        >
          <Icon name="sign-out" size={18} color="#D9534F" />
          <Text style={[styles.itemText, { color: "#D9534F" }]}> Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
