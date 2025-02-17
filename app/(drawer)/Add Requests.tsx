import { View, Text, TextInput, TouchableOpacity,ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-date-picker";
import { Ionicons } from "@expo/vector-icons";

export default function RequestDetailsScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [openTechnician, SetOpenTechnician] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);
  const [openSite, setOpenSite] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const [requestDetails, setRequestDetails] = useState({
    id: "11803",
    technician: "",
    Description: "Mouse not working",
    status: "Open",
    priority: "",
    date: new Date(),
    site: "Accra HQ",
    time: new Date(),
  });
   
  const technicianOptions =[
    { label: "Abel Uche Ekwonyeaseso", value : "Abel Uche Ekwonyeaseso"},
    { label: "Adewunmi Akinyode", value : "Adewunmi Akinyode"},
    { label: "Adeyemi A. Adeola", value : "Adeyemi A. Adeola"},
    { label: "Gentle Agoh", value : "Gentle Agoh"},
    { label: "James Kudjoe Abakwam", value : "James Kudjoe Abakwam"},
    { label: "Kamoli O. Ganiyu", value : "Kamoli O. Ganiyu"},
    { label: "Kwame Opare Adufo", value : "Kwame Opare Adufo"},
    { label: "Leonard Acquah", value : "Leonard Acquah"},
    { label: "Prince T. Okutu", value : "Prince T. Okutu"},
    { label: "Samuel E. Calys Tagoe", value : "Samuel E. Calys Tagoe"},
    { label: "Timothy Jide Adebisi", value : "Timothy Jide Adebisi"},
  ]
  const statusOptions = [
    { label: "Closed", value: "Closed" },
    { label: "On Hold", value: "On Hold" },
    { label: "Resolved", value: "Resolved" },
    { label: "Open", value: "Open" },
  ];

  const priorityOptions = [
    { label: "High", value: "High" },
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "Normal", value: "Normal" },
  ];

  const siteOptions = [
    { label: "Accra HQ", value: "Accra HQ" },
    { label: "Cotonou R&M station", value: "Cotonou R&M station" },
    { label: "Itoki R&M station", value: "Itoki R&M station" },
    { label: "LBCS", value: "LBCS" },
    { label: "Lome R&M station", value: "Lome R&M station" },
    { label: "Takoradi R&M station", value: "Takoradi R&M station" },
    { label: "Tema R&M station", value: "Tema R&M station" },
  ];

  const handleSaveChanges = () => {
    setIsEditing(false);
    SetOpenTechnician(false);
    setOpenStatus(false);
    setOpenPriority(false);
    setOpenSite(false);

  };

  const renderValue = (value: string, options: any[]) => {
    const option = options.find((opt: { value: any; }) => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{requestDetails.id} - ID</Text>
      </View>

      <View style={styles.content}>
        <View>

        <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            placeholderTextColor="#6b7280"
            editable={isEditing}
            value={requestDetails.Description}
            onChangeText={(text) => setRequestDetails(prev => ({ ...prev, Description: text }))}
          />
        </View>

          <Text style={styles.label}>Assigned to</Text>
          {isEditing ? (
          <ScrollView >
            <View style={{ zIndex: 4000 }}>
            <DropDownPicker
              open={openTechnician}
              value={requestDetails.technician}
              items={technicianOptions}
              setOpen={SetOpenTechnician}
              setValue={(callback) => {
                const value = typeof callback === "function" ? callback(requestDetails.technician) : callback;
                setRequestDetails((prev) => ({ ...prev, technician: value }));
              }}
              style={styles.dropdown}
              placeholder="Select technician"
              maxHeight={200}
              listMode="SCROLLVIEW"
            />
            </View>
          </ScrollView>
        ) : (
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>
            {renderValue(requestDetails.technician, technicianOptions) || "No technician selected"}
            </Text>
          </View>
        )}
          

        <Text style={styles.label}>Status</Text>
        {isEditing ? (
          <View style={{ zIndex: 3000 }}>
            <DropDownPicker
              open={openStatus}
              value={requestDetails.status}
              items={statusOptions}
              setOpen={setOpenStatus}
              setValue={(callback) => {
                const value = typeof callback === "function" ? callback(requestDetails.status) : callback;
                setRequestDetails((prev) => ({ ...prev, status: value }));
              }}
              style={styles.dropdown}
              placeholder=" select status"
            />
          </View>
        ) : (
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>
            {renderValue(requestDetails.status, statusOptions) || "No status selected"}
            </Text>
          </View>
        )}

        <Text style={styles.label}>Priority</Text>
        {isEditing ? (
          <View style={{ zIndex: 2000 }}>
            <DropDownPicker
              open={openPriority}
              value={requestDetails.priority}
              items={priorityOptions}
              setOpen={setOpenPriority}
              setValue={(callback) => {
                const value = typeof callback === "function" ? callback(requestDetails.priority) : callback;
                setRequestDetails((prev) => ({ ...prev, priority: value }));
              }}
              style={styles.dropdown}
               placeholder="select priority"
            />
          </View>
        ) : (
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>
            {renderValue(requestDetails.priority, priorityOptions) || "No priority selected"}
            </Text>
          </View>
        )}

        <Text style={styles.label}>Site</Text>
        {isEditing ? (
          <View style={{ zIndex: 1000 }}>
            <DropDownPicker
              open={openSite}
              value={requestDetails.site}
              items={siteOptions}
              setOpen={setOpenSite}
              setValue={(callback) => {
                const value = typeof callback === "function" ? callback(requestDetails.site) : callback;
                setRequestDetails((prev) => ({ ...prev, site: value }));
              }}
              style={styles.dropdown}
              placeholder="select site"
            />
          </View>
        ) : (
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>
            {renderValue(requestDetails.site, siteOptions) || "No site selected"}
            </Text>
          </View>
        )}

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity 
          style={styles.datePicker} 
          onPress={() => isEditing && setOpenDatePicker(true)}
        >
          <Text style={styles.dateText}>{requestDetails.date.toDateString()}</Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openDatePicker}
          date={requestDetails.date}
          mode="date"
          onConfirm={(date) => {
            setOpenDatePicker(false);
            setRequestDetails((prev) => ({ ...prev, date }));
          }}
          onCancel={() => setOpenDatePicker(false)}
        />

        <Text style={styles.label}>Time</Text>
        <TouchableOpacity 
          style={styles.datePicker} 
          onPress={() => isEditing && setOpenTimePicker(true)}
        >
          <Text style={styles.dateText}>{requestDetails.time.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openTimePicker}
          date={requestDetails.time}
          mode="time"
          onConfirm={(time) => {
            setOpenTimePicker(false);
            setRequestDetails((prev) => ({ ...prev, time }));
          }}
          onCancel={() => setOpenTimePicker(false)}
        />

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
        <Ionicons name={isEditing ? "checkmark" : "create"} size={24} color="white" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { backgroundColor: "#106ebe", padding: 15, alignItems: "center" },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  content: { padding: 15, paddingBottom: 80 },
  label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5, marginTop: 5 },
  dropdown: { marginBottom: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, backgroundColor: "#fff" },
  datePicker: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, backgroundColor: "#fff", alignItems: "center", marginBottom: 15 },
  dateText: { fontSize: 14, color: "#333" },
  saveButton: { backgroundColor: "#106ebe", padding: 12, borderRadius: 5, marginTop: 10, alignItems: "center" },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  editButton: { position: "absolute", right: 20, bottom: 20, backgroundColor: "#106ebe", width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", elevation: 5 },
  title: { fontSize: 16, marginBottom: 5 },
  subtitle: { fontSize: 16, marginBottom: 15 },
  textInput: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, backgroundColor: "#fff", alignItems: "center", marginBottom: 15 },
  readOnlyField: { 
    padding: 10, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 5, 
    backgroundColor: "#fff", 
    marginBottom: 15 
  },
  readOnlyText: { 
    fontSize: 14, 
    color: "#333" 
  },
 
}); 