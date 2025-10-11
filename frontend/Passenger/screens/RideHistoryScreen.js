import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../styles/RideHistoryStyle';

export default function RideHistoryScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [rides, setRides] = useState([
    {
      id: 1,
      date: '2024-01-15',
      time: '7:30 AM',
      route: 'DHA Phase 5 → Saddar',
      driver: 'Muhammad Hassan',
      vehicle: 'Toyota Hiace',
      scheduledTime: '7:15 AM',
      actualTime: '7:30 AM',
      delay: '15 minutes late',
      status: 'completed',
      rating: 4.8,
      missed: false,
    },
    {
      id: 2,
      date: '2024-01-14',
      time: '8:15 AM',
      route: 'DHA Phase 5 → Clifton',
      driver: 'Ali Ahmed',
      vehicle: 'Toyota Hiace',
      scheduledTime: '8:00 AM',
      actualTime: '8:15 AM',
      delay: '15 minutes late',
      status: 'completed',
      rating: 4.5,
      missed: false,
    },
    {
      id: 3,
      date: '2024-01-13',
      time: '7:45 AM',
      route: 'DHA Phase 5 → I.I Chundrigar',
      driver: 'Usman Khan',
      vehicle: 'Toyota Hiace',
      scheduledTime: '7:30 AM',
      actualTime: '7:45 AM',
      delay: '15 minutes late',
      status: 'completed',
      rating: 4.9,
      missed: false,
    },
    {
      id: 4,
      date: '2024-01-12',
      time: '8:00 AM',
      route: 'DHA Phase 5 → Saddar',
      driver: 'Bilal Raza',
      vehicle: 'Toyota Hiace',
      scheduledTime: '7:45 AM',
      actualTime: '8:00 AM',
      delay: '15 minutes late',
      status: 'cancelled',
      rating: null,
      missed: true,
    },
    {
      id: 5,
      date: '2024-01-11',
      time: '8:30 AM',
      route: 'DHA Phase 5 → Clifton',
      driver: 'Ahmed Raza',
      vehicle: 'Toyota Hiace',
      scheduledTime: '8:15 AM',
      actualTime: '8:30 AM',
      delay: '15 minutes late',
      status: 'cancelled',
      rating: null,
      missed: true,
    },
    {
      id: 6,
      date: '2024-01-10',
      time: '7:20 AM',
      route: 'DHA Phase 5 → I.I Chundrigar',
      driver: 'Kamran Ali',
      vehicle: 'Toyota Hiace',
      scheduledTime: '7:15 AM',
      actualTime: '7:20 AM',
      delay: '5 minutes late',
      status: 'completed',
      rating: 4.7,
      missed: false,
    },
  ]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const filters = [
    { id: 'all', label: 'All Rides' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Missed' },
    { id: 'delayed', label: 'Delayed' },
  ];

  const filteredRides = selectedFilter === 'all' 
    ? rides 
    : selectedFilter === 'completed' 
    ? rides.filter(ride => ride.status === 'completed' && !ride.missed)
    : selectedFilter === 'cancelled'
    ? rides.filter(ride => ride.missed)
    : rides.filter(ride => ride.delay && ride.delay !== 'On time' && !ride.missed);

  const getStatusColor = (status, missed) => {
    if (missed) return ['#FF6B6B', '#EE5A52'];
    switch (status) {
      case 'completed': return ['#A1D826', '#8BC220'];
      case 'cancelled': return ['#FF6B6B', '#EE5A52'];
      default: return ['#A1D826', '#8BC220'];
    }
  };

  const getStatusIcon = (status, missed) => {
    if (missed) return 'close-circle';
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'cancelled': return 'close-circle';
      default: return 'time';
    }
  };

  const getStatusText = (status, missed) => {
    if (missed) return 'Missed';
    switch (status) {
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };

  const renderRideCard = ({ item, index }) => (
    <Animated.View
      style={[
        styles.rideCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.routeContainer}>
          <Text style={styles.routeText}>{item.route}</Text>
          <View style={[styles.statusBadge, item.missed && styles.missedBadge]}>
            <Text style={styles.statusText}>
              {getStatusText(item.status, item.missed)}
            </Text>
          </View>
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.timeInfo}>
          <View style={styles.timeRow}>
            <Icon name="time-outline" size={16} color="#666" />
            <Text style={styles.timeLabel}>Scheduled:</Text>
            <Text style={styles.timeValue}>{item.scheduledTime}</Text>
          </View>
          <View style={styles.timeRow}>
            <Icon name="time" size={16} color="#666" />
            <Text style={styles.timeLabel}>Actual:</Text>
            <Text style={styles.timeValue}>{item.actualTime}</Text>
          </View>
        </View>

        <View style={styles.delayInfo}>
          <Icon 
            name={item.missed ? "alert-circle" : "time"} 
            size={16} 
            color={item.missed ? "#FF6B6B" : "#FFA500"} 
          />
          <Text style={[
            styles.delayText,
            item.missed ? styles.missedText : styles.delayedText
          ]}>
            {item.missed ? 'You missed this ride' : item.delay}
          </Text>
        </View>

        <View style={styles.driverInfo}>
          <View style={styles.driverDetail}>
            <Icon name="person-outline" size={14} color="#666" />
            <Text style={styles.driverText}>{item.driver}</Text>
          </View>
          <View style={styles.driverDetail}>
            <Icon name="car-outline" size={14} color="#666" />
            <Text style={styles.driverText}>{item.vehicle}</Text>
          </View>
        </View>

        {item.rating && !item.missed && (
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.ratingLabel}>Driver Rating</Text>
          </View>
        )}
      </View>

      {item.missed && (
        <View style={styles.missedOverlay}>
          <Text style={styles.missedMessage}>This ride was missed</Text>
        </View>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#A1D826', '#8BC220']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride History</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Icon name="download-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Filter Tabs - Fixed */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContentContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                selectedFilter === filter.id && styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredRides}
        renderItem={renderRideCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="car-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No rides found</Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedFilter === 'all' 
                ? 'You haven\'t taken any rides yet' 
                : `No ${selectedFilter} rides found`}
            </Text>
          </View>
        }
      />
    </View>
  );
}