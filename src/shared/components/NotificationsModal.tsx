// @ts-nocheck
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme, Typography } from '../../theme/AppTheme';
import { GlassCard, GradientButton } from './CommonWidgets';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose }) => {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    medicineReminders: true,
    appointmentAlerts: true,
    emergencyAlerts: true,
    healthTips: false,
    soundVibration: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
                {/* Drag indicator & Header */}
                <View style={styles.dragHandle} />
                <View style={styles.header}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.iconBadge}>
                      <Ionicons name="notifications-outline" size={20} color={AppTheme.teal} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={Typography.h2}>Notifications</Text>
                      <Text style={[Typography.caption, { marginTop: 2 }]}>
                        Manage alerts, reminders & updates
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color={AppTheme.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* Notification Toggle List */}
                <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                  <GlassCard padding={14} style={styles.cardItem}>
                    <View style={styles.row}>
                      <View style={[styles.itemIcon, { backgroundColor: `${AppTheme.teal}20` }]}>
                        <Ionicons name="notifications" size={18} color={AppTheme.teal} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[Typography.body, { fontWeight: '600' }]}>Push Notifications</Text>
                        <Text style={Typography.caption}>Allow overall app notifications</Text>
                      </View>
                      <Switch
                        value={settings.pushEnabled}
                        onValueChange={() => toggleSetting('pushEnabled')}
                        trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                        thumbColor={settings.pushEnabled ? AppTheme.teal : AppTheme.textMuted}
                      />
                    </View>
                  </GlassCard>

                  <GlassCard padding={14} style={styles.cardItem}>
                    <View style={styles.row}>
                      <View style={[styles.itemIcon, { backgroundColor: `${AppTheme.rose}20` }]}>
                        <Ionicons name="alarm-outline" size={18} color={AppTheme.rose} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[Typography.body, { fontWeight: '600' }]}>Medicine Reminders</Text>
                        <Text style={Typography.caption}>Alerts for scheduled prescriptions</Text>
                      </View>
                      <Switch
                        value={settings.medicineReminders}
                        onValueChange={() => toggleSetting('medicineReminders')}
                        trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                        thumbColor={settings.medicineReminders ? AppTheme.teal : AppTheme.textMuted}
                      />
                    </View>
                  </GlassCard>

                  <GlassCard padding={14} style={styles.cardItem}>
                    <View style={styles.row}>
                      <View style={[styles.itemIcon, { backgroundColor: `${AppTheme.violet}20` }]}>
                        <Ionicons name="calendar-outline" size={18} color={AppTheme.violet} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[Typography.body, { fontWeight: '600' }]}>Doctor Appointments</Text>
                        <Text style={Typography.caption}>Upcoming consultation reminders</Text>
                      </View>
                      <Switch
                        value={settings.appointmentAlerts}
                        onValueChange={() => toggleSetting('appointmentAlerts')}
                        trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                        thumbColor={settings.appointmentAlerts ? AppTheme.teal : AppTheme.textMuted}
                      />
                    </View>
                  </GlassCard>

                  <GlassCard padding={14} style={styles.cardItem}>
                    <View style={styles.row}>
                      <View style={[styles.itemIcon, { backgroundColor: `${AppTheme.error}20` }]}>
                        <Ionicons name="warning-outline" size={18} color={AppTheme.error} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[Typography.body, { fontWeight: '600' }]}>Emergency Alerts</Text>
                        <Text style={Typography.caption}>Critical health & SOS notifications</Text>
                      </View>
                      <Switch
                        value={settings.emergencyAlerts}
                        onValueChange={() => toggleSetting('emergencyAlerts')}
                        trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                        thumbColor={settings.emergencyAlerts ? AppTheme.teal : AppTheme.textMuted}
                      />
                    </View>
                  </GlassCard>

                  <GlassCard padding={14} style={styles.cardItem}>
                    <View style={styles.row}>
                      <View style={[styles.itemIcon, { backgroundColor: `${AppTheme.warning}20` }]}>
                        <Ionicons name="sparkles-outline" size={18} color={AppTheme.warning} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[Typography.body, { fontWeight: '600' }]}>Health Tips & Insights</Text>
                        <Text style={Typography.caption}>Personalized wellness recommendations</Text>
                      </View>
                      <Switch
                        value={settings.healthTips}
                        onValueChange={() => toggleSetting('healthTips')}
                        trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                        thumbColor={settings.healthTips ? AppTheme.teal : AppTheme.textMuted}
                      />
                    </View>
                  </GlassCard>

                  <GlassCard padding={14} style={styles.cardItem}>
                    <View style={styles.row}>
                      <View style={[styles.itemIcon, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                        <Ionicons name="volume-high-outline" size={18} color={AppTheme.textPrimary} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[Typography.body, { fontWeight: '600' }]}>Sound & Vibration</Text>
                        <Text style={Typography.caption}>Play sound for urgent health alerts</Text>
                      </View>
                      <Switch
                        value={settings.soundVibration}
                        onValueChange={() => toggleSetting('soundVibration')}
                        trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                        thumbColor={settings.soundVibration ? AppTheme.teal : AppTheme.textMuted}
                      />
                    </View>
                  </GlassCard>
                </ScrollView>

                <View style={styles.footer}>
                  <GradientButton text="Save Preferences" onPress={onClose} icon="checkmark-circle-outline" />
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
    borderColor: AppTheme.borderTeal,
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
    marginBottom: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${AppTheme.teal}20`,
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
  list: {
    maxHeight: 360,
  },
  cardItem: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: AppTheme.border,
  },
});
