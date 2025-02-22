import React, {useState} from "react";
import { useRouter } from "expo-router";
import { Text, Button, TextInput, Image, StyleSheet,View, KeyboardAvoidingView,} from "react-native";
import loginImage from "../assets/loginn.png";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from   "firebase/auth"; 

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
            alert( "Check your emails!");
          } catch (error:any ) {
            console.log(error);
            alert( "Sign in failed: " + error.message);
          } finally {
            setLoading(false);
            }
        }

        const SignUp  = async () =>{
          setLoading (true);
          try{
            const response = await createUserWithEmailAndPassword(auth,email,password);
            console.log (response);
            alert( "Check your emails!");
          } catch (error:any ) {
            console.log(error);
            alert( " account creation failed: " + error.message);
          } finally {
            setLoading(false);
            }
        }
  


    return (
        <KeyboardAvoidingView
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
                onChangeText={text => setEmail(text)}
                value = {email}
              />
              <TextInput
                style={ styles.textInput}
                placeholder="enter password"
                autoCapitalize="none"
                secureTextEntry = {true}
                clearButtonMode="while-editing"
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

              <Button
              onPress= {SignUp}
              title="Create account"
              color="#106ebe"
              accessibilityLabel=" Create account"
              />

            </View>   
        </KeyboardAvoidingView>
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