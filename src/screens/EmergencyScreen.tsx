// @ts-nocheck
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, SectionHeader } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';

export default function EmergencyScreen() {
  const navigation = useNavigation();
  const [isPressing, setIsPressing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const holdProgress = useRef(new Animated.Value(0)).current;
  let holdAnim = useRef<Animated.CompositeAnimation | null>(null);

  const handlePressIn = () => {
    setIsPressing(true);
    holdAnim.current = Animated.timing(holdProgress, {
      toValue: 1, duration: 2500, useNativeDriver: false,
    });
    holdAnim.current.start(({ finished }) => {
      if (finished) triggerSOS();
    });
  };

  const handlePressOut = () => {
    setIsPressing(false);
    if (holdAnim.current) holdAnim.current.stop();
    Animated.timing(holdProgress, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const triggerSOS = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 2000);
  };

  const heightAnim = holdProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h3, { flex: 1, textAlign: 'center', marginRight: 40 }]}>Emergency</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* SOS Button */}
        <FadeSlideIn from="none" delay={0} style={styles.sosContainer}>
          <View style={styles.ripple1} />
          <View style={styles.ripple2} />
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.sosButton}
          >
            <Text style={[Typography.h1, { color: '#FFF', fontSize: 42 }]}>SOS</Text>
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Animated.View style={[styles.holdFill, { height: heightAnim }]} />
            </View>
          </TouchableOpacity>
          <Text style={[Typography.caption, { marginTop: 24, fontSize: 13 }]}>
            {isPressing ? 'Keep holding...' : 'Hold 2.5s to trigger'}
          </Text>
        </FadeSlideIn>

        {/* Quick Dial */}
        <FadeSlideIn from="bottom" delay={100} style={styles.section}>
          <SectionHeader title="Quick Call" />
          <View style={{ height: 14 }} />
          <View style={styles.quickCallRow}>
            <QuickCallBtn icon="medical" label="Ambulance" color={AppTheme.error} />
            <QuickCallBtn icon="shield-checkmark" label="Police" color={AppTheme.violet} />
            <QuickCallBtn icon="flame" label="Fire" color={AppTheme.warning} />
          </View>
        </FadeSlideIn>

        {/* Medical ID */}
        <FadeSlideIn from="bottom" delay={200} style={styles.section}>
          <GlassCard borderColor={`${AppTheme.error}40`}>
            <View style={styles.medIdHeader}>
              <Ionicons name="card" color={AppTheme.error} size={20} />
              <Text style={[Typography.h3, { marginLeft: 8 }]}>Medical ID</Text>
            </View>
            <View style={styles.idGrid}>
              <IdItem label="Blood Type" value="O+" color={AppTheme.error} />
              <IdItem label="Age" value="34" color={AppTheme.textPrimary} />
              <IdItem label="Weight" value="76.5 kg" color={AppTheme.textPrimary} />
              <IdItem label="Allergies" value="Penicillin, Peanuts" color={AppTheme.warning} />
            </View>
            <View style={styles.divider} />
            <Text style={[Typography.caption, { marginBottom: 8 }]}>Primary Emergency Contact</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="person-circle" color={AppTheme.teal} size={36} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={Typography.body}>Lavanya pandi</Text>
                <Text style={Typography.caption}>Spouse • +91 8600977552</Text>
              </View>
              <Ionicons name="call" color={AppTheme.teal} size={20} />
            </View>
          </GlassCard>
        </FadeSlideIn>
      </ScrollView>

      <Modal visible={loading || success} transparent animationType="fade">
        <View style={styles.modalBg}>
          <GlassCard padding={32} style={{ alignItems: 'center', marginHorizontal: 20 }}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color={AppTheme.error} />
                <Text style={[Typography.h3, { marginTop: 16 }]}>Dispatching Services...</Text>
                <Text style={[Typography.bodyMuted, { textAlign: 'center', marginTop: 8 }]}>Please stay calm. Help is on the way.</Text>
              </>
            ) : (
              <>
                <View style={[styles.successIcon, { backgroundColor: `${AppTheme.error}26` }]}>
                  <Ionicons name="checkmark-done" color={AppTheme.error} size={40} />
                </View>
                <Text style={[Typography.h2, { fontSize: 22, marginTop: 24, textAlign: 'center' }]}>Services Dispatched</Text>
                <Text style={{ color: AppTheme.textMuted, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 21 }}>
                  Emergency services and your emergency contacts have been notified.
                </Text>
                <TouchableOpacity onPress={() => { setSuccess(false); navigation.goBack(); }} style={styles.doneBtn}>
                  <Text style={{ color: AppTheme.bgDeep, fontFamily: 'Outfit_700Bold', fontSize: 16 }}>Return to App</Text>
                </TouchableOpacity>
              </>
            )}
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const QuickCallBtn = ({ icon, label, color }: any) => (
  <View style={{ flex: 1, paddingHorizontal: 4 }}>
    <GlassCard padding={12} borderColor={`${color}33`} style={{ alignItems: 'center' }}>
      <Ionicons name={icon} color={color} size={28} />
      <Text style={[Typography.caption, { marginTop: 8, textAlign: 'center' }]}>{label}</Text>
    </GlassCard>
  </View>
);

const IdItem = ({ label, value, color }: any) => (
  <View style={styles.idItem}>
    <Text style={Typography.caption}>{label}</Text>
    <Text style={[Typography.body, { color, fontWeight: '700', marginTop: 2 }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.bgDeep },
  appBar: { flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS === 'android' ? 40 : 60, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { padding: 8, marginLeft: -8 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sosContainer: { alignItems: 'center', paddingVertical: 40 },
  ripple1: { position: 'absolute', top: 40, width: 200, height: 200, borderRadius: 100, backgroundColor: `${AppTheme.error}22` },
  ripple2: { position: 'absolute', top: 40, width: 240, height: 240, borderRadius: 120, backgroundColor: `${AppTheme.error}11` },
  sosButton: {
    width: 200, height: 200, borderRadius: 100, backgroundColor: AppTheme.error,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: AppTheme.error, shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 20, overflow: 'hidden',
  },
  holdFill: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.25)' },
  section: { marginTop: 20 },
  quickCallRow: { flexDirection: 'row', marginHorizontal: -4 },
  medIdHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  idGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  idItem: { width: '50%', marginBottom: 16 },
  divider: { height: 1, backgroundColor: AppTheme.border, marginVertical: 16 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  successIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  doneBtn: { backgroundColor: AppTheme.error, width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
});
