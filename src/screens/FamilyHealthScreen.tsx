// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, GradientButton } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';

const MEMBERS = [
  { id: '1', name: 'Pandeeswaran', relation: 'Self', age: '25 yrs', blood: 'B+', avatar: 'P', color: AppTheme.teal },
  { id: '2', name: 'Lavanya Pandi', relation: 'Spouse', age: '24 yrs', blood: 'A+', avatar: 'L', color: AppTheme.rose },
  { id: '3', name: 'Aarav Pandi', relation: 'Son', age: '3 yrs', blood: 'B+', avatar: 'A', color: AppTheme.violet },
  { id: '4', name: 'Meenakshi', relation: 'Mother', age: '58 yrs', blood: 'O+', avatar: 'M', color: AppTheme.warning },
];

export default function FamilyHealthScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedMember, setSelectedMember] = useState(MEMBERS[0]);
  const [addModalVisible, setAddModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Family Health Profiles</Text>
        <TouchableOpacity onPress={() => setAddModalVisible(true)} style={styles.addBtn}>
          <Ionicons name="person-add" size={18} color={AppTheme.teal} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Family Member Switcher Horizontal Tabs */}
        <FadeSlideIn from="top" delay={50}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {MEMBERS.map((m) => {
              const active = m.id === selectedMember.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedMember(m)}
                  style={{ marginRight: 12 }}
                >
                  <GlassCard
                    padding={12}
                    borderColor={active ? m.color : AppTheme.border}
                    style={{ backgroundColor: active ? `${m.color}20` : undefined, minWidth: 120 }}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <View style={[styles.memberAvatar, { backgroundColor: `${m.color}30` }]}>
                        <Text style={[Typography.h3, { color: m.color }]}>{m.avatar}</Text>
                      </View>
                      <Text style={[Typography.body, { fontSize: 13, fontWeight: '700', marginTop: 8 }]}>
                        {m.name.split(' ')[0]}
                      </Text>
                      <Text style={[Typography.caption, { fontSize: 10, marginTop: 2 }]}>{m.relation}</Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeSlideIn>

        {/* Selected Member Active Health Card */}
        <FadeSlideIn from="bottom" delay={100}>
          <GlassCard borderColor={`${selectedMember.color}40`}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.largeAvatar, { backgroundColor: `${selectedMember.color}30` }]}>
                <Text style={[Typography.h1, { color: selectedMember.color, fontSize: 26 }]}>
                  {selectedMember.avatar}
                </Text>
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={Typography.h2}>{selectedMember.name}</Text>
                <Text style={[Typography.caption, { marginTop: 2 }]}>
                  {selectedMember.relation} • {selectedMember.age}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <View style={[styles.infoChip, { backgroundColor: `${selectedMember.color}20` }]}>
                    <Text style={[Typography.caption, { color: selectedMember.color, fontWeight: '700' }]}>
                      Blood: {selectedMember.blood}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </GlassCard>
        </FadeSlideIn>

        {/* Immunization & Vaccine Records */}
        <FadeSlideIn from="bottom" delay={150} style={{ marginTop: 20 }}>
          <Text style={[Typography.h3, { fontSize: 17, marginBottom: 12 }]}>
            💉 Immunization & Vaccines ({selectedMember.name.split(' ')[0]})
          </Text>
          <GlassCard padding={14}>
            {[
              { title: 'COVID-19 Booster (Moderna)', date: 'Jan 15, 2026', status: 'Completed', color: AppTheme.teal },
              { title: 'Annual Influenza Vaccine', date: 'Oct 02, 2025', status: 'Completed', color: AppTheme.teal },
              { title: 'Hepatitis B Booster', date: 'Due Sep 2026', status: 'Upcoming', color: AppTheme.warning },
            ].map((v, i) => (
              <View key={i} style={[styles.vaccineRow, i > 0 && styles.divider]}>
                <Ionicons name="checkmark-seal" size={20} color={v.color} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[Typography.body, { fontSize: 13, fontWeight: '600' }]}>{v.title}</Text>
                  <Text style={[Typography.caption, { marginTop: 2 }]}>{v.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${v.color}20` }]}>
                  <Text style={[Typography.caption, { color: v.color, fontWeight: '700' }]}>{v.status}</Text>
                </View>
              </View>
            ))}
          </GlassCard>
        </FadeSlideIn>

        {/* Medical History Timeline */}
        <FadeSlideIn from="bottom" delay={200} style={{ marginTop: 20 }}>
          <Text style={[Typography.h3, { fontSize: 17, marginBottom: 12 }]}>📋 Health Timeline & Consultations</Text>
          <GlassCard padding={14}>
            {[
              { title: 'Routine Dental Checkup', dr: 'Dr. Priya Sharma', date: 'Aug 02, 2026', type: 'Clinic Visit' },
              { title: 'Cardiology Teleconsultation', dr: 'Dr. Aravind Kumar', date: 'Jul 14, 2026', type: 'Video Call' },
            ].map((rec, i) => (
              <View key={i} style={[styles.historyRow, i > 0 && styles.divider]}>
                <View style={[styles.historyIcon, { backgroundColor: `${AppTheme.violet}20` }]}>
                  <Ionicons name="calendar-outline" size={18} color={AppTheme.violet} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[Typography.body, { fontSize: 13, fontWeight: '600' }]}>{rec.title}</Text>
                  <Text style={[Typography.caption, { marginTop: 2 }]}>{rec.dr} • {rec.date}</Text>
                </View>
              </View>
            ))}
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
  addBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: `${AppTheme.teal}20`,
    justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  memberAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  largeAvatar: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  infoChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  vaccineRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  divider: { borderTopWidth: 1, borderTopColor: AppTheme.border, marginTop: 10, paddingTop: 10 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  historyIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
