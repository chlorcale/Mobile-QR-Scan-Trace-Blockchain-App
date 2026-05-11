import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params; // Nhận dữ liệu product từ Scan hoặc List

  return (
    <ScrollView style={styles.container}>
      {/* Header Sản phẩm */}
      <View style={styles.headerCard}>
        <Text style={styles.productName}> {product.name}</Text>
        <Text style={styles.productSub}>
          Mã: {product.productCode} | Hub: {product.region}
        </Text>
        <View style={styles.badge}><Text style={styles.badgeText}>{product.productType}</Text></View>
      </View>

      <Text style={styles.sectionTitle}> Nhật ký On-chain (Timeline)</Text>

      {/* Timeline Steps */}
      {product.steps && product.steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.timelineLine}>
            <View style={styles.dot} />
            {index !== product.steps.length - 1 && <View style={styles.line} />}
          </View>
          
          <View style={styles.stepContent}>
            <Text style={styles.stepTime}>{new Date(step.time).toLocaleString('vi-VN')}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
            <Text style={styles.stepDetail}>{step.detail}</Text>
            <Text style={styles.stepActor}> Hash: {step.actor.substring(0, 10)}...</Text>

            {step.imageHash && (
              <TouchableOpacity 
                style={styles.imageWrapper}
                onPress={() => Linking.openURL(step.imageHash)}
              >
                <Image source={{ uri: step.imageHash }} style={styles.stepImage} />
                <Text style={styles.linkText}>Xem ảnh gốc (IPFS)</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfaf6', padding: 15 },
  headerCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#6F4E37' },
  productName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  productSub: { fontSize: 13, color: '#666', marginTop: 5 },
  badge: { backgroundColor: '#6F4E37', alignSelf: 'flex-start', paddingHorizontal: 10, borderRadius: 5, marginTop: 10 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#6F4E37' },
  stepContainer: { flexDirection: 'row', minHeight: 100 },
  timelineLine: { alignItems: 'center', width: 20 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#6F4E37', zIndex: 1 },
  line: { width: 2, flex: 1, backgroundColor: '#ddd' },
  stepContent: { flex: 1, marginLeft: 15, paddingBottom: 20 },
  stepTime: { fontSize: 11, color: '#999' },
  stepDescription: { fontSize: 16, fontWeight: 'bold', color: '#6F4E37', marginTop: 2 },
  stepDetail: { fontSize: 14, color: '#444', marginTop: 2 },
  stepActor: { fontSize: 11, color: '#888', marginTop: 5, fontStyle: 'italic' },
  imageWrapper: { marginTop: 10 },
  stepImage: { width: '100%', height: 180, borderRadius: 10, backgroundColor: '#eee' },
  linkText: { color: '#0066cc', fontSize: 12, marginTop: 5, textDecorationLine: 'underline' }
});