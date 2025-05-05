import { Image, StyleSheet, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
    return (
       <SafeAreaView>
        <Text style = {style.text}>
             Call Service Desk Phone Number : " 1188 "
        </Text>
        <Image
                source= {require("../../assets/support.png")}
                style={{
                    
                    width: '70%',
                    height: '55%',
                    justifyContent: 'center',
                    marginLeft: 60,
                    marginTop: 40
                  }}
                /> 
        
       </SafeAreaView>
    )
}
 
export default Page;

const style = StyleSheet.create({
    text:{
        fontWeight: "bold", 
        marginTop: 40,
        fontSize: 2,
        color: "#106ebe" ,  
    }
})