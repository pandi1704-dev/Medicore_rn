// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, SectionHeader, StatusBadge } from '../shared/components/CommonWidgets';
import { FadeSlideIn, HeartbeatScale } from '../shared/components/Animations';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [deviceConnected, setDeviceConnected] = useState(true);

  const metrics = [
    { label: 'Age', value: '25 yrs', icon: 'calendar-outline', color: AppTheme.violet },
    { label: 'Blood Type', value: 'B+', icon: 'water-outline', color: AppTheme.rose },
    { label: 'Weight', value: '76.5 kg', icon: 'scale-outline', color: AppTheme.teal },
    { label: 'Height', value: '178 cm', icon: 'body-outline', color: AppTheme.warning },
  ];

  const renderHeader = () => (
    <LinearGradient
      colors={['#1A0A3B', '#0A1628']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <View style={styles.avatarContainer}>
          <Image source={require('../../assets/images/profile.png')} style={styles.avatar} />
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" color={AppTheme.bgDeep} size={14} />
          </View>
        </View>
        <Text style={[Typography.h2, { fontSize: 22, marginTop: 12 }]}>Pandeeswaran</Text>
        <Text style={[Typography.bodyMuted, { marginTop: 4, marginBottom: 8 }]}>pandeeswaran1704@gmail.com</Text>
        <StatusBadge label="Premium Member" color={AppTheme.teal} />
      </View>
    </LinearGradient>
  );

  const renderMetricsGrid = () => (
    <View style={styles.metricsGrid}>
      {metrics.map((m, i) => (
        <View key={i} style={styles.metricCell}>
          <GlassCard borderColor={`${m.color}33`} padding={12}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.metricIcon, { backgroundColor: `${m.color}26` }]}>
                <Ionicons name={m.icon as any} color={m.color} size={16} />
              </View>
              <View style={{ marginLeft: 8 }}>
                <Text style={[Typography.h3, { fontSize: 15 }]}>{m.value}</Text>
                <Text style={[Typography.caption, { fontSize: 10 }]}>{m.label}</Text>
              </View>
            </View>
          </GlassCard>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
        {renderHeader()}

        <View style={styles.content}>
          <FadeSlideIn from="bottom">
            <SectionHeader title="Health Profile" />
            <View style={{ height: 14 }} />
            {renderMetricsGrid()}
            
            <View style={{ height: 16 }} />
            <GlassCard borderColor={`${AppTheme.teal}33`}>
              <View style={styles.scoreHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <HeartbeatScale>
                    <Ionicons name="heart" color={AppTheme.rose} size={18} style={{ marginRight: 6 }} />
                  </HeartbeatScale>
                  <Text style={[Typography.h3, { fontSize: 15 }]}>Health Score</Text>
                </View>
                <StatusBadge label="Excellent" color={AppTheme.teal} />
              </View>
              <View style={{ height: 16 }} />
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.progressBarBg}>
                  <LinearGradient colors={AppTheme.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressBarFill, { width: '92%' }]} />
                </View>
                <Text style={[Typography.h3, { color: AppTheme.teal, fontSize: 13, marginLeft: 12 }]}>92/100</Text>
              </View>
            </GlassCard>
          </FadeSlideIn>

          <FadeSlideIn from="bottom" delay={100} style={styles.section}>
            <SectionHeader title="📡 Connected Devices" actionLabel="Add Device" />
            <View style={{ height: 14 }} />
            <GlassCard borderColor={`${AppTheme.teal}33`}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.deviceIcon, { backgroundColor: `${AppTheme.teal}26` }]}>
                  <Ionicons name="watch-outline" color={AppTheme.teal} size={22} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[Typography.body, { fontWeight: '600' }]}>Apple Watch Series 9</Text>
                  <Text style={[Typography.caption, { color: AppTheme.teal, marginTop: 4, fontWeight: '700' }]}>Connected</Text>
                </View>
                <Switch
                  value={deviceConnected}
                  onValueChange={setDeviceConnected}
                  trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                  thumbColor={deviceConnected ? AppTheme.teal : AppTheme.textMuted}
                />
              </View>
            </GlassCard>
          </FadeSlideIn>

          <FadeSlideIn from="bottom" delay={200} style={styles.section}>
            <GlassCard borderColor={`${AppTheme.violet}40`}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <Ionicons name="shield-checkmark" color={AppTheme.violet} size={20} />
                <Text style={[Typography.h3, { fontSize: 16, marginLeft: 8 }]}>Insurance</Text>
              </View>
              
              <LinearGradient colors={['#1E1040', '#0F1B35']} style={styles.insuranceCard}>
                <View style={styles.insuranceTop}>
                  <Text style={[Typography.body, { fontWeight: '700' }]}>BlueCross BlueShield</Text>
                  <Ionicons name="checkmark-circle" color={AppTheme.teal} size={18} />
                </View>
                <Text style={[Typography.caption, { fontSize: 10, marginTop: 12, letterSpacing: 0.5 }]}>Member ID</Text>
                <Text style={[Typography.body, { fontSize: 15, fontWeight: '600', letterSpacing: 1, marginTop: 4 }]}>BCB-2024-78941203</Text>
                
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={styles.infoChip}><Text style={[Typography.caption, { fontSize: 10 }]}>Plan: PPO Gold</Text></View>
                  <View style={[styles.infoChip, { marginLeft: 8 }]}><Text style={[Typography.caption, { fontSize: 10 }]}>Deductible: ₹45,000</Text></View>
                </View>
              </LinearGradient>
            </GlassCard>
          </FadeSlideIn>

          <FadeSlideIn from="bottom" delay={300} style={styles.section}>
            <SectionHeader title="🚨 Emergency Contacts" actionLabel="Edit" />
            <View style={{ height: 14 }} />
            <GlassCard borderColor={`${AppTheme.rose}33`}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.contactAvatar, { backgroundColor: `${AppTheme.rose}26` }]}>
                  <Text style={[Typography.h3, { color: AppTheme.rose, fontSize: 18 }]}>E</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[Typography.body, { fontWeight: '600' }]}>Lavanya Pandi</Text>
                  <Text style={[Typography.caption, { marginTop: 2 }]}>Spouse • +91 8600977552</Text>
                </View>
                <TouchableOpacity style={styles.callButton}>
                  <Ionicons name="call" color={AppTheme.teal} size={18} />
                </TouchableOpacity>
              </View>
            </GlassCard>
          </FadeSlideIn>

          <FadeSlideIn from="bottom" delay={400} style={styles.section}>
            <Text style={[Typography.h3, { fontSize: 18, marginBottom: 14 }]}>Settings</Text>
            <GlassCard padding={0}>
              <SettingItem icon="notifications-outline" color={AppTheme.teal} label="Notifications" />
              <View style={styles.divider} />
              <SettingItem icon="shield-half-outline" color={AppTheme.violet} label="Privacy & Security" />
              <View style={styles.divider} />
              <SettingItem icon="globe-outline" color={AppTheme.warning} label="Language & Region" />
              <View style={styles.divider} />
              <SettingItem icon="help-circle-outline" color={AppTheme.rose} label="Help & Support" />
            </GlassCard>
          </FadeSlideIn>

          <FadeSlideIn from="bottom" delay={500} style={styles.section}>
            <GlassCard borderColor={`${AppTheme.error}4D`} onPress={() => navigation.replace('Login')}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="log-out-outline" color={AppTheme.error} size={18} />
                <Text style={[Typography.body, { color: AppTheme.error, fontWeight: '700', marginLeft: 8 }]}>Sign Out</Text>
              </View>
            </GlassCard>
          </FadeSlideIn>

        </View>
      </ScrollView>
    </View>
  );
}

