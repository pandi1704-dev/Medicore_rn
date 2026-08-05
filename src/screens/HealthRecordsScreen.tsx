// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, SectionHeader, StatusBadge } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';

const TABS = ['Analytics', 'Lab Results', 'History'];

export default function HealthRecordsScreen() {
  const [activeTab, setActiveTab] = useState('Analytics');
  const insets = useSafeAreaInsets();

  const bpData = [
    { value: 118, label: 'Mon' },
    { value: 121, label: 'Tue' },
    { value: 119, label: 'Wed' },
    { value: 125, label: 'Thu' },
    { value: 120, label: 'Fri' },
    { value: 122, label: 'Sat' },
    { value: 118, label: 'Sun' },
  ];

  const weightData = [
    { value: 76.8, label: 'Jan' },
    { value: 76.5, label: 'Feb' },
    { value: 77.0, label: 'Mar' },
    { value: 76.2, label: 'Apr' },
    { value: 75.8, label: 'May' },
    { value: 76.5, label: 'Jun' },
  ];

  const renderAnalytics = () => (
    <FadeSlideIn from="bottom" style={styles.tabContent}>
      
      {/* BP Chart */}
      <GlassCard borderColor={`${AppTheme.rose}33`}>
        <SectionHeader title="Blood Pressure" actionLabel="Details" />
        <View style={{ height: 4 }} />
        <Text style={[Typography.h2, { color: AppTheme.rose }]}>120/80 <Text style={[Typography.caption, { color: AppTheme.textMuted }]}>mmHg</Text></Text>
        <View style={{ height: 24 }} />
        
        <View style={{ marginLeft: -10 }}>
          <LineChart
            data={bpData}
            color1={AppTheme.rose}
            dataPointsColor1={AppTheme.rose}
            startFillColor1={AppTheme.rose}
            startOpacity={0.2}
            endOpacity={0}
            areaChart
            curved
            dataPointsRadius={4}
            height={140}
            yAxisColor="transparent"
            xAxisColor="transparent"
            hideYAxisText
            rulesColor={AppTheme.border}
            spacing={45}
            initialSpacing={15}
            xAxisLabelTextStyle={{ color: AppTheme.textMuted, fontSize: 10 }}
          />
        </View>
      </GlassCard>

      <View style={{ height: 20 }} />

      {/* Weight Bar Chart */}
      <GlassCard borderColor={`${AppTheme.teal}33`}>
        <SectionHeader title="Weight Tracking" actionLabel="Details" />
        <View style={{ height: 4 }} />
        <Text style={[Typography.h2, { color: AppTheme.teal }]}>76.5 <Text style={[Typography.caption, { color: AppTheme.textMuted }]}>kg</Text></Text>
        <View style={{ height: 24 }} />
        
        <View style={{ marginLeft: -10 }}>
          <BarChart
            data={weightData}
            frontColor={AppTheme.teal}
            barWidth={22}
            barBorderRadius={4}
            height={140}
            yAxisColor="transparent"
            xAxisColor="transparent"
            hideYAxisText
            rulesColor={AppTheme.border}
            spacing={35}
            initialSpacing={15}
            xAxisLabelTextStyle={{ color: AppTheme.textMuted, fontSize: 10 }}
            yAxisTextStyle={{ color: AppTheme.textMuted, fontSize: 10 }}
            showYAxisIndices={false}
          />
        </View>
      </GlassCard>

    </FadeSlideIn>
  );

  const renderLabResults = () => (
    <FadeSlideIn from="bottom" style={styles.tabContent}>
      <GlassCard borderColor={`${AppTheme.violet}33`}>
        <SectionHeader title="Complete Blood Count" />
        <Text style={[Typography.caption, { marginBottom: 16, marginTop: 4 }]}>Oct 15, 2023 • Quest Diagnostics</Text>
        
        {renderLabItem('Hemoglobin', '14.5 g/dL', 'Normal', AppTheme.teal)}
        {renderLabItem('White Blood Cells', '6.8 x10^9/L', 'Normal', AppTheme.teal)}
        {renderLabItem('Platelets', '145 x10^9/L', 'Low', AppTheme.warning)}
      </GlassCard>
      
      <View style={{ height: 20 }} />
      
      <GlassCard borderColor={`${AppTheme.rose}33`}>
        <SectionHeader title="Lipid Panel" />
        <Text style={[Typography.caption, { marginBottom: 16, marginTop: 4 }]}>Sep 02, 2023 • LabCorp</Text>
        
        {renderLabItem('Total Cholesterol', '195 mg/dL', 'Normal', AppTheme.teal)}
        {renderLabItem('LDL (Bad)', '120 mg/dL', 'Borderline', AppTheme.warning)}
        {renderLabItem('HDL (Good)', '55 mg/dL', 'Normal', AppTheme.teal)}
      </GlassCard>
    </FadeSlideIn>
  );

  const renderLabItem = (name: string, value: string, status: string, color: string) => (
    <View style={styles.labItem}>
      <View style={{ flex: 1 }}>
        <Text style={Typography.body}>{name}</Text>
        <Text style={[Typography.h3, { fontSize: 15, marginTop: 4 }]}>{value}</Text>
      </View>
      <StatusBadge label={status} color={color} />
    </View>
  );

  const renderHistory = () => (
    <FadeSlideIn from="bottom" style={styles.tabContent}>
      <GlassCard>
        <SectionHeader title="Medical History" />
        <View style={{ height: 24 }} />
        
        {renderTimelineItem('Dec 2023', 'Annual Physical Exam', 'Dr. Sarah Chen', true)}
        {renderTimelineItem('Aug 2023', 'Dermatology Consultation', 'Dr. Priya Sharma', false)}
        {renderTimelineItem('Mar 2022', 'Orthopedic Surgery (Knee)', 'Dr. Elena Vasquez', false)}
      </GlassCard>
    </FadeSlideIn>
  );

  const renderTimelineItem = (date: string, title: string, subtitle: string, isFirst: boolean) => (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: isFirst ? AppTheme.teal : AppTheme.textMuted }]} />
        <View style={[styles.timelineLine, { backgroundColor: AppTheme.border }]} />
      </View>
      <View style={styles.timelineContent}>
        <Text style={[Typography.caption, { color: AppTheme.teal }]}>{date}</Text>
        <Text style={[Typography.body, { fontWeight: '600', marginTop: 4 }]}>{title}</Text>
        <Text style={[Typography.caption, { marginTop: 4 }]}>{subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 14 }]}>
        <Text style={Typography.h1}>Health Records</Text>
        <Text style={[Typography.bodyMuted, { marginTop: 3 }]}>Your medical summary</Text>
      </View>

      <View style={styles.tabContainer}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, active && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                { color: active ? AppTheme.teal : AppTheme.textMuted, fontFamily: active ? 'Outfit_700Bold' : 'Inter_400Regular' },
              ]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'Analytics' && renderAnalytics()}
        {activeTab === 'Lab Results' && renderLabResults()}
        {activeTab === 'History' && renderHistory()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.bgDeep,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
  },
  tabText: {
    fontSize: 13,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: AppTheme.teal,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Tab bar padding
  },
  tabContent: {
    flex: 1,
  },
  labItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.border,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: AppTheme.bgCard,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
    paddingLeft: 12,
  },
});
