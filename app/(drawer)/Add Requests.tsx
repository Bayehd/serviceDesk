import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, 
  Platform, Alert 
} from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { useRouter } from 'expo-router';

export default function RequestDetailsScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(true);
  const [openTechnician, setOpenTechnician] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);
  const [openSite, setOpenSite] = useState(false);

  const [requestDetails, setRequestDetails] = useState({
    id: "",
    technician: "",
    requester: "",
    description: "",
    status: "",
    priority: "",
    date: new Date(),
    site: "",
  });

  const technicianOptions = [
    { label: "Abel Uche Ekwonyeaseso", value: "Abel Uche Ekwonyeaseso" },
    { label: "Adewunmi Akinyode", value: "Adewunmi Akinyode" },
    { label: "Adeyemi A. Adeola", value: "Adeyemi A. Adeola" },
  ];
  const statusOptions = [
    { label: "Open", value: "Open" },
    { label: "Closed", value: "Closed" },
    { label: "On Hold", value: "On Hold" },
    { label: "Resolved", value: "Resolved" },
  ];
  const priorityOptions = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
    { label: "Normal", value: "Normal" },
  ];
  const siteOptions = [
    { label: "Accra HQ", value: "Accra HQ" },
    { label: "Tema R&M station", value: "Tema R&M station" },
    { label: "Cotonou R&M station", value: "Cotonou R&M station" },
  ];

  const handleSaveChanges = async () => {
    try {
      if (!requestDetails.requester || !requestDetails.description) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      let requestId = requestDetails.id || doc(collection(db, "requests")).id;
      const requestData = {
        ...requestDetails,
        id: requestId,
        date: serverTimestamp(),
        createdAt: requestDetails.id ? requestDetails.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "requests", requestId), requestData, { merge: true });

      Alert.alert("Success", "Request saved successfully", [
        { text: "OK", onPress: () => router.push("/requests") },
      ]);

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving request:", error);
      Alert.alert("Error", "Failed to save request. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView 
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Request</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Requester *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter requester name"
            value={requestDetails.requester}
            onChangeText={(text) => setRequestDetails((prev) => ({ ...prev, requester: text }))}
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            placeholder="Enter request description"
            multiline
            value={requestDetails.description}
            onChangeText={(text) => setRequestDetails((prev) => ({ ...prev, description: text }))}
          />

          {/* Technician Dropdown */}
          <View style={{ zIndex: 4000 }}>
            <Text style={styles.label}>Assigned to</Text>
            <DropDownPicker
              open={openTechnician}
              value={requestDetails.technician}
              items={technicianOptions}
              setOpen={setOpenTechnician}
              setValue={(callback) => {
                const value = typeof callback === "function" ? callback(requestDetails.technician) : callback;
                setRequestDetails((prev) => ({ ...prev, technician: value }));
              }}
              placeholder="Select technician"
              zIndex={4000}
              listMode="MODAL"
            />
          </View>

          {/* Status Dropdown */}
          <View style={{ zIndex: 3000 }}>
            <Text style={styles.label}>Status</Text>
            <DropDownPicker
              open={openStatus}
              value={requestDetails.status}
              items={statusOptions}
              setOpen={setOpenStatus}
              setValue={(callback) => {
                const value = typeof callback === "function" ? callback(requestDetails.status) : callback;
                setRequestDetails((prev) => ({ ...prev, status: value }));
              }}
              placeholder="Select status"
              zIndex={3000}
              listMode="MODAL"
            />
          </View>

          {/* Priority Dropdown */}
          <View style={{ zIndex: 2000 }}>
            <Text style={styles.label}>Priority</Text>
            <DropDownPicker
              open={openPriority}
              value={requestDetails.priority}
              items={priorityOptions}
              setOpen={setOpenPriority}
              setValue={(callback) => {
                const value = typeof callback === "function" ? callback(requestDetails.priority) : callback;
                setRequestDetails((prev) => ({ ...prev, priority: value }));
              }}
              placeholder="Select priority"
              zIndex={2000}
              listMode="MODAL"
            />
          </View>

          {/* Submit Button */}
          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Submit Request</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollView: { flexGrow: 1, paddingBottom: 20 },
  header: { backgroundColor: "#106ebe", padding: 15, flexDirection: "row", alignItems: "center" },
  backButton: { marginRight: 10, padding: 5 },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  content: { padding: 15 },
  label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5 },
  textInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, backgroundColor: "#fff", marginBottom: 10 },
  descriptionInput: { height: 100, textAlignVertical: "top" },
  saveButton: { backgroundColor: "#106ebe", padding: 15, borderRadius: 5, marginTop: 20, alignItems: "center" },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

