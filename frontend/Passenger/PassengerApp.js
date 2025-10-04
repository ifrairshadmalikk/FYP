// PassengerApp.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

// Screens
import Tabs from "./Tabs";
import HistoryScreen from "./HistoryScreen";
import AlertsScreen from "./AlertsScreen";
import PassengerProfile from "./Profile";
import Logout from "./Logout";
import TrackVanScreen from "./TrackVanScreen";
// Custom drawer
import DrawerContent from "./DrawerContent";

const Drawer = createDrawerNavigator();

export default function PassengerApp() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: "#afd826",
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      {/* Tabs wraps Home/History/Alerts as bottom tabs */}
      <Drawer.Screen
        name="Home"
        component={Tabs}
        options={{
          title: "Home",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={PassengerProfile}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      

<Drawer.Screen
  name="TrackVanScreen"
  component={TrackVanScreen}
  options={{
    title: "Track Van",
    drawerItemStyle: { display: "none" }, 
  }}
/>

      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
