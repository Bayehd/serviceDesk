import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="sign" options={{headerShown: false}} />
      <Stack.Screen name="(drawer)" options={{headerShown: false}}/>
      <Stack.Screen name="index" options={{headerShown: false}} /> 
    </Stack>
  );
}
