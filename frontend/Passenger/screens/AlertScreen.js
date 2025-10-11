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
import styles from '../../styles/AlertStyle';

export default function AlertsScreen({ navigation }) {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Travel Confirmation Required',
      message: 'Please confirm your travel plans for tomorrow morning by 8:00 PM today',
      type: 'urgent',
      time: '10:30 AM',
      date: 'Today',
      read: false,
      icon: 'warning',
      category: 'travel',
      actionRequired: true,
    },
    {
      id: 2,
      title: 'Van Arriving Soon',
      message: 'Your van is 5 minutes away from your pickup location. Please be ready.',
      type: 'info',
      time: '9:15 AM',
      date: 'Today',
      read: false,
      icon: 'bus',
      category: 'ride',
      actionRequired: false,
    },
    {
      id: 3,
      title: 'Subscription Renewal Due',
      message: 'Your monthly subscription plan needs renewal to continue using our services without interruption.',
      type: 'warning',
      time: 'Yesterday',
      date: '2024-01-14',
      read: true,
      icon: 'card',
      category: 'payment',
      actionRequired: true,
    },
    {
      id: 4,
      title: 'Route Optimization',
      message: 'Your route has been optimized for better travel experience due to traffic conditions',
      type: 'info',
      time: '2 days ago',
      date: '2024-01-13',
      read: true,
      icon: 'navigate',
      category: 'route',
      actionRequired: false,
    },
    {
      id: 5,
      title: 'Driver Assigned',
      message: 'Muhammad Hassan has been assigned as your driver for the upcoming trip',
      type: 'success',
      time: '3 days ago',
      date: '2024-01-12',
      read: true,
      icon: 'person',
      category: 'driver',
      actionRequired: false,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const blinkAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Blink animation for unread alerts
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Fade in and slide up animation
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
    { id: 'all', label: 'All Alerts', icon: 'notifications' },
    { id: 'travel', label: 'Travel', icon: 'car' },
    { id: 'payment', label: 'Payment', icon: 'card' },
    { id: 'ride', label: 'Ride Updates', icon: 'bus' },
    { id: 'system', label: 'System', icon: 'settings' },
  ];

  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
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

  const getFilteredAlerts = () => {
    if (selectedCategory === 'all') {
      return alerts;
    }
    return alerts.filter(alert => alert.category === selectedCategory);
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
            <Icon name={getAlertIcon(item.type)} size={20} color="#fff" />
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

  const unreadCount = alerts.filter(alert => !alert.read).length;
  const filteredAlerts = getFilteredAlerts();
  const actionRequiredCount = alerts.filter(alert => alert.actionRequired && !alert.read).length;

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
          {unreadCount > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>{unreadCount}</Text>
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
      {actionRequiredCount > 0 && (
        <View style={styles.actionBanner}>
          <Icon name="warning" size={20} color="#FFA726" />
          <Text style={styles.actionBannerText}>
            {actionRequiredCount} alert{actionRequiredCount !== 1 ? 's' : ''} require your attention
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
          {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${categories.find(cat => cat.id === selectedCategory)?.label}`}
        </Text>
      </View>

      {/* Alerts List */}
      <FlatList
        data={filteredAlerts}
        renderItem={renderAlertItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="notifications-off" size={64} color="#e9ecef" />
            <Text style={styles.emptyStateTitle}>No Alerts</Text>
            <Text style={styles.emptyStateText}>
              {selectedCategory === 'all' 
                ? "You're all caught up!" 
                : `No ${categories.find(cat => cat.id === selectedCategory)?.label?.toLowerCase()} alerts`
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