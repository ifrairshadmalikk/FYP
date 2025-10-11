import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import styles from "../../styles/PassengerDashboardStyle";
import { LinearGradient } from 'expo-linear-gradient';

export default function PassengerDashboard({ navigation }) {
  const [showTravelAlert, setShowTravelAlert] = useState(true);
  const [showArrivalAlert, setShowArrivalAlert] = useState(true);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello, I'm your driver!", fromDriver: true, time: "7:15 AM" },
    { id: 2, text: "Hi! When will you arrive?", fromDriver: false, time: "7:16 AM" },
  ]);
  const [inputText, setInputText] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const mapMarkerAnim = useRef(new Animated.Value(0)).current;
  const callRingAnim = useRef(new Animated.Value(0)).current;
  const travelAlertSlideAnim = useRef(new Animated.Value(-100)).current;
  const arrivalAlertSlideAnim = useRef(new Animated.Value(-100)).current;
  const travelAlertPulseAnim = useRef(new Animated.Value(1)).current;
  const arrivalAlertPulseAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);

  const nextTrip = {
    startTime: "7:30 AM",
    route: "DHA Phase 5 → Saddar",
    pickupPoint: "Main Gate, DHA Phase 5",
    estimatedArrival: "5 mins",
  };

  const driver = {
    name: "Muhammad Hassan",
    rating: 4.8,
    vehicleNumber: "KHI-2024",
    vehicleModel: "Toyota Hiace 2022",
    totalTrips: 1250,
    phone: "+92 300 1234567",
  };

  // Enhanced Animations
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Card slide up animation
    Animated.spring(cardAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Alert slide in animations
    Animated.timing(travelAlertSlideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.timing(arrivalAlertSlideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Alert pulse animations (continuous until dismissed)
    if (showTravelAlert) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(travelAlertPulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(travelAlertPulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }

    if (showArrivalAlert) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrivalAlertPulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(arrivalAlertPulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }

    // Blink animation for alerts
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 800, useNativeDriver: false }),
      ])
    ).start();

    // Pulse animation for map marker
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Map marker bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(mapMarkerAnim, { toValue: -10, duration: 500, useNativeDriver: true }),
        Animated.timing(mapMarkerAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Call ring animation
  useEffect(() => {
    if (callModalVisible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(callRingAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(callRingAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      callRingAnim.setValue(0);
    }
  }, [callModalVisible]);

  const blinkOpacity = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const ringScale = callRingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const confirmTravel = () => {
    // Stop pulse animation first
    travelAlertPulseAnim.stopAnimation();
    Animated.timing(travelAlertPulseAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(travelAlertSlideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowTravelAlert(false));
  };

  const dismissTravelAlert = () => {
    // Stop pulse animation first
    travelAlertPulseAnim.stopAnimation();
    Animated.timing(travelAlertPulseAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(travelAlertSlideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowTravelAlert(false));
  };

  const dismissArrivalAlert = () => {
    // Stop pulse animation first
    arrivalAlertPulseAnim.stopAnimation();
    Animated.timing(arrivalAlertPulseAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(arrivalAlertSlideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowArrivalAlert(false));
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const newMsg = {
        id: chatMessages.length + 1,
        text: inputText,
        fromDriver: false,
        time: currentTime,
      };
      setChatMessages([...chatMessages, newMsg]);
      setInputText("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleAlertNavigation = () => {
    navigation.navigate('AlertScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#A1D826', '#8BC220']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity 
          style={styles.notificationWrapper}
          onPress={handleAlertNavigation} 
        >
          <Icon name="notifications" size={26} color="#fff" />
          {(showTravelAlert || showArrivalAlert) && (
            <Animated.View style={[styles.blinkDot, { opacity: blinkOpacity }]} />
          )}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Alerts with Independent Animations */}
        {showTravelAlert && (
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [
              { translateY: travelAlertSlideAnim },
              { translateY: cardTranslateY },
              { scale: travelAlertPulseAnim }
            ] 
          }}>
            <LinearGradient
              colors={['#FF6B6B', '#EE5A52']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.alertBox}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Icon name="time" size={26} color="#fff" />
              </Animated.View>
              <View style={styles.alertTextBox}>
                <Text style={styles.alertTitle}>Tomorrow Travel Confirmation</Text>
                <Text style={styles.alertText}>Will you travel tomorrow?</Text>
                <View style={styles.alertButtons}>
                  <TouchableOpacity style={styles.confirmBtn} onPress={confirmTravel}>
                    <Icon name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.btnText}>Yes, Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallCancelBtn}
                    onPress={dismissTravelAlert}
                  >
                    <Icon name="close-circle" size={18} color="#fff" />
                    <Text style={styles.btnText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {showArrivalAlert && (
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [
              { translateY: arrivalAlertSlideAnim },
              { translateY: cardTranslateY },
              { scale: arrivalAlertPulseAnim }
            ],
            marginTop: showTravelAlert ? 15 : 20 // Adjust spacing based on other alert
          }}>
            <LinearGradient
              colors={['#FF6B6B', '#EE5A52']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.alertBox}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Icon name="bus" size={26} color="#fff" />
              </Animated.View>
              <View style={styles.alertTextBox}>
                <Text style={styles.alertTitle}>Van Arriving Soon!</Text>
                <Text style={styles.alertText}>
                  Your van is {nextTrip.estimatedArrival} away. Please be ready!
                </Text>
                <TouchableOpacity
                  style={styles.smallConfirmBtn}
                  onPress={dismissArrivalAlert}
                >
                  <Icon name="checkmark-done" size={18} color="#fff" />
                  <Text style={styles.btnText}>I'm Ready</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Today's Trip Details with Gradient Heading Only */}
        <Animated.View style={{ 
          transform: [{ translateY: cardTranslateY }],
          marginTop: (!showTravelAlert && !showArrivalAlert) ? 20 : 15 // Adjust top margin based on alerts
        }}>
          <View style={styles.sectionCard}>
            {/* Only heading has gradient background */}
            <LinearGradient
              colors={['#A1D826', '#8BC220']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sectionHeaderGradient}
            >
              <View style={styles.sectionTitleContainer}>
                <Icon name="car" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Today's Trip Details</Text>
              </View>
            </LinearGradient>

            <View style={styles.tripCardContainer}>
              {/* Rest of the content remains white */}
              <View style={styles.tripCard}>
                <Icon name="time" size={24} color="#A1D826" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.tripCardTitle}>Start Time</Text>
                  <Text style={styles.tripCardText}>{nextTrip.startTime}</Text>
                </View>
              </View>

              <View style={styles.tripCard}>
                <Icon name="navigate" size={24} color="#A1D826" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.tripCardTitle}>Route</Text>
                  <Text style={styles.tripCardText}>{nextTrip.route}</Text>
                </View>
              </View>

              <View style={styles.tripCard}>
                <Icon name="pin" size={24} color="#A1D826" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.tripCardTitle}>Pickup Point</Text>
                  <Text style={styles.tripCardText}>{nextTrip.pickupPoint}</Text>
                </View>
              </View>

              <View style={styles.tripCard}>
                <Icon name="people" size={24} color="#A1D826" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.tripCardTitle}>Total Passengers Today</Text>
                  <Text style={styles.tripCardText}>20 Passengers</Text>
                </View>
              </View>
            </View>

            {/* Map section - white background */}
            <View style={styles.mapWrapper}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 24.8607,
                  longitude: 67.0011,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{ latitude: 24.8607, longitude: 67.0011 }}
                  title="Your Van"
                  description="On route to Saddar"
                >
                  <Animated.View style={{ 
                    transform: [
                      { translateY: mapMarkerAnim },
                      { scale: pulseAnim }
                    ] 
                  }}>
                    <Icon name="car" size={32} color="#A1D826" />
                  </Animated.View>
                </Marker>
              </MapView>
             <View style={styles.mapNote}>
  <Icon name="information-circle" size={18} color="#FFA726" />
  <Text style={styles.noteText}>
    Van arriving in {nextTrip.estimatedArrival}
  </Text>
