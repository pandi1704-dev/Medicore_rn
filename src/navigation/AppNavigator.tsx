import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabs from './HomeTabs';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import BookingScreen from '../screens/BookingScreen';
import EmergencyScreen from '../screens/EmergencyScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Booking: { doctor: any };
  Emergency: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade', // To replicate Flutter's FadeTransition
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeTabs} />
      
      {/* Nested Stack Screens */}
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Emergency" 
        component={EmergencyScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
