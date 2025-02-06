import React from "react";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { View, Text,  FlatList, TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**const Page = () => {
    const navigation =useNavigation();

    const onToggle = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };
    return ( 
        <View style = {{ 
            flex:1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Text> Open and Closed Requests</Text>
           
        </View>
    );
};

export default Page;*/

//const navigation =useNavigation();


const requests = [
  { id: "#98", name: "Andrew Woods", title: "Need to change the Location", priority: "Low", date: "21 Jul 2015, 02:30 PM" },
  { id: "#75", name: "Demo", title: "Unable to browse", priority: "Priority not set", date: "No due date set" },
  { id: "#71", name: "Shawn Adams", title: "Websites don't load", priority: "Priority not set", date: "No due date set" },
  { id: "#66", name: "Guest", title: "Please provide the requested resources for the new...", priority: "Priority not set", date: "05 Jul 2013, 03:30 AM" },
  { id: "#63", name: "Kasam", title: "Laptop is not Working", priority: "Priority not set", date: "No due date set" },
  { id: "#61", name: "Daniel", title: "Provide the Exchange access", priority: "Priority not set", date: "No due date set" },
];

const RequestItem = ({ item }: { item: any }) => (
  <View style={styles.requestCard}>
    <Text style={styles.requestId}>{item.id}  •  <Text style={styles.requestName}>{item.name}</Text></Text>
    <Text style={styles.requestTitle}>{item.title}</Text>
    <Text style={styles.requestDetails}>{item.priority}  •  {item.date}</Text>
  </View>
);

export default function RequestScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Opened</Text>
        <Ionicons name="search" size={24} color="white" />
      </View>

      {/* Request List */}
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={RequestItem}
        contentContainerStyle={styles.listContainer}
      />

    </View>
  );
}

const styles = ({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { 
    backgroundColor: "#106ebe", 
    padding: 15, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center"
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  listContainer: { paddingBottom: 80 },
  requestCard: { 
    backgroundColor: "white", 
    padding: 15, 
    marginVertical: 5, 
    borderRadius: 8, 
    elevation: 2 
  },
  requestId: { fontSize: 14, fontWeight: "bold", color: "#444" },
  requestName: { color: "#666", fontWeight: "normal" },
  requestTitle: { fontSize: 16, fontWeight: "bold", marginTop: 4 },
  requestDetails: { fontSize: 13, color: "#666", marginTop: 4 },
  
});