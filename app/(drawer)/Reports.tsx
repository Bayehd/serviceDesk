import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/config/firebase';

interface Request {
  id: string;
  requester: string;
  name: string;
  title: string;
  technician: string;
  priority: string;
  date: any; // Firestore Timestamp
  status: 'Open' | 'Closed' | 'Resolved' | 'Unassigned';
}


interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap; // This is the key fix
  color: string;
}

export default function ReportsScreen() {
  const [timeframe, setTimeframe] = useState('weekly');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch requests from Firestore
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

  // StatCard component with proper type annotations
  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );

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
          >
            <Text style={[styles.timeframeText, timeframe === 'weekly' && styles.activeTimeframeText]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeframeButton, timeframe === 'monthly' && styles.activeTimeframe]}
            onPress={() => setTimeframe('monthly')}
          >
            <Text style={[styles.timeframeText, timeframe === 'monthly' && styles.activeTimeframeText]}>Monthly</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.cardsContainer}>
          <StatCard
            title="Total Requests"
            value={statistics.total}
            icon="documents"
            color="#106ebe"
          />
          <StatCard
            title="Open"
            value={statistics.open}
            icon="folder-open"
            color="#2196F3"
          />
          <StatCard
            title="Closed"
            value={statistics.closed}
            icon="checkmark-circle"
            color="#4CAF50"
          />
          <StatCard
            title="Resolved"
            value={statistics.resolved}
            icon="checkmark-done-circle"
            color="#8BC34A"
          />
          <StatCard
            title="Unassigned"
            value={statistics.unassigned}
            icon="alert-circle"
            color="#FFC107"
          />
          <StatCard
            title="High Priority"
            value={statistics.highPriority}
            icon="warning"
            color="#F44336"
          />
        </View>

        <View style={styles.timeframeInfo}>
          <Ionicons name="information-circle" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.timeframeInfoText}>
            Showing {timeframe === 'weekly' ? 'last 7 days' : 'last 30 days'} statistics
          </Text>
        </View>
      </ScrollView>
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
});