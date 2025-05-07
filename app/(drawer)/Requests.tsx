import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../lib/config/firebase';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'expo-router';

interface Request {
  id: string;
  requester: string;
  requesterEmail: string;
  requesterUID: string;
  name: string;
  title: string;
  technician: string;
  priority: string;
  date: any;
  status: 'Open' | 'Closed' | 'Resolved' | 'Unassigned';
  description?: string;
  site?: string;
}

export default function RequestScreen() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    return fetchRequests();
  }, [user, isAdmin]);

  const fetchRequests = () => {
    if (!user) return () => {};
    
    const requestsRef = collection(db, "requests");
    let requestsQuery;
    
    if (isAdmin) {
      requestsQuery = query(requestsRef, orderBy("date", "desc"));
    } else {
      requestsQuery = query(
        requestsRef,
        where("requesterUID", "==", user.uid),
        orderBy("date", "desc")
      );
    }
  
    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
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
  
    return unsubscribe;
  };
  
  const deleteRequest = async (id: string, requesterUID: string) => {
    try {
      if (!user) {
        Alert.alert('Error', 'You must be logged in to delete requests.');
        return;
      }
      if (isAdmin || user.uid === requesterUID) {
        Alert.alert(
          'Delete Request',
          'Are you sure you want to delete this request?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                const requestRef = doc(db, 'requests', id);
                await deleteDoc(requestRef);
              },
            },
          ]
        );
      } else {
        Alert.alert('Permission Denied', 'You can only delete your own requests.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to delete request. Please try again.');
      console.error('Delete request error:', err);
    }
  };

  const handleRequestPress = (request: Request) => {
    if (isAdmin) {
      router.push({
        pathname: "/(drawer)/addRequests",
        params: {
          requestId: request.id,
          edit: "true"
        }
      });
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Open':
        return styles.statusOpen;
      case 'Closed':
        return styles.statusClosed;
      case 'Resolved':
        return styles.statusResolved;
      case 'Unassigned':
        return styles.statusUnassigned;
      default:
        return {};
    }
  };

  const filteredRequests = requests.filter((request) => {
    const title = request.title || '';
    const name = request.name || '';
    
    const matchesSearch = searchQuery.toLowerCase() === '' ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });
  
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            fetchRequests();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search requests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          placeholderTextColor="#666"
        />
      </View>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#106ebe" />
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.requestCard}
              onPress={() => handleRequestPress(item)}
              onLongPress={() => deleteRequest(item.id, item.requesterUID)}
            >
              <View style={styles.requestHeader}>
                <Text style={styles.requestTitle}>{item.title}</Text>
                <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.requestDetails}>{item.name}</Text>
              <Text style={styles.technician}>{item.technician || 'Unassigned'}</Text>
              <Text style={styles.requestDetails}>Priority: {item.priority}</Text>
              <Text style={styles.requestDate}>
                {item.date?.toDate?.()?.toLocaleString() || 'No date'}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isAdmin
                  ? "No requests found in the system"
                  : "You haven't submitted any requests yet"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: "#106ebe",
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "white",
    margin: 10,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80,
  },
  requestCard: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#106ebe",
    flex: 1,
  },
  requestDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  technician: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "500",
  },
  requestDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusOpen: {
    backgroundColor: "#e3f2fd",
  },
  statusClosed: {
    backgroundColor: "#ffebee",
  },
  statusResolved: {
    backgroundColor: "#e8f5e9",
  },
  statusUnassigned: {
    backgroundColor: "#fff3e0",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    marginBottom: 16,
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
});