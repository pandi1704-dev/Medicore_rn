// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LinearGradient,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, GradientButton } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';

const REPORTS = [
  { id: '1', title: 'Complete Lipid Panel', date: 'Aug 10, 2026', lab: 'Apollo Diagnostics' },
  { id: '2', title: 'Complete Blood Count (CBC)', date: 'Jul 24, 2026', lab: 'Metropolis Healthcare' },
  { id: '3', title: 'HbA1c & Fasting Glucose', date: 'Jun 15, 2026', lab: 'Thyrocare' },
];

const ANALYZED_VITALS = [
  {
    name: 'Total Cholesterol',
    value: '215 mg/dL',
    range: '120 - 200 mg/dL',
    status: 'Borderline High',
    color: AppTheme.warning,
    percentage: 72,
  },
  {
    name: 'Hemoglobin (Hb)',
    value: '14.8 g/dL',
    range: '13.5 - 17.5 g/dL',
    status: 'Optimal',
    color: AppTheme.teal,
    percentage: 50,
  },
  {
    name: 'Fasting Blood Sugar',
    value: '94 mg/dL',
    range: '70 - 99 mg/dL',
    status: 'Normal',
    color: AppTheme.teal,
    percentage: 45,
  },
  {
    name: 'Triglycerides',
    value: '185 mg/dL',
    range: '< 150 mg/dL',
    status: 'Elevated',
    color: AppTheme.rose,
    percentage: 82,
  },
];

export default function LabAnalyzerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedReport, setSelectedReport] = useState(REPORTS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={Typography.h2}>AI Lab Analyzer</Text>
        <TouchableOpacity onPress={handleReanalyze} style={styles.scanBtn}>
          <Ionicons name="scan-outline" size={20} color={AppTheme.teal} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Report Selector Pills */}
        <FadeSlideIn from="top" delay={50}>
          <Text style={[Typography.caption, { marginBottom: 8 }]}>SELECT REPORT TO ANALYZE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {REPORTS.map((r) => {
              const active = r.id === selectedReport.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedReport(r)}
                  style={{ marginRight: 10 }}
                >
                  <GlassCard
                    padding={12}
                    borderColor={active ? AppTheme.teal : AppTheme.border}
                    style={{ backgroundColor: active ? `${AppTheme.teal}15` : undefined }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons
                        name="document-text"
                        size={16}
                        color={active ? AppTheme.teal : AppTheme.textMuted}
                      />
                      <View style={{ marginLeft: 8 }}>
                        <Text style={[Typography.body, { fontSize: 13, fontWeight: active ? '700' : '500' }]}>
                          {r.title}
                        </Text>
                        <Text style={[Typography.caption, { fontSize: 10, marginTop: 2 }]}>
                          {r.date} • {r.lab}
                        </Text>
                      </View>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeSlideIn>

        {/* AI Insight Summary Banner */}
        <FadeSlideIn from="bottom" delay={100}>
          <GlassCard borderColor={`${AppTheme.teal}40`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={16} color={AppTheme.teal} />
              </View>
              <Text style={[Typography.h3, { fontSize: 16, marginLeft: 10, color: AppTheme.teal }]}>
                AI Health Diagnosis Summary
              </Text>
            </View>
            <Text style={[Typography.body, { fontSize: 13, lineHeight: 20 }]}>
              Your lipid panel indicates optimal fasting blood glucose and healthy hemoglobin levels. However, total cholesterol (215 mg/dL) and triglycerides (185 mg/dL) are slightly elevated.
            </Text>
            <View style={styles.summaryTagRow}>
              <View style={[styles.summaryTag, { backgroundColor: `${AppTheme.teal}20` }]}>
                <Text style={[Typography.caption, { color: AppTheme.teal, fontWeight: '700' }]}>
                  Low Cardiovascular Risk
                </Text>
              </View>
              <View style={[styles.summaryTag, { backgroundColor: `${AppTheme.warning}20`, marginLeft: 8 }]}>
                <Text style={[Typography.caption, { color: AppTheme.warning, fontWeight: '700' }]}>
                  Dietary Tweak Suggested
                </Text>
              </View>
            </View>
          </GlassCard>
        </FadeSlideIn>

        {/* Analyzed Vitals Range Gauges */}
        <FadeSlideIn from="bottom" delay={150} style={{ marginTop: 20 }}>
          <Text style={[Typography.h3, { fontSize: 17, marginBottom: 12 }]}>Biomarker Range Gauges</Text>
          {ANALYZED_VITALS.map((vital, idx) => (
            <View key={idx} style={{ marginBottom: 12 }}>
              <GlassCard padding={14} borderColor={`${vital.color}33`}>
                <View style={styles.vitalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.body, { fontWeight: '700' }]}>{vital.name}</Text>
                    <Text style={[Typography.caption, { marginTop: 2 }]}>Reference: {vital.range}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[Typography.h3, { color: vital.color, fontSize: 16 }]}>{vital.value}</Text>
                    <Text style={[Typography.caption, { color: vital.color, fontWeight: '700', marginTop: 2 }]}>
                      {vital.status}
                    </Text>
                  </View>
                </View>

                {/* Range Gauge Bar */}
                <View style={styles.gaugeTrack}>
                  <View
                    style={[
                      styles.gaugeFill,
                      { width: `${vital.percentage}%`, backgroundColor: vital.color },
                    ]}
                  />
                  <View style={[styles.gaugeThumb, { left: `${vital.percentage - 2}%`, borderColor: vital.color }]} />
                </View>
              </GlassCard>
            </View>
          ))}
        </FadeSlideIn>

        {/* AI Diet & Action Plan */}
        <FadeSlideIn from="bottom" delay={200} style={{ marginTop: 10 }}>
          <GlassCard borderColor={`${AppTheme.violet}40`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="nutrition" size={18} color={AppTheme.violet} />
              <Text style={[Typography.h3, { fontSize: 15, marginLeft: 8 }]}>AI Actionable Recommendations</Text>
            </View>
            <View style={styles.actionItem}>
              <Ionicons name="checkmark-circle" size={16} color={AppTheme.teal} />
              <Text style={[Typography.bodyMuted, { fontSize: 13, marginLeft: 8, flex: 1 }]}>
                Increase Omega-3 fatty acid intake (flaxseeds, walnuts, or fish oil supplements).
              </Text>
            </View>
            <View style={styles.actionItem}>
              <Ionicons name="checkmark-circle" size={16} color={AppTheme.teal} />
              <Text style={[Typography.bodyMuted, { fontSize: 13, marginLeft: 8, flex: 1 }]}>
                Engage in 30 minutes of aerobic cardio 4x per week to reduce triglycerides.
              </Text>
            </View>
          </GlassCard>
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
  scanBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: `${AppTheme.teal}20`,
    justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  aiBadge: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: `${AppTheme.teal}20`,
    justifyContent: 'center', alignItems: 'center',
  },
  summaryTagRow: { flexDirection: 'row', marginTop: 12 },
  summaryTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  vitalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  gaugeTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.surface2,
    position: 'relative',
    justifyContent: 'center',
  },
  gaugeFill: { height: 8, borderRadius: 4 },
  gaugeThumb: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: AppTheme.textPrimary,
    borderWidth: 2,
    position: 'absolute',
    top: -3,
  },
  actionItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
});
