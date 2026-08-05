// @ts-nocheck
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppTheme, Typography } from '../theme/AppTheme';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProp>();

  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1
    );
    scale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(1.5)) });
    opacity.value = withTiming(1, { duration: 1000 });

    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Animated.View style={[styles.ringContainer, animatedRingStyle]}>
          <Svg height="140" width="140" viewBox="0 0 140 140">
            <Defs>
              <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={AppTheme.teal} stopOpacity="1" />
                <Stop offset="0.5" stopColor={AppTheme.violet} stopOpacity="1" />
                <Stop offset="1" stopColor={AppTheme.bgDeep} stopOpacity="0" />
              </SvgGradient>
            </Defs>
            <Circle
              cx="70" cy="70" r="60"
              stroke="url(#grad)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="280 97"
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
          <Ionicons name="heart" color="#FFFFFF" size={42} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.brandContainer, animatedLogoStyle]}>
        <Text style={styles.brandTitle}>MediCore</Text>
        <Text style={styles.brandSubtitle}>Your Health, Reimagined</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringContainer: {
    position: 'absolute',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logoText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 42,
    color: AppTheme.textPrimary,
  },
  brandContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  brandTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 32,
    color: AppTheme.textPrimary,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: AppTheme.teal,
    marginTop: 8,
    letterSpacing: 0.5,
  },
});