const SettingItem = ({ icon, color, label }: any) => (
  <TouchableOpacity style={styles.settingItem}>
    <View style={[styles.settingIcon, { backgroundColor: `${color}26` }]}>
      <Ionicons name={icon} color={color} size={18} />
    </View>
    <Text style={[Typography.body, { flex: 1, marginLeft: 16, fontWeight: '500' }]}>{label}</Text>
    <Ionicons name="chevron-forward" color={AppTheme.textMuted} size={18} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.bgDeep,
  },
  scrollContent: {
    paddingBottom: 120, // Tab bar padding
  },
  headerGradient: {
    paddingTop: 80,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.border,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 90,
    height: 90,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: AppTheme.teal,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: AppTheme.bgDeep,
  },
  content: {
    padding: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCell: {
    width: '48%',
    marginBottom: 16,
  },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: AppTheme.border,
    borderRadius: 6,
  },
  progressBarFill: {
    height: 12,
    borderRadius: 6,
  },
  section: {
    marginTop: 20,
  },
  deviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insuranceCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${AppTheme.violet}33`,
  },
  insuranceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoChip: {
    backgroundColor: AppTheme.surface2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.border,
    marginLeft: 68,
  },
  callButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: `${AppTheme.teal}15`,
    borderWidth: 1,
    borderColor: `${AppTheme.teal}40`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

