import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/TransporterStyles";

export default function TransportDashboard() {
  const navigation = useNavigation();

  const [stats] = useState({
    revenue: "Rs. 66,750",
    passengers: 445,
    drivers: 21,
    responseRate: "87%",
  });

  const quickActions = [
    { id: "1", label: "Send Daily Poll", icon: "paper-plane" },
    { id: "2", label: "View Responses", icon: "eye" },
    { id: "3", label: "Assign Routes", icon: "map" },
    { id: "4", label: "Driver Dashboard", icon: "car" },
  ];

  const networks = [
    {
      id: "1",
      name: "Blue Area Express",
      area: "Blue Area - DHA",
      vans: "8/10",
      passengers: 156,
      revenue: "Rs. 23,400",
      status: "active",
      utilization: 0.8,
    },
    {
      id: "2",
      name: "Gulberg Connect",
      area: "Gulberg - Model Town",
      vans: "6/8",
      passengers: 98,
      revenue: "Rs. 14,700",
      status: "active",
      utilization: 0.75,
    },
    {
      id: "3",
      name: "University Shuttle",
      area: "LUMS - LCP - FAST",
      vans: "4/6",
      passengers: 124,
      revenue: "Rs. 18,600",
      status: "active",
      utilization: 0.67,
    },
    {
      id: "4",
      name: "Defence Route",
      area: "DHA - Cantt",
      vans: "4/7",
      passengers: 67,
      revenue: "Rs. 10,050",
      status: "maintenance",
      utilization: 0.6,
    },
  ];

  const activities = [
    {
      id: "1",
      text: "Daily poll sent to Blue Area Express passengers",
      tag: "Blue Area Express",
      time: "5 mins ago",
      icon: "send",
    },
    {
      id: "2",
      text: "Route assigned to Ahmed Khan for Gulberg morning shift",
      tag: "Gulberg Connect",
      time: "12 mins ago",
      icon: "map",
    },
    {
      id: "3",
      text: "15 passengers picked up from F-8 Markaz",
      tag: "University Shuttle",
      time: "18 mins ago",
      icon: "people",
    },
    {
      id: "4",
      text: "Payment received: Rs. 2,400 from morning shift",
      tag: "Blue Area Express",
      time: "25 mins ago",
      icon: "cash",
    },
  ];

  // Animation setup
  const animatedWidths = networks.map(
    () => useRef(new Animated.Value(0)).current
  );

  useEffect(() => {
    networks.forEach((net, i) => {
      Animated.timing(animatedWidths[i], {
        toValue: net.utilization * 100, // percentage width
        duration: 1000,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transport Control Center</Text>
        <Text style={styles.subtitle}>
          Manage your entire transportation network
        </Text>
        <View style={styles.headerDivider} />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.card}>
          <Ionicons name="cash-outline" size={22} color="#000" />
          <Text style={styles.cardLabel}>Today's Revenue</Text>
          <Text style={styles.cardValue}>{stats.revenue}</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="people-outline" size={22} color="#000" />
          <Text style={styles.cardLabel}>Total Passengers</Text>
          <Text style={styles.cardValue}>{stats.passengers}</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="person-circle-outline" size={22} color="#000" />
          <Text style={styles.cardLabel}>Active Drivers</Text>
          <Text style={styles.cardValue}>{stats.drivers}</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="stats-chart-outline" size={22} color="#000" />
          <Text style={styles.cardLabel}>Response Rate</Text>
          <Text style={styles.cardValue}>{stats.responseRate}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionBtn}
            activeOpacity={0.7}
            onPress={() => {
              if (action.label === "Send Daily Poll") {
                navigation.navigate("CreatePoll");
              } else if (action.label === "Assign Routes") {
                navigation.navigate("AssignRoute");  // 👈 yeh naya screen hoga
              }
            }}

          >
            <Ionicons name={action.icon} size={22} color="#000" />
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Network Status */}
      <Text style={styles.sectionTitle}>Network Status</Text>
      {networks.map((net, i) => (
        <View key={net.id} style={styles.networkCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.networkName}>{net.name}</Text>
            <Text
              style={
                net.status === "active"
                  ? styles.activeBadge
                  : styles.inactiveBadge
              }
            >
              {net.status}
            </Text>
          </View>
          <Text style={styles.networkDetail}>{net.area}</Text>
          <Text style={styles.networkDetail}>Active Vans: {net.vans}</Text>
          <Text style={styles.networkDetail}>
            Passengers: {net.passengers}
          </Text>
          <Text style={styles.networkDetail}>Revenue: {net.revenue}</Text>

          {/* Animated Utilization */}
          <View style={styles.utilizationBar}>
            <Animated.View
              style={[
                styles.utilizationFill,
                {
                  width: animatedWidths[i].interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  })
                },
              ]}
            />
          </View>
        </View>
      ))}

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {activities.map((act) => (
        <View key={act.id} style={styles.activityCard}>
          <View style={styles.rowBetween}>
            <Ionicons name={act.icon} size={20} color="#000" />
            <Text style={styles.activityTime}>{act.time}</Text>
          </View>
          <Text style={styles.activityText}>{act.text}</Text>
          <Text style={styles.activityTag}>{act.tag}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
