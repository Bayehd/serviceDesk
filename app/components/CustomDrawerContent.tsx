import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from 'expo-router';
import { Image, View, Text, Button, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAuth, signOut } from "firebase/auth";
//import { db } from "../../FirebaseConfig"; 

export default function CustomDrawerContent(props: any) {
    const router = useRouter();
    const { top, bottom } = useSafeAreaInsets();
    const auth = getAuth();

    // 🔹 Sign Out Function
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace("/"); // 🔹 Redirect to Index Page
        } catch (error) {
            console.error("Sign Out Error:", error.message);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={{ alignItems: "center", paddingVertical: 20 }}>
                    <Image
                        source={require("../assets/Profile.png")}
                        style={{ width: 80, height: 80, borderRadius: 40 }}
                    />
                    <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>Benonia Ayeh</Text>
                    <Text style={{ fontSize: 14, color: "#1c3367" }}>oayeh@wagpco.com</Text>
                </View>

                <DrawerItemList {...props} />
            </DrawerContentScrollView>

          
            <View style={{ borderTopWidth: 1, borderTopColor: "#ccc", padding: 10 }}>
                <DrawerItem 
                    label="Sign Out"
                    onPress={handleSignOut}
                    labelStyle={{ color: "#106ebe", fontWeight: "bold" }}
                />
            </View>
        </View>
    );
}
