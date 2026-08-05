// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme } from '../theme/AppTheme';

import DashboardScreen from '../screens/DashboardScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import HealthRecordsScreen from '../screens/HealthRecordsScreen';
import AIChatScreen from '../screens/AIChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Dashboard', component: DashboardScreen, icon: 'home', label: 'Home' },
  { name: 'Doctors', component: DoctorsScreen, icon: 'people', label: 'Doctors' },
  { name: 'Records', component: HealthRecordsScreen, icon: 'bar-chart', label: 'Records' },
  { name: 'AIChat', component: AIChatScreen, icon: 'chatbubble', label: 'AI Chat' },
  { name: 'Profile', component: ProfileScreen, icon: 'person', label: 'Profile' },
];

export default function HomeTabs() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 64 + (insets.bottom || 16);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { height: tabBarHeight, paddingBottom: insets.bottom || 16 }],
        tabBarActiveTintColor: AppTheme.bgDeep,
        tabBarInactiveTintColor: AppTheme.textMuted,
      }}
    >
      {TABS.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name={tab.icon} label={tab.label} focused={focused} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const TabIcon = ({ name, label, focused }: { name: string; label: string; focused: boolean }) => {
  if (focused) {
    return (
      <LinearGradient
        colors={AppTheme.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.tabIconFocused}
      >
        <Ionicons name={name as any} size={20} color={AppTheme.bgDeep} />
        <Text style={styles.tabLabel}>{label}</Text>
      </LinearGradient>
    );
  }
  return (
    <View style={styles.tabIconContainer}>
      <Ionicons name={`${name}-outline` as any} size={22} color={AppTheme.textMuted} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: AppTheme.bgCard,
    borderTopColor: AppTheme.border,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  tabIconFocused: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  tabLabel: {
    color: AppTheme.bgDeep,
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
  },
});
