import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

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

export default function RequestScreen() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

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
  
  const addRequest = async () => {
    try {
      const requestsRef = collection(db, 'requests');
      const newRequest = {
        requester: "New User",
        name: "Request",
        title: "New Issue",
        technician: "",
        priority: "Normal",
        date: serverTimestamp(),
        status: "Open" as const,
      };

      await addDoc(requestsRef, newRequest);
    } catch (err) {
      Alert.alert('Error', 'Failed to add request. Please try again.');
      console.error('Add request error:', err);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
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
    } catch (err) {
      Alert.alert('Error', 'Failed to delete request. Please try again.');
      console.error('Delete request error:', err);
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
    
    const matchesFilter = selectedFilter === 'All' || 
      (selectedFilter === 'Closed' ? 
        ['Closed', 'Resolved'].includes(request.status) : 
        request.status === selectedFilter);
    
    return matchesSearch && matchesFilter;
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
              onLongPress={() => deleteRequest(item.id)}
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
              <Text style={styles.emptyText}>No requests found</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addRequest}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
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
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#106ebe",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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