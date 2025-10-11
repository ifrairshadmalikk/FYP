import React, { useState } from "react";
import { 
  View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, 
  ScrollView, TouchableOpacity, TextInput 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RouteAssignment({ navigation }) {
  const [routes, setRoutes] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [stopPassenger, setStopPassenger] = useState("");
  const [stopPickup, setStopPickup] = useState("");
  const [stopDrop, setStopDrop] = useState("");
  const [currentStops, setCurrentStops] = useState([]);

  const addStop = () => {
    if (stopPassenger && stopPickup && stopDrop) {
      setCurrentStops([...currentStops, { passenger: stopPassenger, pickup: stopPickup, drop: stopDrop }]);
      setStopPassenger("");
      setStopPickup("");
      setStopDrop("");
    }
  };

  const addRoute = () => {
    if (routeName && currentStops.length > 0) {
      setRoutes([...routes, { id: Date.now(), routeName, stops: currentStops }]);
      setRouteName("");
      setCurrentStops([]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#afd826" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route Assignment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="Route Name"
          value={routeName}
          onChangeText={setRouteName}
          style={styles.input}
        />

        <Text style={styles.stopsTitle}>Add Stops:</Text>
        <TextInput 
          placeholder="Passenger Name" 
          value={stopPassenger} 
          onChangeText={setStopPassenger} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Pickup Location" 
          value={stopPickup} 
          onChangeText={setStopPickup} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Drop Location" 
          value={stopDrop} 
          onChangeText={setStopDrop} 
          style={styles.input} 
        />

        <TouchableOpacity style={styles.addButton} onPress={addStop}>
          <Text style={styles.buttonText}>Add Stop</Text>
        </TouchableOpacity>

        {currentStops.map((stop, index) => (
          <Text key={index} style={styles.stop}>
            - {stop.passenger}: {stop.pickup} → {stop.drop}
          </Text>
        ))}

        <TouchableOpacity style={styles.addRouteButton} onPress={addRoute}>
          <Text style={styles.buttonText}>Add Route</Text>
        </TouchableOpacity>

        <Text style={styles.existingRoutesTitle}>Existing Routes:</Text>
        {routes.map((route) => (
          <View key={route.id} style={styles.card}>
            <Text style={styles.routeName}>{route.routeName}</Text>
            {route.stops.map((stop, idx) => (
              <Text key={idx} style={styles.stop}>
                - {stop.passenger}: {stop.pickup} → {stop.drop}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, backgroundColor: "#F9FAFB",
  },
  headerContainer: { height: 60, backgroundColor: "#afd826", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  container: { padding: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 10 },
  stopsTitle: { fontSize: 16, fontWeight: "700", marginTop: 10, marginBottom: 5 },
  stop: { fontSize: 14, color: "#555", marginLeft: 10, marginBottom: 4 },
  addButton: { backgroundColor: "#afd826", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginVertical: 8 },
  addRouteButton: { backgroundColor: "#afd826", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginVertical: 12 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  existingRoutesTitle: { fontSize: 16, fontWeight: "700", marginTop: 20, marginBottom: 10 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 12, elevation: 3 },
  routeName: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
});


