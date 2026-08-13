// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, GradientButton } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';

export default function VitalsSyncScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [autoSync, setAutoSync] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2 mins ago');

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Vitals & Wearable Sync</Text>
        <TouchableOpacity onPress={handleSyncNow} style={styles.syncBtn}>
          <Ionicons name="sync" size={20} color={AppTheme.teal} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Device Status Card */}
        <FadeSlideIn from="top" delay={50}>
          <GlassCard borderColor={`${AppTheme.teal}40`}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.deviceIcon, { backgroundColor: `${AppTheme.teal}20` }]}>
                <Ionicons name="watch-outline" size={28} color={AppTheme.teal} />
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={Typography.h2}>Apple Watch Series 9</Text>
                <Text style={[Typography.caption, { color: AppTheme.teal, fontWeight: '700', marginTop: 2 }]}>
                  Connected • Battery 84%
                </Text>
                <Text style={[Typography.caption, { marginTop: 2 }]}>Last Sync: {lastSyncTime}</Text>
              </View>
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                thumbColor={autoSync ? AppTheme.teal : AppTheme.textMuted}
              />
            </View>
          </GlassCard>
        </FadeSlideIn>

        {/* Sync Action Button */}
        <View style={{ marginVertical: 16 }}>
          <GradientButton
            text={isSyncing ? 'Syncing Telemetry Data...' : 'Sync Telemetry Now'}
            onPress={handleSyncNow}
            isLoading={isSyncing}
            icon="refresh-outline"
          />
        </View>

        {/* Sleep Stage Telemetry Breakdown */}
        <FadeSlideIn from="bottom" delay={100}>
          <Text style={[Typography.h3, { fontSize: 17, marginBottom: 12 }]}>🌙 Sleep Stage Telemetry</Text>
          <GlassCard padding={16}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={Typography.body}>Total Sleep</Text>
              <Text style={[Typography.h3, { color: AppTheme.violet }]}>7h 20m</Text>
            </View>

            {/* Stacked Bar for Sleep */}
            <View style={styles.sleepBarTrack}>
              <View style={[styles.sleepSegment, { width: '30%', backgroundColor: AppTheme.violet }]} />
              <View style={[styles.sleepSegment, { width: '25%', backgroundColor: AppTheme.teal }]} />
              <View style={[styles.sleepSegment, { width: '45%', backgroundColor: AppTheme.surface2 }]} />
            </View>

            <View style={styles.sleepLegendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: AppTheme.violet }]} />
                <Text style={[Typography.caption, { marginLeft: 6 }]}>Deep: 2h 15m</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: AppTheme.teal }]} />
                <Text style={[Typography.caption, { marginLeft: 6 }]}>REM: 1h 45m</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: AppTheme.surface2 }]} />
                <Text style={[Typography.caption, { marginLeft: 6 }]}>Light: 3h 20m</Text>
              </View>
            </View>
          </GlassCard>
        </FadeSlideIn>

        {/* Continuous Vitals Grid */}
        <FadeSlideIn from="bottom" delay={150} style={{ marginTop: 20 }}>
          <Text style={[Typography.h3, { fontSize: 17, marginBottom: 12 }]}>📊 Live Telemetry Stream</Text>
          <View style={styles.vitalsGrid}>
            <GlassCard padding={14} style={styles.vitalCard} borderColor={`${AppTheme.rose}33`}>
              <Ionicons name="heart" size={22} color={AppTheme.rose} />
              <Text style={[Typography.h2, { marginTop: 8 }]}>72 BPM</Text>
              <Text style={Typography.caption}>Resting Heart Rate</Text>
            </GlassCard>

            <GlassCard padding={14} style={styles.vitalCard} borderColor={`${AppTheme.teal}33`}>
              <Ionicons name="water" size={22} color={AppTheme.teal} />
              <Text style={[Typography.h2, { marginTop: 8 }]}>98%</Text>
              <Text style={Typography.caption}>Blood Oxygen (SpO2)</Text>
            </GlassCard>

            <GlassCard padding={14} style={styles.vitalCard} borderColor={`${AppTheme.warning}33`}>
              <Ionicons name="flame" size={22} color={AppTheme.warning} />
              <Text style={[Typography.h2, { marginTop: 8 }]}>2,450 kcal</Text>
              <Text style={Typography.caption}>Active Caloric Burn</Text>
            </GlassCard>

            <GlassCard padding={14} style={styles.vitalCard} borderColor={`${AppTheme.violet}33`}>
              <Ionicons name="walk" size={22} color={AppTheme.violet} />
              <Text style={[Typography.h2, { marginTop: 8 }]}>8,432</Text>
              <Text style={Typography.caption}>Daily Step Count</Text>
            </GlassCard>
          </View>
        </FadeSlideIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.bgDeep },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center', alignItems: 'center',
  },
  syncBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: `${AppTheme.teal}20`,
    justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  deviceIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  sleepBarTrack: { height: 12, borderRadius: 6, flexDirection: 'row', overflow: 'hidden', marginVertical: 10 },
  sleepSegment: { height: '100%' },
  sleepLegendRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  vitalCard: { width: '48%', marginBottom: 12 },
});
