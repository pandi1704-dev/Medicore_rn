// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, GradientButton } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';
import { LinearGradient } from 'expo-linear-gradient';

// Only import react-native-maps on native (not web)
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

let Location: any = null;
if (Platform.OS !== 'web') {
  Location = require('expo-location');
}

const { width } = Dimensions.get('window');

const MOCK_HOSPITALS = [
  { id: '1', name: 'City General Hospital', type: 'Hospital', distance: '1.2 km', rating: 4.8, lat: 13.0827, lng: 80.2707 },
  { id: '2', name: 'MediCare Clinic', type: 'Clinic', distance: '2.5 km', rating: 4.5, lat: 13.0900, lng: 80.2800 },
  { id: '3', name: 'Apollo Pharmacy', type: 'Pharmacy', distance: '0.8 km', rating: 4.2, lat: 13.0750, lng: 80.2600 },
];

// ─── Web Fallback: list view instead of map ───────────────────────────────────
function MapWebFallback({ selectedHospital, setSelectedHospital, insets, navigation }) {
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Home');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.webHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h2, { textAlign: 'center' }]}>Nearby Hospitals</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Map placeholder banner */}
      <LinearGradient
        colors={[`${AppTheme.teal}22`, `${AppTheme.violet}22`]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.webBanner}
      >
        <Ionicons name="map" size={40} color={AppTheme.teal} />
        <Text style={[Typography.h3, { marginTop: 10, textAlign: 'center' }]}>
          Interactive map available on mobile
        </Text>
        <Text style={[Typography.caption, { marginTop: 6, textAlign: 'center' }]}>
          Open the iOS or Android app for a live Google Map
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 100 }}>
        {MOCK_HOSPITALS.map((h, idx) => (
          <FadeSlideIn key={h.id} from="bottom" delay={idx * 80}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setSelectedHospital(h)}>
              <GlassCard
                padding={16}
                borderColor={selectedHospital?.id === h.id ? `${AppTheme.teal}50` : AppTheme.border}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.typeIcon, { backgroundColor: h.type === 'Pharmacy' ? `${AppTheme.violet}20` : `${AppTheme.teal}20` }]}>
                    <Ionicons
                      name={h.type === 'Pharmacy' ? 'medical' : 'business'}
                      color={h.type === 'Pharmacy' ? AppTheme.violet : AppTheme.teal}
                      size={22}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={Typography.h3}>{h.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Text style={[Typography.caption, { color: AppTheme.teal }]}>{h.type}</Text>
                      <View style={styles.dot} />
                      <Ionicons name="location-outline" color={AppTheme.textMuted} size={12} />
                      <Text style={[Typography.caption, { marginLeft: 3 }]}>{h.distance}</Text>
                    </View>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" color="#FBBC05" size={13} />
                    <Text style={[Typography.h3, { fontSize: 13, marginLeft: 4 }]}>{h.rating}</Text>
                  </View>
                </View>

                {selectedHospital?.id === h.id && (
                  <View style={{ flexDirection: 'row', marginTop: 14, gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <GradientButton text="Get Directions" icon="navigate" onPress={() => {}} />
                    </View>
                    <TouchableOpacity style={styles.callBtn}>
                      <Ionicons name="call" color={AppTheme.rose} size={22} />
                    </TouchableOpacity>
                  </View>
                )}
              </GlassCard>
            </TouchableOpacity>
          </FadeSlideIn>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Main MapScreen ───────────────────────────────────────────────────────────
export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(MOCK_HOSPITALS[0]);

  useEffect(() => {
    if (Platform.OS === 'web') return; // skip location on web
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        setLocation({ coords: { latitude: 13.0827, longitude: 80.2707 } });
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (e) {
        setLocation({ coords: { latitude: 13.0827, longitude: 80.2707 } });
      }
    })();
  }, []);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Home');
  };

  // ── Web: use list fallback ──────────────────────────────────────────────────
  if (Platform.OS === 'web') {
    return (
      <MapWebFallback
        selectedHospital={selectedHospital}
        setSelectedHospital={setSelectedHospital}
        insets={insets}
        navigation={navigation}
      />
    );
  }

  // ── Native: full-screen map ────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Map */}
      {location ? (
        <MapView
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {MOCK_HOSPITALS.map((hospital) => (
            <Marker
              key={hospital.id}
              coordinate={{ latitude: hospital.lat, longitude: hospital.lng }}
              onPress={() => setSelectedHospital(hospital)}
            >
              <View style={[
                styles.markerWrap,
                selectedHospital.id === hospital.id && styles.markerSelected
              ]}>
                <Ionicons
                  name={hospital.type === 'Pharmacy' ? 'medical' : 'business'}
                  size={selectedHospital.id === hospital.id ? 20 : 16}
                  color={AppTheme.bgDeep}
                />
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={AppTheme.teal} />
          <Text style={[Typography.bodyMuted, { marginTop: 12 }]}>
            {errorMsg || 'Finding your location...'}
          </Text>
        </View>
      )}

      {/* Floating header */}
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 12 }]} pointerEvents="box-none">
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={AppTheme.textMuted} />
          <Text style={[Typography.bodyMuted, { marginLeft: 10, flex: 1 }]}>Search hospitals...</Text>
        </View>
      </View>

      {/* Bottom sheet */}
      {selectedHospital && (
        <FadeSlideIn from="bottom" style={[styles.bottomSheet, { paddingBottom: (insets.bottom || 0) + 20 }]}>
          <GlassCard padding={20} borderColor={`${AppTheme.teal}40`}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={Typography.h2}>{selectedHospital.name}</Text>
                <Text style={[Typography.body, { color: AppTheme.teal, marginTop: 4 }]}>{selectedHospital.type}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" color="#FBBC05" size={14} />
                <Text style={[Typography.h3, { fontSize: 13, marginLeft: 4 }]}>{selectedHospital.rating}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
              <Ionicons name="location" color={AppTheme.textMuted} size={16} />
              <Text style={[Typography.bodyMuted, { marginLeft: 6 }]}>{selectedHospital.distance} away</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 20, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <GradientButton text="Directions" icon="navigate" onPress={() => {}} />
              </View>
              <TouchableOpacity style={styles.callBtn}>
                <Ionicons name="call" color={AppTheme.rose} size={24} />
              </TouchableOpacity>
            </View>
          </GlassCard>
        </FadeSlideIn>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.bgDeep },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  webHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
    justifyContent: 'space-between',
  },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', gap: 12,
    zIndex: 30,
    elevation: 30,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: `${AppTheme.bgDeep}CC`,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: AppTheme.border,
    zIndex: 40,
    elevation: 40,
  },
  searchBar: {
    flex: 1, height: 44, borderRadius: 22,
    backgroundColor: `${AppTheme.bgDeep}CC`,
    borderWidth: 1, borderColor: AppTheme.border,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
  },
  markerWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: AppTheme.violet,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: AppTheme.textPrimary,
    elevation: 5,
  },
  markerSelected: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: AppTheme.teal,
  },
  bottomSheet: { position: 'absolute', bottom: 0, left: 20, right: 20 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: `${AppTheme.surface2}80`,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  callBtn: {
    width: 54, height: 54, borderRadius: 16,
    backgroundColor: `${AppTheme.rose}20`,
    borderWidth: 1, borderColor: `${AppTheme.rose}40`,
    justifyContent: 'center', alignItems: 'center',
  },
  // web styles
  webBanner: {
    marginHorizontal: 20, marginBottom: 20,
    borderRadius: 20, padding: 24,
    alignItems: 'center',
    borderWidth: 1, borderColor: `${AppTheme.teal}30`,
  },
  typeIcon: {
    width: 46, height: 46, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  dot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: AppTheme.textMuted,
    marginHorizontal: 6,
  },
});

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
];
