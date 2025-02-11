import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter, Link } from "expo-router";
import { Image, View, Text, TouchableOpacity, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileImage from "../app/assets/Profile.png";

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
                    padding: 5,
                    paddingBottom: 10,
                }}
            >   
                <Button
                    title="Sign Out"
                    color="#2C539A"
                    onPress={ () => {router.push( "../app/index")}}
                    accessibilityLabel="Sign Out" />
                   
            </View>
        </View>
    );
}
