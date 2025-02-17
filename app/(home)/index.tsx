import React, {useState} from "react";
import { useRouter } from "expo-router";
import { Text, Button, TextInput, Image, StyleSheet,View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import loginImage from "../assets/loginn.png";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {signInWithEmailAndPassword } from   "firebase/auth"; 


 export default function Page (){
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const auth = FIREBASE_AUTH;
   //const [errors, setErrors] = useState('');

   /*const validateForm = () => {
    let errors ={};

    if(!email) errors.email = "incorrect email";
    if (!password) errors.password = " incorrect password";

    setErrors (errors);

    return Object.key (errors).length === 0;
   }
 
    const handleSubmit= ()=>{
      if ( validateForm()) {
        console.log ("submitted", email ,password);
        setEmail("");
        setPassword("");
        setErrors ({});
      }
    };
*/

        const SignIn  = async () =>{
          setLoading (true);
          try{
            const response = await signInWithEmailAndPassword(auth,email,password);
            console.log (response);
            alert( "Check oyur emails!");
          } catch (error:any ) {
            console.log(error);
            alert( "Sign in failed: " + error.message);
          } finally {
            setLoading(false);
            }
        }
  


    return (
        <SafeAreaView 
                style = {{ 
                paddingVertical: 24,
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                }}>
             <Image
                source= {loginImage}
                style={{
                    width: '90%',
                    height: '35%',
                    alignSelf: 'center',
                    marginBottom: 36,
                  }}
                /> 

              <Text style={{ color: '#106ebe' , justifyContent: "center",  marginBottom: 25,
                marginLeft: "35%", fontSize: 20, fontWeight: '900'}}> Service Desk</Text>
         
              <TextInput
                style={ styles.textInput}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                keyboardType="email-address"
                placeholder="username@wagpco.com"
                placeholderTextColor="#6b7280"
                onChangeText={text => setEmail(text)}
                value = {email}
              />
              <TextInput
                style={ styles.textInput}
                placeholder="enter password"
                autoCapitalize="none"
                clearButtonMode="while-editing"
                placeholderTextColor="#6b7280"
                onChangeText={text => setPassword(text)}
                value = {password}
              />
            <View style ={{ marginRight: 99, marginLeft: 99, borderRadius: 10 }}>
              <Button
              onPress={ () => router.push( "/(drawer)/Requests")}
              title="Sign in"
              color="#106ebe"
              accessibilityLabel="Sign in "
              />
            </View>   
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
  textInput:{
    padding: 10, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 5, 
    backgroundColor: "#fff", 
    alignItems: "center", 
    marginBottom: 15,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
  }

})