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
import { GlassCard, SectionHeader, StatusBadge } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';
import { useAppointments, Appointment } from '../context/AppointmentContext';
import { CancelBookingModal } from '../shared/components/CancelBookingModal';

type FilterType = 'All' | 'Upcoming' | 'Completed' | 'Cancelled';

export default function BookingHistoryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { appointments, cancelAppointment } = useAppointments();

  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedAptToCancel, setSelectedAptToCancel] = useState<Appointment | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const filteredAppointments = appointments.filter((apt) => {
    if (activeFilter === 'All') return true;
    return apt.status === activeFilter;
  });

  const handleConfirmCancel = (id: string, reason: string) => {
    cancelAppointment(id, reason);
    setToastMessage('✅ Appointment successfully cancelled.');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={Typography.h2}>Booking History</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Doctors')} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={AppTheme.teal} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {(['All', 'Upcoming', 'Completed', 'Cancelled'] as FilterType[]).map((tab) => {
          const active = activeFilter === tab;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.8}
              onPress={() => setActiveFilter(tab)}
              style={[
                styles.tabItem,
                active && { backgroundColor: `${AppTheme.teal}20`, borderColor: AppTheme.teal },
              ]}
            >
              <Text
                style={[
                  Typography.caption,
                  {
                    fontSize: 12,
                    fontWeight: active ? '700' : '500',
                    color: active ? AppTheme.teal : AppTheme.textMuted,
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Toast Alert */}
      {toastMessage.length > 0 && (
        <View style={styles.toastBanner}>
          <Ionicons name="information-circle" size={18} color={AppTheme.teal} />
          <Text style={[Typography.caption, { color: AppTheme.teal, marginLeft: 8 }]}>
            {toastMessage}
          </Text>
        </View>
      )}

      {/* Appointment List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredAppointments.map((apt, idx) => {
          const isUpcoming = apt.status === 'Upcoming';
          const isCompleted = apt.status === 'Completed';
          const isCancelled = apt.status === 'Cancelled';

          const badgeColor = isUpcoming ? AppTheme.teal : isCompleted ? AppTheme.violet : AppTheme.error;

          return (
            <FadeSlideIn key={apt.id} from="bottom" delay={idx * 50} style={{ marginBottom: 14 }}>
              <GlassCard padding={16} borderColor={`${badgeColor}40`}>
                {/* Doctor Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.drAvatar, { backgroundColor: `${apt.color}25` }]}>
                    <Ionicons name="medical" size={20} color={apt.color} />
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[Typography.body, { fontWeight: '700', fontSize: 15 }]}>
                      {apt.doctorName}
                    </Text>
                    <Text style={[Typography.caption, { marginTop: 2 }]}>
                      {apt.specialty} • {apt.hospital}
                    </Text>
                  </View>

                  <StatusBadge label={apt.status} color={badgeColor} />
                </View>

                <View style={styles.divider} />

                {/* Date & Time Row */}
                <View style={styles.infoRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="calendar-outline" size={15} color={AppTheme.teal} />
                    <Text style={[Typography.caption, { marginLeft: 6, color: AppTheme.textPrimary, fontWeight: '600' }]}>
                      {apt.date}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="time-outline" size={15} color={AppTheme.violet} />
                    <Text style={[Typography.caption, { marginLeft: 6, color: AppTheme.textPrimary, fontWeight: '600' }]}>
                      {apt.time}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name={apt.type === 'Video Call' ? 'videocam-outline' : 'business-outline'}
                      size={15}
                      color={AppTheme.warning}
                    />
                    <Text style={[Typography.caption, { marginLeft: 4, color: AppTheme.warning, fontWeight: '600' }]}>
                      {apt.type}
                    </Text>
                  </View>
                </View>

                {/* Cancelled Reason Note */}
                {isCancelled && apt.cancelReason && (
                  <View style={styles.cancelNote}>
                    <Ionicons name="information-circle-outline" size={14} color={AppTheme.error} />
                    <Text style={[Typography.caption, { color: AppTheme.error, marginLeft: 6, flex: 1 }]}>
                      Reason: {apt.cancelReason}
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  {isUpcoming && (
                    <>
                      {apt.type === 'Video Call' && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => navigation.navigate('VideoCall')}
                          style={[styles.btnAction, { backgroundColor: AppTheme.teal }]}
                        >
                          <Ionicons name="videocam" size={16} color={AppTheme.bgDeep} />
                          <Text style={[Typography.caption, { color: AppTheme.bgDeep, fontWeight: '700', marginLeft: 6 }]}>
                            Join Call
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setSelectedAptToCancel(apt)}
                        style={[styles.btnAction, { backgroundColor: `${AppTheme.error}25`, borderWidth: 1, borderColor: `${AppTheme.error}66` }]}
                      >
                        <Ionicons name="close-circle-outline" size={16} color={AppTheme.error} />
                        <Text style={[Typography.caption, { color: AppTheme.error, fontWeight: '700', marginLeft: 6 }]}>
                          Cancel Booking
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {isCompleted && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('Doctors')}
                      style={[styles.btnAction, { backgroundColor: `${AppTheme.violet}25`, borderWidth: 1, borderColor: `${AppTheme.violet}66` }]}
                    >
                      <Ionicons name="refresh-outline" size={16} color={AppTheme.violet} />
                      <Text style={[Typography.caption, { color: AppTheme.violet, fontWeight: '700', marginLeft: 6 }]}>
                        Re-Book Doctor
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </GlassCard>
            </FadeSlideIn>
          );
        })}

        {filteredAppointments.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar" size={48} color={AppTheme.textMuted} />
            <Text style={[Typography.bodyMuted, { marginTop: 12 }]}>
              No {activeFilter.toLowerCase()} appointments found.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        visible={!!selectedAptToCancel}
        appointment={selectedAptToCancel}
        onClose={() => setSelectedAptToCancel(null)}
        onConfirmCancel={handleConfirmCancel}
      />
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: AppTheme.surface2,
    borderWidth: 1,
    borderColor: AppTheme.border,
    alignItems: 'center',
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${AppTheme.teal}15`,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${AppTheme.teal}40`,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  drAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1, backgroundColor: AppTheme.border, marginVertical: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cancelNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${AppTheme.error}15`,
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
});
