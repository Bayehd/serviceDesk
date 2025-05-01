import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { createRequest } from '../../requestService';

export default function RequestDetailsScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openTechnician, setOpenTechnician] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);
  const [openSite, setOpenSite] = useState(false);

  const [requestDetails, setRequestDetails] = useState({
    requester: "",
    description: "",
    technician: "", 
    status: "Open",
    priority: "Normal",
    site: "",
  });

  const technicianOptions = [
    { label: "Abel Uche Ekwonyeaseso", value: "Abel Uche Ekwonyeaseso" },
    { label: "Adewunmi Akinyode", value: "Adewunmi Akinyode" },
    { label: "Adeyemi A. Adeola", value: "Adeyemi A. Adeola" },
    { label: "Leonard Acquah", value: "Leonard Acquah" },
    { label: "Prince T. Okutu", value: "Prince T. Okutu" },
    { label: "Joseph Appiah", value: "Joseph Appiah"}, 
    { label: "Kwame Opare Adufo", value: "Kwame Opare Adufo" }, 
    { label: "Joshua Sackey", value: "Joshua Sackey" }, 
    { label: "Samuel E.Calys-Tagoe", value: "Samuel E.Calys-Tagoe" }, 
    { label: "Kamoli O. Ganiyu", value: "Kamoli O. Ganiyu" },
    { label: "Gentle Agoh", value: "Gentle Agoh" },
    { label: "Timothy Jide Adebisi", value: "Timothy Jide Adebisi" }
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
    { label: "Takoradi R&M station", value: "Takoradi R&M station" },
    { label: "Lome R&M station", value: "Lome R&M station" },
    { label: "Ikeja", value: "Ikeja" },
  ];

  const resetForm = () => {
    setRequestDetails({
      requester: "",
      description: "",
      technician: "",
      status: "",
      priority: "",
      site: "",
    });
  };

  const handleSaveChanges = async () => {
    try {
      if (!requestDetails.requester || !requestDetails.description) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      setIsSubmitting(true);
      
      
      const requestData = {
        ...requestDetails,
        title: requestDetails.description.split('\n')[0].substring(0, 30),
        name: requestDetails.requester
      };

      await createRequest(requestData);

      
      resetForm();

      Alert.alert("Success", "Request saved successfully", [
        { text: "OK", onPress: () => router.replace("/(drawer)/Requests") },
      ]);
    } catch (error) {
      console.error("Error saving request:", error);
      Alert.alert("Error", "Failed to save request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView 
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
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

         
          <View style={{ zIndex: 3000, marginTop: 10 }}>
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

         
          <View style={{ zIndex: 2000, marginTop: 10 }}>
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
          
        
          <View style={{ zIndex: 1000, marginTop: 10 }}>
            <Text style={styles.label}>Site</Text>
            <DropDownPicker
              open={openSite}
              value={requestDetails.site}
              items={siteOptions}
              setOpen={setOpenSite}
              setValue={(callback) => {
                const value = typeof callback === "function" ? callback(requestDetails.site) : callback;
                setRequestDetails((prev) => ({ ...prev, site: value }));
              }}
              placeholder="Select site"
              zIndex={1000}
              listMode="MODAL"
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, isSubmitting && styles.disabledButton]} 
            onPress={handleSaveChanges}
            disabled={isSubmitting}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollView: { flexGrow: 1, paddingBottom: 20 },
  header: { backgroundColor: "#106ebe", padding: 15, flexDirection: "row", alignItems: "center" },
  content: { padding: 15 },
  label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5 },
  textInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, backgroundColor: "#fff", marginBottom: 10 },
  descriptionInput: { height: 100, textAlignVertical: "top" },
  saveButton: { backgroundColor: "#106ebe", padding: 15, borderRadius: 5, marginTop: 20, alignItems: "center" },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  disabledButton: { backgroundColor: "#9DC2E8", opacity: 0.7 }
});