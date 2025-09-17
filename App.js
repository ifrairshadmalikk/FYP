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

import LoginScreen from "./frontend/screens/LoginScreen";

import PassengerList from "./frontend/Transporter/PassengerList";
import DriverList from "./frontend/Transporter/DriverList";
import AddDriver from "./frontend/Transporter/AddDriverScreen";
import AddPassenger from "./frontend/Transporter/AddPassengerScreen";
import ManageRecords from "./frontend/Transporter/ManageRecordsScreen";
import Payments from "./frontend/Transporter/PaymentsScreen";
import VanTracking from "./frontend/Transporter/VanTrackingScreen";
import Alerts from "./frontend/Transporter/AlertsScreen";
import DriverPerformance from "./frontend/Transporter/DriverPerformance";
import PassengerPerformance from "./frontend/Transporter/PassengerPerformance";
import RouteAssignment from "./frontend/Transporter/RouteAssignment";
import SmartScheduling from "./frontend/Transporter/SmartScheduling";
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
        
        {/* Passenger App */}
        <Stack.Screen name="PassengerApp" component={PassengerApp} />

        {/* Transporter Screens */}
        
        <Stack.Screen name="Add Driver" component={AddDriverScreen} />
        <Stack.Screen name="Add Passenger" component={AddPassengerScreen} />
        <Stack.Screen name="Manage Records" component={ManageRecordsScreen} />
        
        <Stack.Screen name="Van Tracking" component={VanTrackingScreen} />
       
      
        <Stack.Screen name="PassengerList" component={PassengerList} />
        <Stack.Screen name="DriverList" component={DriverList} />
        <Stack.Screen name="AddDriver" component={AddDriver} />
        <Stack.Screen name="AddPassenger" component={AddPassenger} />
        <Stack.Screen name="ManageRecords" component={ManageRecords} />
        <Stack.Screen name="Payments" component={Payments} />
        <Stack.Screen name="VanTracking" component={VanTracking} />
        <Stack.Screen name="Alerts" component={Alerts} />
        <Stack.Screen name="DriverPerformance" component={DriverPerformance} />
        <Stack.Screen name="PassengerPerformance" component={PassengerPerformance} />
        <Stack.Screen name="RouteAssignment" component={RouteAssignment} />
        <Stack.Screen name="SmartScheduling" component={SmartScheduling} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
