import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AntDesign from '@expo/vector-icons/AntDesign';

import { StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/CustomDrawerContent";

export default function  DrawerLayout() {

    return(
        <GestureHandlerRootView style={{ flex:1}}>
            <Drawer drawerContent = {CustomDrawerContent}
            screenOptions={{
                drawerActiveBackgroundColor: " #2C539A",
                drawerActiveTintColor: "#1c3367",
            }}>
                <Drawer.Screen name= "Requests" 
                options = {{ 
                    drawerLabel : "Requests",
                    headerTitle : "Requests",
                    drawerIcon: ({ size, color}) => <AntDesign name="inbox" size={size} color={color} />,
                }}
              />

                <Drawer.Screen name= "addRequests" 
                options = {{ 
                    drawerLabel : " addRequests", 
                    headerTitle : "Request Details",
                    drawerIcon: ({ size, color}) => <AntDesign name="edit"  size={size} />,
                }}
              />

          <Drawer.Screen name= "Reports" 
                options = {{ 
                    drawerLabel : "Reports",
                    headerTitle : "Report Information",
                    drawerIcon: ({ size, color}) => <Entypo name="news" size={size} color={color} />,
                }}
              />

               <Drawer.Screen name= "Support" 
                options = {{ 
                    drawerLabel : " Support",
                    headerTitle : "  For Support",
                    drawerIcon: ({ size, color}) => <Entypo name="slideshare" size={size} color={color} />,
                }}
              />
            </Drawer>
        </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  name: { backgroundColor: " #106ebe" },
});