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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme, Typography } from '../../theme/AppTheme';
import { GlassCard, GradientButton } from './CommonWidgets';

interface HelpSupportModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateAIChat?: () => void;
}

const FAQS = [
  {
    q: 'How do I book an appointment with a specialist?',
    a: 'Go to the Doctors tab on the main screen, choose your specialty, select your preferred doctor and available time slot, then tap "Confirm Booking".',
  },
  {
    q: 'Is my personal health data secured?',
    a: 'Yes, Medicore uses HIPAA-compliant 256-bit AES encryption for all health records and lab reports stored in your account.',
  },
  {
    q: 'How do I track my daily medicine reminders?',
    a: 'Navigate to the Pharmacy / Medicine section to view your current prescriptions and set customizable reminder alarms.',
  },
  {
    q: 'Can I connect my Apple Watch or wearable device?',
    a: 'Yes! Head to your Profile screen under "Connected Devices" and toggle on device synchronization to auto-sync vitals.',
  },
];

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  visible,
  onClose,
  onNavigateAIChat,
}) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const toggleFaq = (index: number) => {
    setExpandedFaq((prev) => (prev === index ? null : index));
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSent(false);
    }, 3000);
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
                      <Ionicons name="help-circle-outline" size={20} color={AppTheme.rose} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={Typography.h2}>Help & Support</Text>
                      <Text style={[Typography.caption, { marginTop: 2 }]}>
                        FAQs, 24/7 AI chat & customer care
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color={AppTheme.textMuted} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                  {/* AI Assistant Banner */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      onClose();
                      if (onNavigateAIChat) onNavigateAIChat();
                    }}
                    style={{ marginBottom: 14 }}
                  >
                    <LinearGradient
                      colors={['#1E1040', '#0F2840']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={styles.aiBanner}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.aiAvatar}>
                          <Ionicons name="hardware-chip-outline" size={22} color={AppTheme.teal} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={[Typography.h3, { fontSize: 15, color: AppTheme.teal }]}>
                            24/7 AI Medical Assistant
                          </Text>
                          <Text style={[Typography.caption, { marginTop: 2 }]}>
                            Ask health questions, check symptoms & get advice
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={AppTheme.teal} />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Contact Support Channels */}
                  <Text style={[Typography.h3, { fontSize: 15, marginBottom: 10 }]}>Contact Us</Text>
                  <View style={styles.contactRow}>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      style={{ flex: 1, marginRight: 6 }}
                      onPress={() => Linking.openURL('tel:+918600977552')}
                    >
                      <GlassCard padding={12} borderColor={`${AppTheme.teal}33`}>
                        <View style={{ alignItems: 'center' }}>
                          <Ionicons name="call" size={20} color={AppTheme.teal} />
                          <Text style={[Typography.caption, { marginTop: 6, fontWeight: '700', color: AppTheme.teal }]}>
                            Call Support
                          </Text>
                          <Text style={[Typography.caption, { fontSize: 10 }]}>+91 8600977552</Text>
                        </View>
                      </GlassCard>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.75}
                      style={{ flex: 1, marginLeft: 6 }}
                      onPress={() => Linking.openURL('mailto:support@medicore.health')}
                    >
                      <GlassCard padding={12} borderColor={`${AppTheme.violet}33`}>
                        <View style={{ alignItems: 'center' }}>
                          <Ionicons name="mail" size={20} color={AppTheme.violet} />
                          <Text style={[Typography.caption, { marginTop: 6, fontWeight: '700', color: AppTheme.violet }]}>
                            Email Support
                          </Text>
                          <Text style={[Typography.caption, { fontSize: 10 }]}>support@medicore.health</Text>
                        </View>
                      </GlassCard>
                    </TouchableOpacity>
                  </View>

                  {/* FAQs Section */}
                  <Text style={[Typography.h3, { fontSize: 15, marginTop: 16, marginBottom: 10 }]}>
                    Frequently Asked Questions
                  </Text>
                  {FAQS.map((faq, index) => {
                    const isExpanded = expandedFaq === index;
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => toggleFaq(index)}
                        style={{ marginBottom: 8 }}
                      >
                        <GlassCard padding={12} borderColor={isExpanded ? AppTheme.teal : AppTheme.border}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons
                              name="help-circle"
                              size={16}
                              color={isExpanded ? AppTheme.teal : AppTheme.textMuted}
                            />
                            <Text
                              style={[
                                Typography.body,
                                { flex: 1, marginLeft: 10, fontSize: 13, fontWeight: isExpanded ? '600' : '400' },
                              ]}
                            >
                              {faq.q}
                            </Text>
                            <Ionicons
                              name={isExpanded ? 'chevron-up' : 'chevron-down'}
                              size={16}
                              color={AppTheme.textMuted}
                            />
                          </View>
                          {isExpanded && (
                            <View style={styles.faqAnswerContainer}>
                              <Text style={[Typography.bodyMuted, { fontSize: 12, lineHeight: 18 }]}>
                                {faq.a}
                              </Text>
                            </View>
                          )}
                        </GlassCard>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Send Feedback Form */}
                  <Text style={[Typography.h3, { fontSize: 15, marginTop: 16, marginBottom: 10 }]}>
                    Send App Feedback
                  </Text>
                  <GlassCard padding={12} style={{ marginBottom: 16 }}>
                    {feedbackSent ? (
                      <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                        <Ionicons name="checkmark-circle" size={28} color={AppTheme.teal} />
                        <Text style={[Typography.body, { color: AppTheme.teal, fontWeight: '600', marginTop: 4 }]}>
                          Thank you for your feedback!
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <TextInput
                          style={styles.feedbackInput}
                          placeholder="Describe an issue or suggestion..."
                          placeholderTextColor={AppTheme.textMuted}
                          multiline
                          numberOfLines={3}
                          value={feedbackText}
                          onChangeText={setFeedbackText}
                        />
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={handleSendFeedback}
                          style={styles.sendBtn}
                        >
                          <Text style={[Typography.caption, { color: AppTheme.bgDeep, fontWeight: '700' }]}>
                            Submit Feedback
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </GlassCard>

                  {/* Footer Meta */}
                  <View style={{ alignItems: 'center', marginVertical: 10 }}>
                    <Text style={[Typography.caption, { fontSize: 10 }]}>
                      Medicore v1.0.0 (Build 2026) • All Rights Reserved
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.footer}>
                  <GradientButton text="Close" onPress={onClose} icon="close-circle-outline" />
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
    maxHeight: '84%',
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
    backgroundColor: `${AppTheme.rose}20`,
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
    maxHeight: 400,
  },
  aiBanner: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.borderTeal,
  },
  aiAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: `${AppTheme.teal}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
  },
  faqAnswerContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: AppTheme.border,
  },
  feedbackInput: {
    color: AppTheme.textPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  sendBtn: {
    alignSelf: 'flex-end',
    backgroundColor: AppTheme.teal,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
  },
  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: AppTheme.border,
  },
});
