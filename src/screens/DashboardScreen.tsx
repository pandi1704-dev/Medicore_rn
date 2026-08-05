// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CircularProgress from 'react-native-circular-progress-indicator';
import { LineChart } from 'react-native-gifted-charts';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, SectionHeader, VitalChip, Badge } from '../shared/components/CommonWidgets';
import { FadeSlideIn, SyncedHeartPulse, ContinuousPulseRing } from '../shared/components/Animations';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [heartRate, setHeartRate] = useState(72);

  const [joinCallVisible, setJoinCallVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(68 + Math.floor(Math.random() * 12));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning ☀️';
    if (h < 17) return 'Good afternoon 👋';
    return 'Good evening 🌙';
  };

  const chartData = [
    { value: 70, label: 'Mon' }, { value: 74, label: 'Tue' },
    { value: 68, label: 'Wed' }, { value: 80, label: 'Thu' },
    { value: 72, label: 'Fri' }, { value: 76, label: 'Sat' },
    { value: 73, label: 'Sun' },
  ];

  const QUICK_ACTIONS = [
    { icon: 'search', label: 'Find Doctor', color: AppTheme.teal, route: 'Doctors' },
    { icon: 'warning', label: 'SOS', color: AppTheme.error, route: 'Emergency' },
    { icon: 'chatbubble-outline', label: 'AI Chat', color: AppTheme.violet, route: 'AIChat' },
    { icon: 'analytics-outline', label: 'Records', color: AppTheme.rose, route: 'Records' },
  ];

  return (
    <View style={styles.container}>
      {/* ── Join Call Modal ── */}
      <Modal transparent animationType="fade" visible={joinCallVisible} onRequestClose={() => setJoinCallVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Join Call</Text>
            <Text style={styles.modalMessage}>
              Your appointment call with Dr. Aravind Kumar is ready. Do you want to join now?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setJoinCallVisible(false)}>
                <Text style={styles.modalLater}>Later</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalJoinBtn} onPress={() => setJoinCallVisible(false)}>
                <Text style={styles.modalJoinText}>Join Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: (insets.top || 0) + 16, paddingBottom: 100 + (insets.bottom || 0) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <FadeSlideIn from="top" delay={0} style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={Typography.h1}>Pandeeswaran</Text>
            <View style={styles.scorePill}>
              <View style={styles.scoreDot} />
              <Text style={styles.scoreText}>Health Score: 92/100</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.avatarWrap} onPress={() => navigation.navigate('Profile')}>
            <Image source={require('../../assets/images/profile.png')} style={styles.avatar} />
            <View style={styles.onlineDotWrap}>
              <ContinuousPulseRing color={AppTheme.teal} size={12} />
              <View style={styles.onlineDot} />
            </View>
          </TouchableOpacity>
        </FadeSlideIn>

        {/* ── Health Card ── */}
        <FadeSlideIn from="bottom" delay={80}>
          <GlassCard padding={0} borderColor={AppTheme.borderTeal}>
            <LinearGradient
              colors={[AppTheme.violetDim, AppTheme.tealDim]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.healthCard}
            >
              {/* Progress Ring */}
              <View style={styles.ringWrap}>
                <CircularProgress
                  value={92}
                  radius={52}
                  duration={1200}
                  maxValue={100}
                  activeStrokeColor={AppTheme.teal}
                  activeStrokeSecondaryColor={AppTheme.violet}
                  inActiveStrokeColor={AppTheme.surface2}
                  inActiveStrokeWidth={8}
                  activeStrokeWidth={8}
                  showProgressValue={false}
                />
                {/* absolute overlay — library has no icon support */}
                <View style={styles.ringOverlay}>
                  <SyncedHeartPulse
                    color={AppTheme.rose}
                    size={15}
                    icon={<Ionicons name="heart" color={AppTheme.rose} size={15} />}
                  />
                  <Text style={{ fontFamily: 'Outfit_800ExtraBold', fontSize: 22, color: AppTheme.textPrimary }}>{heartRate}</Text>
                  <Text style={{ fontSize: 10, color: AppTheme.textMuted }}>BPM</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.healthStats}>
                <Text style={Typography.caption}>Overall Health</Text>
                <Text style={[Typography.h2, { color: AppTheme.teal }]}>Excellent</Text>
                <Text style={styles.trendText}>↑ +4 pts this week</Text>
                <View style={{ height: 12 }} />
                {[
                  { icon: 'walk', color: AppTheme.violet, label: '8,432 steps' },
                  { icon: 'water', color: AppTheme.teal, label: '6/8 glasses' },
                  { icon: 'moon', color: AppTheme.rose, label: '7h 20m sleep' },
                ].map(item => (
                  <View key={item.label} style={styles.statRow}>
                    <Ionicons name={item.icon} color={item.color} size={13} />
                    <Text style={styles.statText}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </GlassCard>
        </FadeSlideIn>

        {/* ── Vitals ── */}
        <FadeSlideIn from="bottom" delay={140} style={styles.section}>
          <SectionHeader title="Today's Vitals" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vitalsRow}
          >
            <VitalChip label="SpO₂" value="98%" icon="water-outline" color={AppTheme.teal} />
            <View style={{ width: 12 }} />
            <VitalChip label="Blood Pressure" value="120/80" icon="heart-half-outline" color={AppTheme.rose} />
            <View style={{ width: 12 }} />
            <VitalChip label="Glucose" value="94 mg" icon="color-fill-outline" color={AppTheme.violet} />
          </ScrollView>
        </FadeSlideIn>

        {/* ── Heart Rate Chart ── */}
        <FadeSlideIn from="bottom" delay={180} style={styles.section}>
          <GlassCard>
            <SectionHeader title="Heart Rate" actionLabel="See All" />
            <Text style={[Typography.caption, { marginTop: 4, marginBottom: 16 }]}>This week</Text>
            <View style={{ marginHorizontal: -8 }}>
              <LineChart
                data={chartData}
                color1={AppTheme.teal}
                dataPointsColor1={AppTheme.teal}
                startFillColor1={AppTheme.teal}
                startOpacity={0.18}
                endOpacity={0}
                areaChart curved
                dataPointsRadius={4}
                height={110}
                yAxisColor="transparent"
                xAxisColor="transparent"
                hideYAxisText
                rulesColor={AppTheme.border}
                spacing={42}
                initialSpacing={10}
                xAxisLabelTextStyle={{ color: AppTheme.textMuted, fontSize: 10, fontFamily: 'Inter_400Regular' }}
              />
            </View>
          </GlassCard>
        </FadeSlideIn>

        {/* ── Medications ── */}
        <FadeSlideIn from="bottom" delay={220} style={styles.section}>
          <GlassCard borderColor={AppTheme.violetDim}>
            <SectionHeader title="💊 Medications" actionLabel="View All" />
            <View style={{ height: 16 }} />
            {[
              { name: 'Lisinopril 10mg', time: '8:00 AM', color: AppTheme.teal, status: 'Taken' },
              { name: 'Metformin 500mg', time: '1:00 PM', color: AppTheme.violet, status: 'Pending' },
            ].map((med, i) => (
              <View key={i} style={[styles.medRow, i > 0 && { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: AppTheme.border }]}>
                <View style={[styles.medIcon, { backgroundColor: med.color + '20' }]}>
                  <Ionicons name="medical" color={med.color} size={18} />
                </View>
                <View style={styles.medInfo}>
                  <Text style={[Typography.body, { fontWeight: '600', fontSize: 14 }]}>{med.name}</Text>
                  <Text style={[Typography.caption, { marginTop: 3 }]}>{med.time}</Text>
                </View>
                <Badge label={med.status} color={med.status === 'Taken' ? AppTheme.teal : AppTheme.warning} size="sm" />
              </View>
            ))}
          </GlassCard>
        </FadeSlideIn>

        {/* ── Next Appointment ── */}
        <FadeSlideIn from="bottom" delay={245} style={styles.section}>
          <SectionHeader title="Next Appointment" actionLabel="View All" />
          <View style={{ height: 14 }} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setJoinCallVisible(true)}
          >
            <GlassCard borderColor={`${AppTheme.teal}33`}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.apptIconWrap}>
                  <Ionicons name="medical" color={AppTheme.teal} size={22} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[Typography.body, { fontWeight: '600', fontSize: 14 }]}>Dr. Aravind Kumar</Text>
                  <Text style={[Typography.caption, { marginTop: 2 }]}>Cardiologist · Apollo Hospital</Text>
                </View>
                <Ionicons name="chevron-forward" color={AppTheme.textMuted} size={18} />
              </View>
              <View style={styles.apptDivider} />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={styles.apptChip}>
                  <Ionicons name="calendar-outline" color={AppTheme.teal} size={13} />
                  <Text style={styles.apptChipText}>Mon, Aug 11</Text>
                </View>
                <View style={styles.apptChip}>
                  <Ionicons name="time-outline" color={AppTheme.violet} size={13} />
                  <Text style={[styles.apptChipText, { color: AppTheme.violet }]}>10:30 AM</Text>
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        </FadeSlideIn>

        {/* ── Quick Actions ── */}
        <FadeSlideIn from="bottom" delay={260} style={styles.section}>
          <SectionHeader title="Quick Actions" />
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map(item => (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.78}
                onPress={() => navigation.navigate(item.route)}
                style={styles.actionCell}
              >
                <GlassCard padding={14} borderColor={item.color + '40'}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={[styles.actionIconWrap, { backgroundColor: item.color + '20' }]}>
                      <Ionicons name={item.icon} color={item.color} size={22} />
                    </View>
                    <Text style={[Typography.caption, { textAlign: 'center', marginTop: 10, fontSize: 12 }]}>
                      {item.label}
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </FadeSlideIn>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.bgDeep },
  scrollContent: { paddingHorizontal: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontFamily: 'Inter_400Regular', fontSize: 13, color: AppTheme.textMuted, marginBottom: 4 },
  scorePill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: AppTheme.tealDim, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: AppTheme.borderTeal, marginTop: 10,
  },
  scoreDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: AppTheme.teal, marginRight: 7 },
  scoreText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: AppTheme.teal },
  avatarWrap: { position: 'relative', marginLeft: 12 },
  avatar: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  onlineDotWrap: { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, alignItems: 'center', justifyContent: 'center' },
  onlineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: AppTheme.teal, borderWidth: 2, borderColor: AppTheme.bgDeep },

  healthCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20 },
  ringWrap: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  ringOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  healthStats: { flex: 1, marginLeft: 20 },
  trendText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: AppTheme.teal, marginTop: 3 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  statText: { fontFamily: 'Inter_400Regular', color: AppTheme.textMuted, fontSize: 12, marginLeft: 7 },

  section: { marginTop: 22 },
  vitalsRow: { paddingTop: 14 },

  medRow: { flexDirection: 'row', alignItems: 'center' },
  medIcon: { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  medInfo: { flex: 1 },

  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10,
  },
  actionCell: { flex: 1 },
  actionIconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  apptIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: `${AppTheme.teal}20`, justifyContent: 'center', alignItems: 'center' },
  apptDivider: { height: 1, backgroundColor: AppTheme.border, marginVertical: 14 },
  apptChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: AppTheme.surface2, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  apptChipText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: AppTheme.teal },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  modalBox: { width: '100%', backgroundColor: '#1A1F2E', borderRadius: 20, padding: 24 },
  modalTitle: { fontFamily: 'Outfit_800ExtraBold', fontSize: 22, color: AppTheme.textPrimary, marginBottom: 12 },
  modalMessage: { fontFamily: 'Inter_400Regular', fontSize: 14, color: AppTheme.textMuted, lineHeight: 22 },
  modalActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 28, gap: 16 },
  modalLater: { fontFamily: 'Inter_500Medium', fontSize: 15, color: AppTheme.textMuted },
  modalJoinBtn: { backgroundColor: AppTheme.teal, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 50 },
  modalJoinText: { fontFamily: 'Outfit_800ExtraBold', fontSize: 15, color: '#000' },
});
