import React, { useState } from "react";
import {
  Text,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { signIn } from "../components/authService";
import { useAuth } from "../components/authContext";

interface AuthContextType {
  user: any;
  userRole: string | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: any) => void;
  setUserRole: (role: string | null) => void;
  setAdminSession: () => Promise<void>;
  signOut: () => Promise<boolean>;
}

const AuthScreen = () => {
  const router = useRouter();
  const { setUser, setUserRole, setAdminSession } = useAuth() as AuthContextType;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    setLoading(true);
    
    try {
      const { user, role } = await signIn(email, password);
      
      // Store user information including email in auth context
      setUser({
        ...user,
        email: email // Ensure email is stored in user object
      });
      setUserRole(role);
      
      // If this is an admin login, store the session
      if (role === 'admin') {
        await setAdminSession();
      }
      
      console.log(`Logged in as ${role}:`, email);
           
      if (role === 'admin') {
        router.replace("/(drawer)/Requests");
      } else {
        router.replace("/(drawer)/Requests");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Authentication Failed",
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image source={require("../assets/loginn.png")} style={styles.image} />

      <Text style={styles.title}>Service Desk</Text>

      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Enter email"
        onChangeText={setEmail}
        value={email}
        editable={!loading}
      />

      <TextInput
        style={styles.textInput}
        placeholder="Enter password"
        autoCapitalize="none"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        editable={!loading}
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>SIGN IN</Text>
        )}
      </TouchableOpacity>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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

export default AuthScreen;