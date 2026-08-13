// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';

const TIMELINE = [
  { title: 'Order Confirmed', time: '10:15 AM', done: true },
  { title: 'Prescription Verified', time: '10:22 AM', done: true },
  { title: 'Packed by Apollo Pharmacy', time: '10:35 AM', done: true },
  { title: 'Out for Delivery', time: 'Estimated 10:55 AM', done: true, current: true },
  { title: 'Delivered to Doorstep', time: 'Pending', done: false },
];

export default function OrderTrackingScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Live Order Tracking</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Estimated Delivery Time Banner */}
        <FadeSlideIn from="top" delay={50}>
          <GlassCard borderColor={`${AppTheme.teal}40`}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.timeBadge, { backgroundColor: `${AppTheme.teal}20` }]}>
                <Ionicons name="bicycle-outline" size={24} color={AppTheme.teal} />
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={Typography.caption}>ESTIMATED ARRIVAL</Text>
                <Text style={[Typography.h1, { color: AppTheme.teal, fontSize: 24, marginTop: 2 }]}>
                  18 Mins (10:55 AM)
                </Text>
                <Text style={[Typography.caption, { marginTop: 2 }]}>Order #MED-8941203</Text>
              </View>
            </View>
          </GlassCard>
        </FadeSlideIn>

        {/* Live Delivery Agent Card */}
        <FadeSlideIn from="bottom" delay={100} style={{ marginTop: 16 }}>
          <GlassCard padding={14}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.agentAvatar}>
                <Ionicons name="person" size={20} color={AppTheme.teal} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[Typography.body, { fontWeight: '700' }]}>Ramesh Kumar</Text>
                <Text style={[Typography.caption, { marginTop: 2 }]}>Delivery Partner • Express Health</Text>
              </View>
              <TouchableOpacity
                style={[styles.callBtn, { backgroundColor: `${AppTheme.teal}20` }]}
                onPress={() => Linking.openURL('tel:+919876543210')}
              >
                <Ionicons name="call" size={18} color={AppTheme.teal} />
              </TouchableOpacity>
            </View>
          </GlassCard>
        </FadeSlideIn>

        {/* Status Timeline */}
        <FadeSlideIn from="bottom" delay={150} style={{ marginTop: 20 }}>
          <Text style={[Typography.h3, { fontSize: 17, marginBottom: 14 }]}>Delivery Status Timeline</Text>
          <GlassCard padding={16}>
            {TIMELINE.map((item, idx) => (
              <View key={idx} style={styles.timelineRow}>
                <View style={styles.leftCol}>
                  <View style={[
                    styles.dot,
                    { backgroundColor: item.done ? AppTheme.teal : AppTheme.surface2 },
                    item.current && { borderColor: AppTheme.teal, borderWidth: 3, backgroundColor: AppTheme.bgDeep }
                  ]} />
                  {idx < TIMELINE.length - 1 && (
                    <View style={[styles.line, { backgroundColor: item.done ? AppTheme.teal : AppTheme.surface2 }]} />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 12, paddingBottom: idx === TIMELINE.length - 1 ? 0 : 20 }}>
                  <Text style={[Typography.body, { fontWeight: item.done ? '700' : '400', fontSize: 14 }]}>
                    {item.title}
                  </Text>
                  <Text style={[Typography.caption, { marginTop: 2 }]}>{item.time}</Text>
                </View>
              </View>
            ))}
          </GlassCard>
        </FadeSlideIn>

        {/* Itemized Order Summary */}
        <FadeSlideIn from="bottom" delay={200} style={{ marginTop: 20 }}>
          <Text style={[Typography.h3, { fontSize: 17, marginBottom: 14 }]}>Order Summary (2 Items)</Text>
          <GlassCard padding={14}>
            <View style={styles.itemRow}>
              <Text style={[Typography.body, { flex: 1, fontSize: 13 }]}>Lisinopril 10mg (30 Tablets)</Text>
              <Text style={[Typography.body, { fontWeight: '700', fontSize: 13 }]}>₹320</Text>
            </View>
            <View style={[styles.itemRow, { marginTop: 8 }]}>
              <Text style={[Typography.body, { flex: 1, fontSize: 13 }]}>Metformin 500mg (60 Tablets)</Text>
              <Text style={[Typography.body, { fontWeight: '700', fontSize: 13 }]}>₹180</Text>
            </View>
            <View style={{ height: 1, backgroundColor: AppTheme.border, marginVertical: 12 }} />
            <View style={styles.itemRow}>
              <Text style={[Typography.body, { flex: 1, fontWeight: '700' }]}>Total Amount Paid</Text>
              <Text style={[Typography.h3, { color: AppTheme.teal }]}>₹500</Text>
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  timeBadge: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  agentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: `${AppTheme.teal}20`, justifyContent: 'center', alignItems: 'center' },
  callBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  timelineRow: { flexDirection: 'row' },
  leftCol: { alignItems: 'center', width: 24 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  line: { width: 2, flex: 1, marginVertical: 2 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
