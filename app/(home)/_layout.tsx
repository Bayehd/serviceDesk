import { Slot } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../components/authContext';
import { Stack } from 'expo-router';

export default function Layout() {
  return (

    <AuthProvider>
      <Stack>
      <Slot />
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