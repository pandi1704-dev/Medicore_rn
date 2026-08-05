// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';

const SPECIALTIES = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Orthopedics'];

const DOCTORS = [
  { id: '1', name: 'Dr. Karthick Raj', specialty: 'Cardiology', rating: 4.9, reviews: 312, fee: 700, available: true, exp: '12 yrs', color: AppTheme.teal, image: require('../../assets/images/drkarthick.png') },
  { id: '2', name: 'Dr. Suresh Babu', specialty: 'Neurology', rating: 4.8, reviews: 218, fee: 900, available: true, exp: '8 yrs', color: AppTheme.violet, image: require('../../assets/images/drsuresh.png') },
  { id: '3', name: 'Dr. Priya Raman', specialty: 'Dermatology', rating: 4.7, reviews: 175, fee: 550, available: false, exp: '6 yrs', color: AppTheme.rose, image: require('../../assets/images/drpriya.png') },
  { id: '4', name: 'Dr. Anand Krishnan', specialty: 'Pediatrics', rating: 4.9, reviews: 405, fee: 600, available: true, exp: '15 yrs', color: AppTheme.warning, image: require('../../assets/images/dranand.png') },
  { id: '5', name: 'Dr. Divya Shankar', specialty: 'Orthopedics', rating: 4.6, reviews: 143, fee: 800, available: true, exp: '10 yrs', color: AppTheme.success, image: require('../../assets/images/drdivya.png') },
];

export default function DoctorsScreen() {
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const insets = useSafeAreaInsets();

  const filteredDoctors = useMemo(() => DOCTORS.filter(d => {
    const matchSpec = selectedSpec === 'All' || d.specialty === selectedSpec;
    const matchSearch = !search.trim() || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  }), [search, selectedSpec]);

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 14 }]}>
        <FadeSlideIn from="left" style={{ flex: 1 }}>
          <Text style={Typography.h1}>Find Doctors</Text>
          <Text style={[Typography.bodyMuted, { marginTop: 3 }]}>{filteredDoctors.length} specialists available</Text>
        </FadeSlideIn>
        <FadeSlideIn from="right">
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options" color={AppTheme.teal} size={20} />
          </TouchableOpacity>
        </FadeSlideIn>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" color={AppTheme.textMuted} size={18} style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors, specialties..."
          placeholderTextColor={AppTheme.textMuted}
          value={search}
          onChangeText={setSearch}
          underlineColorAndroid="transparent"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={{ padding: 4 }}>
            <Ionicons name="close-circle" color={AppTheme.textMuted} size={18} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Specialty Filter Chips ── */}
      <FadeSlideIn from="bottom" delay={110}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specRow}>
          {SPECIALTIES.map(spec => {
            const active = spec === selectedSpec;
            return (
              <TouchableOpacity key={spec} onPress={() => setSelectedSpec(spec)} style={{ marginRight: 8 }}>
                <LinearGradient
                  colors={active ? AppTheme.primaryGradient : [AppTheme.surface, AppTheme.surface]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.specChip, { borderColor: active ? 'transparent' : AppTheme.border }]}
                >
                  <Text style={{ color: active ? AppTheme.bgDeep : AppTheme.textMuted, fontSize: 13, fontFamily: 'Inter_600SemiBold' }}>
                    {spec}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </FadeSlideIn>

      {/* ── Doctor List ── */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 + (insets.bottom || 0) }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeSlideIn from="bottom" delay={150 + index * 70}>
            <DoctorCard doctor={item} />
          </FadeSlideIn>
        )}
      />
    </View>
  );
}

const DoctorCard = ({ doctor }: any) => {
  const navigation = useNavigation();
  return (
    <View style={{ marginBottom: 12 }}>
      <GlassCard borderColor={`${doctor.color}33`} onPress={doctor.available ? () => navigation.navigate('Booking', { doctor }) : undefined}>
        <View style={styles.cardRow}>
          {/* Avatar */}
          <View style={{ marginRight: 14 }}>
            <Image source={doctor.image} style={styles.docAvatar} />
            {doctor.available && <View style={styles.availDot} />}
          </View>

          {/* Info */}
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>{doctor.name}</Text>
            <Text style={[styles.docSpec, { color: doctor.color }]}>{doctor.specialty}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" color="#FBBC05" size={13} />
              <Text style={styles.ratingText}>{doctor.rating}</Text>
              <Text style={styles.reviewText}>({doctor.reviews})</Text>
              <View style={styles.dot} />
              <Text style={styles.expText}>{doctor.exp}</Text>
            </View>
          </View>

          {/* Fee + Book */}
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <Text style={styles.feeText}>₹{doctor.fee}</Text>
            <Text style={styles.feeSub}>/ visit</Text>
            <LinearGradient
              colors={doctor.available ? AppTheme.primaryGradient : [AppTheme.surface2, AppTheme.surface2]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.bookBtn}
            >
              <Text style={{ color: doctor.available ? AppTheme.bgDeep : AppTheme.textMuted, fontSize: 12, fontFamily: 'Outfit_700Bold' }}>
                {doctor.available ? 'Book' : 'Busy'}
              </Text>
            </LinearGradient>
          </View>
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.bgDeep },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingBottom: 16 },
  filterBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: AppTheme.surface,
    borderWidth: 1, borderColor: AppTheme.border, justifyContent: 'center', alignItems: 'center',
  },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: AppTheme.surface,
    borderWidth: 1, borderColor: AppTheme.border, borderRadius: 14,
    marginHorizontal: 20, paddingHorizontal: 16, height: 50, marginBottom: 6,
  },
  searchInput: { flex: 1, color: AppTheme.textPrimary, fontFamily: 'Inter_400Regular', fontSize: 14 },
  specRow: { paddingHorizontal: 20, paddingVertical: 12 },
  specChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22, borderWidth: 1 },
  listContent: { paddingHorizontal: 20 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  docAvatar: { width: 62, height: 62, borderRadius: 18 },
  availDot: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: AppTheme.teal,
    borderWidth: 2, borderColor: AppTheme.bgDeep, position: 'absolute', bottom: 0, right: 0,
  },
  docName: { fontFamily: 'Outfit_700Bold', fontSize: 15, color: AppTheme.textPrimary },
  docSpec: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7 },
  ratingText: { fontFamily: 'Outfit_700Bold', fontSize: 12, color: AppTheme.textPrimary, marginLeft: 4 },
  reviewText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: AppTheme.textMuted, marginLeft: 3 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: AppTheme.textMuted, marginHorizontal: 7 },
  expText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: AppTheme.textMuted },
  feeText: { fontFamily: 'Outfit_800ExtraBold', fontSize: 17, color: AppTheme.textPrimary },
  feeSub: { fontFamily: 'Inter_400Regular', fontSize: 10, color: AppTheme.textMuted, marginTop: 1 },
  bookBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 11, marginTop: 9 },
});
