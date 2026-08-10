// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard, GradientButton, Badge } from '../shared/components/CommonWidgets';
import { FadeSlideIn } from '../shared/components/Animations';
import { LinearGradient } from 'expo-linear-gradient';

const CATEGORIES = ['All', 'Vitamins', 'Pain Relief', 'Cold & Flu', 'First Aid', 'Skin Care'];

const PRODUCTS = [
  { id: '1', name: 'Vitamin C 1000mg', brand: 'HealthPlus', price: 12.99, rating: 4.8, type: 'Vitamins', imageIcon: 'nutrition' },
  { id: '2', name: 'Paracetamol 500mg', brand: 'MediCare', price: 5.49, rating: 4.5, type: 'Pain Relief', imageIcon: 'medical' },
  { id: '3', name: 'Cough Syrup', brand: 'ClearRelief', price: 8.99, rating: 4.2, type: 'Cold & Flu', imageIcon: 'flask' },
  { id: '4', name: 'First Aid Kit', brand: 'SafeGuard', price: 24.99, rating: 4.9, type: 'First Aid', imageIcon: 'medkit' },
  { id: '5', name: 'Omega 3 Fish Oil', brand: 'NatureBest', price: 18.50, rating: 4.7, type: 'Vitamins', imageIcon: 'fish' },
];

export default function PharmacyScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);

  const formatINR = (amount: number) => `\u20B9${amount.toFixed(2)}`;

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCat = activeCategory === 'All' || p.type === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: (insets.top || 0) + 12 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={22} color={AppTheme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={Typography.h1}>Pharmacy</Text>
          <Text style={[Typography.bodyMuted, { marginTop: 2 }]}>Order medicines online</Text>
        </View>

        <TouchableOpacity style={styles.cartBtn}>
          <Ionicons name="cart-outline" size={24} color={AppTheme.textPrimary} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <FadeSlideIn from="bottom" delay={0}>
          <View style={styles.searchWrap}>
            <Ionicons name="search" color={AppTheme.textMuted} size={18} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search medicines..."
              placeholderTextColor={AppTheme.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </FadeSlideIn>

        {/* Categories */}
        <FadeSlideIn from="bottom" delay={50}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {CATEGORIES.map(cat => {
              const active = cat === activeCategory;
              return (
                <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)} style={{ marginRight: 12 }}>
                  <LinearGradient
                    colors={active ? AppTheme.primaryGradient : [AppTheme.surface, AppTheme.surface]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[styles.catChip, { borderColor: active ? 'transparent' : AppTheme.border }]}
                  >
                    <Text style={{ color: active ? AppTheme.bgDeep : AppTheme.textMuted, fontFamily: active ? 'Outfit_700Bold' : 'Inter_500Medium', fontSize: 13 }}>
                      {cat}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeSlideIn>

        {/* Products Grid */}
        <View style={styles.productGrid}>
          {filteredProducts.map((product, index) => (
            <FadeSlideIn key={product.id} from="bottom" delay={100 + index * 50} style={styles.productCell}>
              <GlassCard padding={16} borderColor={`${AppTheme.teal}20`}>
                <View style={styles.productImgWrap}>
                  <Ionicons name={product.imageIcon as any} size={40} color={AppTheme.teal} />
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" color="#FBBC05" size={10} />
                    <Text style={[Typography.caption, { fontSize: 10, marginLeft: 2, color: AppTheme.bgDeep, fontWeight: '700' }]}>{product.rating}</Text>
                  </View>
                </View>
                
                <Text style={[Typography.h3, { fontSize: 14, marginTop: 12 }]} numberOfLines={1}>{product.name}</Text>
                <Text style={[Typography.caption, { marginTop: 2 }]}>{product.brand}</Text>
                
                <View style={styles.priceRow}>
                  <Text style={[Typography.h2, { fontSize: 16, color: AppTheme.teal }]}>{formatINR(product.price)}</Text>
                  <TouchableOpacity 
                    style={styles.addBtn}
                    onPress={() => setCartCount(c => c + 1)}
                  >
                    <Ionicons name="add" size={18} color={AppTheme.bgDeep} />
                  </TouchableOpacity>
                </View>
              </GlassCard>
            </FadeSlideIn>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.bgDeep,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  headerTextWrap: {
    flex: 1,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: AppTheme.rose,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppTheme.bgDeep,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    color: AppTheme.textPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  catRow: {
    paddingVertical: 16,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCell: {
    width: '48%',
    marginBottom: 16,
  },
  productImgWrap: {
    height: 90,
    backgroundColor: AppTheme.surface2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: AppTheme.teal,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppTheme.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
