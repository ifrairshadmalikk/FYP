import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "./PassengerApp";
import Tabs from "./Tabs";

const Drawer = createDrawerNavigator();

export default function PassengerDashboard() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Tabs" component={Tabs} />
    </Drawer.Navigator>
  );
}