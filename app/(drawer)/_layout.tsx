import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomDrawerContent from "../../components/CustomDrawerContent";

const DrawerLayout = () => {
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

                <Drawer.Screen name= "Organize filters" 
                options = {{ 
                    drawerLabel : "Organize filters",
                    headerTitle : "Unassigned Requests",
                    drawerIcon: ({ size, color}) => <AntDesign name="profile" size={size} color={color} />,
                }}
              />

                <Drawer.Screen name= "Add Requests" 
                options = {{ 
                    drawerLabel : " Add Requests", 
                    headerTitle : "Request Details",
                    drawerIcon: ({ size, color}) => <AntDesign name="edit"  size={size} color={color}/>,
                }}
              />
               <Drawer.Screen name= "Settings" 
                options = {{ 
                    drawerLabel : " Settings",
                    headerTitle : " Settings",
                    drawerIcon: ({ size, color}) => <AntDesign name="setting" size={size} color={color} />,
                }}
              />
            </Drawer>
        </GestureHandlerRootView>
  );
};

export default DrawerLayout;