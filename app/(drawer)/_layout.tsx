import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomDrawerContent from "../components/CustomDrawerContent";
import { StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

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

                <Drawer.Screen name= "Add Requests" 
                options = {{ 
                    drawerLabel : " Add Requests", 
                    headerTitle : "Request Details",
                    drawerIcon: ({ size, color}) => <AntDesign name="edit"  size={size} color={color}/>,
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
  headerTitle: { backgroundColor: " #106ebe" },
});