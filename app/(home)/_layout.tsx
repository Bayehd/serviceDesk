import { Slot } from 'expo-router';

export default function Layout() {
  return <Slot />; // This will automatically handle navigation
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