import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../styles/PassengerPaymentStyle';

export default function PaymentsScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('current');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  
  const [subscriptionPlans] = useState([
    {
      id: 1,
      name: 'Monthly Subscription',
      price: 'Rs. 10,000',
      duration: '1 Month',
      description: 'Full month van pooling service',
      features: ['Unlimited Rides', 'All Routes', '24/7 Service', 'Priority Support', 'Monthly Billing'],
      popular: true,
    }
  ]);

  const [subscriptionHistory, setSubscriptionHistory] = useState([
    {
      id: 1,
      planName: 'Monthly Subscription',
      amount: 'Rs. 10,000',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      status: 'active',
      paymentMethod: 'Bank Transfer',
      transactionId: 'SUB001234',
      requestDate: '2023-12-25',
      approvedDate: '2023-12-28',
      approvedBy: 'Transport Manager',
    },
    {
      id: 2,
      planName: 'Monthly Subscription',
      amount: 'Rs. 10,000',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      status: 'completed',
      paymentMethod: 'EasyPaisa',
      transactionId: 'SUB001233',
      requestDate: '2023-11-25',
      approvedDate: '2023-11-28',
      approvedBy: 'Transport Manager',
    },
    {
      id: 3,
      planName: 'Monthly Subscription',
      amount: 'Rs. 10,000',
      startDate: '2023-11-01',
      endDate: '2023-11-30',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      transactionId: 'SUB001232',
      requestDate: '2023-10-25',
      approvedDate: '2023-10-28',
      approvedBy: 'Transport Manager',
    },
    {
      id: 4,
      planName: 'Monthly Subscription',
      amount: 'Rs. 10,000',
      startDate: '2023-10-01',
      endDate: '2023-10-31',
      status: 'completed',
      paymentMethod: 'Credit Card',
      transactionId: 'SUB001231',
      requestDate: '2023-09-25',
      approvedDate: '2023-09-28',
      approvedBy: 'Transport Manager',
    },
    {
      id: 5,
      planName: 'Monthly Subscription',
      amount: 'Rs. 10,000',
      startDate: '2023-09-01',
      endDate: '2023-09-30',
      status: 'rejected',
      paymentMethod: 'EasyPaisa',
      transactionId: 'SUB001230',
      requestDate: '2023-08-25',
      rejectedDate: '2023-08-27',
      rejectedReason: 'Payment verification failed',
    },
  ]);

  const [currentSubscription, setCurrentSubscription] = useState({
    planName: 'Monthly Subscription',
    amount: 'Rs. 10,000',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'active',
    paymentMethod: 'Bank Transfer',
    transactionId: 'SUB001234',
    daysRemaining: 6,
    requestDate: '2023-12-25',
    approvedDate: '2023-12-28',
    approvedBy: 'Transport Manager',
  });

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

  const tabs = [
    { id: 'current', label: 'Current Plan' },
    { id: 'history', label: 'History' },
    { id: 'renew', label: 'Renew Plan' },
  ];

  const filters = [
    { id: 'all', label: 'All Status' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return ['#A1D826', '#8BC220'];
      case 'completed': return ['#4ECDC4', '#45B7D1'];
      case 'rejected': return ['#FF6B6B', '#EE5A52'];
      case 'pending': return ['#FF9500', '#FF8A00'];
      default: return ['#A1D826', '#8BC220'];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'checkmark-circle';
      case 'completed': return 'checkmark-done';
      case 'rejected': return 'close-circle';
      case 'pending': return 'time';
      default: return 'checkmark-circle';
    }
  };

  const filteredSubscriptions = subscriptionHistory.filter(sub => {
    const matchesTab = selectedTab === 'history' || sub.status === 'active';
    const matchesFilter = selectedFilter === 'all' || sub.status === selectedFilter;
    const matchesSearch = sub.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesFilter && matchesSearch;
  });

  const getSubscriptionStats = () => {
    const stats = {
      total: subscriptionHistory.length,
      active: subscriptionHistory.filter(s => s.status === 'active').length,
      completed: subscriptionHistory.filter(s => s.status === 'completed').length,
      rejected: subscriptionHistory.filter(s => s.status === 'rejected').length,
    };
    return stats;
  };

  const handleRenewSubscription = () => {
    setShowRenewModal(false);
    
    // Add new subscription request to history
    const newRequest = {
      id: subscriptionHistory.length + 1,
      planName: 'Monthly Subscription',
      amount: 'Rs. 10,000',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      status: 'pending',
      paymentMethod: 'Pending',
      transactionId: `SUB00${subscriptionHistory.length + 1234}`,
      requestDate: new Date().toISOString().split('T')[0],
    };
    
    setSubscriptionHistory([newRequest, ...subscriptionHistory]);
    
    Alert.alert(
      'Renewal Request Sent',
      'Your monthly subscription renewal request has been sent to your transporter. They will review and approve it within 24 hours.',
      [{ text: 'OK' }]
    );
  };

  const renderCurrentSubscription = () => (
    <Animated.View
      style={[
        styles.currentPlanCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <LinearGradient
        colors={['#A1D826', '#8BC220']}
        style={styles.currentPlanGradient}
      >
        <View style={styles.planHeader}>
          <View>
            <Text style={styles.planName}>{currentSubscription.planName}</Text>
            <Text style={styles.planPrice}>{currentSubscription.amount}</Text>
            <Text style={styles.planDescription}>Monthly Van Pooling Service</Text>
          </View>
          <LinearGradient
            colors={['#fff', '#f8f9fa']}
            style={styles.statusBadgeLarge}
          >
            <Icon name={getStatusIcon(currentSubscription.status)} size={16} color="#A1D826" />
            <Text style={styles.statusTextLarge}>
              {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.planDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Icon name="calendar" size={16} color="#fff" />
              <Text style={styles.detailTextWhite}>
                {currentSubscription.startDate} to {currentSubscription.endDate}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Icon name="time" size={16} color="#fff" />
              <Text style={styles.detailTextWhite}>
                {currentSubscription.daysRemaining} days remaining
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="card" size={16} color="#fff" />
              <Text style={styles.detailTextWhite}>
                {currentSubscription.paymentMethod}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Icon name="checkmark-circle" size={16} color="#fff" />
              <Text style={styles.detailTextWhite}>
                Approved by: {currentSubscription.approvedBy}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.planActions}>
          <TouchableOpacity 
            style={styles.renewBtn}
            onPress={() => setShowRenewModal(true)}
          >
            <Icon name="refresh" size={18} color="#fff" />
            <Text style={styles.renewBtnText}>Renew Plan</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderSubscriptionCard = ({ item, index }) => (
    <Animated.View
      style={[
        styles.subscriptionCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      {/* Header Section */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.planNameSmall}>{item.planName}</Text>
          <Text style={styles.planAmount}>{item.amount}</Text>
        </View>
        <LinearGradient
          colors={getStatusColor(item.status)}
          style={styles.statusBadge}
        >
          <Icon name={getStatusIcon(item.status)} size={12} color="#fff" />
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </LinearGradient>
      </View>

      {/* Details Section */}
      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={12} color="#666" />
            <Text style={styles.detailText}>{item.startDate} to {item.endDate}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="card" size={12} color="#666" />
            <Text style={styles.detailText}>{item.paymentMethod}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="document" size={12} color="#666" />
            <Text style={styles.detailText}>ID: {item.transactionId}</Text>
          </View>
        </View>

        {item.approvedBy && (
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Icon name="checkmark-circle" size={12} color="#666" />
              <Text style={styles.detailText}>Approved by: {item.approvedBy}</Text>
            </View>
          </View>
        )}

        {item.rejectedReason && (
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Icon name="close-circle" size={12} color="#FF6B6B" />
              <Text style={[styles.detailText, { color: '#FF6B6B' }]}>
                Reason: {item.rejectedReason}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const renderRenewPlan = () => (
    <Animated.View
      style={[
        styles.renewPlanContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <LinearGradient
        colors={['#A1D826', '#8BC220']}
        style={styles.renewPlanCard}
      >
        <View style={styles.renewPlanHeader}>
          <Icon name="refresh-circle" size={48} color="#fff" />
          <Text style={styles.renewPlanTitle}>Renew Your Subscription</Text>
          <Text style={styles.renewPlanSubtitle}>
            Continue enjoying uninterrupted Raahi service
          </Text>
        </View>

        <View style={styles.renewPlanDetails}>
          <View style={styles.renewDetailItem}>
            <Icon name="calendar" size={20} color="#fff" />
            <View style={styles.renewDetailText}>
              <Text style={styles.renewDetailLabel}>Next Billing Cycle</Text>
              <Text style={styles.renewDetailValue}>1st Feb 2025 - 29th Feb 2025</Text>
            </View>
          </View>

          <View style={styles.renewDetailItem}>
            <Icon name="cash" size={20} color="#fff" />
            <View style={styles.renewDetailText}>
              <Text style={styles.renewDetailLabel}>Monthly Amount</Text>
              <Text style={styles.renewDetailValue}>Rs. 10,000</Text>
            </View>
          </View>

          <View style={styles.renewDetailItem}>
            <Icon name="car" size={20} color="#fff" />
            <View style={styles.renewDetailText}>
              <Text style={styles.renewDetailLabel}>Service Includes</Text>
              <Text style={styles.renewDetailValue}>Can Avail Rides for 1 month</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.renewNowBtn}
          onPress={() => setShowRenewModal(true)}
        >
          <LinearGradient
            colors={['#fff', '#f8f9fa']}
            style={styles.renewNowGradient}
          >
            <Icon name="arrow-forward" size={20} color="#A1D826" />
            <Text style={styles.renewNowText}>Renew Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Recent Renewals */}
      <View style={styles.recentRenewals}>
        <Text style={styles.recentTitle}>Recent Renewals</Text>
        {subscriptionHistory.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.recentItem}>
            <View style={styles.recentItemLeft}>
              <Text style={styles.recentPlanName}>{item.planName}</Text>
              <Text style={styles.recentDate}>{item.startDate} to {item.endDate}</Text>
            </View>
            <LinearGradient
              colors={getStatusColor(item.status)}
              style={styles.recentStatus}
            >
              <Text style={styles.recentStatusText}>{item.status}</Text>
            </LinearGradient>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const stats = getSubscriptionStats();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#A1D826', '#8BC220']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monthly Subscription</Text>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Icon name="filter" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.tabActive
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content based on selected tab */}
      {selectedTab === 'current' && (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {renderCurrentSubscription()}
          
          {/* Stats Overview */}
          <Animated.View 
            style={[
              styles.statsCard,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.statsTitle}>Subscription Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.active}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.completed}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.rejected}</Text>
                <Text style={styles.statLabel}>Rejected</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      )}

      {selectedTab === 'history' && (
        <>
          {/* Search Bar */}
          <Animated.View 
            style={[
              styles.searchContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.searchBox}>
              <Icon name="search" size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by transaction ID..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {/* Active Filter Display */}
          {selectedFilter !== 'all' && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                Filter: {filters.find(f => f.id === selectedFilter)?.label}
              </Text>
              <TouchableOpacity onPress={() => setSelectedFilter('all')}>
                <Icon name="close" size={16} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}

          {/* Subscription List */}
          <FlatList
            data={filteredSubscriptions}
            renderItem={renderSubscriptionCard}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon name="receipt" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>No subscriptions found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery ? 'Try adjusting your search' : 'No subscription history available'}
                </Text>
              </View>
            }
          />
        </>
      )}

      {selectedTab === 'renew' && (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {renderRenewPlan()}
        </ScrollView>
      )}

      {/* Renew Modal */}
      <Modal
        visible={showRenewModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Renew Monthly Subscription</Text>
              <TouchableOpacity onPress={() => setShowRenewModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Your renewal request will be sent to your transporter. They will review and approve it within 24 hours. Once approved, you'll receive payment instructions.
            </Text>

            <View style={styles.renewalDetails}>
              <View style={styles.renewalDetailItem}>
                <Text style={styles.renewalDetailLabel}>Plan</Text>
                <Text style={styles.renewalDetailValue}>Monthly Subscription</Text>
              </View>
              <View style={styles.renewalDetailItem}>
                <Text style={styles.renewalDetailLabel}>Amount</Text>
                <Text style={styles.renewalDetailValue}>Rs. 10,000</Text>
              </View>
              <View style={styles.renewalDetailItem}>
                <Text style={styles.renewalDetailLabel}>Duration</Text>
                <Text style={styles.renewalDetailValue}>1 Month</Text>
              </View>
              <View style={styles.renewalDetailItem}>
                <Text style={styles.renewalDetailLabel}>Next Cycle</Text>
                <Text style={styles.renewalDetailValue}>1st Feb - 29th Feb 2025</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setShowRenewModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmBtn}
                onPress={handleRenewSubscription}
              >
                <LinearGradient
                  colors={['#A1D826', '#8BC220']}
                  style={styles.confirmBtnGradient}
                >
                  
                  <Text style={styles.confirmBtnText}>Send Renewal Request</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Subscriptions</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterList}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterItem,
                    selectedFilter === filter.id && styles.filterItemActive
                  ]}
                  onPress={() => {
                    setSelectedFilter(filter.id);
                    setShowFilterModal(false);
                  }}
                >
                  <Text style={[
                    styles.filterText,
                    selectedFilter === filter.id && styles.filterTextActive
                  ]}>
                    {filter.label}
                  </Text>
                  {selectedFilter === filter.id && (
                    <Icon name="checkmark" size={20} color="#A1D826" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.clearFilterBtn}
              onPress={() => {
                setSelectedFilter('all');
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.clearFilterText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}