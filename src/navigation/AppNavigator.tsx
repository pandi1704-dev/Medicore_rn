import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabs from './HomeTabs';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import BookingScreen from '../screens/BookingScreen';
import EmergencyScreen from '../screens/EmergencyScreen';

import MapScreen from '../screens/MapScreen';
import MedicineReminderScreen from '../screens/MedicineReminderScreen';
import VideoCallScreen from '../screens/VideoCallScreen';
import PharmacyScreen from '../screens/PharmacyScreen';
import ScannerScreen from '../screens/ScannerScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Booking: { doctor: any };
  Emergency: undefined;
  Map: undefined;
  MedicineReminder: undefined;
  VideoCall: undefined;
  Pharmacy: undefined;
  Scanner: undefined;
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
      <Stack.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MedicineReminder" 
        component={MedicineReminderScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="VideoCall" 
        component={VideoCallScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Pharmacy" 
        component={PharmacyScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
