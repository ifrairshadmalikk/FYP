import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

// 👇 Screens import
import HomeScreen from "./PassengerHomeScreen";
import HistoryScreen from "./HistoryScreen";
import AttendanceScreen from "./AttendanceScreen";
import PassengerProfile from './PassengerProfile';
import Notifications from './Notifications';
import Safety from './Safety';
import Settings from './Settings';
import HelpSupport from './HelpSupport';

const Drawer = createDrawerNavigator();

export default function PassengerApp() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: true,
                drawerActiveTintColor: "#afd826",
                drawerLabelStyle: { fontSize: 16 },
            }}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="time" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={PassengerProfile}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="notifications" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Safety"
                component={Safety}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="shield-checkmark" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Attendance"
                component={AttendanceScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={Settings}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Help & Support"
                component={HelpSupport}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="help-circle" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}