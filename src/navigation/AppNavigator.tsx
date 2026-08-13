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
import LabAnalyzerScreen from '../screens/LabAnalyzerScreen';
import FamilyHealthScreen from '../screens/FamilyHealthScreen';
import SymptomTriageScreen from '../screens/SymptomTriageScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import VitalsSyncScreen from '../screens/VitalsSyncScreen';

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
  LabAnalyzer: undefined;
  FamilyHealth: undefined;
  SymptomTriage: undefined;
  OrderTracking: undefined;
  VitalsSync: undefined;
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
      <Stack.Screen 
        name="LabAnalyzer" 
        component={LabAnalyzerScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="FamilyHealth" 
        component={FamilyHealthScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="SymptomTriage" 
        component={SymptomTriageScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="OrderTracking" 
        component={OrderTrackingScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="VitalsSync" 
        component={VitalsSyncScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
