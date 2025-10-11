import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../styles/NotificationScreenStyle';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Trip Confirmed',
      message: 'Your trip for tomorrow has been confirmed by the transporter',
      time: '2 hours ago',
      type: 'success',
      read: false,
      icon: 'checkmark-circle',
      category: 'trip',
    },
    {
      id: 2,
      title: 'Subscription Renewed',
      message: 'Your monthly subscription has been renewed successfully. You can continue using our services.',
      time: '5 hours ago',
      type: 'payment',
      read: false,
      icon: 'card',
      category: 'payment',
    },
    {
      id: 3,
      title: 'Driver Assigned',
      message: 'Muhammad Hassan has been assigned as your driver for the upcoming trip',
      time: '1 day ago',
      type: 'info',
      read: true,
      icon: 'person',
      category: 'driver',
    },
    {
      id: 4,
      title: 'Route Updated',
      message: 'Your route has been optimized for better travel experience',
      time: '2 days ago',
      type: 'warning',
      read: true,
      icon: 'navigate',
      category: 'route',
    },
    {
      id: 5,
      title: 'Payment Due Reminder',
      message: 'Your monthly subscription payment is due in 3 days',
      time: '3 days ago',
      type: 'payment',
      read: true,
      icon: 'alert-circle',
      category: 'payment',
    },
    {
      id: 6,
      title: 'Service Update',
      message: 'New features added to improve your van pooling experience',
      time: '1 week ago',
      type: 'info',
      read: true,
      icon: 'megaphone',
      category: 'system',
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
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
  }, []);

  const categories = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'payment', label: 'Payments', icon: 'card' },
    { id: 'trip', label: 'Trips', icon: 'car' },
    { id: 'driver', label: 'Drivers', icon: 'person' },
    { id: 'system', label: 'System', icon: 'settings' },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return ['#A1D826', '#8BC220'];
      case 'payment': return ['#FFA726', '#FF9800'];
      case 'warning': return ['#FF6B6B', '#EE5A52'];
      case 'info': return ['#5AC8FA', '#4AB9F1'];
      default: return ['#A1D826', '#8BC220'];
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const getFilteredNotifications = () => {
    if (selectedCategory === 'all') {
      return notifications;
    }
    return notifications.filter(notification => notification.category === selectedCategory);
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

  const unreadCount = getUnreadCount();
  const filteredNotifications = getFilteredNotifications();

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
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{unreadCount}</Text>
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
          {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${categories.find(cat => cat.id === selectedCategory)?.label}`}
        </Text>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
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
              {selectedCategory === 'all' 
                ? "You're all caught up!" 
                : `No ${categories.find(cat => cat.id === selectedCategory)?.label?.toLowerCase()} notifications`
              }
            </Text>
          </View>
        }
      />

      {/* Mark All as Read FAB */}
      {unreadCount > 0 && (
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