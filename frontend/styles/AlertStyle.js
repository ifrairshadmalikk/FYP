import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  unreadCountBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  moreButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Action Required Banner
  actionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  actionBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 8,
  },

  // Category Tabs
  categoryContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryList: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryTabActive: {
    backgroundColor: '#A1D826',
    borderColor: '#8BC220',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  // AlertStyle.js میں یہ نئے styles شامل کریں

loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f9fa'
},
loadingText: {
  marginTop: 12,
  fontSize: 16,
  color: '#6c757d'
},
alertsHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 10,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#e9ecef'
},
refreshButton: {
  padding: 8,
  borderRadius: 20,
  backgroundColor: '#f8f9fa'
},
createSampleButton: {
  marginTop: 16,
  paddingHorizontal: 20,
  paddingVertical: 10,
  backgroundColor: '#A1D826',
  borderRadius: 8
},
createSampleText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 14
}
,
  // Alerts Count
  alertsCount: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  countText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },

  // List Container
  listContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },

  // Alert Card
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f8f9fa',
    overflow: 'hidden',
    position: 'relative',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  alertIconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  alertTime: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
    marginRight: 8,
  },
  actionRequiredBadge: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  actionRequiredText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },

  // Alert Body
  alertBody: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 12,
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // Alert Footer
  alertFooter: {
    padding: 16,
    paddingTop: 0,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  markReadBtn: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  markReadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  actionBtn: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  // Unread Border
  unreadBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FF6B6B',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 6,
  },
});

// Additional utility styles
export const alertStyles = {
  colors: {
    primary: '#A1D826',
    primaryDark: '#8BC220',
    urgent: '#FF6B6B',
    warning: '#FFA726',
    success: '#A1D826',
    info: '#5AC8FA',
    light: '#f8f9fa',
    dark: '#2c3e50',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};