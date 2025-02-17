import { View,StyleSheet, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
    return (
       <SafeAreaView>
        <Text style = {style.text}>
             Call Service Desk Phone Number : " 1188 "
        </Text>

        
       </SafeAreaView>
    )
}
 
export default Page;

const style = StyleSheet.create({
    text:{
        fontWeight: "bold", 
        marginTop: 40,
        fontSize: 20,
        color: "#106ebe" ,
        
       
    }
})