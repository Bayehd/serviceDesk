// Sign-Up Page (signup.js)
import React, { useState } from 'react';
import { 
  Text, 
  View, 
  KeyboardAvoidingView, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
//import { getAuth, signOut } from "firebase/auth";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = () => {
    if (!form.email || !form.password || !form.confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    Alert.alert(
      "Success", 
      "Account created successfully!",
      [
        { 
          text: "OK", 
          onPress: () => {
    
            router.replace("/(home)/index");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => {router.back()}}
            style={styles.headerBack}
          >
            <AntDesign 
              name="left" 
              color="#1D2A32"
              size={30} 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Service Desk</Text>
        <Text style={styles.subtitle}>Create your account.</Text>

        <KeyboardAvoidingView style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              placeholder="username@wagpco.com"
              onChangeText={email => setForm({ ...form, email })}
              style={styles.inputControl}
              value={form.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              placeholder="Enter password"
              onChangeText={password => setForm({ ...form, password })}
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              placeholder="Confirm password"
              onChangeText={confirmPassword => setForm({ ...form, confirmPassword })}
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.confirmPassword}
              autoCapitalize="none"
            />
          </View>
          <View>
            <TouchableOpacity onPress={handleSignUp} style={styles.btn}>
              <Text style={styles.btnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    marginLeft: -16,
  },
  title: {
    color: "#106ebe",
    fontSize: 20,
    fontWeight: "900",
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 24,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
        marginBottom: 15,
  },
  btn: {
    width: "100%",
    backgroundColor: "#106ebe",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});