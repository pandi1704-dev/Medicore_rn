// @ts-nocheck
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme, Typography } from '../../theme/AppTheme';
import { GlassCard, GradientButton } from './CommonWidgets';
import { Appointment } from '../../context/AppointmentContext';

interface CancelBookingModalProps {
  visible: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmCancel: (id: string, reason: string) => void;
}

const CANCELLATION_REASONS = [
  'Schedule Conflict / Personal Emergency',
  'Feeling Better / Consultation No Longer Needed',
  'Found Another Doctor / Hospital',
  'Doctor Consultation Fee Concerns',
  'Other Reason',
];

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  visible,
  appointment,
  onClose,
  onConfirmCancel,
}) => {
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!appointment) return null;

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Other Reason' && customReason.trim()
      ? customReason.trim()
      : selectedReason;
    onConfirmCancel(appointment.id, finalReason);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <LinearGradient colors={['#0F1B35', '#0A1628']} style={styles.cardGradient}>
                {/* Drag handle & Header */}
                <View style={styles.dragHandle} />
                <View style={styles.header}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.iconBadge}>
                      <Ionicons name="alert-circle-outline" size={20} color={AppTheme.error} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={Typography.h2}>Cancel Appointment</Text>
                      <Text style={[Typography.caption, { marginTop: 2 }]}>
                        {appointment.doctorName}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color={AppTheme.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* Appointment Detail Summary */}
                <GlassCard padding={12} borderColor={`${AppTheme.error}33`} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={[Typography.body, { fontWeight: '700' }]}>{appointment.doctorName}</Text>
                      <Text style={[Typography.caption, { marginTop: 2 }]}>
                        {appointment.specialty} • {appointment.hospital}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[Typography.caption, { color: AppTheme.teal, fontWeight: '700' }]}>
                        {appointment.date}
                      </Text>
                      <Text style={[Typography.caption, { marginTop: 2 }]}>{appointment.time}</Text>
                    </View>
                  </View>
                </GlassCard>

                {/* Cancellation Reasons */}
                <Text style={[Typography.h3, { fontSize: 15, marginBottom: 10 }]}>
                  Please select a reason for cancellation:
                </Text>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.reasonList}>
                  {CANCELLATION_REASONS.map((r, index) => {
                    const isSelected = selectedReason === r;
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => setSelectedReason(r)}
                        style={{ marginBottom: 8 }}
                      >
                        <GlassCard
                          padding={12}
                          borderColor={isSelected ? AppTheme.error : AppTheme.border}
                          style={{ backgroundColor: isSelected ? `${AppTheme.error}15` : undefined }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                              style={[
                                styles.radio,
                                isSelected && { borderColor: AppTheme.error, backgroundColor: AppTheme.error },
                              ]}
                            >
                              {isSelected && <Ionicons name="checkmark" size={12} color="#FFF" />}
                            </View>
                            <Text
                              style={[
                                Typography.body,
                                {
                                  flex: 1,
                                  marginLeft: 10,
                                  fontSize: 13,
                                  color: isSelected ? AppTheme.error : AppTheme.textPrimary,
                                  fontWeight: isSelected ? '600' : '400',
                                },
                              ]}
                            >
                              {r}
                            </Text>
                          </View>
                        </GlassCard>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Custom Reason Box */}
                  {selectedReason === 'Other Reason' && (
                    <TextInput
                      style={styles.customInput}
                      placeholder="Please specify your reason..."
                      placeholderTextColor={AppTheme.textMuted}
                      value={customReason}
                      onChangeText={setCustomReason}
                      multiline
                      numberOfLines={2}
                    />
                  )}
                </ScrollView>

                {/* Actions */}
                <View style={styles.actionRow}>
                  <TouchableOpacity activeOpacity={0.8} onPress={onClose} style={styles.keepBtn}>
                    <Text style={[Typography.body, { fontWeight: '700', color: AppTheme.textPrimary }]}>
                      Keep Booking
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.8} onPress={handleConfirm} style={styles.cancelConfirmBtn}>
                    <Text style={[Typography.body, { fontWeight: '700', color: '#FFF' }]}>
                      Confirm Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 11, 24, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '80%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: `${AppTheme.error}40`,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppTheme.surface2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${AppTheme.error}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppTheme.surface2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasonList: {
    maxHeight: 220,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: AppTheme.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customInput: {
    backgroundColor: AppTheme.surface,
    borderColor: AppTheme.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    color: AppTheme.textPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 6,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: AppTheme.border,
  },
  keepBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: AppTheme.surface2,
    alignItems: 'center',
  },
  cancelConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: AppTheme.error,
    alignItems: 'center',
  },
});
