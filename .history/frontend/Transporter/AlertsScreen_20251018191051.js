import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#afd826",
  primaryDark: "#8fb320",
  success: "#28a745",
  warning: "#f39c12",
  danger: "#dc3545",
  info: "#17a2b8",
  white: "#ffffff",
  black: "#111111",
  gray: "#6c757d",
  lightGray: "#f8f9fa",
  border: "#dee2e6",
  background: "#f9fafb",
};

export default function AlertsScreen({ navigation }) {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "New Passenger Added",
      detail: "Ali Ahmed has been added to your Blue Area route",
      time: "2 mins ago",
      icon: "person-add-outline",
      color: COLORS.success,
      priority: "low",
      route: "Blue Area Route",
      driver: "Ahmed Khan",
      vehicle: "Van-101",
      actions: ["View Details", "Call"],
      unread: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Route Completed",
      detail: "Morning route completed successfully with all passengers",
      time: "5 mins ago",
      icon: "checkmark-done-outline",
      color: COLORS.success,
      priority: "low",
      route: "University Route",
      driver: "Hassan Ali",
      vehicle: "Van-101",
      actions: ["View Report", "Rate Driver"],
      unread: true,
      createdAt: new Date(),
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [filter, setFilter] = useState("all");
  const [markedAsRead, setMarkedAsRead] = useState([]);
  const [autoDismissTime, setAutoDismissTime] = useState(60); // 1 minute default
  const [newNotification, setNewNotification] = useState(null);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const settingsSlideAnim = useRef(new Animated.Value(height)).current;
  const notificationAnim = useRef(new Animated.Value(-100)).current;

  // Load settings from storage
  useEffect(() => {
    // In real app, load from AsyncStorage
    const loadSettings = async () => {
      // Simulate loading settings
      setAutoDismissTime(60); // 1 minute default
    };
    loadSettings();
  }, []);

  // Save settings
  const saveSettings = () => {
    // In real app, save to AsyncStorage
    Alert.alert("✅ Settings Saved", `Notifications will auto-dismiss after ${autoDismissTime} seconds`);
    closeSettingsModal();
  };

  // Simulate occasional notifications (less frequent)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance for new notification
        const notifications = [
          {
            title: "Route Update",
            detail: "Your route has been optimized for better timing",
            icon: "refresh-outline",
            color: COLORS.info,
            priority: "low",
          },
          {
            title: "Payment Received",
            detail: "Monthly payment has been processed successfully",
            icon: "card-outline",
            color: COLORS.success,
            priority: "low",
          },
          {
            title: "Driver Check-in",
            detail: "Driver has started the morning route",
            icon: "car-outline",
            color: COLORS.info,
            priority: "low",
          }
        ];
        
        const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
        const newAlert = {
          id: Date.now(),
          ...randomNotif,
          time: "Just now",
          route: "Daily Route",
          driver: "System",
          vehicle: "Auto",
          actions: ["View", "OK"],
          unread: true,
          createdAt: new Date(),
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        showNotification(newAlert);
      }
    }, 30000); // Check every 30 seconds (less frequent)

    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss notifications based on settings
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => 
        prev.filter(alert => {
          const timeDiff = (new Date() - alert.createdAt) / 1000; // seconds
          return timeDiff < autoDismissTime;
        })
      );
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [autoDismissTime]);

  const showNotification = (alert) => {
    setNewNotification(alert);
    
    // Slide in animation
    Animated.sequence([
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(4000), // Show for 4 seconds
      Animated.timing(notificationAnim, {
        toValue: -100,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNewNotification(null);
    });
  };

  const handleAlertPress = (alert) => {
    setSelectedAlert(alert);
    setAlertModalVisible(true);

    // Mark as read when opened
    if (!markedAsRead.includes(alert.id)) {
      setMarkedAsRead([...markedAsRead, alert.id]);
    }

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeAlertModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setAlertModalVisible(false);
      setSelectedAlert(null);
    });
  };

  const openSettingsModal = () => {
    setSettingsModalVisible(true);
    Animated.timing(settingsSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSettingsModal = () => {
    Animated.timing(settingsSlideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSettingsModalVisible(false);
    });
  };

  const handleActionPress = (action, alert) => {
    // Simple actions that make sense
    let message = "";
    switch (action) {
      case "Call":
        message = "📞 Opening phone dialer...";
        break;
      case "View Details":
        message = "📋 Opening passenger details...";
        break;
      case "View Report":
        message = "📊 Opening route report...";
        break;
      case "Rate Driver":
        message: "⭐ Opening rating screen...";
        navigation.navigate("DriverPerformance");
        closeAlertModal();
        return;
      case "View":
        message = "👀 Opening details...";
        break;
      case "OK":
        // Just close if OK is pressed
        closeAlertModal();
        return;
      default:
        message = "✅ Action completed";
    }
    
    Alert.alert("Action", message, [{ text: "OK" }]);
  };

  const markAllAsRead = () => {
    const allAlertIds = alerts.map(alert => alert.id);
    setMarkedAsRead(allAlertIds);
    Alert.alert("✅ Done", "All notifications marked as read");
  };

  const clearAllAlerts = () => {
    if (alerts.length === 0) {
      Alert.alert("ℹ️ Info", "No alerts to clear");
      return;
    }
    
    Alert.alert(
      "Clear All Alerts",
      "Are you sure you want to remove all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: () => {
            setAlerts([]);
            setMarkedAsRead([]);
            Alert.alert("✅ Cleared", "All notifications removed");
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return COLORS.danger;
      case "medium": return COLORS.warning;
      case "low": return COLORS.info;
      default: return COLORS.gray;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true;
    return alert.priority === filter;
  });

  const unreadCount = alerts.filter(alert => !markedAsRead.includes(alert.id)).length;

  // Simple Alert Card - Very user friendly
  const AlertCard = ({ alert }) => {
    const isRead = markedAsRead.includes(alert.id);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.alertCard,
          {
            borderLeftWidth: 4,
            borderLeftColor: getPriorityColor(alert.priority),
          },
          pressed && { backgroundColor: "#f8f9fa" },
          !isRead && styles.unreadCard,
        ]}
        onPress={() => handleAlertPress(alert)}
      >
        <View style={styles.alertHeader}>
          <View style={[styles.iconCircle, { backgroundColor: alert.color + '20' }]}>
            <Ionicons name={alert.icon} size={20} color={alert.color} />
          </View>

          <View style={styles.alertContent}>
            <View style={styles.titleRow}>
              <Text style={[styles.alertTitle, !isRead && styles.unreadTitle]}>
                {alert.title}
              </Text>
              {!isRead && <View style={styles.unreadDot} />}
            </View>

            <Text style={styles.alertDetail}>
              {alert.detail}
            </Text>

            <View style={styles.alertFooter}>
              <View style={styles.alertMeta}>
                <Ionicons name="time-outline" size={12} color={COLORS.gray} />
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              <Text style={styles.alertRoute}>{alert.route}</Text>
            </View>
          </View>
        </View>

        {/* Simple actions */}
        <View style={styles.quickActions}>
          {alert.actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionBtn}
              onPress={() => handleActionPress(action, alert)}
            >
              <Text style={styles.actionText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    );
  };

  const TimeOption = ({ time, label, selected, onSelect }) => (
    <TouchableOpacity
      style={[
        styles.timeOption,
        selected && styles.timeOptionSelected
      ]}
      onPress={() => onSelect(time)}
    >
      <Ionicons 
        name={selected ? "radio-button-on" : "radio-button-off"} 
        size={20} 
        color={selected ? COLORS.white : COLORS.gray} 
      />
      <Text style={[
        styles.timeOptionText,
        selected && styles.timeOptionTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Friendly Notification Banner */}
      {newNotification && (
        <Animated.View 
          style={[
            styles.notificationBanner,
            { transform: [{ translateY: notificationAnim }] }
          ]}
        >
          <View style={styles.notificationContent}>
            <View style={[styles.notificationIcon, { backgroundColor: newNotification.color + '20' }]}>
              <Ionicons name={newNotification.icon} size={20} color={newNotification.color} />
            </View>
            <View style={styles.notificationText}>
              <Text style={styles.notificationTitle}>{newNotification.title}</Text>
              <Text style={styles.notificationDetail}>
                {newNotification.detail}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationClose}
              onPress={() => {
                Animated.timing(notificationAnim, {
                  toValue: -100,
                  duration: 300,
                  useNativeDriver: true,
                }).start(() => setNewNotification(null));
              }}
            >
              <Ionicons name="close" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Clean Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up 🎉'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={openSettingsModal} style={styles.headerBtn}>
            <Ionicons name="settings-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Simple Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["all", "high", "medium", "low"].map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterBtn,
                filter === filterType && styles.filterBtnActive
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text style={[
                styles.filterText,
                filter === filterType && styles.filterTextActive
              ]}>
                {filterType === "all" ? "All Notifications" :
                 filterType === "high" ? "🔴 Important" :
                 filterType === "medium" ? "🟡 Warnings" : "🔵 Info"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions Bar */}
      <View style={styles.quickActionBar}>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.quickAction} onPress={markAllAsRead}>
            <Ionicons name="checkmark-done" size={16} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.quickAction} onPress={clearAllAlerts}>
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          <Text style={[styles.quickActionText, { color: COLORS.danger }]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Alerts List */}
      <View style={styles.alertsContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={80} color={COLORS.lightGray} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyText}>
                {filter === "all" 
                  ? "You're all caught up! No new notifications."
                  : `No ${filter} priority notifications.`
                }
              </Text>
              <Text style={styles.emptySubtext}>
                New notifications will appear here automatically
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Alert Detail Modal */}
      <Modal
        visible={alertModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAlertModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            {selectedAlert && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleRow}>
                    <View style={[styles.modalIcon, { backgroundColor: selectedAlert.color + '20' }]}>
                      <Ionicons name={selectedAlert.icon} size={24} color={selectedAlert.color} />
                    </View>
                    <View style={styles.modalTitleContainer}>
                      <Text style={styles.modalTitle}>{selectedAlert.title}</Text>
                      <Text style={styles.modalSubtitle}>{selectedAlert.time}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={closeAlertModal} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color={COLORS.gray} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.alertDescription}>{selectedAlert.detail}</Text>

                  <View style={styles.alertInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={16} color={COLORS.gray} />
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Route:</Text> {selectedAlert.route}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="person-outline" size={16} color={COLORS.gray} />
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Driver:</Text> {selectedAlert.driver}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="car-outline" size={16} color={COLORS.gray} />
                      <Text style={styles.infoText}><Text style={styles.infoLabel}>Vehicle:</Text> {selectedAlert.vehicle}</Text>
                    </View>
                  </View>

                  <View style={styles.actionSection}>
                    <Text style={styles.actionTitle}>What would you like to do?</Text>
                    <View style={styles.actionButtons}>
                      {selectedAlert.actions.map((action, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.modalActionBtn}
                          onPress={() => handleActionPress(action, selectedAlert)}
                        >
                          <Text style={styles.modalActionText}>{action}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        style={[styles.modalActionBtn, styles.secondaryAction]}
                        onPress={closeAlertModal}
                      >
                        <Text style={[styles.modalActionText, styles.secondaryActionText]}>Maybe Later</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSettingsModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.settingsModal,
              { transform: [{ translateY: settingsSlideAnim }] }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Settings</Text>
              <TouchableOpacity onPress={closeSettingsModal} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.settingsBody}>
              <View style={styles.settingSection}>
                <View style={styles.settingHeader}>
                  <Ionicons name="time-outline" size={24} color={COLORS.primary} />
                  <Text style={styles.settingTitle}>Auto-remove Timing</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Notifications will automatically disappear after this time to keep your screen clean
                </Text>
                
                <View style={styles.timeOptions}>
                  <TimeOption 
                    time={30}
                    label="30 seconds"
                    selected={autoDismissTime === 30}
                    onSelect={setAutoDismissTime}
                  />
                  <TimeOption 
                    time={60}
                    label="1 minute"
                    selected={autoDismissTime === 60}
                    onSelect={setAutoDismissTime}
                  />
                  <TimeOption 
                    time={300}
                    label="5 minutes"
                    selected={autoDismissTime === 300}
                    onSelect={setAutoDismissTime}
                  />
                  <TimeOption 
                    time={1800}
                    label="30 minutes"
                    selected={autoDismissTime === 1800}
                    onSelect={setAutoDismissTime}
                  />
                </View>

                <View style={styles.currentSetting}>
                  <Text style={styles.currentSettingText}>
                    Currently: {autoDismissTime >= 60 ? `${autoDismissTime/60} minutes` : `${autoDismissTime} seconds`}
                  </Text>
                </View>
              </View>

              <View style={styles.settingSection}>
                <View style={styles.settingHeader}>
                  <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
                  <Text style={styles.settingTitle}>Test Notification</Text>
                </View>
                <Text style={styles.settingDescription}>
                  See how notifications will look and behave
                </Text>
                <TouchableOpacity 
                  style={styles.testButton}
                  onPress={() => {
                    const testAlert = {
                      id: Date.now(),
                      title: "Test Notification",
                      detail: "This is how notifications will appear in your app",
                      time: "Just now",
                      icon: "notifications-outline",
                      color: COLORS.primary,
                      priority: "low",
                      route: "Test Route",
                      driver: "Test System",
                      vehicle: "Test Van",
                      actions: ["OK", "View Details"],
                      unread: true,
                      createdAt: new Date(),
                    };
                    setAlerts(prev => [testAlert, ...prev]);
                    showNotification(testAlert);
                    closeSettingsModal();
                  }}
                >
                  <Ionicons name="play" size={18} color={COLORS.white} />
                  <Text style={styles.testButtonText}>Send Test Notification</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={closeSettingsModal}
              >
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={saveSettings}
              >
                <Text style={styles.saveBtnText}>Save Settings</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  // Notification Banner
  notificationBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    zIndex: 1000,
    elevation: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  notificationDetail: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  notificationClose: {
    padding: 8,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    marginTop: 10,
  },
  backBtn: {
    padding: 8,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    padding: 8,
  },
  // Filter
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 6,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  // Quick Action Bar
  quickActionBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    justifyContent: 'space-around',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginLeft: 6,
  },
  // Alerts
  alertsContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  alertCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  unreadCard: {
    backgroundColor: '#f8f9fa',
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: "700",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  alertDetail: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 22,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTime: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "500",
    marginLeft: 4,
  },
  alertRoute: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  actionBtn: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.black,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.7,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: height * 0.85,
  },
  settingsModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.black,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "500",
    marginTop: 4,
  },
  closeBtn: {
    padding: 8,
  },
  modalBody: {
    flex: 1,
    marginBottom: 24,
  },
  settingsBody: {
    flex: 1,
    marginBottom: 24,
  },
  alertDescription: {
    fontSize: 18,
    color: COLORS.black,
    lineHeight: 26,
    marginBottom: 24,
  },
  alertInfo: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: "600",
    color: COLORS.black,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.gray,
    marginLeft: 12,
  },
  actionSection: {
    marginBottom: 24,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 16,
  },
  actionButtons: {
    gap: 12,
  },
  modalActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  secondaryAction: {
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryActionText: {
    color: COLORS.gray,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  // Settings
  settingSection: {
    marginBottom: 32,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  settingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
  },
  settingDescription: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
    lineHeight: 24,
  },
  timeOptions: {
    gap: 12,
    marginBottom: 20,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 12,
  },
  timeOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.gray,
  },
  timeOptionTextSelected: {
    color: COLORS.white,
    fontWeight: "600",
  },
  currentSetting: {
    backgroundColor: COLORS.primary + '10',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentSettingText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  testButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  saveBtn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightGray,
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryBtnText: {
    color: COLORS.gray,
    fontWeight: "600",
    fontSize: 16,
  },
});