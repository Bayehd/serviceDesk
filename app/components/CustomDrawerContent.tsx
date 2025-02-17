import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from 'expo-router';
import { Image, View, Text, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileImage from "../assets/Profile.png";



export default function CustomDrawerContent(props: any) {
    const router = useRouter();
    const { top, bottom } = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={{ alignItems: "center", }}>
                    <Image
                        source={ProfileImage }
                        style={{
                            width: '80',
                            height: '100',
                            borderRadius: 40,
                            marginRight: 50,
                        }}
                    />
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Benonia Ayeh</Text>
                        <Text style={{ fontSize: 14, color: "#1c3367" }}>oayeh@wagpco.com</Text>
                </View>

                <DrawerItemList {...props} />
                
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
            
                <Button onPress={() => router.replace("/")}
                   title="Sign Out"
                   color="#106ebe"
                   accessibilityLabel="Sign Out"/>
            </View>
        </View>
    );
}
