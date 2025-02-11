import React, {useState} from "react";
import { useRouter } from "expo-router";
import { Text, Button, Image} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

 export default function Page (){
   const router = useRouter();
   const [text, setText] = useState('');
    
    return (
        <SafeAreaView 
         style = {{ 
            flex:1,
            alignItems : "center",
            justifyContent: "center" 
            }}>
            <Text> Benonia</Text>
            <Button
            onPress={ () => router.push( "/(drawer)/Requests")}
            title="Learn More"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
            />
          
                <Image
                source={{uri: 'https://cdn.vectorstock.com/i/500p/14/00/call-center-symbols-set-flat-icons-vector-20851400.avif'}}
                style={{
                width: 80,
                height: 80, 
               }}
                />
            <TextInput
        style={{height: 40, padding: 5}}
        placeholder="username@wagpco.com"
        onChangeText={newText => setText(newText)}
       
      />
        <TextInput
        style={{height: 40, padding: 5}}
        placeholder="enter password"
        onChangeText={newText => setText(newText)}
        
      />
            
        </SafeAreaView>
    )
}
