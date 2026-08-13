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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme, Typography } from '../../theme/AppTheme';
import { GlassCard, GradientButton } from './CommonWidgets';
import { useLanguage, Language } from '../../context/LanguageContext';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose }) => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep local selection synced when modal opens
  React.useEffect(() => {
    if (visible) {
      setSelectedLang(currentLanguage);
      setSearchQuery('');
    }
  }, [visible, currentLanguage]);

  const filteredLanguages = languages.filter((lang) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.region.toLowerCase().includes(q)
    );
  });

  const handleSave = () => {
    setLanguage(selectedLang);
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
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalContent}
            >
              <LinearGradient
                colors={['#0F1B35', '#0A1628']}
                style={styles.cardGradient}
              >
                {/* Modal Header */}
                <View style={styles.header}>
                  <View style={styles.dragHandle} />
                  <View style={styles.titleRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={styles.globeIconContainer}>
                        <Ionicons name="globe-outline" size={20} color={AppTheme.teal} />
                      </View>
                      <View style={{ marginLeft: 12 }}>
                        <Text style={Typography.h2}>Language & Region</Text>
                        <Text style={[Typography.caption, { marginTop: 2 }]}>
                          Select your preferred display language
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                      <Ionicons name="close" size={20} color={AppTheme.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                  <Ionicons name="search-outline" size={18} color={AppTheme.textMuted} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search languages..."
                    placeholderTextColor={AppTheme.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Ionicons name="close-circle" size={16} color={AppTheme.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Language List */}
                <ScrollView
                  style={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  {filteredLanguages.map((lang) => {
                    const isSelected = selectedLang.code === lang.code;
                    return (
                      <TouchableOpacity
                        key={lang.code}
                        activeOpacity={0.7}
                        onPress={() => setSelectedLang(lang)}
                        style={styles.langItemWrapper}
                      >
                        <GlassCard
                          borderColor={isSelected ? AppTheme.teal : AppTheme.border}
                          padding={14}
                          style={{
                            backgroundColor: isSelected ? `${AppTheme.teal}10` : 'rgba(255, 255, 255, 0.03)',
                          }}
                        >
                          <View style={styles.langRow}>
                            <Text style={styles.flag}>{lang.flag}</Text>
                            <View style={{ flex: 1, marginLeft: 14 }}>
                              <Text
                                style={[
                                  Typography.body,
                                  {
                                    fontWeight: isSelected ? '700' : '500',
                                    color: isSelected ? AppTheme.teal : AppTheme.textPrimary,
                                  },
                                ]}
                              >
                                {lang.name}
                              </Text>
                              <Text style={[Typography.caption, { marginTop: 2 }]}>
                                {lang.nativeName} • {lang.region}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.radioCircle,
                                isSelected && { borderColor: AppTheme.teal, backgroundColor: AppTheme.teal },
                              ]}
                            >
                              {isSelected && <Ionicons name="checkmark" size={14} color={AppTheme.bgDeep} />}
                            </View>
                          </View>
                        </GlassCard>
                      </TouchableOpacity>
                    );
                  })}
                  {filteredLanguages.length === 0 && (
                    <View style={styles.emptyContainer}>
                      <Ionicons name="earth-outline" size={40} color={AppTheme.textMuted} />
                      <Text style={[Typography.bodyMuted, { marginTop: 10 }]}>
                        No languages found matching "{searchQuery}"
                      </Text>
                    </View>
                  )}
                </ScrollView>

                {/* Footer Save Action */}
                <View style={styles.footer}>
                  <GradientButton
                    text={`Save & Apply (${selectedLang.name})`}
                    onPress={handleSave}
                    icon="checkmark-circle-outline"
                  />
                </View>
              </LinearGradient>
            </KeyboardAvoidingView>
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
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  globeIconContainer: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: AppTheme.border,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: AppTheme.textPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  listContainer: {
    maxHeight: 340,
  },
  langItemWrapper: {
    marginBottom: 10,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: AppTheme.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: AppTheme.border,
  },
});
