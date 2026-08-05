// @ts-nocheck
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme, Typography } from '../../theme/AppTheme';

// ─── GlassCard ──────────────────────────────────────────────────────────────
interface GlassCardProps {
  children: React.ReactNode;
  borderColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  borderColor = AppTheme.border,
  onPress,
  style,
  padding = 16,
}) => {
  const inner = (
    <View style={[styles.glassCard, { borderColor, padding }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={styles.fullWidth}>
        {inner}
      </TouchableOpacity>
    );
  }
  return <View style={styles.fullWidth}>{inner}</View>;
};

// ─── GradientButton ─────────────────────────────────────────────────────────
interface GradientButtonProps {
  text: string;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  text, onPress, isLoading = false, disabled = false, icon,
}) => (
  <TouchableOpacity
    activeOpacity={0.82}
    onPress={disabled || isLoading ? undefined : onPress}
    style={[styles.fullWidth, { opacity: disabled ? 0.45 : 1 }]}
  >
    <LinearGradient
      colors={disabled ? [AppTheme.surface2, AppTheme.surface] : AppTheme.primaryGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientButton}
    >
      {isLoading ? (
        <ActivityIndicator color={AppTheme.bgDeep} size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon && <Ionicons name={icon} size={18} color={AppTheme.bgDeep} />}
          <Text style={[styles.gradientButtonText, { color: disabled ? AppTheme.textMuted : AppTheme.bgDeep }]}>
            {text}
          </Text>
        </View>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

// ─── SectionHeader ───────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={Typography.h3}>{title}</Text>
    {actionLabel && (
      <TouchableOpacity activeOpacity={0.7} onPress={onAction} style={styles.actionBtn}>
        <Text style={styles.actionText}>{actionLabel}</Text>
        <Ionicons name="chevron-forward" size={14} color={AppTheme.teal} />
      </TouchableOpacity>
    )}
  </View>
);

// ─── Badge ───────────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, color, size = 'md' }) => (
  <View style={[
    styles.badge,
    {
      backgroundColor: color + '20',
      borderColor: color + '50',
      paddingHorizontal: size === 'sm' ? 8 : 12,
      paddingVertical: size === 'sm' ? 2 : 5,
    }
  ]}>
    <Text style={[styles.badgeText, { color, fontSize: size === 'sm' ? 10 : 12 }]}>{label}</Text>
  </View>
);

// Keep StatusBadge as alias for backwards compatibility
export const StatusBadge = Badge;

// ─── VitalChip ───────────────────────────────────────────────────────────────
interface VitalChipProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const VitalChip: React.FC<VitalChipProps> = ({ label, value, icon, color }) => (
  <View style={[styles.vitalChip, { borderColor: color + '33' }]}>
    <View style={[styles.vitalIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={17} color={color} />
    </View>
    <View style={styles.vitalText}>
      <Text style={styles.vitalLabel}>{label}</Text>
      <Text style={styles.vitalValue}>{value}</Text>
    </View>
  </View>
);

// ─── ScreenHeader ─────────────────────────────────────────────────────────────
// Unified top header used across all screens — handles safe area automatically
interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, rightElement }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screenHeader, { paddingTop: (insets.top || 0) + 12 }]}>
      <View style={{ flex: 1 }}>
        <Text style={Typography.h1}>{title}</Text>
        {subtitle && <Text style={[Typography.bodyMuted, { marginTop: 2 }]}>{subtitle}</Text>}
      </View>
      {rightElement && <View style={styles.headerRight}>{rightElement}</View>}
    </View>
  );
};

// ─── Divider ─────────────────────────────────────────────────────────────────
export const Divider = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.divider, style]} />
);

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  fullWidth: { width: '100%' },

  glassCard: {
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },

  gradientButton: {
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppTheme.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  gradientButtonText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: AppTheme.teal,
  },

  badge: {
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '700',
  },

  vitalChip: {
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 148,
  },
  vitalIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vitalText: {
    justifyContent: 'center',
  },
  vitalLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: AppTheme.textMuted,
  },
  vitalValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: AppTheme.textPrimary,
    marginTop: 2,
  },

  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  divider: {
    height: 1,
    backgroundColor: AppTheme.border,
    width: '100%',
  },
});
