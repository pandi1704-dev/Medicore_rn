import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const Screen = {
  width: SCREEN_W,
  height: SCREEN_H,
  // Responsive horizontal padding — scales with screen width
  hPad: SCREEN_W < 375 ? 16 : 20,
  // Whether this is a small phone (iPhone SE etc.)
  isSmall: SCREEN_W < 375,
};

export const AppTheme = {
  // Core Colors
  bgDeep: '#050B18', // Deep Navy
  bgCard: '#0A1628',

  // Brand Accents
  teal: '#0FFCBE',
  tealDim: 'rgba(15, 252, 190, 0.15)',
  violet: '#7C3AED',
  violetDim: 'rgba(124, 58, 237, 0.15)',
  rose: '#F472B6',
  warning: '#FBBF24',
  error: '#EF4444',
  success: '#10B981',

  // Text
  textPrimary: '#F8FAFC', // Slate 50
  textMuted: '#94A3B8',   // Slate 400

  // Surface / Borders
  surface: 'rgba(255, 255, 255, 0.04)',
  surface2: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.06)',
  borderTeal: 'rgba(15, 252, 190, 0.2)',

  // Gradients
  primaryGradient: ['#0FFCBE', '#7C3AED'] as [string, string],
  tealViolet: ['#0FFCBE', '#7C3AED'] as [string, string],
};

// Typography Tokens — responsive font sizes
export const Typography = {
  h1: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: SCREEN_W < 375 ? 22 : 26,
    color: AppTheme.textPrimary,
  },
  h2: {
    fontFamily: 'Outfit_700Bold',
    fontSize: SCREEN_W < 375 ? 17 : 20,
    color: AppTheme.textPrimary,
  },
  h3: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: SCREEN_W < 375 ? 15 : 18,
    color: AppTheme.textPrimary,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: AppTheme.textPrimary,
  },
  bodyMuted: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: AppTheme.textMuted,
  },
  caption: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: AppTheme.textMuted,
  },
};
