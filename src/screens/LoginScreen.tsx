// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AppTheme, Typography } from "../theme/AppTheme";
import { GlassCard, GradientButton } from "../shared/components/CommonWidgets";
import { SyncedHeartPulse, ContinuousPulseRing } from "../shared/components/Animations";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from "react-native-reanimated";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Strength calculation
  let strength = 0;
  if (password.length > 5) strength += 0.33;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) strength += 0.33;
  if (/[^A-Za-z0-9]/.test(password)) strength += 0.34;

  const strengthWidth = useSharedValue(0);

  React.useEffect(() => {
    strengthWidth.value = withTiming(strength * 100, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [strength]);

  const getStrengthColor = () => {
    if (strength < 0.4) return AppTheme.error;
    if (strength < 0.7) return AppTheme.warning;
    return AppTheme.teal;
  };

  const animatedStrengthStyle = useAnimatedStyle(() => ({
    width: `${strengthWidth.value}%`,
    backgroundColor: getStrengthColor(),
  }));

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.replace("Home");
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Background elements */}
      <View style={StyleSheet.absoluteFill} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <ContinuousPulseRing color={AppTheme.teal} size={52} />
            <ContinuousPulseRing color={AppTheme.violet} size={52} delay={10000} />
            <Ionicons name="heart" color="#FFFFFF" size={42} />
          </View>
          <Text style={Typography.h1}>MediCore</Text>
          <Text style={[Typography.bodyMuted, { marginTop: 8 }]}>
            Your health journey begins here.
          </Text>
        </View>

        <GlassCard padding={24} style={styles.card}>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.activeTab]}
              onPress={() => setIsLogin(true)}
            >
              <Text
                style={[
                  Typography.h3,
                  { color: isLogin ? AppTheme.teal : AppTheme.textMuted },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.activeTab]}
              onPress={() => setIsLogin(false)}
            >
              <Text
                style={[
                  Typography.h3,
                  { color: !isLogin ? AppTheme.teal : AppTheme.textMuted },
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={AppTheme.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Pandeeswaran"
                    placeholderTextColor={AppTheme.textMuted}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={AppTheme.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="alex@example.com"
                  placeholderTextColor={AppTheme.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={AppTheme.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={AppTheme.textMuted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={AppTheme.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Password Strength Indicator */}
              {!isLogin && password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthTrack}>
                    <Animated.View
                      style={[styles.strengthFill, animatedStrengthStyle]}
                    />
                  </View>
                  <Text
                    style={[
                      Typography.caption,
                      { color: getStrengthColor(), marginTop: 6 },
                    ]}
                  >
                    {strength < 0.4
                      ? "Weak"
                      : strength < 0.7
                        ? "Fair"
                        : "Strong"}
                  </Text>
                </View>
              )}
            </View>

            {isLogin && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={[Typography.bodyMuted, { color: AppTheme.teal }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.submitBtn}>
              <GradientButton
                text={isLogin ? "Sign In" : "Create Account"}
                onPress={handleSubmit}
                isLoading={isLoading}
              />
            </View>

            {/* Social Login */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={[Typography.caption, { paddingHorizontal: 12 }]}>
                Or continue with
              </Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons
                  name="logo-google"
                  size={20}
                  color={AppTheme.textPrimary}
                />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons
                  name="logo-apple"
                  size={20}
                  color={AppTheme.textPrimary}
                />
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.bgDeep,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  card: {
    borderColor: AppTheme.borderTeal,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: AppTheme.teal,
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...Typography.body,
    fontSize: 13,
    marginBottom: 8,
    color: AppTheme.textMuted,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppTheme.surface2,
    borderWidth: 1,
    borderColor: AppTheme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: AppTheme.textPrimary,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  eyeIcon: {
    padding: 4,
  },
  strengthContainer: {
    marginTop: 10,
  },
  strengthTrack: {
    height: 4,
    backgroundColor: AppTheme.surface2,
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 32,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AppTheme.border,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.border,
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 6,
  },
  socialText: {
    ...Typography.body,
    fontWeight: "600",
    marginLeft: 8,
  },
});
