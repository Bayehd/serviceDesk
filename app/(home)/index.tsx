import React, { useState, useEffect } from "react";
import { Text, TextInput, Image, StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, Alert } from "react-native";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "expo-router";

// ✅ Ensure Firebase is initialized only once
const firebaseConfig = {
  apiKey: "AIzaSyD1-g61TNrK0H7KjdhvQj6k3Rxr_1uhnAY",
  authDomain: "servicedesk-10957.firebaseapp.com",
  projectId: "servicedesk-10957",
  storageBucket: "servicedesk-10957.firebasestorage.app",
  messagingSenderId: "905706685008",
  appId: "1:905706685008:web:b7007d69ed9faeb16d8755",
  measurementId: "G-N9LF18TDV8"
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();

const AuthScreen = () => {
  const router = useRouter(); // ✅ Moved inside the component
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);

      // ✅ Navigate to the request page using Expo Router
      router.replace("/(drawer)/Requests");
    } catch (error) {
      Alert.alert("Login Failed", error.message); // ✅ Fixed typo `err.message`
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);

      // ✅ Navigate after sign-up
      router.replace("/(drawer)/request");
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
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
        placeholder="username@wagpco.com"
        onChangeText={setEmail}
        value={email}
      />
      
      <TextInput
        style={styles.textInput}
        placeholder="Enter password"
        autoCapitalize="none"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={isLogin ? handleSignIn : handleSignUp}>
        <Text style={styles.buttonText}>{isLogin ? "SIGN IN" : "CREATE ACCOUNT"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>
          {isLogin ? "Create an account? Sign Up" : "Already have an account? Sign In"}
        </Text>
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
  toggleText: {
    color: "#106ebe",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default AuthScreen;