</View>
            </View>
          </View>
        </Animated.View>

        {/* Your Driver with Gradient Heading Only */}
        <Animated.View style={{ transform: [{ translateY: cardTranslateY }] }}>
          <View style={styles.sectionCard}>
            {/* Only heading has gradient background */}
            <LinearGradient
              colors={['#A1D826', '#8BC220']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sectionHeaderGradient}
            >
              <View style={styles.sectionTitleContainer}>
                <Icon name="person" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Your Driver</Text>
              </View>
            </LinearGradient>

            {/* Driver content - white background */}
            <View style={styles.driverBox}>
              <View style={styles.driverCircle}>
                <Text style={styles.driverInitials}>MH</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <View style={styles.ratingRow}>
                  <Icon name="star" size={14} color="#FFD700" />
                  <Text style={styles.driverSub}> {driver.rating} • {driver.totalTrips} trips</Text>
                </View>
                <Text style={styles.driverSub}>{driver.vehicleModel}</Text>
                <Text style={styles.driverSub}>{driver.vehicleNumber}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Enhanced Call Modal */}
      <Modal visible={callModalVisible} transparent animationType="fade">
        <View style={styles.callModalOverlay}>
          <Animated.View style={[styles.callModalContent, { transform: [{ scale: ringScale }] }]}>
            <LinearGradient
              colors={['#A1D826', '#8BC220']}
              style={styles.callerAvatar}
            >
              <Text style={styles.callerInitials}>MH</Text>
            </LinearGradient>

            <Text style={styles.callerName}>{driver.name}</Text>
            <Text style={styles.callerInfo}>Driver • {driver.vehicleNumber}</Text>
            <Text style={styles.callingText}>Calling...</Text>

            <View style={styles.callActions}>
              <TouchableOpacity onPress={() => setCallModalVisible(false)}>
                <LinearGradient
                  colors={['#FF6B6B', '#EE5A52']}
                  style={styles.endCallBtn}
                >
                  <Icon name="call" size={32} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity>
                <LinearGradient
                  colors={['#A1D826', '#8BC220']}
                  style={styles.answerCallBtn}
                >
                  <Icon name="call" size={32} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Enhanced Chat Modal */}
      <Modal visible={chatModalVisible} animationType="slide">
        <View style={styles.chatContainer}>
          <LinearGradient
            colors={['#A1D826', '#8BC220']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.chatHeader}
          >
            <TouchableOpacity onPress={() => setChatModalVisible(false)}>
              <Icon name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={styles.chatDriverCircle}>
              <Text style={styles.chatDriverInitials}>MH</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatHeaderTitle}>{driver.name}</Text>
              <Text style={styles.chatHeaderSubtitle}>Driver</Text>
            </View>
            <TouchableOpacity>
              <Icon name="videocam" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          <FlatList
            ref={flatListRef}
            data={chatMessages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.messageWrapper}>
                <View
                  style={[
                    styles.chatBubble,
                    item.fromDriver ? styles.driverBubble : styles.userBubble,
                  ]}
                >
                  <Text style={styles.chatText}>{item.text}</Text>
                  <Text style={styles.chatTime}>{item.time}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={{ padding: 15 }}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={80}
          >
            <View style={styles.chatInputBox}>
              <TouchableOpacity style={styles.attachBtn}>
                <Icon name="add-circle" size={28} color="#A1D826" />
              </TouchableOpacity>
              <TextInput
                style={styles.chatInput}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity onPress={sendMessage}>
                <LinearGradient
                  colors={['#A1D826', '#8BC220']}
                  style={styles.sendButton}
                >
                  <Icon name="send" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}