import { auth, SignUpSchema, SignUpSchemaType, usersCollection } from "@/lib";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword , sendEmailVerification} from "firebase/auth";
import { addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(SignUpSchema),
  });

  async function onSubmit(data: SignUpSchemaType) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      if (userCredential) {
        await addDoc(usersCollection, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          role: "user",
          createdAt: new Date().toISOString(),
        });
        await sendEmailVerification(userCredential.user);

        Alert.alert("Success", "Account created successfully!")
        router.replace("/"); 
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          "Sign Up Error", 
          "This email address is already in use. Please use a different email or log in instead."
        );
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert(
          "Sign Up Error", 
          "Please enter a valid email address."
        );
      } else if (error.code === 'auth/weak-password') {
        Alert.alert(
          "Sign Up Error", 
          "Password is too weak. Please use a stronger password."
        );
      } else {
        Alert.alert(
          "Sign Up Error", 
          "Failed to create account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBack}
              accessibilityLabel="Go back"
            >
              <AntDesign name="left" color="#1D2A32" size={24} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Service Desk</Text>
          <Text style={styles.subtitle}>Create your account</Text>

          <KeyboardAvoidingView 
            style={styles.form}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
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
                        style={styles.inputControl}
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
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
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
                        style={styles.inputControl}
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
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={[
                      styles.textInputWrapper,
                      errors.confirmPassword && styles.inputError
                    ]}>
                      <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        secureTextEntry={!showConfirmPassword}
                        placeholder="Confirm your password"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={styles.inputControl}
                        accessibilityLabel="Confirm password input"
                      />
                      <Pressable
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.passwordToggle}
                        accessibilityLabel="Toggle confirm password visibility"
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#666"
                        />
                      </Pressable>
                    </View>
                    {errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword.message || "Confirm password is required"}
                      </Text>
                    )}
                  </View>
                )}
                name="confirmPassword"
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                style={styles.button}
                disabled={loading}
                accessibilityLabel="Sign up button"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/")} accessibilityLabel="Sign in link">
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  headerBack: {
    padding: 10,
    marginLeft: -10,
  },
  title: {
    color: "#106ebe",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
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
  inputIcon: {
    marginRight: 10,
  },
  inputError: {
    borderColor: "#e74c3c",
    borderWidth: 1.5,
  },
  inputControl: {
    flex: 1,
    padding: 14,
    fontSize: 16,
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
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#106ebe",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#666",
    fontSize: 15,
  },
  loginLink: {
    color: "#106ebe",
    fontSize: 15,
    fontWeight: "bold",
  },
});
