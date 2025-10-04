// Tabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

import HomeScreen from "./HomeScreen";
import HistoryScreen from "./HistoryScreen";
import AlertsScreen from "./AlertsScreen";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let name = "circle";
          if (route.name === "Home") name = "home";
          else if (route.name === "History") name = "history";
          else if (route.name === "Alerts") name = "bell";
          else if (route.name === "More") name = "bars";
          return <Icon name={name} size={22} color={color} />;
        },
        tabBarActiveTintColor: "#afd826",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: 0.5,
          borderTopColor: "#eee",
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />

      <Tab.Screen
        name="More"
        component={() => null}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.openDrawer();
          },
        }}
      />
    </Tab.Navigator>
  );
}
