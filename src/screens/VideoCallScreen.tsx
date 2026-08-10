// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppTheme, Typography } from '../theme/AppTheme';
import { BlurView } from 'expo-blur';
import { ContinuousPulseRing } from '../shared/components/Animations';

export default function VideoCallScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      {/* Background (Doctor's Feed) - In a real app this would be WebRTC/Agora View */}
      <View style={styles.doctorFeed}>
        <View style={styles.placeholderFeed}>
          <Ionicons name="person" size={80} color={AppTheme.surface} />
          <Text style={[Typography.h3, { color: AppTheme.textMuted, marginTop: 16 }]}>Dr. Sarah Chen's Feed</Text>
        </View>
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerInfo}>
          <Text style={[Typography.h2, { color: '#FFF' }]}>Dr. Sarah Chen</Text>
          <View style={styles.timeWrap}>
            <View style={styles.recordingDot} />
            <Text style={[Typography.caption, { color: '#FFF' }]}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>

      {/* User's Mini Feed */}
      {!isVideoOff && (
        <View style={[styles.userFeedWrap, { top: insets.top + 80 }]}>
          <View style={styles.userFeed}>
             <Ionicons name="person" size={40} color={AppTheme.surface} />
          </View>
        </View>
      )}

      {/* Controls Bottom Sheet */}
      <View style={[styles.controlsWrap, { paddingBottom: insets.bottom + 20 }]}>
        <BlurView intensity={30} tint="dark" style={styles.controlsBlur}>
          <TouchableOpacity 
            style={[styles.controlBtn, isMuted && styles.controlBtnActive]} 
            onPress={() => setIsMuted(!isMuted)}
          >
            <Ionicons name={isMuted ? "mic-off" : "mic"} size={26} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlBtn, isVideoOff && styles.controlBtnActive]} 
            onPress={() => setIsVideoOff(!isVideoOff)}
          >
            <Ionicons name={isVideoOff ? "videocam-off" : "videocam"} size={26} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlBtn, styles.endCallBtn]} onPress={() => navigation.goBack()}>
            <ContinuousPulseRing color={AppTheme.error} size={64} />
            <Ionicons name="call" size={28} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  doctorFeed: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
  },
  placeholderFeed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  headerInfo: {
    alignItems: 'center',
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.error,
    marginRight: 6,
  },
  userFeedWrap: {
    position: 'absolute',
    right: 20,
    width: 100,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  userFeed: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlsBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 40,
    gap: 24,
    overflow: 'hidden',
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  endCallBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppTheme.error,
  },
});
