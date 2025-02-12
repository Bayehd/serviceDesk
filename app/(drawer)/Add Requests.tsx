import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-date-picker";
import { Ionicons } from "@expo/vector-icons";

/*const Page = () => {
    return (
        <View style = {{ 
            flex:1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Text> Add Requests</Text>
        </View>
    )
}

export default Page;*/

export default function RequestDetailsScreen() {
    const [isEditing, setIsEditing] = useState(false);
    const [openStatus, setOpenStatus] = useState(false);
    const [openPriority, setOpenPriority] = useState(false);
    const [openSite, setOpenSite] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);

    const [requestDetails, setRequestDetails] = useState({
        id: "11803",
        title: "Mouse not working",
        requester: "Knkansah",
        assignedTo: "Not Assigned",
        status: "Open",
        date: new Date(),
        priority: "Critical",
        time: new Date(),
        technician: "Jennifer Doe",
        site: "Accra HQ",
    });

    
    const statusOptions = [
        { label: "Closed", value: "Closed" },
        { label: "On Hold", value: "On Hold" },
        { label: "Resolved", value: "Resolved" },
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

    return (
        <View style={styles.container}>
           
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{requestDetails.id} - ID</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{requestDetails.title}</Text>
                <Text style={styles.subtitle}>{requestDetails.requester}</Text>

            
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
                    style={styles.dropdown}
                />

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
                />

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
                />


                {/* Date Picker*/}
               <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setOpenDatePicker(true)}
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

                {/* Time Picker */}
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setOpenTimePicker(true)}
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

                {/* Save Button */}
                {isEditing && (
                    <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditing(false)}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Floating Edit Button */}
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
                <Ionicons name={isEditing ? "checkmark" : "create"} size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    header: { backgroundColor: "#106ebe", padding: 15, alignItems: "center" },
    headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
    content: { padding: 15, paddingBottom: 80 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    subtitle: { fontSize: 14, color: "#666", marginBottom: 15 },
    label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5 },
    dropdown: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    datePicker: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
        alignItems: "center",
        marginBottom: 15,
    },
    dateText: { fontSize: 14, color: "#333" },
    saveButton: { backgroundColor: "#106ebe", padding: 12, borderRadius: 5, marginTop: 10, alignItems: "center" },
    saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    editButton: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "#106ebe",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
});
