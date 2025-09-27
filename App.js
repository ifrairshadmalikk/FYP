import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Common Screens
import Onboarding from "./frontend/screens/Onboarding";
import WelcomeScreen from "./frontend/screens/WelcomeScreen";
import LoginScreen from "./frontend/screens/LoginScreen";
import DashboardRegisterScreen from "./frontend/screens/DashboardRegisterScreen";
import PassengerRegisterScreen from "./frontend/screens/PassengerRegisterScreen";
import DriverRegisterScreen from "./frontend/screens/DriverRegisterScreen";
import TransporterRegisterScreen from "./frontend/screens/TransporterRegisterScreen";
import PassengerTransporterSelectionScreen from "./frontend/screens/PassengerTransporterSelectionScreen";
import TransporterLoginScreen from "./frontend/screens/TransporterLoginScreen"; 
// Passenger App
import PassengerApp from "./frontend/Passenger/PassengerApp";
import PassengerLoginScreen from "./frontend/Passenger/PassengerLoginScreen";
// Transporter Screens
import TransporterDashboardScreen from "./frontend/Transporter/TransporterDashboard";
import PassengerList from "./frontend/Transporter/PassengerList";
import DriverList from "./frontend/Transporter/DriverList";
import AddDriverScreen from "./frontend/Transporter/AddDriverScreen";
import AddPassengerScreen from "./frontend/Transporter/AddPassengerScreen";
import ManageRecordsScreen from "./frontend/Transporter/ManageRecordsScreen";
import PaymentsScreen from "./frontend/Transporter/PaymentsScreen";
import VanTrackingScreen from "./frontend/Transporter/VanTrackingScreen";
import AlertsScreen from "./frontend/Transporter/AlertsScreen";
import DriverPerformance from "./frontend/Transporter/DriverPerformance";
import PassengerPerformance from "./frontend/Transporter/PassengerPerformance";
import RouteAssignment from "./frontend/Transporter/RouteAssignment";
import SmartScheduling from "./frontend/Transporter/SmartScheduling";
import CreateDailyPoll from "./frontend/Transporter/CreateDailyPoll"

//Driver
import DriverDashboard from "./frontend/Driver/DriverDashboard";
import DriverTrackingScreen from "./frontend/Driver/DriverTrackingScreen";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Initial Flow */}
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Registration Flow */}
        <Stack.Screen name="DashboardRegister" component={DashboardRegisterScreen} />
        <Stack.Screen name="PassengerRegister" component={PassengerRegisterScreen} />
        <Stack.Screen name="DriverRegister" component={DriverRegisterScreen} />
        <Stack.Screen name="TransporterRegister" component={TransporterRegisterScreen} />
        <Stack.Screen name="TransporterLogin" component={TransporterLoginScreen} />
        {/* Passenger Flow */}
        <Stack.Screen name="PassengerTransporterSelection" component={PassengerTransporterSelectionScreen} />
        <Stack.Screen name="PassengerApp" component={PassengerApp} />
        <Stack.Screen name="PassengerLoginScreen"  component={PassengerLoginScreen}                />
        

        {/* Transporter Flow */}
       <Stack.Screen name="TransporterDashboard" component={TransporterDashboardScreen} />
        <Stack.Screen name="PassengerList" component={PassengerList} />
        <Stack.Screen name="DriverList" component={DriverList} />
        <Stack.Screen name="Add Driver" component={AddDriverScreen} />
        <Stack.Screen name="AddPassenger" component={AddPassengerScreen} />
        <Stack.Screen name="Manage Records" component={ManageRecordsScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        <Stack.Screen name="Van Tracking" component={VanTrackingScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="DriverPerformance" component={DriverPerformance} />
        <Stack.Screen name="PassengerPerformance" component={PassengerPerformance} />
        <Stack.Screen name="RouteAssignment" component={RouteAssignment} />
        <Stack.Screen name="SmartScheduling" component={SmartScheduling} />
{/*Driver*/}
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
        <Stack.Screen name="VanTrackingdriver" component={DriverTrackingScreen} />
        <Stack.Screen name="CreatePoll" component={CreateDailyPoll} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
