// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmergencyScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [isPressing, setIsPressing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calling state for Quick Call buttons
  const [activeCall, setActiveCall] = useState<{ name: string; number: string } | null>(null);

  const holdProgress = useRef(new Animated.Value(0)).current;
  let holdAnim = useRef<Animated.CompositeAnimation | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTriggeredRef = useRef(false);
  const tapCountRef = useRef(0);
  const tapResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTapCounter = () => {
    tapCountRef.current = 0;
    if (tapResetTimerRef.current) {
      clearTimeout(tapResetTimerRef.current);
      tapResetTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (holdAnim.current) holdAnim.current.stop();
      if (tapResetTimerRef.current) clearTimeout(tapResetTimerRef.current);
    };
  }, []);

  const handlePressIn = () => {
    holdTriggeredRef.current = false;
    setIsPressing(true);

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    holdAnim.current = Animated.timing(holdProgress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    });
    holdAnim.current.start();

    holdTimerRef.current = setTimeout(() => {
      holdTriggeredRef.current = true;
      setIsPressing(false);
      if (holdAnim.current) holdAnim.current.stop();
      holdProgress.setValue(1);
      triggerSOS();
    }, 3000);
  };

  const handlePressOut = () => {
    setIsPressing(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (holdAnim.current) holdAnim.current.stop();

    // If user released before 3 sec, collapse progress immediately.
    // If SOS already triggered, still reset so the next attempt starts clean.
    Animated.timing(holdProgress, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    holdTriggeredRef.current = false;
  };

  const triggerSOS = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleTripleTapSOS = () => {
    if (loading || success || isPressing) return;

    tapCountRef.current += 1;

    if (tapCountRef.current >= 3) {
      resetTapCounter();
      setIsPressing(false);
      if (holdAnim.current) holdAnim.current.stop();
      Animated.timing(holdProgress, {
        toValue: 0,
        duration: 120,
        useNativeDriver: false,
      }).start();
      triggerSOS();
      return;
    }

    if (tapResetTimerRef.current) clearTimeout(tapResetTimerRef.current);
    tapResetTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
      tapResetTimerRef.current = null;
    }, 1200);
  };

  const handleQuickCall = (name: string, number: string) => {
    setActiveCall({ name, number });

    // Trigger phone link
    try {
      Linking.openURL(`tel:${number}`);
    } catch (e) {
      console.log('Phone link error:', e);
    }

    // Dismiss calling toast after 4 seconds
    setTimeout(() => {
      setActiveCall(null);
    }, 4000);
  };

  const heightAnim = holdProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.appBar, { paddingTop: (insets.top || 0) + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency SOS</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Title & Subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.primaryQuestion}>Are you in an emergency?</Text>
          <Text style={styles.subtitleText}>
            Hold the button below to alert emergency services and your contacts.
          </Text>
        </View>

        {/* Big Glowing SOS Button */}
        <FadeSlideIn from="none" delay={0} style={styles.sosContainer}>
          <View style={styles.glowRingOuter}>
            <View style={styles.glowRingInner}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleTripleTapSOS}
                style={styles.sosCircleButton}
              >
                <Ionicons name="warning" size={36} color="#FFF" style={{ marginBottom: 4 }} />
                <Text style={styles.sosText}>SOS</Text>
                <Text style={styles.holdText}>
                  {isPressing ? 'KEEP HOLDING' : 'HOLD 3 SEC'}
                </Text>
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                  <Animated.View style={[styles.holdFill, { height: heightAnim }]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </FadeSlideIn>

        {/* Quick Call Section */}
        <FadeSlideIn from="bottom" delay={100} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Call</Text>
          <View style={{ height: 12 }} />
          <View style={styles.quickCallGrid}>
            {/* Ambulance Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickCallCardWrapper}
              onPress={() => handleQuickCall('Ambulance', '108')}
            >
              <GlassCard
                padding={14}
                borderColor={`${AppTheme.error}66`}
                style={styles.quickCallCard}
              >
                <Ionicons name="medical" color={AppTheme.error} size={26} />
                <Text style={styles.quickCallLabel}>Ambulance</Text>
                <Text style={[styles.quickCallNumber, { color: AppTheme.error }]}>108</Text>
              </GlassCard>
            </TouchableOpacity>

            {/* Police Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickCallCardWrapper}
              onPress={() => handleQuickCall('Police', '100')}
            >
              <GlassCard
                padding={14}
                borderColor={`${AppTheme.teal}66`}
                style={styles.quickCallCard}
              >
                <Ionicons name="shield-checkmark" color={AppTheme.teal} size={26} />
                <Text style={styles.quickCallLabel}>Police</Text>
                <Text style={[styles.quickCallNumber, { color: AppTheme.teal }]}>100</Text>
              </GlassCard>
            </TouchableOpacity>

            {/* Fire Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickCallCardWrapper}
              onPress={() => handleQuickCall('Fire', '112')}
            >
              <GlassCard
                padding={14}
                borderColor={`${AppTheme.warning}66`}
                style={styles.quickCallCard}
              >
                <Ionicons name="flame" color={AppTheme.warning} size={26} />
                <Text style={styles.quickCallLabel}>Fire</Text>
                <Text style={[styles.quickCallNumber, { color: AppTheme.warning }]}>112</Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </FadeSlideIn>

        {/* Medical ID Card */}
        <FadeSlideIn from="bottom" delay={200} style={styles.section}>
          <GlassCard borderColor={`${AppTheme.teal}66`} padding={18}>
            {/* Header */}
            <View style={styles.medIdHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="medkit" color={AppTheme.teal} size={20} />
                <Text style={[Typography.h3, { marginLeft: 10, fontSize: 18 }]}>Medical ID</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[Typography.caption, { color: AppTheme.teal, fontWeight: '700', fontSize: 13 }]}>
                  View Full
                </Text>
              </TouchableOpacity>
            </View>

            {/* Vitals Grid */}
            <View style={styles.idGrid}>
              <View style={styles.idCell}>
                <Text style={Typography.caption}>Blood Type</Text>
                <Text style={[Typography.h2, { color: AppTheme.rose, marginTop: 4 }]}>B+</Text>
              </View>

              <View style={styles.idCell}>
                <Text style={Typography.caption}>Age</Text>
                <Text style={[Typography.h2, { color: AppTheme.violet, marginTop: 4 }]}>25</Text>
              </View>

              <View style={styles.idCell}>
                <Text style={Typography.caption}>Weight</Text>
                <Text style={[Typography.h2, { color: AppTheme.warning, marginTop: 4 }]}>76kg</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Allergies */}
            <View style={{ marginBottom: 14 }}>
              <Text style={Typography.caption}>Allergies</Text>
              <Text style={[Typography.body, { color: AppTheme.error, fontWeight: '700', marginTop: 4 }]}>
                Penicillin, Peanuts
              </Text>
            </View>

            {/* Emergency Contacts */}
            <View>
              <Text style={Typography.caption}>Emergency Contacts</Text>
              <Text style={[Typography.body, { fontWeight: '600', marginTop: 4 }]}>
                Lavanya Pandi (Spouse) - +91 8670004300
              </Text>
            </View>
          </GlassCard>
        </FadeSlideIn>
      </ScrollView>

      {/* Active Call Bottom Overlay Sheet (Screenshot 2 Design) */}
      {activeCall && (
        <View style={styles.callingOverlayContainer}>
          <View style={styles.callingBanner}>
            <Ionicons name="call" size={20} color={AppTheme.teal} style={styles.callingIcon} />
            <Text style={styles.callingText}>
              Calling {activeCall.name} ({activeCall.number})...
            </Text>
            <TouchableOpacity onPress={() => setActiveCall(null)} style={styles.closeCallBtn}>
              <Ionicons name="close" size={18} color={AppTheme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* SOS Triggered Modal */}
      <Modal visible={loading || success} transparent animationType="fade">
        <View style={styles.modalBg}>
          <GlassCard padding={32} style={{ alignItems: 'center', marginHorizontal: 20 }}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color={AppTheme.error} />
                <Text style={[Typography.h3, { marginTop: 16 }]}>Dispatching Emergency Services...</Text>
                <Text style={[Typography.bodyMuted, { textAlign: 'center', marginTop: 8 }]}>
                  Stay calm. Emergency responders & primary contacts are being notified with your live GPS location.
                </Text>
              </>
            ) : (
              <>
                <View style={[styles.successIcon, { backgroundColor: `${AppTheme.success}26` }]}>
                  <Ionicons name="checkmark-done" color={AppTheme.success} size={40} />
                </View>
                <Text style={[Typography.h2, { fontSize: 22, marginTop: 24, textAlign: 'center' }]}>
                  Emergency Alert Sent
                </Text>
                <Text style={{ color: AppTheme.textMuted, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 21 }}>
                  Nearby ambulance dispatched. Lavanya Pandi has received your location broadcast.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSuccess(false);
                    navigation.goBack();
                  }}
                  style={styles.doneBtn}
                >
                  <Text style={{ color: '#FFF', fontFamily: 'Outfit_700Bold', fontSize: 16 }}>
                    Return to Home
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.bgDeep,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: AppTheme.error,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  primaryQuestion: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: AppTheme.textPrimary,
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: AppTheme.textMuted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  sosContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  glowRingOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRingInner: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosCircleButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: AppTheme.error,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: AppTheme.error,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  sosText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 32,
    color: '#FFF',
    letterSpacing: 1,
  },
  holdText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    color: '#FFF',
    marginTop: 2,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  holdFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: AppTheme.textPrimary,
  },
  quickCallGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickCallCardWrapper: {
    flex: 1,
  },
  quickCallCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  quickCallLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: AppTheme.textPrimary,
    marginTop: 10,
  },
  quickCallNumber: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    marginTop: 2,
  },
  medIdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  idGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  idCell: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.border,
    marginVertical: 14,
  },
  callingOverlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  callingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callingIcon: {
    marginRight: 12,
  },
  callingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#0A1628',
    flex: 1,
  },
  closeCallBtn: {
    padding: 4,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBtn: {
    backgroundColor: AppTheme.teal,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
});
