import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  RefreshControl,
  Alert as RNAlert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../styles/NotificationScreenStyle';

const API_BASE_URL = 'http://192.168.0.109:5001/api';

const categories = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'payment', label: 'Payments', icon: 'card' },
  { id: 'trip', label: 'Trips', icon: 'car' },
  { id: 'driver', label: 'Drivers', icon: 'person' },
  { id: 'system', label: 'System', icon: 'settings' },
];

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [counts, setCounts] = useState({
    total: 0,
    unread: 0
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

    fetchNotifications();
  }, []);

  // Fetch notifications from backend (बिना token के)
  const fetchNotifications = async (category = selectedCategory) => {
    try {
      let url = `${API_BASE_URL}/notifications`;
      if (category !== 'all') {
        url += `?category=${category}`;
      }

      console.log('📡 Fetching notifications from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Notifications response status:', response.status);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications || []);
        setCounts(data.counts || { total: 0, unread: 0 });
        console.log(`✅ Loaded ${data.notifications?.length || 0} notifications`);
      } else {
        throw new Error(data.message || 'Failed to load notifications');
      }

    } catch (error) {
      console.error('❌ Fetch notifications error:', error);
      RNAlert.alert(
        'Connection Error', 
        'Please make sure server is running on http://192.168.0.109:5001'
      );
      setNotifications([]);
      setCounts({ total: 0, unread: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Category change effect
  useEffect(() => {
    if (!loading) {
      fetchNotifications(selectedCategory);
    }
  }, [selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setNotifications(notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        ));
        // Update counts
        setCounts(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1)
        }));
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update all notifications to read
        setNotifications(notifications.map(notification => ({ 
          ...notification, 
          read: true 
        })));
        // Update counts
        setCounts(prev => ({
          ...prev,
          unread: 0
        }));
        RNAlert.alert('Success', 'All notifications marked as read');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return ['#A1D826', '#8BC220'];
      case 'payment': return ['#FFA726', '#FF9800'];
      case 'warning': return ['#FF6B6B', '#EE5A52'];
      case 'info': return ['#5AC8FA', '#4AB9F1'];
      case 'trip': return ['#A1D826', '#8BC220'];
      case 'driver': return ['#5AC8FA', '#4AB9F1'];
      case 'system': return ['#FFA726', '#FF9800'];
      default: return ['#A1D826', '#8BC220'];
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

  const renderNotification = ({ item, index }) => (
    <Animated.View
      style={[
        styles.notificationCard,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIconContainer}>
          <LinearGradient
            colors={getNotificationColor(item.type)}
            style={styles.notificationIcon}
          >
            <Icon name={item.icon} size={18} color="#fff" />
          </LinearGradient>
          <View style={styles.notificationTitleContainer}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        </View>
        
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
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.notificationBody}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>

      {!item.read && (
        <View style={styles.unreadIndicator} />
      )}
    </Animated.View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#A1D826" />
      <Text style={styles.loadingText}>Loading notifications...</Text>
    </View>
  );

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
          <Text style={styles.headerTitle}>Notifications</Text>
          {counts.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{counts.unread}</Text>
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

      {/* Notifications Count */}
      <View style={styles.notificationsCount}>
        <Text style={styles.countText}>
          {counts.total} notification{counts.total !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${categories.find(cat => cat.id === selectedCategory)?.label}`}
        </Text>
        <TouchableOpacity onPress={onRefresh}>
          <Icon name="refresh" size={16} color="#7f8c8d" />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && renderLoadingState()}

      {/* Notifications List */}
      {!loading && (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#A1D826']}
              tintColor="#A1D826"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="notifications-off" size={64} color="#e9ecef" />
              <Text style={styles.emptyStateTitle}>No Notifications</Text>
              <Text style={styles.emptyStateText}>
                No notifications found.
              </Text>
            </View>
          }
        />
      )}

      {/* Mark All as Read FAB */}
      {!loading && counts.unread > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={markAllAsRead}
        >
          <LinearGradient
            colors={['#A1D826', '#8BC220']}
            style={styles.fabGradient}
          >
            <Icon name="checkmark-done" size={20} color="#fff" />
            <Text style={styles.fabText}>Mark All Read</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}