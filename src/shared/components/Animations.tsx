// @ts-nocheck
import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

interface FadeSlideInProps {
  children: React.ReactNode;
  delay?: number;
  from?: 'bottom' | 'top' | 'left' | 'right' | 'none';
  style?: ViewStyle;
  duration?: number;
}

/**
 * A simple reusable entrance animation component using react-native-reanimated.
 * Replaces MotiView to avoid the duplicate React/framer-motion conflict.
 */
export const FadeSlideIn: React.FC<FadeSlideInProps> = ({
  children,
  delay = 0,
  from = 'bottom',
  style,
  duration = 500,
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(from === 'left' ? -20 : from === 'right' ? 20 : 0);
  const translateY = useSharedValue(from === 'top' ? -20 : from === 'bottom' ? 20 : 0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.ease) }));
    translateX.value = withDelay(delay, withTiming(0, { duration, easing: Easing.out(Easing.ease) }));
    translateY.value = withDelay(delay, withTiming(0, { duration, easing: Easing.out(Easing.ease) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return <Animated.View style={[animStyle, style]}>{children}</Animated.View>;
};

/**
 * A pulsing ring animation for use with the SOS button.
 */
interface PulseRingProps {
  color: string;
  size: number;
  delay?: number;
  style?: ViewStyle;
}

export const PulseRing: React.FC<PulseRingProps> = ({ color, size, delay = 0, style }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withTiming(1.6, {
        duration: 1500,
        easing: Easing.out(Easing.ease),
      })
    );
    opacity.value = withDelay(
      delay,
      withTiming(0, {
        duration: 1500,
        easing: Easing.out(Easing.ease),
      })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animStyle,
        style,
      ]}
    />
  );
};

export const ContinuousPulseRing: React.FC<PulseRingProps> = ({ color, size, delay = 0, style }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1.6, { duration: 1500, easing: Easing.out(Easing.ease) }),
        -1, // infinite
        false // don't reverse, just loop
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animStyle,
        style,
      ]}
    />
  );
};

export const HeartbeatScale: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    // A heartbeat is usually two quick beats then a pause
    // We'll simulate a simple heartbeat scale
    scale.value = withRepeat(
      withTiming(1.15, { duration: 250, easing: Easing.inOut(Easing.ease) }),
      -1,
      true // reverse
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[animStyle, style]}>{children}</Animated.View>;
};

// Heart icon + expanding ring driven by one shared animation value
export const SyncedHeartPulse: React.FC<{
  icon: React.ReactNode;
  color: string;
  size: number;
}> = ({ icon, color, size }) => {
  const beat = useSharedValue(0);

  useEffect(() => {
    beat.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const heartStyle = useAnimatedStyle(() => {
    const s = beat.value < 0.5
      ? 1 + beat.value * 0.3          // scale up on first half
      : 1.15 - (beat.value - 0.5) * 0.3; // scale down on second half
    return { transform: [{ scale: s }] };
  });

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + beat.value * 0.9 }],
    opacity: 1 - beat.value,
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          ringStyle,
        ]}
      />
      <Animated.View style={heartStyle}>{icon}</Animated.View>
    </View>
  );
};
