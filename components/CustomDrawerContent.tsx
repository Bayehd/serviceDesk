import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileImage from "../assets/Profile.png";

export default function CustomDrawerContent(props: any) {
    const router = useRouter();
    const { top, bottom } = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={{ padding: 20, alignItems: "center", }}>
                    <Image
                        source={ProfileImage }
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            marginRight: 5,
                           

                        }}
                    />
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Benonia Ayeh</Text>
                        <Text style={{ fontSize: 14, color: "#1c3367" }}>oayeh@wagpco.com</Text>
                </View>

                {/* Drawer Items */}
                <DrawerItemList {...props} />
                <DrawerItem label={""} onPress={() => router.replace("/")} />
            </DrawerContentScrollView>

            {/* Sign Out Section */}
            <View
                style={{
                    borderTopColor: "#2C539A",
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
