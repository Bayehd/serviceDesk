import React from 'react';

import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/authContext';

export default function RootLayout() {
  return (
<AuthProvider>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <Stack.Screen name='signup' options={{headerShown:false}}/>
        <Stack.Screen name="+not-found" />
      </Stack>
      </AuthProvider>
 
  );
}


/*
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import RequestScreen from "../(drawer)/Requests";

const Stack = createStackNavigator();

export default function Layout() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} /> 
      <Stack.Screen name="(drawer)"  component ={RequestScreen }/>
      <Stack.Screen name="(drawer)"  component ={RequestScreen }/>
      
    </NavigationContainer>

  );
}


//<Stack.Navigator name="sign" options={{headerShown: false}} />*/