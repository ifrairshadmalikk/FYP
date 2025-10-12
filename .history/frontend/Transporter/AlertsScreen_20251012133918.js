import React, { useState, useRef } from "react";
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
  LayoutAnimation,
  UIManager,
  Platform,
  Dimensions,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Color Constants
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
      title: "Passenger Missed Pickup",
      detail: "Ali Ahmed was not present at the scheduled pickup location in F-8 Markaz. Driver waited for 5 minutes before proceeding.",
      time: "2 mins ago",
      icon: "person-remove-outline",
      color: COLORS.warning,
      priority: "medium",
      route: "Blue Area Express",
      driver: "Ahmed Khan",
      vehicle: "Van-101",
      actions: ["Call Passenger", "Reschedule", "Mark No-Show"],
      status: "pending",
      unread: true,
      type: "missed_pickup"
    },
    {
      id: 2,
      title: "Route Delay - Traffic",
      detail: "Unexpected traffic congestion at Jinnah Avenue has delayed Van 101 by approximately 15 minutes. Passengers have been notified.",
      time: "5 mins ago",
      icon: "time-outline",
      color: COLORS.info,
      priority: "low",
      route: "University Shuttle",
      driver: "Hassan Ali",
      vehicle: "Van-101",
      actions: ["View Route", "Send Update", "Check Traffic"],
      status: "active",
      unread: true,
      type: "delay"
    },
    {
      id: 3,
      title: "Vehicle Breakdown",
      detail: "Van 102 reported mechanical failure near Blue Area. Recovery team dispatched. Alternate vehicle arranged for passengers.",
      time: "12 mins ago",
      icon: "warning-outline",
      color: COLORS.danger,
      priority: "high",
      route: "Gulberg Connect",
      driver: "Ali Raza",
      vehicle: "Van-102",
      actions: ["Track Recovery", "Contact Driver", "Passenger Updates"],
      status: "urgent",
      unread: false,
      type: "breakdown"
    },
    {
      id: 4,
      title: "Overcapacity Alert",
      detail: "Van 104 currently carrying 14 passengers, exceeding maximum capacity of 12. Safety protocol initiated.",
      time: "20 mins ago",
      icon: "people-outline",
      color: COLORS.danger,
      priority: "high",
      route: "Defence Route",
      driver: "Zara Khan",
      vehicle: "Van-104",
      actions: ["Contact Driver", "Arrange Backup", "Review Bookings"],
      status: "resolved",
      unread: false,
      type: "overcapacity"
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [filter, setFilter] = useState("all");
  const [markedAsRead, setMarkedAsRead] = useState([]);

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    criticalAlerts: true,
    delayAlerts: true,
    maintenanceAlerts: true,
    passengerAlerts: true,
    paymentAlerts: false,
    driverAlerts: true,
    soundEnabled: true,
    vibrationEnabled: true,
    pushNotifications: true,
  });

  const slideAnim = useRef(new Animated.Value(height)).current;
  const settingsSlideAnim = useRef(new Animated.Value(height)).current;

  // Simple one-tap to open details
  const handleAlertPress = (alert) => {
    setSelectedAlert(alert);
    setAlertModalVisible(true);

    // Mark as read when opened
    if (!markedAsRead.includes(alert.id)) {
      setMarkedAsRead([...markedAsRead, alert.id]);
    }

    // Slide up animation for modal
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

  const toggleNotificationSetting = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleActionPress = (action, alert) => {
    let message = "";

    switch (action) {
      case "Call Passenger":
        message = "Calling passenger...";
        break;
      case "Reschedule":
        message = "Opening reschedule options...";
        break;
      case "Mark No-Show":
        message = "Passenger marked as no-show";
        break;
      case "View Route":
        message = "Opening route map...";
        break;
      case "Send Update":
        message = "Sending update to passengers...";
        break;
      case "Track Recovery":
        message = "Tracking recovery vehicle...";
        break;
      case "Contact Driver":
        message = "Calling driver...";
        break;
      default:
        message = "Action completed";
    }

    Alert.alert("Action", message, [{ text: "OK" }]);
  };

  const markAllAsRead = () => {
    const allAlertIds = alerts.map(alert => alert.id);
    setMarkedAsRead(allAlertIds);
    Alert.alert("Success", "All alerts marked as read");
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

  const unreadCount = alerts.filter(alert =>
    !markedAsRead.includes(alert.id)
  ).length;

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
          <View style={styles.alertIconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: alert.color + '20' }]}>
              <Ionicons name={alert.icon} size={20} color={alert.color} />
            </View>
          </View>

          <View style={styles.alertMainContent}>
            <View style={styles.alertTitleRow}>
              <Text style={[
                styles.alertTitle,
                !isRead && styles.unreadTitle
              ]}>
                {alert.title}
              </Text>
              <View style={styles.badgeContainer}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(alert.priority) }]}>
                  <Text style={styles.priorityText}>{alert.priority.toUpperCase()}</Text>
                </View>
                {!isRead && (
                  <View style={styles.unreadDot} />
                )}
              </View>
            </View>

            <View style={styles.alertMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={12} color={COLORS.gray} />
                <Text style={styles.metaText}>{alert.route}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={12} color={COLORS.gray} />
                <Text style={styles.metaText}>{alert.driver}</Text>
              </View>
            </View>

            <Text style={styles.alertTime}>{alert.time}</Text>

            {/* Preview of details */}
            <Text style={styles.alertPreview} numberOfLines={2}>
              {alert.detail}
            </Text>
          </View>
        </View>

        {/* Quick action buttons always visible */}
        <View style={styles.quickActions}>
          {alert.actions.slice(0, 2).map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionButton}
              onPress={() => handleActionPress(action, alert)}
            >
              <Text style={styles.quickActionText}>{action}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => handleAlertPress(alert)}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  const SettingItem = ({ icon, title, description, value, onToggle, isLast = false }) => (
    <View style={[styles.settingItem, isLast && styles.lastSettingItem]}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
        thumbColor={COLORS.white}
        ios_backgroundColor={COLORS.lightGray}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Alerts</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} new` : 'All caught up'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.headerButton} onPress={markAllAsRead}>
              <Text style={styles.markReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerButton} onPress={openSettingsModal}>
            <Ionicons name="settings-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Simple Filter Tabs */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {["all", "high", "medium", "low"].map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterButton,
                filter === filterType && styles.filterButtonActive
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
        </ScrollView>
      </View>

      {/* Alerts List */}
      <View style={styles.alertsContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.lightGray} />
              <Text style={styles.emptyStateTitle}>No Alerts</Text>
              <Text style={styles.emptyStateText}>
                {filter === "all"
                  ? "All clear! No alerts at the moment."
                  : `No ${filter} priority alerts.`
                }
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
                  <View style={styles.modalTitleContainer}>
                    <View style={[styles.modalIcon, { backgroundColor: selectedAlert.color + '20' }]}>
                      <Ionicons name={selectedAlert.icon} size={24} color={selectedAlert.color} />
                    </View>
                    <View>
                      <Text style={styles.modalTitle}>{selectedAlert.title}</Text>
                      <Text style={styles.modalSubtitle}>
                        {selectedAlert.route} • {selectedAlert.time}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.closeButton} onPress={closeAlertModal}>
                    <Ionicons name="close" size={24} color={COLORS.gray} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.alertInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="person-outline" size={16} color={COLORS.gray} />
                      <Text style={styles.infoText}>Driver: {selectedAlert.driver}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="car-outline" size={16} color={COLORS.gray} />
                      <Text style={styles.infoText}>Vehicle: {selectedAlert.vehicle}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="pulse-outline" size={16} color={COLORS.gray} />
                      <Text style={styles.infoText}>
                        Priority: <Text style={{ color: getPriorityColor(selectedAlert.priority), fontWeight: '600' }}>
                          {selectedAlert.priority.toUpperCase()}
                        </Text>
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modalDetail}>{selectedAlert.detail}</Text>

                  <View style={styles.actionSection}>
                    <Text style={styles.actionTitle}>Quick Actions</Text>
                    <View style={styles.actionButtons}>
                      {selectedAlert.actions.map((action, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.actionButton}
                          onPress={() => {
                            handleActionPress(action, selectedAlert);
                            closeAlertModal();
                          }}
                        >
                          <Text style={styles.actionButtonText}>{action}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: COLORS.primary }]}
                    onPress={() => {
                      closeAlertModal();
                      navigation.navigate("VanTracking");
                    }}
                  >
                    <Ionicons name="location-outline" size={18} color={COLORS.white} />
                    <Text style={styles.primaryButtonText}>Track Vehicle</Text>
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
              styles.settingsModalContent,
              { transform: [{ translateY: settingsSlideAnim }] }
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
                <Text style={styles.modalTitle}>Notification Settings</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={closeSettingsModal}>
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.settingsBody}>
              <Text style={styles.settingsSectionTitle}>Alert Types</Text>

              <SettingItem
                icon="warning-outline"
                title="Critical Alerts"
                description="Emergency breakdowns and safety issues"
                value={notificationSettings.criticalAlerts}
                onToggle={() => toggleNotificationSetting('criticalAlerts')}
              />

              <SettingItem
                icon="time-outline"
                title="Delay Alerts"
                description="Route delays and traffic updates"
                value={notificationSettings.delayAlerts}
                onToggle={() => toggleNotificationSetting('delayAlerts')}
              />

              <SettingItem
                icon="construct-outline"
                title="Maintenance Alerts"
                description="Vehicle maintenance and repairs"
                value={notificationSettings.maintenanceAlerts}
                onToggle={() => toggleNotificationSetting('maintenanceAlerts')}
              />

              <SettingItem
                icon="person-outline"
                title="Passenger Alerts"
                description="Passenger-related notifications"
                value={notificationSettings.passengerAlerts}
                onToggle={() => toggleNotificationSetting('passengerAlerts')}
              />

              <SettingItem
                icon="card-outline"
                title="Payment Alerts"
                description="Payment receipts and reminders"
                value={notificationSettings.paymentAlerts}
                onToggle={() => toggleNotificationSetting('paymentAlerts')}
              />

              <SettingItem
                icon="people-outline"
                title="Driver Alerts"
                description="Driver assignments and updates"
                value={notificationSettings.driverAlerts}
                onToggle={() => toggleNotificationSetting('driverAlerts')}
              />

              <Text style={styles.settingsSectionTitle}>Notification Preferences</Text>

              <SettingItem
                icon="volume-high-outline"
                title="Sound"
                description="Play sound for notifications"
                value={notificationSettings.soundEnabled}
                onToggle={() => toggleNotificationSetting('soundEnabled')}
              />

              <SettingItem
                icon="phone-portrait-outline"
                title="Vibration"
                description="Vibrate for notifications"
                value={notificationSettings.vibrationEnabled}
                onToggle={() => toggleNotificationSetting('vibrationEnabled')}
              />

              <SettingItem
                icon="notifications-outline"
                title="Push Notifications"
                description="Receive push notifications"
                value={notificationSettings.pushNotifications}
                onToggle={() => toggleNotificationSetting('pushNotifications')}
                isLast={true}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: COLORS.primary }]}
                onPress={closeSettingsModal}
              >
                <Text style={styles.primaryButtonText}>Save Settings</Text>
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
    backgroundColor: COLORS.primaryDark
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerTitleContainer: {
    alignItems: "center",
    flex: 1,
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
  markReadText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  filterWrapper: {
    height: 50,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
    height: 32,
    justifyContent: 'center',
  },
  filterButtonActive: {
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
  alertsContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
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
  alertIconContainer: {
    marginRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  alertMainContent: {
    flex: 1,
  },
  alertTitleRow: {
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
  alertMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.gray,
    marginLeft: 4,
    fontWeight: "500",
  },
  alertTime: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: "500",
    marginBottom: 4,
  },
  alertPreview: {
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  quickActionButton: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
    marginRight: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 20,
  },
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
    maxHeight: height * 0.85,
  },
  settingsModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  modalTitleContainer: {
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
  closeButton: {
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
  modalDetail: {
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
  actionButton: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.black,
  },
  modalFooter: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  // Settings Styles
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '20',
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 16,
  },
});