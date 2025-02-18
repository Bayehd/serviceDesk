import {Stack} from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="sign" options={{headerShown: false}} />
      <Stack.Screen name="(drawer)" options={{headerShown: false}}/>
      <Stack.Screen name="index" options={{headerShown: false}} /> 
    </Stack>
  );
}
