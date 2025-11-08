import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  FlatList,
  Alert as RNAlert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../styles/AlertStyle';

const API_BASE_URL = 'http://192.168.0.109:5001/api'; // اپنا سرور URL استعمال کریں

export default function AlertsScreen({ navigation }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [counts, setCounts] = useState({
    total: 0,
    unread: 0,
    actionRequired: 0
  });

  const blinkAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Animation effects
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

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

  // Fetch alerts from backend
  const fetchAlerts = async (category = selectedCategory) => {
    try {
      const token = await getAuthToken(); // اپنا token management function استعمال کریں
      
      let url = `${API_BASE_URL}/alerts`;
      if (category !== 'all') {
        url += `?category=${category}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setAlerts(data.alerts);
        setCounts(data.counts);
      } else {
        RNAlert.alert('Error', data.message || 'Failed to fetch alerts');
      }
    } catch (error) {
      console.error('Fetch alerts error:', error);
      RNAlert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Category change effect
  useEffect(() => {
    if (!loading) {
      fetchAlerts(selectedCategory);
    }
  }, [selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Alerts', icon: 'notifications' },
    { id: 'travel', label: 'Travel', icon: 'car' },
    { id: 'payment', label: 'Payment', icon: 'card' },
    { id: 'ride', label: 'Ride Updates', icon: 'bus' },
    { id: 'driver', label: 'Driver', icon: 'person' },
    { id: 'route', label: 'Route', icon: 'navigate' },
    { id: 'system', label: 'System', icon: 'settings' },
  ];

  const markAsRead = async (id) => {
    try {
      const token = await getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/alerts/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setAlerts(alerts.map(alert => 
          alert.id === id ? { ...alert, read: true } : alert
        ));
        // Refresh counts
        fetchAlerts();
      } else {
        RNAlert.alert('Error', data.message || 'Failed to mark as read');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      RNAlert.alert('Error', 'Network error. Please try again.');
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/alerts/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update all alerts to read
        setAlerts(alerts.map(alert => ({ ...alert, read: true })));
        // Refresh counts
        fetchAlerts();
        RNAlert.alert('Success', 'All alerts marked as read');
      } else {
        RNAlert.alert('Error', data.message || 'Failed to mark all as read');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      RNAlert.alert('Error', 'Network error. Please try again.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'urgent': return ['#FF6B6B', '#EE5A52'];
      case 'warning': return ['#FFA726', '#FF9800'];
      case 'success': return ['#A1D826', '#8BC220'];
      case 'info': return ['#5AC8FA', '#4AB9F1'];
      default: return ['#A1D826', '#8BC220'];
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'urgent': return 'warning';
      case 'warning': return 'alert-circle';
      case 'success': return 'checkmark-circle';
      case 'info': return 'information-circle';
      default: return 'notifications';
    }
  };

  const renderCategoryTab = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item.id && styles.categoryTabActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Icon 
        name={item.icon} 
        size={18} 
        color={selectedCategory === item.id ? '#fff' : '#7f8c8d'} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderAlertItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.alertCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      {/* Alert Header */}
      <View style={styles.alertHeader}>
        <View style={styles.alertIconContainer}>
          <LinearGradient
            colors={getAlertColor(item.type)}
            style={styles.alertIcon}
          >
            <Icon name={item.icon || getAlertIcon(item.type)} size={20} color="#fff" />
          </LinearGradient>
          <View style={styles.alertTitleContainer}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <View style={styles.alertMeta}>
              <Text style={styles.alertTime}>{item.date} • {item.time}</Text>
              {item.actionRequired && (
                <View style={styles.actionRequiredBadge}>
                  <Text style={styles.actionRequiredText}>Action Required</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        {!item.read && (
          <Animated.View 
            style={[
              styles.unreadIndicator,
              { opacity: blinkAnim }
            ]} 
          />
        )}
      </View>

      {/* Alert Body */}
      <View style={styles.alertBody}>
        <Text style={styles.alertMessage}>{item.message}</Text>
      </View>

      {/* Alert Footer */}
      <View style={styles.alertFooter}>
        <View style={styles.alertActions}>
          {!item.read && (
            <TouchableOpacity 
              style={styles.markReadBtn}
              onPress={() => markAsRead(item.id)}
            >
              <LinearGradient
                colors={['#A1D826', '#8BC220']}
                style={styles.markReadGradient}
              >
                <Icon name="checkmark" size={14} color="#fff" />
                <Text style={styles.markReadText}>Mark Read</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          {item.actionRequired && (
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionText}>Take Action</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Unread Border */}
      {!item.read && (
        <View style={styles.unreadBorder} />
      )}
    </Animated.View>
  );

  const filteredAlerts = alerts; // اب فیلٹرنگ بیک اینڈ میں ہو رہی ہے

  return (
    <View style={styles.container}>
      {/* Header */}
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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Alerts & Notifications</Text>
          {counts.unread > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>{counts.unread}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={markAllAsRead}
        >
          <Icon name="checkmark-done" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Action Required Banner */}
      {counts.actionRequired > 0 && (
        <View style={styles.actionBanner}>
          <Icon name="warning" size={20} color="#FFA726" />
          <Text style={styles.actionBannerText}>
            {counts.actionRequired} alert{counts.actionRequired !== 1 ? 's' : ''} require your attention
          </Text>
        </View>
      )}

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryTab}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Alerts Count */}
      <View style={styles.alertsCount}>
        <Text style={styles.countText}>
          {counts.total} alert{counts.total !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${categories.find(cat => cat.id === selectedCategory)?.label}`}
        </Text>
        <TouchableOpacity onPress={() => setRefreshing(true)}>
          <Icon name="refresh" size={16} color="#7f8c8d" />
        </TouchableOpacity>
      </View>

      {/* Alerts List */}
      <FlatList
        data={filteredAlerts}
        renderItem={renderAlertItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#A1D826']}
            tintColor={'#A1D826'}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="notifications-off" size={64} color="#e9ecef" />
            <Text style={styles.emptyStateTitle}>
              {loading ? 'Loading...' : 'No Alerts'}
            </Text>
            <Text style={styles.emptyStateText}>
              {loading 
                ? 'Fetching your alerts...' 
                : selectedCategory === 'all' 
                  ? "You're all caught up!" 
                  : `No ${categories.find(cat => cat.id === selectedCategory)?.label?.toLowerCase()} alerts`
              }
            </Text>
          </View>
        }
      />

      {/* Mark All as Read FAB */}
      {counts.unread > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={markAllAsRead}
        >
          <LinearGradient
            colors={['#FF6B6B', '#EE5A52']}
            style={styles.fabGradient}
          >
            <Icon name="checkmark-done" size={18} color="#fff" />
            <Text style={styles.fabText}>Mark All Read</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Helper function to get auth token (اپنے token storage کے مطابق اپ ڈیٹ کریں)
const getAuthToken = async () => {
  
  return 'your-auth-token-here';
};