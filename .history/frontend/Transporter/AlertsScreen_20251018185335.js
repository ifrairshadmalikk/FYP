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
      title: "Passenger Not Found",
      detail: "Ali Ahmed was not at pickup location in F-8 Markaz.",
      time: "2 mins ago",
      icon: "person-remove-outline",
      color: COLORS.warning,
      priority: "medium",
      route: "Blue Area Route",
      driver: "Ahmed Khan",
      vehicle: "Van-101",
      actions: ["Call", "Reschedule"],
      unread: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Route Delay",
      detail: "Traffic at Jinnah Avenue. Delay of 15 minutes.",
      time: "5 mins ago",
      icon: "time-outline",
      color: COLORS.info,
      priority: "low",
      route: "University Route",
      driver: "Hassan Ali",
      vehicle: "Van-101",
      actions: ["View Route", "Send Update"],
      unread: true,
      createdAt: new Date(),
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [filter, setFilter] = useState("all");
  const [markedAsRead, setMarkedAsRead] = useState([]);
  const [autoDismissTime, setAutoDismissTime] = useState(30); // seconds
  const [newNotification, setNewNotification] = useState(null);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const settingsSlideAnim = useRef(new Animated.Value(height)).current;
  const notificationAnim = useRef(new Animated.Value(-100)).current;

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance for new notification
        const newAlert = {
          id: Date.now(),
          title: "New Passenger Added",
          detail: "A new passenger has been assigned to your route.",
          time: "Just now",
          icon: "person-add-outline",
          color: COLORS.success,
          priority: "low",
          route: "City Route",
          driver: "Auto System",
          vehicle: "System",
          actions: ["View", "Assign"],
          unread: true,
          createdAt: new Date(),
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        showNotification(newAlert);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => 
        prev.filter(alert => {
          const timeDiff = (new Date() - alert.createdAt) / 1000; // seconds
          return timeDiff < autoDismissTime;
        })
      );
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [autoDismissTime]);

  const showNotification = (alert) => {
    setNewNotification(alert);
    
    // Slide in animation
    Animated.sequence([
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000), // Show for 3 seconds
      Animated.timing(notificationAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNewNotification(null);
    });
  };

  const handleAlertPress = (alert) => {
    setSelectedAlert(alert);
    setAlertModalVisible(true);

    // Mark as read
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
    let message = "";
    switch (action) {
      case "Call":
        message = "Calling passenger...";
        break;
      case "Reschedule":
        message = "Opening reschedule...";
        break;
      case "View Route":
        message = "Opening route map...";
        break;
      case "Send Update":
        message = "Sending update...";
        break;
      case "Track":
        message = "Tracking vehicle...";
        break;
      case "Contact Driver":
        message = "Calling driver...";
        break;
      case "View":
        message = "Opening details...";
        break;
      case "Assign":
        message = "Opening assignment...";
        break;
      default:
        message = "Action completed";
    }
    Alert.alert("Action", message, [{ text: "OK" }]);
  };

  const markAllAsRead = () => {
    const allAlertIds = alerts.map(alert => alert.id);
    setMarkedAsRead(allAlertIds);
    Alert.alert("Done", "All alerts marked as read");
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    setMarkedAsRead([]);
    Alert.alert("Cleared", "All alerts removed");
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
              <View style={styles.badgeContainer}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(alert.priority) }]}>
                  <Text style={styles.priorityText}>{alert.priority}</Text>
                </View>
                {!isRead && <View style={styles.unreadDot} />}
              </View>
            </View>

            <Text style={styles.alertDetail} numberOfLines={2}>
              {alert.detail}
            </Text>

            <View style={styles.alertFooter}>
              <Text style={styles.alertTime}>{alert.time}</Text>
              <Text style={styles.alertRoute}>{alert.route}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          {alert.actions.slice(0, 2).map((action, index) => (
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

      {/* New Notification Banner */}
      {newNotification && (
        <Animated.View 
          style={[
            styles.notificationBanner,
            { transform: [{ translateY: notificationAnim }] }
          ]}
        >
          <View style={styles.notificationContent}>
            <View style={[styles.notificationIcon, { backgroundColor: newNotification.color + '20' }]}>
              <Ionicons name={newNotification.icon} size={16} color={newNotification.color} />
            </View>
            <View style={styles.notificationText}>
              <Text style={styles.notificationTitle}>{newNotification.title}</Text>
              <Text style={styles.notificationDetail} numberOfLines={1}>
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
              <Ionicons name="close" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Alerts</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} new` : 'All clear'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>Mark Read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={openSettingsModal} style={styles.headerBtn}>
            <Ionicons name="settings-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
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
              {filterType === "all" ? "All" :
               filterType === "high" ? "Critical" :
               filterType === "medium" ? "Warning" : "Info"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alerts List */}
      <View style={styles.alertsContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredAlerts.length > 0 ? (
            <>
              {filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
              <TouchableOpacity style={styles.clearAllBtn} onPress={clearAllAlerts}>
                <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                <Text style={styles.clearAllText}>Clear All Alerts</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.lightGray} />
              <Text style={styles.emptyTitle}>No Alerts</Text>
              <Text style={styles.emptyText}>
                {filter === "all" ? "All clear! No alerts." : `No ${filter} alerts`}
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

                <View style={styles.modalBody}>
                  <View style={styles.alertInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={16} color={COLORS.gray} />
                      <Text style={styles.infoText}>Route: {selectedAlert.route}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="person-outline" size={16} color={COLORS.gray} />
                      <Text style={styles.infoText}>Driver: {selectedAlert.driver}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="car-outline" size={16} color={COLORS.gray} />
                      <Text style={styles.infoText}>Vehicle: {selectedAlert.vehicle}</Text>
                    </View>
                  </View>

                  <Text style={styles.alertDescription}>{selectedAlert.detail}</Text>

                  <View style={styles.actionSection}>
                    <Text style={styles.actionTitle}>Quick Actions</Text>
                    <View style={styles.actionButtons}>
                      {selectedAlert.actions.map((action, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.modalActionBtn}
                          onPress={() => {
                            handleActionPress(action, selectedAlert);
                            closeAlertModal();
                          }}
                        >
                          <Text style={styles.modalActionText}>{action}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() => {
                      closeAlertModal();
                      navigation.navigate("VanTracking");
                    }}
                  >
                    <Ionicons name="location-outline" size={18} color={COLORS.white} />
                    <Text style={styles.trackBtnText}>Track Vehicle</Text>
                  </TouchableOpacity>
                </View>
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
                <Text style={styles.settingTitle}>Auto Dismiss Time</Text>
                <Text style={styles.settingDescription}>
                  Notifications will automatically disappear after:
                </Text>
                
                <View style={styles.timeOptions}>
                  <TimeOption 
                    time={15}
                    label="15 seconds"
                    selected={autoDismissTime === 15}
                    onSelect={setAutoDismissTime}
                  />
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
                </View>

                <View style={styles.currentSetting}>
                  <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.currentSettingText}>
                    Current: {autoDismissTime} seconds
                  </Text>
                </View>
              </View>

              <View style={styles.settingSection}>
                <Text style={styles.settingTitle}>Test Notification</Text>
                <Text style={styles.settingDescription}>
                  Send a test notification to see how it works:
                </Text>
                <TouchableOpacity 
                  style={styles.testButton}
                  onPress={() => {
                    const testAlert = {
                      id: Date.now(),
                      title: "Test Notification",
                      detail: "This is a test notification to show how alerts work.",
                      time: "Just now",
                      icon: "notifications-outline",
                      color: COLORS.primary,
                      priority: "low",
                      route: "Test Route",
                      driver: "Test System",
                      vehicle: "Test Van",
                      actions: ["OK", "Close"],
                      unread: true,
                      createdAt: new Date(),
                    };
                    setAlerts(prev => [testAlert, ...prev]);
                    showNotification(testAlert);
                    closeSettingsModal();
                  }}
                >
                  <Ionicons name="notifications-outline" size={18} color={COLORS.white} />
                  <Text style={styles.testButtonText}>Send Test Notification</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={closeSettingsModal}
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
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 40,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 2,
  },
  notificationDetail: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
  },
  notificationClose: {
    padding: 4,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    marginTop: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    padding: 8,
    marginLeft: 8,
  },
  headerBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  // Filter
  filterContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  // Alerts
  alertsContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  alertCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unreadCard: {
    backgroundColor: '#f8f9fa',
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: "700",
  },
  badgeContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  alertDetail: {
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 16,
    marginBottom: 8,
  },
  alertFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertTime: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: "500",
  },
  alertRoute: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  actionBtn: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
    marginTop: 8,
  },
  clearAllText: {
    color: COLORS.danger,
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  settingsModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "500",
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    marginBottom: 20,
  },
  settingsBody: {
    flex: 1,
    marginBottom: 20,
  },
  alertInfo: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 8,
    fontWeight: "500",
  },
  alertDescription: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
    marginBottom: 20,
  },
  actionSection: {
    marginBottom: 20,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalActionBtn: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalActionText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.black,
  },
  modalFooter: {
    gap: 12,
  },
  trackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  trackBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  // Settings
  settingSection: {
    marginBottom: 24,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
    lineHeight: 20,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray,
  },
  timeOptionTextSelected: {
    color: COLORS.white,
  },
  currentSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  currentSettingText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  testButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  saveBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
});