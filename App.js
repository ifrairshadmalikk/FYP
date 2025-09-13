import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Onboarding1 from "./frontend/screens/Onboarding1";
import Onboarding2 from "./frontend/screens/Onboarding2";
import Onboarding3 from "./frontend/screens/Onboarding3";
import WelcomeScreen from "./frontend/screens/WelcomeScreen";
import DashboardRegisterScreen from "./frontend/screens/DashboardRegisterScreen";
import PassengerRegisterScreen from "./frontend/screens/PassengerRegisterScreen";
import DriverRegisterScreen from "./frontend/screens/DriverRegisterScreen";
import TransporterRegisterScreen from "./frontend/screens/TransporterRegisterScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="Onboarding3" component={Onboarding3} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register Dashboard" component={DashboardRegisterScreen} />
        <Stack.Screen name="Passenger Register" component={PassengerRegisterScreen} />
        <Stack.Screen name="Driver Register" component={DriverRegisterScreen} />
        <Stack.Screen name="Transporter Register" component={TransporterRegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
