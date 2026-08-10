// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_MEDICINES = [
  { id: '1', name: 'Lisinopril 10mg', time: '08:00 AM', status: 'Taken', type: 'Pill', color: AppTheme.teal },
  { id: '2', name: 'Vitamin D3 1000 IU', time: '08:00 AM', status: 'Taken', type: 'Capsule', color: AppTheme.warning },
  { id: '3', name: 'Metformin 500mg', time: '01:00 PM', status: 'Pending', type: 'Pill', color: AppTheme.violet },
  { id: '4', name: 'Atorvastatin 20mg', time: '09:00 PM', status: 'Pending', type: 'Pill', color: AppTheme.rose },
];

export default function MedicineReminderScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [medicines, setMedicines] = useState(MOCK_MEDICINES);

  const toggleStatus = (id: string) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === 'Taken' ? 'Pending' : 'Taken' };
      }
      return m;
    }));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerRow, { paddingTop: (insets.top || 0) + 12 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={Typography.h1}>Medications</Text>
          <Text style={[Typography.bodyMuted, { marginTop: 2 }]}>Your daily schedule</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FadeSlideIn from="bottom" delay={100} style={styles.progressSection}>
          <GlassCard borderColor={`${AppTheme.teal}40`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={Typography.h2}>Today's Progress</Text>
                <Text style={[Typography.bodyMuted, { marginTop: 4 }]}>2 of 4 taken</Text>
              </View>
              <View style={styles.progressRingWrap}>
                {/* A simplified progress indicator instead of importing the big circular progress again */}
                <View style={styles.progressCircle}>
                  <Text style={[Typography.h3, { color: AppTheme.teal }]}>50%</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </FadeSlideIn>

        <Text style={[Typography.h3, styles.sectionTitle]}>Schedule</Text>

        {medicines.map((med, index) => (
          <FadeSlideIn key={med.id} from="bottom" delay={150 + index * 50}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => toggleStatus(med.id)} style={styles.medCardWrap}>
              <GlassCard padding={16} borderColor={med.status === 'Taken' ? `${AppTheme.teal}40` : AppTheme.border}>
                <View style={styles.medRow}>
                  <View style={[styles.medIconWrap, { backgroundColor: `${med.color}20` }]}>
                    <Ionicons name="medical" color={med.color} size={20} />
                  </View>
                  <View style={styles.medInfo}>
                    <Text style={[Typography.h3, { fontSize: 16, textDecorationLine: med.status === 'Taken' ? 'line-through' : 'none', color: med.status === 'Taken' ? AppTheme.textMuted : AppTheme.textPrimary }]}>
                      {med.name}
                    </Text>
                    <View style={styles.medDetailsRow}>
                      <Ionicons name="time-outline" color={AppTheme.textMuted} size={14} />
                      <Text style={[Typography.caption, { marginLeft: 4, marginRight: 12 }]}>{med.time}</Text>
                      <Ionicons name="bandage-outline" color={AppTheme.textMuted} size={14} />
                      <Text style={[Typography.caption, { marginLeft: 4 }]}>{med.type}</Text>
                    </View>
                  </View>
                  <View style={[styles.checkbox, med.status === 'Taken' && styles.checkboxActive]}>
                    {med.status === 'Taken' && <Ionicons name="checkmark" color={AppTheme.bgDeep} size={16} />}
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          </FadeSlideIn>
        ))}
      </ScrollView>

      <FadeSlideIn from="bottom" delay={400} style={[styles.fabContainer, { bottom: (insets.bottom || 0) + 20 }]}>
        <TouchableOpacity style={styles.fab}>
          <LinearGradient colors={AppTheme.primaryGradient} style={styles.fabInner}>
            <Ionicons name="add" color={AppTheme.bgDeep} size={28} />
          </LinearGradient>
        </TouchableOpacity>
      </FadeSlideIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.bgDeep,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  progressSection: {
    marginTop: 10,
    marginBottom: 24,
  },
  progressRingWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: AppTheme.surface,
    borderTopColor: AppTheme.teal,
    borderRightColor: AppTheme.teal,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    transform: [{ rotate: '-45deg' }], // Counter rotate text
  },
  sectionTitle: {
    marginBottom: 16,
    color: AppTheme.textPrimary,
  },
  medCardWrap: {
    marginBottom: 12,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  medInfo: {
    flex: 1,
  },
  medDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: AppTheme.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkboxActive: {
    backgroundColor: AppTheme.teal,
    borderColor: AppTheme.teal,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: AppTheme.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  fabInner: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
