// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, GradientButton } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';

export default function BookingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const doctor = (route.params as any)?.doctor || {
    name: 'Dr. Karthick Raj', specialty: 'Cardiology', rating: 4.9, reviews: 312, fee: 700, color: AppTheme.teal,
  };

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calMonth, setCalMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });

  const today = new Date(); today.setHours(0,0,0,0);

  const calDays = (() => {
    const year = calMonth.getFullYear(), month = calMonth.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDow).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  })();

  const onCalDayPress = (day: number) => {
    const picked = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
    picked.setHours(0,0,0,0);
    const diff = Math.round((picked.getTime() - today.getTime()) / 86400000);
    const idx = diff >= 0 && diff < 14 ? diff : -1;
    if (idx >= 0) { setSelectedDate(idx); setSelectedTime(''); }
    setShowDatePicker(false);
  };

  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const afternoonSlots = ['12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'];
  const eveningSlots = ['05:00 PM', '05:30 PM', '06:00 PM', '07:00 PM'];
  const bookedSlots = ['10:00 AM', '02:30 PM', '05:00 PM'];

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setShowSuccess(true); }, 1500);
  };

  const renderTimeSlots = (title: string, slots: string[], icon: any, iconColor: string) => (
    <View style={styles.timeSection}>
      <View style={styles.timeHeader}>
        <Ionicons name={icon} color={iconColor} size={18} />
        <Text style={[Typography.h3, { marginLeft: 8, fontSize: 16 }]}>{title}</Text>
      </View>
      <View style={styles.slotsGrid}>
        {slots.map(time => {
          const isSelected = selectedTime === time;
          const isBooked = bookedSlots.includes(time) && selectedDate === 0;
          return (
            <TouchableOpacity key={time} disabled={isBooked} onPress={() => setSelectedTime(time)} style={{ width: '31%', marginBottom: 10 }}>
              <View style={[styles.slotButton, {
                backgroundColor: isSelected ? `${AppTheme.teal}26` : isBooked ? `${AppTheme.surface}80` : AppTheme.surface,
                borderColor: isSelected ? AppTheme.teal : isBooked ? 'transparent' : AppTheme.border,
              }]}>
                <Text style={{
                  color: isSelected ? AppTheme.teal : isBooked ? `${AppTheme.textMuted}66` : AppTheme.textPrimary,
                  fontSize: 13, fontWeight: isSelected ? '700' : '500',
                  textDecorationLine: isBooked ? 'line-through' : 'none',
                }}>{time}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h3, { flex: 1, textAlign: 'center', marginRight: 40 }]}>Book Appointment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FadeSlideIn from="top">
          <GlassCard borderColor={`${doctor.color}33`}>
            <View style={{ flexDirection: 'row' }}>
              {doctor.image
                ? <Image source={doctor.image} style={styles.avatar} />
                : <LinearGradient colors={[`${doctor.color}66`, `${doctor.color}1A`]} style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="person" color={doctor.color} size={40} />
                  </LinearGradient>
              }
              <View style={styles.docInfo}>
                <Text style={[Typography.h3, { fontSize: 18 }]}>{doctor.name}</Text>
                <Text style={{ color: doctor.color, fontSize: 14, fontWeight: '600', marginTop: 4 }}>{doctor.specialty}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Ionicons name="star" color="#FBBC05" size={14} />
                  <Text style={{ color: AppTheme.textMuted, fontSize: 12, marginLeft: 4 }}>{doctor.rating} ({doctor.reviews} reviews)</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </FadeSlideIn>

        <FadeSlideIn from="bottom" delay={100} style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={[Typography.h3, { flex: 1 }]}>Select Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" color={AppTheme.teal} size={20} />
            </TouchableOpacity>
          </View>
          {showDatePicker && (<Modal transparent animationType="fade" visible onRequestClose={() => setShowDatePicker(false)}>
              <TouchableOpacity style={styles.calBackdrop} activeOpacity={1} onPress={() => setShowDatePicker(false)}>
                <TouchableOpacity activeOpacity={1} style={styles.calBox}>
                  {/* Month nav */}
                  <View style={styles.calNav}>
                    <TouchableOpacity onPress={() => setCalMonth(m => { const p = new Date(m); p.setMonth(p.getMonth()-1); return p; })}>
                      <Ionicons name="chevron-back" color={AppTheme.teal} size={22} />
                    </TouchableOpacity>
                    <Text style={styles.calMonthLabel}>
                      {calMonth.toLocaleString('default',{month:'long'})} {calMonth.getFullYear()}
                    </Text>
                    <TouchableOpacity onPress={() => setCalMonth(m => { const n = new Date(m); n.setMonth(n.getMonth()+1); return n; })}>
                      <Ionicons name="chevron-forward" color={AppTheme.teal} size={22} />
                    </TouchableOpacity>
                  </View>
                  {/* Day labels */}
                  <View style={styles.calWeekRow}>
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                      <Text key={d} style={styles.calWeekDay}>{d}</Text>
                    ))}
                  </View>
                  {/* Day grid */}
                  <View style={styles.calGrid}>
                    {calDays.map((day, i) => {
                      if (!day) return <View key={i} style={styles.calCell} />;
                      const d = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
                      d.setHours(0,0,0,0);
                      const past = d < today;
                      const diff = Math.round((d.getTime()-today.getTime())/86400000);
                      const disabled = past || diff >= 14;
                      const isSel = diff === selectedDate;
                      return (
                        <TouchableOpacity key={i} style={styles.calCell} disabled={disabled} onPress={() => onCalDayPress(day)}>
                          <View style={[styles.calDayInner, isSel && { backgroundColor: AppTheme.teal }]}>
                            <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: disabled ? AppTheme.border : isSel ? '#000' : AppTheme.textPrimary }}>{day}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>)}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((date, index) => {
              const isSelected = selectedDate === index;
              return (
                <TouchableOpacity key={index} onPress={() => { setSelectedDate(index); setSelectedTime(''); }} style={{ marginRight: 12 }}>
                  <LinearGradient
                    colors={isSelected ? AppTheme.primaryGradient : [AppTheme.surface, AppTheme.surface]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[styles.dateCard, { borderColor: isSelected ? 'transparent' : AppTheme.border }]}
                  >
                    <Text style={{ color: isSelected ? 'rgba(5, 11, 24, 0.8)' : AppTheme.textMuted, fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>
                      {date.toLocaleString('default', { month: 'short' })}
                    </Text>
                    <Text style={{ color: isSelected ? AppTheme.bgDeep : AppTheme.textPrimary, fontFamily: 'Outfit_800ExtraBold', fontSize: 20, marginTop: 4 }}>
                      {date.getDate()}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeSlideIn>

        <FadeSlideIn from="bottom" delay={200} style={styles.section}>
          {renderTimeSlots('Morning', morningSlots, 'sunny-outline', AppTheme.warning)}
          <View style={{ height: 24 }} />
          {renderTimeSlots('Afternoon', afternoonSlots, 'partly-sunny-outline', AppTheme.teal)}
          <View style={{ height: 24 }} />
          {renderTimeSlots('Evening', eveningSlots, 'moon-outline', AppTheme.violet)}
        </FadeSlideIn>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View><Text style={{ color: AppTheme.textMuted, fontSize: 12 }}>Total Fee</Text><Text style={[Typography.h2, { fontSize: 24, marginTop: 2 }]}>₹{doctor.fee}</Text></View>
        <View style={{ flex: 1, marginLeft: 24 }}>
          <GradientButton text="Confirm Booking" isLoading={isLoading} disabled={!selectedTime} onPress={handleConfirm} />
        </View>
      </View>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <GlassCard padding={32} style={{ alignItems: 'center' , backgroundColor:'rgb(26, 31, 46)'}}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" color={AppTheme.teal} size={40} />
              </View>
              <Text style={[Typography.h2, { fontSize: 22, marginTop: 24, textAlign: 'center' }]}>Booking Confirmed!</Text>
              <Text style={{ color: AppTheme.textMuted, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 21 }}>
                Your appointment with {doctor.name} is scheduled for:
              </Text>
              <View style={styles.timePill}>
                <Ionicons name="calendar-outline" color={AppTheme.teal} size={16} />
                <Text style={{ color: AppTheme.textPrimary, fontWeight: '600', fontSize: 13, marginLeft: 8 }}>
                  {dates[selectedDate].toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })} at {selectedTime}
                </Text>
              </View>
              <TouchableOpacity onPress={() => { setShowSuccess(false); navigation.goBack(); }} style={styles.doneBtn}>
                <Text style={{ color: AppTheme.bgDeep, fontFamily: 'Outfit_700Bold', fontSize: 16 }}>Done</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.bgDeep },
  appBar: { flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS === 'android' ? 40 : 60, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { padding: 8, marginLeft: -8 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  avatar: { width: 72, height: 72, borderRadius: 20 },
  docInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  section: { marginTop: 32 },
  dateCard: { width: 64, height: 80, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  timeSection: { width: '100%' },
  timeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slotButton: { paddingVertical: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bottomBar: {
    flexDirection: 'row', padding: 20, paddingBottom: 32,
    backgroundColor: AppTheme.bgCard, borderTopWidth: 1, borderTopColor: AppTheme.border, alignItems: 'center',
  },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%' },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: `${AppTheme.teal}26`, justifyContent: 'center', alignItems: 'center' },
  timePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: AppTheme.surface2, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginTop: 16 },
  doneBtn: { backgroundColor: AppTheme.teal, width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },

  calBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  calBox: { width: '100%', backgroundColor: '#1A1F2E', borderRadius: 20, padding: 20 },
  calNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  calMonthLabel: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: AppTheme.textPrimary },
  calWeekRow: { flexDirection: 'row', marginBottom: 8 },
  calWeekDay: { flex: 1, textAlign: 'center', fontFamily: 'Inter_600SemiBold', fontSize: 12, color: AppTheme.textMuted },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
  calDayInner: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
});
