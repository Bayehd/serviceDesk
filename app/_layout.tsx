import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const DrawerLayout = () => {
    return(
        <GestureHandlerRootView style={{ flex:1}}>
            <Drawer>
                <Drawer.Screen name= "Requests" options = {{ drawerLabel : "Requests"}}/>
            </Drawer>
        </GestureHandlerRootView>
  );
};

export default DrawerLayout;