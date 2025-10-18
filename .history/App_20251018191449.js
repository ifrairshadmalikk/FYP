import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Screens
import Onboarding from "./frontend/screens/Onboarding";
import WelcomeScreen from "./frontend/screens/WelcomeScreen";
import LoginScreen from "./frontend/screens/LoginScreen";
import DashboardRegisterScreen from "./frontend/screens/DashboardRegisterScreen";
import PassengerRegisterScreen from "./frontend/screens/PassengerRegisterScreen";
import DriverRegisterScreen from "./frontend/screens/DriverRegisterScreen";
import TransporterRegisterScreen from "./frontend/screens/TransporterRegisterScreen";
import PassengerTransporterSelectionScreen from "./frontend/screens/PassengerTransporterSelectionScreen";
import TransporterLoginScreen from "./frontend/screens/TransporterLoginScreen";

// Passenger Screens
import PassengerAppNavigation from "./frontend/Passenger/screens/PassengerAppNavigation";
import PassengerLoginScreen from "./frontend/Passenger/screens/PassengerLoginScreen";
import PassengerDashboard from "./frontend/Passenger/screens/PassengerDashboard";



// Transporter Screens
import TransporterDashboardScreen from "./frontend/Transporter/TransporterDashboard";
import PassengerList from "./frontend/Transporter/PassengerList";
import DriverList from "./frontend/Transporter/DriverList";
import AddDriverScreen from "./frontend/Transporter/AddDriverScreen";
import AddPassengerScreen from "./frontend/Transporter/AddPassengerScreen";
import PaymentsScreen from "./frontend/Transporter/PaymentsScreen";
import VanTrackingScreen from "./frontend/Transporter/VanTrackingScreen";
import AlertsScreen from "./frontend/Transporter/AlertsScreen";
import DriverPerformance from "./frontend/Transporter/DriverPerformance";
import PassengerPerformance from "./frontend/Transporter/PassengerPerformance";
import RouteAssignment from "./frontend/Transporter/RouteAssignment";
import SmartScheduling from "./frontend/Transporter/SmartScheduling";
import CreateDailyPoll from "./frontend/Transporter/CreateDailyPoll";
import AssignRoutesScreen from "./frontend/Transporter/AssignRoutesScreen";
import DriverProfile from "./frontend/Transporter/DriverProfile";
import PassengerProfile from "./frontend/Transporter/PassengerProfile";
import ProfileScreen from "./frontend/Transporter/ProfileScreen";
import 

// Driver
import DriverDashboard from "./frontend/Driver/DriverDashboard";
import DriverTrackingScreen from "./frontend/Driver/DriverTrackingScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ Transporter Drawer Navigation
function TransporterDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        drawerStyle: {
          backgroundColor: "#fff",
          width: 240,
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={TransporterDashboardScreen} />
      <Drawer.Screen name="Passenger List" component={PassengerList} />
      <Drawer.Screen name="Driver List" component={DriverList} />
      <Drawer.Screen name="Payments" component={PaymentsScreen} />
      <Drawer.Screen name="Alerts" component={AlertsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 🌟 Initial Flow */}
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* 🌟 Registration Flow */}
        <Stack.Screen name="DashboardRegister" component={DashboardRegisterScreen} />
        <Stack.Screen name="PassengerRegister" component={PassengerRegisterScreen} />
        <Stack.Screen name="DriverRegister" component={DriverRegisterScreen} />
        <Stack.Screen name="TransporterRegister" component={TransporterRegisterScreen} />
        <Stack.Screen name="TransporterLogin" component={TransporterLoginScreen} />

        {/* 🌟 Passenger Flow */}
                <Stack.Screen name="PassengerLoginScreen" component={PassengerLoginScreen} />
                <Stack.Screen name="PassengerAppNavigation" component={PassengerAppNavigation} />

        {/* 🌟 Transporter Flow */}
        <Stack.Screen name="Transporter" component={TransporterDrawer} />
        <Stack.Screen name="TransporterDashboard" component={TransporterDashboardScreen} />
        <Stack.Screen name="PassengerList" component={PassengerList} />
        <Stack.Screen name="DriverList" component={DriverList} />
        <Stack.Screen name="AddDriver" component={AddDriverScreen} />
        <Stack.Screen name="AddPassenger" component={AddPassengerScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        <Stack.Screen name="VanTracking" component={VanTrackingScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="DriverPerformance" component={DriverPerformance} />
        <Stack.Screen name="PassengerPerformance" component={PassengerPerformance} />
        <Stack.Screen name="CreateRoute" component={RouteAssignment} />
        <Stack.Screen name="SmartScheduling" component={SmartScheduling} />
        <Stack.Screen name="AssignRoute" component={AssignRoutesScreen} />
        <Stack.Screen name="PassengerProfile" component={DriverProfile} />
        <Stack.Screen name="DriverProfile" component={DriverProfile} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ViewResponse" component={ViewResponce} />
        
        {/* 🌟 Driver Flow */}
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
        <Stack.Screen name="VanTrackingdriver" component={DriverTrackingScreen} />
        <Stack.Screen name="CreatePoll" component={CreateDailyPoll} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
