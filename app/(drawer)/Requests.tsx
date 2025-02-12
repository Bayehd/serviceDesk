import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
//import { DrawerActions } from "@react-navigation/native";
//import { useNavigation } from "expo-router";


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

const Stack = createStackNavigator();

function MyStack(){
  return(
    <Stack.Navigator>

    </Stack.Navigator>
  )
}

// Sample Data
const requests = [
  { id: "11804", name: "Kwame Opare Adufo", title: "GCMA's printer", priority: "", date: "21 Jul 2024, 02:30 PM" },
  { id: "11805", name: "Adeyemi A. Adeola", title: "Unable to browse", priority: "Priority not set", date: "No due date set" },
  { id: "11806", name: "Kwame Opare Adufo", title: "Mouse not working", priority: "Priority not set", date: "No due date set" },
  { id: "11807", name: "Leonard Acquah", title: "Coreg access", priority: "Low", date: "05 Jul 2013, 03:30 AM" },
  { id: "11808", name: "Sam E. Calys Tagoe", title: "Replacement for battery", priority: "Priority not set", date: "No due date set" },
  { id: "11809", name: "Prince T. Okutu", title: "Tema HMI values", priority: "High", date: "No due date set" },
];

// Request Item Component
const RequestItem = ({ item }: { item: any }) => (
  <View style={styles.requestCard}>
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.requestId}>{item.id} • </Text>
      <Text style={styles.requestName}>{item.name}</Text>
    </View>
    <Text style={styles.requestTitle}>{item.title}</Text>
    <Text style={styles.requestDetails}>{item.priority} • {item.date}</Text>
  </View>
);

export default function RequestScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Opened</Text>
         <Button title =" Search" onPress={() => console.log('button pressed')}
             />
      </View>

      {/* Request List */}
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RequestItem item={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { 
    backgroundColor: "#106ebe", 
    padding: 15, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  listContainer: { paddingBottom: 80 },
  requestCard: { 
    backgroundColor: "white", 
    padding: 15, 
    marginVertical: 5, 
    borderRadius: 8, 
    elevation: 2,
  },
  requestId: { fontSize: 14, fontWeight: "bold", color: "#444" },
  requestName: { color: "#666", fontWeight: "400" }, 
  requestTitle: { fontSize: 16, fontWeight: "bold", marginTop: 4 },
  requestDetails: { fontSize: 13, color: "#666", marginTop: 4 },
});
