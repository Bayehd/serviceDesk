import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/config/firebase';
import { useAuth } from '../../context/authContext'; 

interface Request {
  id: string;
  requester: string;
  name: string;
  title: string;
  technician: string;
  priority: string;
  date: any; 
  status: 'Open' | 'Closed' | 'Resolved' | 'Unassigned';
}

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap; 
  color: string;
  onPress: () => void;
  isActive: boolean;
  isAdmin: boolean;
}

type FilterType = 'total' | 'open' | 'closed' | 'resolved' | 'unassigned' | 'highPriority' | null;

export default function ReportsScreen() {
  const { isAdmin } = useAuth(); 
  const [timeframe, setTimeframe] = useState('weekly');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  useEffect(() => {
    const requestsRef = collection(db, "requests");
    const q = query(requestsRef, orderBy("date", "desc")); 
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRequests: Request[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Request, 'id'>;
        return {
          id: doc.id,
          ...data,
        };
      });
  
      setRequests(fetchedRequests);
      setLoading(false);
    }, (error) => {
      setError("Failed to fetch requests");
      console.error("Firestore Error:", error);
      setLoading(false);
    });
  
    return () => unsubscribe(); 
  }, []);

  const statistics = useMemo(() => {
    if (requests.length === 0) {
      return {
        total: 0,
        open: 0,
        closed: 0,
        resolved: 0,
        unassigned: 0,
        highPriority: 0,
      };
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const filterDate = timeframe === 'weekly' ? oneWeekAgo : oneMonthAgo;

    const filteredRequests = requests.filter(request => {
      const requestDate = request.date?.toDate ? 
        request.date.toDate() : 
        new Date(request.date);
      
      return requestDate >= filterDate;
    });

    const stats = {
      total: filteredRequests.length,
      open: filteredRequests.filter(r => r.status === 'Open').length,
      closed: filteredRequests.filter(r => r.status === 'Closed').length,
      resolved: filteredRequests.filter(r => r.status === 'Resolved').length,
      unassigned: filteredRequests.filter(r => r.status === 'Unassigned').length,
      highPriority: filteredRequests.filter(r => (r.priority || '').toLowerCase() === 'high').length,
    };

    return stats;
  }, [timeframe, requests]);

  const filteredRequests = useMemo(() => {
    if (!activeFilter) return [];

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const filterDate = timeframe === 'weekly' ? oneWeekAgo : oneMonthAgo;

    const timeframeFiltered = requests.filter(request => {
      const requestDate = request.date?.toDate ? 
        request.date.toDate() : 
        new Date(request.date);
      
      return requestDate >= filterDate;
    });

    switch (activeFilter) {
      case 'total':
        return timeframeFiltered;
      case 'open':
        return timeframeFiltered.filter(r => r.status === 'Open');
      case 'closed':
        return timeframeFiltered.filter(r => r.status === 'Closed');
      case 'resolved':
        return timeframeFiltered.filter(r => r.status === 'Resolved');
      case 'unassigned':
        return timeframeFiltered.filter(r => r.status === 'Unassigned');
      case 'highPriority':
        return timeframeFiltered.filter(r => (r.priority || '').toLowerCase() === 'high');
      default:
        return [];
    }
  }, [activeFilter, timeframe, requests]);

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, onPress, isActive, isAdmin }) => (
    <TouchableOpacity 
      style={[
        styles.card, 
        { borderLeftColor: color },
        isActive && styles.activeCard,
        !isAdmin && styles.nonAdminCard
      ]}
      onPress={isAdmin ? onPress : undefined}
      disabled={!isAdmin}
      accessibilityLabel={`${title} statistic: ${value}`}
      accessibilityHint={isAdmin ? "Tap to filter requests" : "Admin access required to filter"}
    >
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      {!isAdmin && (
        <View style={styles.lockIconContainer}>
          <Ionicons name="lock-closed" size={14} color="#999" />
        </View>
      )}
    </TouchableOpacity>
  );

  const RequestItem = ({ item }: { item: Request }) => {
    const requestDate = item.date?.toDate ? 
      item.date.toDate() : 
      new Date(item.date);
    
    const formattedDate = requestDate.toLocaleDateString();
    
    const getPriorityColor = (priority: string) => {
      switch((priority || '').toLowerCase()) {
        case 'high': return '#F44336';
        case 'medium': return '#FFC107';
        case 'low': return '#4CAF50';
        default: return '#757575';
      }
    };

    const getStatusIcon = (status: string) => {
      switch(status) {
        case 'Open': return 'folder-open';
        case 'Closed': return 'checkmark-circle';
        case 'Resolved': return 'checkmark-done-circle';
        case 'Unassigned': return 'alert-circle';
        default: return 'help-circle';
      }
    };

    return (
      <View style={styles.requestItem}>
        <View style={styles.requestHeader}>
          <Text style={styles.requestTitle}>{item.title}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{item.priority || 'N/A'}</Text>
          </View>
        </View>
        
        <View style={styles.requestDetails}>
          <View style={styles.requestDetail}>
            <Ionicons name="person" size={16} color="#666" />
            <Text style={styles.requestDetailText}>{item.requester}</Text>
          </View>
          
          <View style={styles.requestDetail}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.requestDetailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.requestDetail}>
            <Ionicons name={getStatusIcon(item.status)} size={16} color="#666" />
            <Text style={styles.requestDetailText}>{item.status}</Text>
          </View>
          
          <View style={styles.requestDetail}>
            <Ionicons name="construct" size={16} color="#666" />
            <Text style={styles.requestDetailText}>{item.technician || 'Unassigned'}</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleCardPress = (filterType: FilterType) => {
  
    if (!isAdmin) return;

    if (activeFilter === filterType) {
      // If clicking the already active filter, clear it
      setActiveFilter(null);
    } else {
      setActiveFilter(filterType);
    }
  };

  const renderListHeader = () => {
    if (!activeFilter) return null;
    
    let title = '';
    switch (activeFilter) {
      case 'total': title = 'All Requests'; break;
      case 'open': title = 'Open Requests'; break;
      case 'closed': title = 'Closed Requests'; break;
      case 'resolved': title = 'Resolved Requests'; break;
      case 'unassigned': title = 'Unassigned Requests'; break;
      case 'highPriority': title = 'High Priority Requests'; break;
    }
    
    return (
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>{title} ({filteredRequests.length})</Text>
        <TouchableOpacity 
          style={styles.clearFilterButton}
          onPress={() => setActiveFilter(null)}
          accessibilityLabel="Clear filter"
          accessibilityHint="Removes the current filter"
        >
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#106ebe" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#F44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
          }}
          accessibilityLabel="Retry loading"
          accessibilityHint="Attempts to load reports again"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timeframeContainer}>
          <TouchableOpacity
            style={[styles.timeframeButton, timeframe === 'weekly' && styles.activeTimeframe]}
            onPress={() => setTimeframe('weekly')}
            accessibilityLabel="Weekly timeframe"
            accessibilityState={{ selected: timeframe === 'weekly' }}
          >
            <Text style={[styles.timeframeText, timeframe === 'weekly' && styles.activeTimeframeText]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeframeButton, timeframe === 'monthly' && styles.activeTimeframe]}
            onPress={() => setTimeframe('monthly')}
            accessibilityLabel="Monthly timeframe"
            accessibilityState={{ selected: timeframe === 'monthly' }}
          >
            <Text style={[styles.timeframeText, timeframe === 'monthly' && styles.activeTimeframeText]}>Monthly</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
          <View style={styles.cardsContainer}>
            <StatCard
              title="Total Requests"
              value={statistics.total}
              icon="documents"
              color="#106ebe"
              onPress={() => handleCardPress('total')}
              isActive={activeFilter === 'total'}
              isAdmin={isAdmin}
            />
            <StatCard
              title="Open"
              value={statistics.open}
              icon="folder-open"
              color="#2196F3"
              onPress={() => handleCardPress('open')}
              isActive={activeFilter === 'open'}
              isAdmin={isAdmin}
            />
            <StatCard
              title="Closed"
              value={statistics.closed}
              icon="checkmark-circle"
              color="#4CAF50"
              onPress={() => handleCardPress('closed')}
              isActive={activeFilter === 'closed'}
              isAdmin={isAdmin}
            />
            <StatCard
              title="Resolved"
              value={statistics.resolved}
              icon="checkmark-done-circle"
              color="#8BC34A"
              onPress={() => handleCardPress('resolved')}
              isActive={activeFilter === 'resolved'}
              isAdmin={isAdmin}
            />
            <StatCard
              title="Unassigned"
              value={statistics.unassigned}
              icon="alert-circle"
              color="#FFC107"
              onPress={() => handleCardPress('unassigned')}
              isActive={activeFilter === 'unassigned'}
              isAdmin={isAdmin}
            />
            <StatCard
              title="High Priority"
              value={statistics.highPriority}
              icon="warning"
              color="#F44336"
              onPress={() => handleCardPress('highPriority')}
              isActive={activeFilter === 'highPriority'}
              isAdmin={isAdmin}
            />
          </View>

          <View style={styles.timeframeInfo}>
            <Ionicons name="information-circle" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.timeframeInfoText}>
              Showing {timeframe === 'weekly' ? 'last 7 days' : 'last 30 days'} statistics
            </Text>
          </View>
          
          {!isAdmin && (
            <View style={styles.adminNoticeContainer}>
              <Ionicons name="lock-closed" size={20} color="#666" />
              <Text style={styles.adminNoticeText}>
                Admin access required to view detailed requests
              </Text>
            </View>
          )}
          
          {isAdmin && activeFilter && (
            <>
              {renderListHeader()}
              <FlatList
                data={filteredRequests}
                keyExtractor={(item) => item.id}
                renderItem={RequestItem}
                contentContainerStyle={styles.requestsList}
                scrollEnabled={false}
                ListEmptyComponent={
                  <View style={styles.emptyListContainer}>
                    <Ionicons name="document" size={32} color="#bbb" />
                    <Text style={styles.emptyListText}>No requests found</Text>
                  </View>
                }
              />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#106ebe',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  activeTimeframe: {
    backgroundColor: 'white',
  },
  timeframeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTimeframeText: {
    color: '#106ebe',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    position: 'relative',
  },
  activeCard: {
    backgroundColor: '#f0f7ff',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  nonAdminCard: {
    opacity: 0.85,
  },
  lockIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#106ebe',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  timeframeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 5,
  },
  timeframeInfoText: {
    color: '#666',
    fontSize: 14,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  clearFilterButton: {
    padding: 5,
  },
  requestsList: {
    paddingBottom: 80,
  },
  requestItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.84,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  requestDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  requestDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 5,
    minWidth: '45%',
  },
  requestDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  emptyListContainer: {
    alignItems: 'center',
    padding: 30,
  },
  emptyListText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
  adminNoticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  adminNoticeText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
});