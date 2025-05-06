import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity,
  View, ActivityIndicator, FlatList
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { createRequest, updateRequest, getRequestById } from '../../requestService';
import { useAuth } from "@/context/authContext";

interface RequestDetails {
  id?: string;
  requester: string;
  description: string;
  technician: string;
  status: string;
  priority: string;
  site: string;
  requesterUID?: string;
}

export default function RequestDetailsScreen() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const params = useLocalSearchParams();
  
  const requestId = params.requestId as string;
  const isEditMode = params.edit === "true";
  
  const [isLoading, setIsLoading] = useState<boolean>(requestId ? true : false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [openTechnician, setOpenTechnician] = useState<boolean>(false);
  const [openStatus, setOpenStatus] = useState<boolean>(false);
  const [openPriority, setOpenPriority] = useState<boolean>(false);
  const [openSite, setOpenSite] = useState<boolean>(false);
  const [showRequesterSuggestions, setShowRequesterSuggestions] = useState<boolean>(false);
  const [filteredRequesters, setFilteredRequesters] = useState<string[]>([]);
  
  console.log('User object:', user);
  console.log('Edit mode:', isEditMode, 'Request ID:', requestId);
  
  const possibleRequesters: string[] = [
    "knkansah",
    "Datsbe",
    "Onyarko",
    "Kosei",
    "Pbekoe",
    "Sashley",
    "Jappiah",
    "Jsackey",
    "Sagyoe",
    "Asulaiman",
    "Copoku",
    "Chodasi",
    "dneequaye",
    "Dattobrah",
    "Ehanson"
  ];

  const [requestDetails, setRequestDetails] = useState<RequestDetails>({
    requester: "",
    description: "",
    technician: "", 
    status: "Open", 
    priority: "Low [ ** User only **]", 
    site: "",
  });

  useEffect(() => {
    if (requestId) {
      const fetchRequestDetails = async () => {
        try {
          setIsLoading(true);
          const requestData = await getRequestById(requestId);
          if (requestData) {
            setRequestDetails({
              id: requestId,
              requester: requestData.requester || "",
              description: requestData.description || "",
              technician: requestData.technician || "",
              status: requestData.status || "Open",
              priority: requestData.priority || "Low [ ** User only **]",
              site: requestData.site || "",
              requesterUID: requestData.requesterUID || "",
            });
          }
        } catch (error) {
          console.error("Error fetching request details:", error);
          Alert.alert("Error", "Failed to load request details");
        } finally {
          setIsLoading(false);
        }
      };

      fetchRequestDetails();
    } else if (user && user.email) {
      const username = user.email.split('@')[0];
      setRequestDetails(prev => ({
        ...prev,
        requester: username,
        requesterUID: user.uid
      }));
    }
  }, [requestId, user]);

  const handleRequesterChange = (text: string) => {
    setRequestDetails(prev => ({ ...prev, requester: text }));
    
    if (text.length === 0) {
      setFilteredRequesters(possibleRequesters);
      setShowRequesterSuggestions(true);
    } else {
      const filtered = possibleRequesters.filter(
        item => item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRequesters(filtered);
      setShowRequesterSuggestions(filtered.length > 0);
    }
  };

  const selectRequester = (requester: string) => {
    setRequestDetails(prev => ({ ...prev, requester }));
    setShowRequesterSuggestions(false);
  };
  
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
  
  const adminStatusOptions = [
    { label: "Open", value: "Open" },
    { label: "Closed", value: "Closed" },
    { label: "On Hold", value: "On Hold" },
    { label: "Resolved", value: "Resolved" },
  ];
  
  const userStatusOptions = [
    { label: "Open", value: "Open" },
  ];
  
  const statusOptions = isAdmin ? adminStatusOptions : userStatusOptions;
  
  const priorityOptions = [
    { label: "High [ ** Entire Organisation **]", value: "High [ ** Entire Organisation **]" },
    { label: "Medium [ ** Department only **]", value: "Medium [ ** Department only **]" },
    { label: "Low [ ** User only **]", value: "Low [ ** User only **]" },
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
      requester: user?.email ? user.email.split('@')[0] : "",
      description: "",
      technician: "",
      status: "Open", 
      priority: "Low [ ** User only **]", 
      site: "",
      requesterUID: user?.uid || "",
    });
  };

  const handleSaveChanges = async () => {
    try {
      if (!requestDetails.requester || !requestDetails.description) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      setIsSubmitting(true);
      
      if (requestId) {
        // Check if the current user is the owner or an admin
        const canEdit = isAdmin || (user?.uid === requestDetails.requesterUID);
        
        if (!canEdit) {
          Alert.alert('Error', 'You do not have permission to edit this request');
          setIsSubmitting(false);
          return;
        }
        
        const requestData = {
          ...requestDetails,
          id: requestId,
          title: requestDetails.description.split('\n')[0].substring(0, 30),
          name: requestDetails.requester,
          updatedAt: new Date(),
          updatedBy: user?.uid || '',
        };

        console.log('Updating request data:', requestData);
        await updateRequest(requestId, requestData);
        
        Alert.alert("Success", "Request updated successfully", [
          { text: "OK", onPress: () => router.replace("/(drawer)/Requests") },
        ]);
      } else {
        const requestData = {
          ...requestDetails,
          title: requestDetails.description.split('\n')[0].substring(0, 30),
          name: requestDetails.requester,
          requesterUID: user?.uid || '',
          requesterEmail: user?.email || '',
          createdAt: new Date(),
          status: "Open"  // Ensure new requests are always set to "Open"
        };

        console.log('Submitting new request data:', requestData);
        await createRequest(requestData);
        resetForm();

        Alert.alert("Success", "Request created successfully", [
          { text: "OK", onPress: () => router.replace("/(drawer)/Requests") },
        ]);
      }
    } catch (error) {
      console.error("Error saving request:", error);
      Alert.alert("Error", "Failed to save request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if user can edit this form (is admin or is the request creator)
  const canEditAssignedFields = isAdmin;
  const isOwner = user?.uid === requestDetails.requesterUID;
  const canEditRequest = isAdmin || isOwner;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#106ebe" />
        <Text style={styles.loadingText}>Loading request details...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView 
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {requestId && (
            <View style={styles.editModeHeader}>
              <Text style={styles.editModeText}>
                {isAdmin ? "Admin Edit Mode" : isOwner ? "Editing Your Request" : "Viewing Request"}
              </Text>
            </View>
          )}
          
          <View style={styles.formField}>
            <Text style={styles.label}>Requester *</Text>
            <View style={styles.requesterInputContainer}>
              <TextInput
                style={[styles.textInput, !canEditRequest && styles.disabledInput]}
                placeholder="Enter requester name"
                value={requestDetails.requester}
                onChangeText={handleRequesterChange}
                editable={canEditRequest}
                onFocus={() => {
                  if (!canEditRequest) return;
                  
                  // Show all options on focus if field is empty
                  if (!requestDetails.requester) {
                    setFilteredRequesters(possibleRequesters);
                    setShowRequesterSuggestions(true);
                  } else {
                    // Filter based on current text
                    const filtered = possibleRequesters.filter(
                      item => item.toLowerCase().includes(requestDetails.requester.toLowerCase())
                    );
                    setFilteredRequesters(filtered);
                    setShowRequesterSuggestions(filtered.length > 0);
                  }
                }}
              />
              {showRequesterSuggestions && canEditRequest && (
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    data={filteredRequesters}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => selectRequester(item)}
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    )}
                    nestedScrollEnabled={true}
                    style={{ maxHeight: 150 }}
                  />
                </View>
              )}
            </View>
          </View>

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[
              styles.textInput, 
              styles.descriptionInput,
              !canEditRequest && styles.disabledInput
            ]}
            placeholder="Enter request description"
            multiline
            value={requestDetails.description}
            editable={canEditRequest}
            onChangeText={(text) => setRequestDetails((prev) => ({ ...prev, description: text }))}
          />

          <View style={{ zIndex: 4000, marginTop: 20 }}>
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
              disabled={!canEditAssignedFields}
              style={!canEditAssignedFields ? styles.disabledDropdown : {}}
            />
            {!canEditAssignedFields && (
              <Text style={styles.infoText}>Only admins can assign technicians</Text>
            )}
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
              disabled={!canEditAssignedFields}
              style={!canEditAssignedFields ? styles.disabledDropdown : {}}
            />
            {!canEditAssignedFields && (
              <Text style={styles.infoText}>Only admins can change the status</Text>
            )}
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
              disabled={!canEditAssignedFields}
              style={!canEditAssignedFields ? styles.disabledDropdown : {}}
            /> 
            {!canEditAssignedFields && (
              <Text style={styles.infoText}>Only admins can change the priority</Text>
            )}
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
              disabled={!canEditRequest}
              style={!canEditRequest ? styles.disabledDropdown : {}}
            />
          </View>

          {canEditRequest && (
            <TouchableOpacity 
              style={[styles.saveButton, isSubmitting && styles.disabledButton]} 
              onPress={handleSaveChanges}
              disabled={isSubmitting}
            >
              <Text style={styles.saveButtonText}>
                {isSubmitting ? "Submitting..." : requestId ? "Update Request" : "Submit Request"}
              </Text>
            </TouchableOpacity>
          )}
          
          {!canEditRequest && requestId && (
            <View style={styles.viewOnlyNotice}>
              <Text style={styles.viewOnlyText}>
                You are in view-only mode. Only the request owner or admins can edit this request.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  scrollView: {
    flexGrow: 1, 
    paddingBottom: 20 
  },
  header: {
    backgroundColor: "#106ebe",
    padding: 15, 
    flexDirection: "row",
    alignItems: "center" 
  },
  adminBanner: {
    backgroundColor: "#1565c0",
    padding: 8,
    margin: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  adminBannerText: {
    color: "white",
    fontWeight: "bold",
  },
  editModeHeader: {
    backgroundColor: "#106ebe",
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  editModeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    padding: 15,
  },
  formField: {
    marginBottom: 5,
  },
  requesterInputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  label: {
    fontSize: 14, 
    fontWeight: "bold",
    color: "#333", 
    marginBottom: 5 
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc", 
    borderRadius: 5, 
    padding: 10, 
    backgroundColor: "#fff",
    marginBottom: 10 
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7
  },
  descriptionInput: {
    height: 100, 
    textAlignVertical: "top" 
  },
  saveButton: {
    backgroundColor: "#106ebe", 
    padding: 15, 
    borderRadius: 5, 
    marginTop: 20, 
    alignItems: "center" 
  },
  saveButtonText: {
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  disabledButton: { 
    backgroundColor: "#9DC2E8", 
    opacity: 0.7 
  },
  disabledDropdown: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7
  },
  suggestionsContainer: { 
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: -5,
    width: '100%',
    position: 'absolute',
    top: 45, 
    left: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999, 
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 5
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f5f5f5"
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#106ebe"
  },
  viewOnlyNotice: {
    backgroundColor: "#f8d7da",
    padding: 15,
    borderRadius: 5,
    marginTop: 20
  },
  viewOnlyText: {
    color: "#721c24",
    fontSize: 14,
    textAlign: "center"
  }
});