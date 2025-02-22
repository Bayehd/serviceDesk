
import React, {useEffect, useState } from "react";
import {Redirect, Stack} from 'expo-router';
import auth, {FirebaseAuthTypes} from "@react-native-firebase/auth";
import {Text} from "react-native";

export default function Layout() {

  /*const  { user, isLoading} = useSession();

  if (isLoading) { 
   return(
   <Text> loading...</Text>
   )
  }
  if (!user) {
    return < Redirect href=""/>;
  }
  
  function useSession(): { user: any; isLoading: any; } {
    throw new Error("Function not implemented.");
  }

  /*const [ intializing, setInitializing] = useState(true);
  const [user, setUser] = useState< FirebaseAuthTypes.User || null>{};

  useEffect (() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  },[]); */
  
  return (
    <Stack>
      <Stack.Screen name="sign" options={{headerShown: false}} />
      <Stack.Screen name="(drawer)" options={{headerShown: false}}/>
      <Stack.Screen name="index" options={{headerShown: false}} /> 
    </Stack>
  );
}


