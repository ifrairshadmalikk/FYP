import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Screens
import Onboarding from "./frontend/screens/Onboarding";
import WelcomeScreen from "./frontend/screens/WelcomeScreen";
import DashboardRegisterScreen from "./frontend/screens/DashboardRegisterScreen";
import PassengerRegisterScreen from "./frontend/screens/PassengerRegisterScreen";
import DriverRegisterScreen from "./frontend/screens/DriverRegisterScreen";
import TransporterRegisterScreen from "./frontend/screens/TransporterRegisterScreen";
import PassengerTransporterSelectionScreen from "./frontend/screens/PassengerTransporterSelectionScreen";
import DriverTransporterSelectionScreen from "./frontend/screens/DriverTransporterSelectionScreen";
import LoginScreen from "./frontend/screens/LoginScreen";

// Passenger App (already has its own Drawer)
import PassengerApp from "./frontend/Passenger/PassengerApp";

// Transporter Screens
import TransporterDashboard from "./frontend/Transporter/TransporterDashboardScreen";
import AddDriverScreen from "./frontend/Transporter/AddDriverScreen";
import AddPassengerScreen from "./frontend/Transporter/AddPassengerScreen";
import ManageRecordsScreen from "./frontend/Transporter/ManageRecordsScreen";
import PaymentsScreen from "./frontend/Transporter/PaymentsScreen";
import VanTrackingScreen from "./frontend/Transporter/VanTrackingScreen";
import AlertsScreen from "./frontend/Transporter/AlertsScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ Drawer for Transporter
function TransporterApp() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={TransporterDashboard} />
      <Drawer.Screen name="Add Driver" component={AddDriverScreen} />
      <Drawer.Screen name="Add Passenger" component={AddPassengerScreen} />
      <Drawer.Screen name="Manage Records" component={ManageRecordsScreen} />
      <Drawer.Screen name="Payments" component={PaymentsScreen} />
      <Drawer.Screen name="Van Tracking" component={VanTrackingScreen} />
      <Drawer.Screen name="Alerts" component={AlertsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Onboarding Flow */}
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/* Login */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Registration Flow */}
        <Stack.Screen name="DashboardRegisterScreen" component={DashboardRegisterScreen} />
        <Stack.Screen name="PassengerRegister" component={PassengerRegisterScreen} />
        <Stack.Screen name="DriverRegister" component={DriverRegisterScreen} />
        <Stack.Screen name="Transporter Register" component={TransporterRegisterScreen} />

        {/* Selection Screens */}
        <Stack.Screen name="PassengerTransporterSelection" component={PassengerTransporterSelectionScreen} />
        <Stack.Screen name="DriverTransporterSelection" component={DriverTransporterSelectionScreen} />

        {/* Passenger Drawer App */}
        <Stack.Screen name="PassengerApp" component={PassengerApp} />

        {/* ✅ Transporter Drawer App */}
        <Stack.Screen name="TransporterApp" component={TransporterApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
