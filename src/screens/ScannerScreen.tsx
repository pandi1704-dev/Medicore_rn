// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppTheme, Typography } from '../theme/AppTheme';
import { ContinuousPulseRing } from '../shared/components/Animations';

const { width } = Dimensions.get('window');

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Home');
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={[Typography.body, { color: '#FFF' }]}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFillObject} facing="back">
        
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={[Typography.h2, { color: '#FFF' }]}>Scan Document</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Scanner Frame */}
          <View style={styles.scannerFrameWrap}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <ContinuousPulseRing color={AppTheme.teal} size={width * 0.7} style={{ opacity: 0.2 }} />
            </View>
            <Text style={[Typography.bodyMuted, { color: '#FFF', marginTop: 30, textAlign: 'center' }]}>
              Position the medical document or prescription within the frame
            </Text>
          </View>

          {/* Bottom Controls */}
          <View style={[styles.controls, { paddingBottom: insets.bottom + 30 }]}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="images" size={24} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureBtnWrap}>
              <View style={styles.captureBtnOuter}>
                <View style={styles.captureBtnInner} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="flash" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrameWrap: {
    alignItems: 'center',
  },
  scannerFrame: {
    width: width * 0.8,
    height: width * 1.1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: AppTheme.teal,
  },
  cornerTL: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF',
  },
});
