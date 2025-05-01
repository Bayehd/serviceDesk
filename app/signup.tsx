import { auth, SignUpSchema, SignUpSchemaType, usersCollection } from "@/lib";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc } from "firebase/firestore";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
export default function SignUp() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    defaultValues: {
      email: "gyekye@gmail.com",
      password: "gyekye@gmail.com",
      confirmPassword: "gyekye@gmail.com",
    },
    resolver: zodResolver(SignUpSchema),
  });

  async function onSubmit(data: SignUpSchemaType) {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      if (user) {
        await addDoc(usersCollection, {
          uid: user?.user?.uid,
          email: user?.user?.email,
          role: "user",
          createdAt: new Date().toISOString(),
        });

        Alert.alert("Success", "Account created successfully!");
        router.push("/(drawer)");
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      Alert.alert("Error", "Failed to create account. Please try again.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={styles.headerBack}
          >
            <AntDesign name="left" color="#1D2A32" size={30} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Service Desk</Text>
        <Text style={styles.subtitle}>Create your account.</Text>

        <KeyboardAvoidingView style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="First name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.inputControl}
                />
              )}
              name="email"
            />
            {errors.email && <Text>This is required.</Text>}
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
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
                  style={styles.inputControl}
                />
              )}
              name="password"
            />
            {errors.password && <Text>This is required.</Text>}
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
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
                    style={styles.inputControl}
                  value={value}
                />
              )}
              name="confirmPassword"
            />
            {errors.confirmPassword && <Text>This is required.</Text>}
          </View>
          <View>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={styles.btn}
            >
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: "relative",
    marginLeft: -16,
  },
  title: {
    color: "#106ebe",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
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
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
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
    fontWeight: "600",
    color: "#fff",
  },
});
