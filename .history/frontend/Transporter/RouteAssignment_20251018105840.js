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
      <StatusBar backgroundColor="#2D3748" barStyle="light-content" />

      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route Assignment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Route Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create New Route</Text>
          <TextInput
            placeholder="Route Name"
            placeholderTextColor="#A0AEC0"
            value={routeName}
            onChangeText={setRouteName}
            style={styles.input}
          />
        </View>

        {/* Stops Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Stops</Text>
          <TextInput 
            placeholder="Passenger Name" 
            placeholderTextColor="#A0AEC0"
            value={stopPassenger} 
            onChangeText={setStopPassenger} 
            style={styles.input} 
          />
          <TextInput 
            placeholder="Pickup Location" 
            placeholderTextColor="#A0AEC0"
            value={stopPickup} 
            onChangeText={setStopPickup} 
            style={styles.input} 
          />
          <TextInput 
            placeholder="Drop Location" 
            placeholderTextColor="#A0AEC0"
            value={stopDrop} 
            onChangeText={setStopDrop} 
            style={styles.input} 
          />

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={addStop}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Stop</Text>
          </TouchableOpacity>

          {/* Current Stops List */}
          {currentStops.length > 0 && (
            <View style={styles.currentStopsContainer}>
              <Text style={styles.stopsSubtitle}>Current Stops:</Text>
              {currentStops.map((stop, index) => (
                <View key={index} style={styles.stopItem}>
                  <View style={styles.stopIndicator}>
                    <Text style={styles.stopNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.stopDetails}>
                    <Text style={styles.passengerName}>{stop.passenger}</Text>
                    <View style={styles.routePath}>
                      <Text style={styles.locationText}>{stop.pickup}</Text>
                      <Ionicons name="arrow-forward" size={16} color="#4A5568" />
                      <Text style={styles.locationText}>{stop.drop}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Add Route Button */}
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={addRoute}>
          <Ionicons name="map-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Create Route</Text>
        </TouchableOpacity>

        {/* Existing Routes */}
        {routes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Existing Routes</Text>
            {routes.map((route) => (
              <View key={route.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="bus" size={20} color="#4C51BF" />
                  <Text style={styles.routeName}>{route.routeName}</Text>
                </View>
                <View style={styles.cardContent}>
                  {route.stops.map((stop, idx) => (
                    <View key={idx} style={styles.routeStop}>
                      <View style={styles.stopDot} />
                      <View style={styles.stopContent}>
                        <Text style={styles.stopPassenger}>{stop.passenger}</Text>
                        <View style={styles.stopRoute}>
                          <Text style={styles.stopLocation}>{stop.pickup}</Text>
                          <Ionicons name="arrow-forward" size={14} color="#718096" />
                          <Text style={styles.stopLocation}>{stop.drop}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  headerContainer: {
    height: 60,
    backgroundColor: "#2D3748",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  placeholder: {
    width: 70, // Adjusted to account for back button text
  },
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 16,
  },
  stopsSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 12,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#2D3748",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: "#4C51BF",
  },
  secondaryButton: {
    backgroundColor: "#38B2AC",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  currentStopsContainer: {
    marginTop: 8,
  },
  stopItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#38B2AC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  stopIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#38B2AC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stopNumber: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  stopDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 2,
  },
  routePath: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: 12,
    color: "#718096",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 0,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F7FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 8,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
  },
  cardContent: {
    padding: 16,
  },
  routeStop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4C51BF",
    marginTop: 6,
    marginRight: 12,
  },
  stopContent: {
    flex: 1,
  },
  stopPassenger: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 2,
  },
  stopRoute: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stopLocation: {
    fontSize: 12,
    color: "#718096",
  },
});