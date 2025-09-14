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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register Dashboard" component={DashboardRegisterScreen} />
        <Stack.Screen name="Passenger Register" component={PassengerRegisterScreen} />
        <Stack.Screen name="Driver Register" component={DriverRegisterScreen} />
        <Stack.Screen name="Transporter Register" component={TransporterRegisterScreen} />
         <Stack.Screen
          name="PassengerTransporterSelection"
          component={PassengerTransporterSelectionScreen}
        />
        <Stack.Screen
          name="DriverTransporterSelection"
          component={PassengerTransporterSelectionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
