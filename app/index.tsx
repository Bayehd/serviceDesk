import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { auth, LoginSchema, LoginSchemaType, usersCollection } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Controller, useForm } from "react-hook-form";
import { getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/context/authContext";

export default function AuthScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    defaultValues: {
      email: "gyekye@gmail.com",
      password: "gyekye@gmail.com",
    },
    resolver: zodResolver(LoginSchema),
  });
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleAuth(data: LoginSchemaType) {
    setLoading(true);

    try {
      const user = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (!user) {
        Alert.alert("Error", "Failed to log in. Please try again.");
        return;
      }
      const { user: firebaseUser } = user;
      const q = query(
        usersCollection,
        where("email", "==", firebaseUser.email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "User not found. Please check your email.");
        return;
      }
      const userDoc = querySnapshot.docs[0].data();

      setUser(userDoc);
      Alert.alert("Success", `Welcome back, ${userDoc.email}!`);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Authentication Failed",
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.push("/signup")}>
          <Text>Press</Text>
        </Pressable>
        <Image source={require("../assets/loginn.png")} style={styles.image} />

        <Text style={styles.title}>Service Desk</Text>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter your email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
          name="email"
        />
        {errors.email && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              secureTextEntry={true}
              placeholder="Enter password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
            />
          )}
          name="password"
        />
        {errors.password && <Text>This is required.</Text>}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handleAuth)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>SIGN IN</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  image: {
    width: "90%",
    height: "50%",
    resizeMode: "contain",
  },
  title: {
    color: "#106ebe",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 20,
  },
  textInput: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    width: "90%",
    backgroundColor: "#106ebe",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  adminHint: {
    marginTop: 20,
    padding: 10,
  },
  adminHintText: {
    color: "#666",
    fontSize: 12,
  },
});
