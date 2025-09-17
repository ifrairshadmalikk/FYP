import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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

// Passenger App
import PassengerApp from "./frontend/Passenger/PassengerApp";


import AddDriverScreen from "./frontend/Transporter/AddDriverScreen";
import AddPassengerScreen from "./frontend/Transporter/AddPassengerScreen";
import ManageRecordsScreen from "./frontend/Transporter/ManageRecordsScreen";
import PaymentsScreen from "./frontend/Transporter/PaymentsScreen";
import VanTrackingScreen from "./frontend/Transporter/VanTrackingScreen";
import AlertsScreen from "./frontend/Transporter/AlertsScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Transporter Register"
          component={TransporterRegisterScreen}
        />
        {/* Onboarding Flow */}
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/* Login */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Registration Flow */}
        <Stack.Screen
          name="DashboardRegisterScreen"
          component={DashboardRegisterScreen}
        />
        <Stack.Screen
          name="PassengerRegister"
          component={PassengerRegisterScreen}
        />
        <Stack.Screen
          name="DriverRegister"
          component={DriverRegisterScreen}
        />
        

        {/* Selection Screens */}
        <Stack.Screen
          name="PassengerTransporterSelection"
          component={PassengerTransporterSelectionScreen}
        />
        <Stack.Screen
          name="DriverTransporterSelection"
          component={DriverTransporterSelectionScreen}
        />

        {/* Passenger App */}
        <Stack.Screen name="PassengerApp" component={PassengerApp} />

        {/* Transporter Screens */}
        
        <Stack.Screen name="Add Driver" component={AddDriverScreen} />
        <Stack.Screen name="Add Passenger" component={AddPassengerScreen} />
        <Stack.Screen name="Manage Records" component={ManageRecordsScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        <Stack.Screen name="Van Tracking" component={VanTrackingScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
