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
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { auth, LoginSchema, LoginSchemaType, usersCollection } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Controller, useForm } from "react-hook-form";
import { getDocs, query, where } from "firebase/firestore";
import { useAuth, User } from "@/context/authContext";

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
  const [showPassword, setShowPassword] = useState(false);

  async function handleAuth(data: LoginSchemaType) {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (!userCredential) {
        Alert.alert("Error", "Failed to log in. Please try again.");
        return;
      }

      const { user: firebaseUser } = userCredential;
      const q = query(
        usersCollection,
        where("email", "==", firebaseUser.email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "User not found. Please check your email.");
        return;
      }

      const userDoc = querySnapshot.docs[0].data() as User
      console.log("User document:", userDoc);
      setUser(userDoc);
      

      router.replace("/(drawer)/Requests"); 
    } catch (error: any) {
      console.error("Login error:", error);
      

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert(
          "Authentication Failed",
          "Invalid email or password. Please try again."
        );
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert(
          "Too Many Attempts",
          "Access temporarily disabled due to many failed login attempts. Try again later or reset your password."
        );
      } else {
        Alert.alert(
          "Login Error",
          "An unexpected error occurred. Please try again."
        );
      }
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
        <View style={styles.header}>
          <Image source={require("../assets/loginn.png")} style={styles.image} />
          <Text style={styles.title}>Service Desk</Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <View style={[
                  styles.textInputWrapper,
                  errors.email && styles.inputError
                ]}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    accessibilityLabel="Email input"
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>
                    {errors.email.message || "Email is required"}
                  </Text>
                )}
              </View>
            )}
            name="email"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <View style={[
                  styles.textInputWrapper,
                  errors.password && styles.inputError
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    secureTextEntry={!showPassword}
                    placeholder="Enter password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.textInput}
                    accessibilityLabel="Password input"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                    accessibilityLabel="Toggle password visibility"
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#666"
                    />
                  </Pressable>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>
                    {errors.password.message || "Password is required"}
                  </Text>
                )}
              </View>
            )}
            name="password"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(handleAuth)}
            disabled={loading}
            accessibilityLabel="Sign in button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>SIGN IN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  title: {
    color: "#106ebe",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 10,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    width: "90%",
    marginBottom: 15,
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: "#e74c3c",
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    padding: 14,
  },
  passwordToggle: {
    padding: 10,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    width: "90%",
    backgroundColor: "#106ebe",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  signupText: {
    color: "#666",
  },
  signupLink: {
    color: "#106ebe",
    fontWeight: "bold",
  },
});
