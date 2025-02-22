import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";


const requests = [
  { id: "11804", name: "Kwame Opare Adufo", title: "GCMA's printer", priority: "", date: "2024-07-21", status: "Open" },
  { id: "11805", name: "Adeyemi A. Adeola", title: "Unable to browse", priority: "Priority not set", date: "2024-07-20", status: "Unassigned" },
  { id: "11806", name: "Kwame Opare Adufo", title: "Mouse not working", priority: "Priority not set", date: "2024-07-19", status: "Open" },
  { id: "11807", name: "Leonard Acquah", title: "Coreg access", priority: "Low", date: "2024-07-18", status: "Resolved" },
  { id: "11808", name: "Sam E. Calys Tagoe", title: "Replacement for battery", priority: "Priority not set", date: "2024-07-17", status: "Closed" },
  { id: "11809", name: "Prince T. Okutu", title: "Tema HMI values", priority: "High", date: "2024-07-16", status: "Open" },
];

export default function ReportsScreen() {
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' or 'monthly'

  const statistics = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const filterDate = timeframe === 'weekly' ? oneWeekAgo : oneMonthAgo;

    const filteredRequests = requests.filter(request => {
      const requestDate = new Date(request.date);
      return requestDate >= filterDate;
    });

    const stats = {
      total: filteredRequests.length,
      open: filteredRequests.filter(r => r.status === 'Open').length,
      closed: filteredRequests.filter(r => r.status === 'Closed').length,
      resolved: filteredRequests.filter(r => r.status === 'Resolved').length,
      unassigned: filteredRequests.filter(r => r.status === 'Unassigned').length,
      highPriority: filteredRequests.filter(r => r.priority === 'High').length,
    };

    return stats;
  }, [timeframe]);

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
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
});