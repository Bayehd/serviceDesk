import React, { useState } from "react";
import {
  Text,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

const AuthScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = () => {
    // Placeholder logic – replace with your own authentication method
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    console.log(`${isLogin ? "Logging in" : "Signing up"} with:`, { email, password });

   
    router.replace("/(drawer)/Requests"); 
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

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
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
