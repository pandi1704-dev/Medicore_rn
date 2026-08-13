// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, GradientButton } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';

const BODY_REGIONS = [
  { id: 'head', title: 'Head & Brain', subtitle: 'Headache, Dizziness, Migraine', icon: 'person-outline', color: AppTheme.violet },
  { id: 'chest', title: 'Chest & Breathing', subtitle: 'Chest Tightness, Shortness of Breath', icon: 'heart-outline', color: AppTheme.rose },
  { id: 'stomach', title: 'Stomach & Digestion', subtitle: 'Nausea, Abdominal Pain, Acid', icon: 'nutrition-outline', color: AppTheme.warning },
  { id: 'joints', title: 'Joints & Muscles', subtitle: 'Back Pain, Joint Stiffness', icon: 'body-outline', color: AppTheme.teal },
];

export default function SymptomTriageScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [selectedRegion, setSelectedRegion] = useState(BODY_REGIONS[0]);
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [triageResult, setTriageResult] = useState<any | null>(null);

  const handleEvaluate = () => {
    if (severity === 'Severe') {
      setTriageResult({
        level: 'Urgent Care Required',
        color: AppTheme.error,
        actionText: 'Connect with Emergency Doctor or Call SOS',
        recommendation: 'Your symptoms suggest immediate medical evaluation is recommended.',
        route: 'Emergency',
      });
    } else {
      setTriageResult({
        level: 'Consultation Recommended',
        color: AppTheme.teal,
        actionText: 'Book Teleconsultation Specialist',
        recommendation: 'Your symptoms are manageable. Scheduling a consultation with a General Physician is advised.',
        route: 'Doctors',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Symptom Checker & Triage</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 1: Select Symptom Region */}
        <FadeSlideIn from="top" delay={50}>
          <Text style={[Typography.caption, { marginBottom: 10 }]}>STEP 1: SELECT AFFECTED BODY AREA</Text>
          <View style={styles.regionGrid}>
            {BODY_REGIONS.map((r) => {
              const active = r.id === selectedRegion.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedRegion(r);
                    setTriageResult(null);
                  }}
                  style={{ width: '48%', marginBottom: 12 }}
                >
                  <GlassCard
                    padding={14}
                    borderColor={active ? r.color : AppTheme.border}
                    style={{ backgroundColor: active ? `${r.color}20` : undefined }}
                  >
                    <View style={[styles.iconWrap, { backgroundColor: `${r.color}25` }]}>
                      <Ionicons name={r.icon as any} size={22} color={r.color} />
                    </View>
                    <Text style={[Typography.body, { fontWeight: '700', marginTop: 10, fontSize: 13 }]}>
                      {r.title}
                    </Text>
                    <Text style={[Typography.caption, { fontSize: 10, marginTop: 4 }]} numberOfLines={2}>
                      {r.subtitle}
                    </Text>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>
        </FadeSlideIn>

        {/* Step 2: Severity Scale */}
        <FadeSlideIn from="bottom" delay={100} style={{ marginTop: 10 }}>
          <Text style={[Typography.caption, { marginBottom: 10 }]}>STEP 2: SYMPTOM SEVERITY LEVEL</Text>
          <GlassCard padding={14}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => {
                const active = severity === sev;
                const color = sev === 'Mild' ? AppTheme.teal : sev === 'Moderate' ? AppTheme.warning : AppTheme.error;
                return (
                  <TouchableOpacity
                    key={sev}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSeverity(sev);
                      setTriageResult(null);
                    }}
                    style={{ flex: 1, marginHorizontal: 4 }}
                  >
                    <View
                      style={[
                        styles.sevBtn,
                        {
                          borderColor: active ? color : AppTheme.border,
                          backgroundColor: active ? `${color}25` : AppTheme.surface2,
                        },
                      ]}
                    >
                      <Text style={[Typography.body, { color: active ? color : AppTheme.textMuted, fontWeight: '700' }]}>
                        {sev}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>
        </FadeSlideIn>

        {/* Evaluate Button */}
        <View style={{ marginVertical: 20 }}>
          <GradientButton text="Run AI Triage Evaluation" onPress={handleEvaluate} icon="pulse-outline" />
        </View>

        {/* Step 3: Triage Outcome Card */}
        {triageResult && (
          <FadeSlideIn from="bottom" delay={50}>
            <GlassCard borderColor={`${triageResult.color}66`}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.resultBadge, { backgroundColor: `${triageResult.color}25` }]}>
                  <Ionicons name="medical" size={24} color={triageResult.color} />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[Typography.h3, { color: triageResult.color, fontSize: 17 }]}>
                    {triageResult.level}
                  </Text>
                  <Text style={[Typography.caption, { marginTop: 2 }]}>Based on {selectedRegion.title} ({severity})</Text>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: AppTheme.border, marginVertical: 14 }} />

              <Text style={[Typography.body, { fontSize: 13, lineHeight: 20 }]}>
                {triageResult.recommendation}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate(triageResult.route as any)}
                style={[styles.actionBtn, { backgroundColor: triageResult.color }]}
              >
                <Text style={[Typography.body, { color: AppTheme.bgDeep, fontWeight: '700', textAlign: 'center' }]}>
                  {triageResult.actionText}
                </Text>
              </TouchableOpacity>
            </GlassCard>
          </FadeSlideIn>
        )}
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  regionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  iconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sevBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  resultBadge: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  actionBtn: { marginTop: 16, paddingVertical: 14, borderRadius: 12 },
});
