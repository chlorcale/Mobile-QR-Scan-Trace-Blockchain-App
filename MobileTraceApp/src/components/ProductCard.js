import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ProductCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.badge}><Text style={styles.badgeText}>{item.productType || 'SHTT'}</Text></View>
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.info}>ID: #{item.productId} | {item.manufacturer}</Text>
    <Text style={styles.area}>Vùng sản xuất {item.area}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 3 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#6F4E37', paddingHorizontal: 8, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  name: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  info: { fontSize: 12, color: '#666' },
  area: { fontSize: 12, color: '#A67B5B', marginTop: 4 }
});