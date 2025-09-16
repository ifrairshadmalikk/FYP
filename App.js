import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Onboarding from "./frontend/screens/Onboarding";
import WelcomeScreen from "./frontend/screens/WelcomeScreen";
import DashboardRegisterScreen from "./frontend/screens/DashboardRegisterScreen";
import PassengerRegisterScreen from "./frontend/screens/PassengerRegisterScreen";
import DriverRegisterScreen from "./frontend/screens/DriverRegisterScreen";
import TransporterRegisterScreen from "./frontend/screens/TransporterRegisterScreen";
import PassengerTransporterSelectionScreen from "./frontend/screens/PassengerTransporterSelectionScreen";
import DriverTransporterSelectionScreen from "./frontend/screens/DriverTransporterSelectionScreen";

// 👇 Login import
import LoginScreen from "./frontend/screens/LoginScreen";

// 👇 Passenger Drawer App import
import PassengerApp from "./frontend/Passenger/PassengerApp";

const Stack = createStackNavigator();

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
        <Stack.Screen name="DashboardRegister" component={DashboardRegisterScreen} />
        <Stack.Screen name="PassengerRegister" component={PassengerRegisterScreen} />
        <Stack.Screen name="DriverRegister" component={DriverRegisterScreen} />
        <Stack.Screen name="TransporterRegister" component={TransporterRegisterScreen} />

        {/* Selection Screens */}
        <Stack.Screen
          name="PassengerTransporterSelection"
          component={PassengerTransporterSelectionScreen}
        />
        <Stack.Screen
          name="DriverTransporterSelection"
          component={DriverTransporterSelectionScreen}
        />

        {/* 👇 Passenger Drawer App (Home + Sidebar Navigation) */}
        <Stack.Screen name="PassengerApp" component={PassengerApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
