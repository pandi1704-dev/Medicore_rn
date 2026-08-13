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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme, Typography } from '../../theme/AppTheme';
import { GlassCard, GradientButton } from './CommonWidgets';

interface PrivacySecurityModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PrivacySecurityModal: React.FC<PrivacySecurityModalProps> = ({ visible, onClose }) => {
  const [settings, setSettings] = useState({
    biometrics: true,
    twoFactor: true,
    dataSharing: false,
    analytics: true,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportData = () => {
    setIsExporting(true);
    setExportMessage('Generating encrypted health report...');
    setTimeout(() => {
      setIsExporting(false);
      setExportMessage('✅ Health Records Exported (Medicore_Health_Data.pdf)');
      setTimeout(() => setExportMessage(''), 3500);
    }, 1800);
  };

  const handleClearCache = () => {
    setExportMessage('Local cache & temporary data cleared successfully!');
    setTimeout(() => setExportMessage(''), 3000);
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
                {/* Drag Handle & Header */}
                <View style={styles.dragHandle} />
                <View style={styles.header}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.iconBadge}>
                      <Ionicons name="shield-checkmark-outline" size={20} color={AppTheme.violet} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={Typography.h2}>Privacy & Security</Text>
                      <Text style={[Typography.caption, { marginTop: 2 }]}>
                        Data encryption & access controls
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color={AppTheme.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* Toast / Message Banner */}
                {exportMessage.length > 0 && (
                  <View style={styles.toastBanner}>
                    <Ionicons name="information-circle" size={18} color={AppTheme.teal} />
                    <Text style={[Typography.caption, { color: AppTheme.teal, marginLeft: 8, flex: 1 }]}>
                      {exportMessage}
                    </Text>
                  </View>
                )}

                <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                  {/* Security Compliance Card */}
                  <GlassCard borderColor={`${AppTheme.teal}40`} padding={14} style={styles.cardItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="lock-closed" size={20} color={AppTheme.teal} />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={[Typography.body, { fontWeight: '700', color: AppTheme.teal }]}>
                          256-Bit End-to-End Encryption
                        </Text>
                        <Text style={[Typography.caption, { marginTop: 2 }]}>
                          HIPAA & GDPR Compliant Security Protocol
                        </Text>
                      </View>
                    </View>
                  </GlassCard>

                  {/* Biometric Switch */}
                  <GlassCard padding={14} style={styles.cardItem}>
                    <View style={styles.row}>
                      <View style={[styles.itemIcon, { backgroundColor: `${AppTheme.violet}20` }]}>
                        <Ionicons name="finger-print-outline" size={18} color={AppTheme.violet} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[Typography.body, { fontWeight: '600' }]}>Biometric Lock</Text>
                        <Text style={Typography.caption}>Require Face ID / Fingerprint to open</Text>
                      </View>
                      <Switch
                        value={settings.biometrics}
                        onValueChange={() => toggleSetting('biometrics')}
                        trackColor={{ false: AppTheme.surface2, true: AppTheme.violetDim }}
                        thumbColor={settings.biometrics ? AppTheme.violet : AppTheme.textMuted}
                      />
                    </View>
                  </GlassCard>

                  {/* 2FA Switch */}
                  <GlassCard padding={14} style={styles.cardItem}>
                    <View style={styles.row}>
                      <View style={[styles.itemIcon, { backgroundColor: `${AppTheme.teal}20` }]}>
                        <Ionicons name="key-outline" size={18} color={AppTheme.teal} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[Typography.body, { fontWeight: '600' }]}>Two-Factor Authentication</Text>
                        <Text style={Typography.caption}>SMS / Authenticator OTP on login</Text>
                      </View>
                      <Switch
                        value={settings.twoFactor}
                        onValueChange={() => toggleSetting('twoFactor')}
                        trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                        thumbColor={settings.twoFactor ? AppTheme.teal : AppTheme.textMuted}
                      />
                    </View>
                  </GlassCard>

                  {/* Provider Data Sharing */}
                  <GlassCard padding={14} style={styles.cardItem}>
                    <View style={styles.row}>
                      <View style={[styles.itemIcon, { backgroundColor: `${AppTheme.warning}20` }]}>
                        <Ionicons name="share-social-outline" size={18} color={AppTheme.warning} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[Typography.body, { fontWeight: '600' }]}>Doctor Data Sharing</Text>
                        <Text style={Typography.caption}>Share lab results with assigned doctors</Text>
                      </View>
                      <Switch
                        value={settings.dataSharing}
                        onValueChange={() => toggleSetting('dataSharing')}
                        trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                        thumbColor={settings.dataSharing ? AppTheme.teal : AppTheme.textMuted}
                      />
                    </View>
                  </GlassCard>

                  {/* Anonymous Analytics */}
                  <GlassCard padding={14} style={styles.cardItem}>
                    <View style={styles.row}>
                      <View style={[styles.itemIcon, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                        <Ionicons name="analytics-outline" size={18} color={AppTheme.textPrimary} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[Typography.body, { fontWeight: '600' }]}>Anonymous Diagnostics</Text>
                        <Text style={Typography.caption}>Help improve Medicore app performance</Text>
                      </View>
                      <Switch
                        value={settings.analytics}
                        onValueChange={() => toggleSetting('analytics')}
                        trackColor={{ false: AppTheme.surface2, true: AppTheme.tealDim }}
                        thumbColor={settings.analytics ? AppTheme.teal : AppTheme.textMuted}
                      />
                    </View>
                  </GlassCard>

                  {/* Actions Section */}
                  <View style={{ marginTop: 6 }}>
                    <TouchableOpacity activeOpacity={0.75} onPress={handleExportData} style={{ marginBottom: 10 }}>
                      <GlassCard padding={14} borderColor={`${AppTheme.teal}30`}>
                        <View style={styles.row}>
                          <Ionicons name="download-outline" size={18} color={AppTheme.teal} />
                          <Text style={[Typography.body, { flex: 1, marginLeft: 12, fontWeight: '600', color: AppTheme.teal }]}>
                            {isExporting ? 'Preparing Export...' : 'Export Medical Records (PDF)'}
                          </Text>
                          <Ionicons name="chevron-forward" size={16} color={AppTheme.teal} />
                        </View>
                      </GlassCard>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.75} onPress={handleClearCache}>
                      <GlassCard padding={14} borderColor={`${AppTheme.error}30`}>
                        <View style={styles.row}>
                          <Ionicons name="trash-bin-outline" size={18} color={AppTheme.error} />
                          <Text style={[Typography.body, { flex: 1, marginLeft: 12, fontWeight: '600', color: AppTheme.error }]}>
                            Clear Cache & Active Sessions
                          </Text>
                          <Ionicons name="chevron-forward" size={16} color={AppTheme.error} />
                        </View>
                      </GlassCard>
                    </TouchableOpacity>
                  </View>
                </ScrollView>

                <View style={styles.footer}>
                  <GradientButton text="Done" onPress={onClose} icon="checkmark-done-outline" />
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
    maxHeight: '82%',
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
    marginBottom: 14,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${AppTheme.violet}20`,
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
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${AppTheme.teal}15`,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${AppTheme.teal}40`,
    marginBottom: 12,
  },
  list: {
    maxHeight: 380,
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
