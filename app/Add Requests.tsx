import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

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
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [requestDetails, setRequestDetails] = useState({
        id: "11803",
        title: "Mouse not working",
        requester: "Knkansah",
        AssignedTo: "Not Assigned",
        status: "Open",
        date: new Date().toISOString().split("T")[0], // Default to today's date
        priority: "Critical",
        time: "Not Assigned",
        Technician: "Jeniffer Doe",
        site: "Accra HQ", // Default value
    });

    // Update field values
    const handleChange = (field: string, value: string) => {
        setRequestDetails((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{requestDetails.id} - Request ID</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{requestDetails.title}</Text>
                <Text style={styles.subtitle}>{requestDetails.requester}</Text>

                {/* Editable Fields */}
                {Object.keys(requestDetails).map((key, index) => {
                    if (["id", "title", "requester"].includes(key)) return null;

                    return (
                        <View key={index} style={styles.fieldContainer}>
                            <Text style={styles.label}>{key.replace(/([A-Z])/g, " $1").trim()}</Text>
                            
                            {isEditing ? (
                                key === "status" ? (
                                    <Picker
                                        selectedValue={requestDetails.status}
                                        style={styles.picker}
                                        onValueChange={(itemValue: string) => handleChange("status", itemValue)}
                                    >
                                        <Picker.Item label="Closed" value="Closed" />
                                        <Picker.Item label="On Hold" value="On Hold" />
                                        <Picker.Item label="Resolved" value="Resolved" />
                                    </Picker>
                                ) : key === "priority" ? (
                                    <Picker
                                        selectedValue={requestDetails.priority}
                                        style={styles.picker}
                                        onValueChange={(itemValue: string) => handleChange("priority", itemValue)}
                                    >
                                        <Picker.Item label="High" value="High" />
                                        <Picker.Item label="Medium" value="Medium" />
                                        <Picker.Item label="Normal" value="Normal" />
                                        <Picker.Item label="Low" value="Low" />
                                    </Picker>
                                ) : key === "site" ? (
                                    <Picker
                                        selectedValue={requestDetails.site}
                                        style={styles.picker}
                                        onValueChange={(itemValue: string) => handleChange("site", itemValue)}
                                    >
                                        <Picker.Item label="Accra HQ" value="Accra HQ" />
                                        <Picker.Item label="Cotonou R&M station" value="Cotonou R&M station" />
                                        <Picker.Item label="Itoki R&M station" value="Itoki R&M station" />
                                        <Picker.Item label="LBCS" value="LBCS" />
                                        <Picker.Item label="Lome R&M station" value="Lome R&M station" />
                                        <Picker.Item label="Takoradi R&M station" value="Takoradi R&M station" />
                                        <Picker.Item label="Tema R&M station" value="Tema R&M station" />
                                    </Picker>
                                ) : key === "date" ? (
                                    <>
                                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                                            <Text>{requestDetails.date}</Text>
                                        </TouchableOpacity>
                                        {showDatePicker && (
                                            <DateTimePicker
                                                value={new Date(requestDetails.date)}
                                                mode="date"
                                                display="default"
                                                onChange={(event: any, selectedDate: { toISOString: () => string; }) => {
                                                    setShowDatePicker(false);
                                                    if (selectedDate) {
                                                        handleChange("date", selectedDate.toISOString().split("T")[0]);
                                                    }
                                                }}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <TextInput
                                        style={styles.input}
                                        value={requestDetails[key as keyof typeof requestDetails]}
                                        onChangeText={(text) => handleChange(key, text)}
                                    />
                                )
                            ) : (
                                <Text style={styles.value}>{requestDetails[key as keyof typeof requestDetails]}</Text>
                            )}
                        </View>
                    );
                })}

                {/* Save Button (Visible in Edit Mode) */}
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
    fieldContainer: { marginBottom: 10 },
    label: { fontSize: 14, fontWeight: "bold", color: "#333" },
    value: { fontSize: 14, color: "#555", paddingVertical: 5 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        fontSize: 14,
        backgroundColor: "#fff",
    },
    picker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    dateButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        backgroundColor: "#fff",
        alignItems: "center",
    },
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
