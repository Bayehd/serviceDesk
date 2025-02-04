import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomDrawerContent(props: any) {
    const router = useRouter();
    const { top, bottom } = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={{  backgroundColor: "#003366", padding: 20, alignItems: "center" }}>
                    <Image
                        source={{ uri: "https://www.freeiconspng.com/uploads/profile-icon-9.png" }}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            marginBottom: 10,
                            borderColor: "#fff",
                        }}
                    />
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Benonia Ayeh</Text>
                    <Text style={{ fontSize: 14, color: "#fff" }}>oayeh@wagpco.com</Text>
                </View>

                <DrawerItemList {...props} />
                <DrawerItem label={"Settings"} onPress={() => router.replace("/")} />
            </DrawerContentScrollView>

            <View
                style={{
                    borderTopColor: "black",
                    borderTopWidth: 1,
                    padding: 20,
                    paddingBottom: 20 + bottom,
                }}
            >
            <TouchableOpacity onPress={() => console.log("Sign Out Pressed")}>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#2C539A" }}>Sign Out</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
}
