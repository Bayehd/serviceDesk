import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

const initialRequests = [
  { id: "11804", requester: "Oayeh", name: "Kwame Opare Adufo", title: "GCMA's printer", priority: "", date: "21 Jul 2024, 02:30 PM", status: "Open" },
  { id: "11805", requester: "Oayeh", name: "Adeyemi A. Adeola", title: "Unable to browse", priority: "Priority not set", date: "No due date set", status: "Unassigned" },
  { id: "11806", requester: "Oayeh", name: "Kwame Opare Adufo", title: "Mouse not working", priority: "Priority not set", date: "No due date set", status: "Open" },
  { id: "11807", requester: "Oayeh", name: "Leonard Acquah", title: "Coreg access", priority: "Low", date: "05 Jul 2013, 03:30 AM", status: "Resolved" },
  { id: "11808", requester: "Oayeh", name: "Sam E. Calys Tagoe", title: "Replacement for battery", priority: "Priority not set", date: "No due date set", status: "Closed" },
  { id: "11809", requester: "Oayeh", name: "Prince T. Okutu", title: "Tema HMI values", priority: "High", date: "No due date set", status: "Open" },
];


const RequestItem = ({ item }: { item: any }) => (
  <TouchableOpacity style={styles.requestCard}>
    <View>
      <Text style={styles.requestId}>{item.id} •  {item.requester}</Text>
    </View>
    <Text>{item.name}</Text>
    <Text style={styles.requestTitle}>{item.title}</Text>
    <View style={styles.detailsRow}>
      <Text >{item.priority} • {item.date}</Text>
      <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const getStatusStyle = (status: any) => {
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

export default function RequestScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredRequests, setFilteredRequests] = useState(initialRequests);

  const filterOptions = [
    { label: "All Requests", value: "All" },
    { label: "Open Requests", value: "Open" },
    { label: "Unassigned", value: "Unassigned" },
    { label: "Closed/Resolved", value: "Closed" },
  ];

  const filterRequests = useCallback(() => {
    let results = initialRequests;

    // Apply status filter
    if (selectedFilter !== "All") {
      if (selectedFilter === "Closed") {
        results = results.filter(request => 
          request.status === "Closed" || request.status === "Resolved"
        );
      } else {
        results = results.filter(request => request.status === selectedFilter);
      }
    }

    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(request =>
        request.title.toLowerCase().includes(query) ||
        request.name.toLowerCase().includes(query) ||
        request.id.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(results);
  }, [searchQuery, selectedFilter]);

  React.useEffect(() => {
    filterRequests();
  }, [filterRequests]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <DropDownPicker
            open={openFilter}
            value={selectedFilter}
            items={filterOptions}
            setOpen={setOpenFilter}
            setValue={setSelectedFilter}
            style={styles.filterPicker}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.filterText}
            placeholder="Filter Requests"
          />
        </View>
      </View>

      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search requests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RequestItem item={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No requests found</Text>
          </View>
        }
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  header: { 
    backgroundColor: "#106ebe", 
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  filterContainer: {
    zIndex: 1000,
  },
  filterPicker: {
    backgroundColor: "white",
    borderWidth: 0,
    height: 40,
  
  },
  filterText: {
    color: "#333",
    fontSize: 14,
  },
  dropDownContainer: {
    backgroundColor: "white",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: "50%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10,
    marginLeft: "50%",
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 7,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  listContainer: { 
    padding: 10,
    paddingBottom: 80 
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
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  requestId: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#444" 
  }, 
  requestTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginTop: 4,
    color: "#106ebe",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  requestDetails: { 
    fontSize: 13, 
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "900",
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
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});