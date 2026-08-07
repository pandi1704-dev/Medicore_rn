// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, GradientButton } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const MOCK_HOSPITALS = [
  { id: '1', name: 'City General Hospital', type: 'Hospital', distance: '1.2 km', rating: 4.8, lat: 13.0827, lng: 80.2707 },
  { id: '2', name: 'MediCare Clinic', type: 'Clinic', distance: '2.5 km', rating: 4.5, lat: 13.0900, lng: 80.2800 },
  { id: '3', name: 'Apollo Pharmacy', type: 'Pharmacy', distance: '0.8 km', rating: 4.2, lat: 13.0750, lng: 80.2600 },
];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const maps = Platform.OS === 'web' ? null : require('react-native-maps');
  const MapView = maps?.default;
  const Marker = maps?.Marker;
  const PROVIDER_GOOGLE = maps?.PROVIDER_GOOGLE;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState(MOCK_HOSPITALS[0]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
      // For demo, we'll just set a mock location in Chennai if actual fetch takes too long,
      // but let's try to get current position.
      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (e) {
        setLocation({ coords: { latitude: 13.0827, longitude: 80.2707 } } as any);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Map View */}
      {Platform.OS === 'web' ? (
        <View style={styles.webMapWrap}>
          <LinearGradient
            colors={[`${AppTheme.teal}22`, `${AppTheme.violet}22`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.webMapCard}
          >
            <Ionicons name="map-outline" color={AppTheme.teal} size={34} />
            <Text style={[Typography.h3, { marginTop: 12, textAlign: 'center' }]}>Map preview is available on mobile</Text>
            <Text style={[Typography.caption, { marginTop: 8, textAlign: 'center' }]}>Use Android or iOS app for live map and location markers.</Text>
          </LinearGradient>
        </View>
      ) : location && MapView && Marker ? (
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

      {/* Floating Header */}
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 12 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={AppTheme.textMuted} />
          <Text style={[Typography.bodyMuted, { marginLeft: 10, flex: 1 }]}>Search hospitals...</Text>
        </View>
      </View>

      {/* Bottom Sheet */}
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
  container: {
    flex: 1,
    backgroundColor: AppTheme.bgDeep,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMapWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  webMapCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppTheme.border,
    paddingVertical: 30,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${AppTheme.bgDeep}CC`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  searchBar: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${AppTheme.bgDeep}CC`,
    borderWidth: 1,
    borderColor: AppTheme.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  markerWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppTheme.violet,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppTheme.textPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerSelected: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: AppTheme.teal,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${AppTheme.surface2}80`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  callBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: `${AppTheme.rose}20`,
    borderWidth: 1,
    borderColor: `${AppTheme.rose}40`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Dark mode map style
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];
