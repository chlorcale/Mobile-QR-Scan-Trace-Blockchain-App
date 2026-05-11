import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { Ionicons } from '@expo/vector-icons';

// 1. IMPORT địa chỉ IP tự động nhận diện
import { BASE_URL } from '../ip-config'; 

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [currentHub, setCurrentHub] = useState('VN'); // Mặc định là Việt Nam
  const [loading, setLoading] = useState(false);

  const fetchProducts = (hub) => {
    setLoading(true);
    
    // 2. SỬ DỤNG BASE_URL thay vì IP cứng
    const url = `${BASE_URL}/products?region=${hub}`;
    
    console.log(`🌐 [Home] Đang tải sản phẩm từ: ${url}`);

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(e => {
        console.log(`❌ Lỗi tải sản phẩm từ ${hub}:`, e.message);
        setLoading(false);
      });
  };

  // Tải lại dữ liệu mỗi khi người dùng đổi Hub hoặc khi màn hình được Focus
  useEffect(() => {
    fetchProducts(currentHub);
  }, [currentHub]);

  return (
    <ScrollView style={styles.container}>
      {/* Banner giới thiệu */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Ứng dụng TRUY XUẤT NGUỒN GỐC</Text>
        <Text style={styles.bannerSub}>Hệ thống xác thực đa chuỗi tích hợp Cosmos SDK & Interchain Technology</Text>
      </View>

      {/* --- TÍNH NĂNG CHỌN NETWORK (HUB SELECTOR) --- */}
      <Text style={styles.sectionTitle}> Chọn mạng lưới truy xuất</Text>
      <View style={styles.hubSelector}>
        <TouchableOpacity 
          style={[styles.hubButton, currentHub === 'VN' && styles.hubActive]} 
          onPress={() => setCurrentHub('VN')}
        >
          <Text style={[styles.hubText, currentHub === 'VN' && styles.hubTextActive]}>🇻🇳 Vietnam Hub</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.hubButton, currentHub === 'AUS' && styles.hubActive]} 
          onPress={() => setCurrentHub('AUS')}
        >
          <Text style={[styles.hubText, currentHub === 'AUS' && styles.hubTextActive]}>🇦🇺 Australia Hub</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sản phẩm On-chain */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}> Sản phẩm tại {currentHub}</Text>
        {loading && <ActivityIndicator color="#6F4E37" />}
      </View>

      <FlatList
          data={products}
          scrollEnabled={false}
          // Sửa lại dòng này: Kết hợp Vùng và ID để đảm bảo tính duy nhất
          keyExtractor={(item, index) => {
            const uniqueKey = item.region && item.productId 
              ? `${item.region}-${item.productId}` 
              : `item-${index}`;
            return uniqueKey;
          }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
              <ProductCard item={item} />
            </TouchableOpacity>
          )}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
                <Ionicons name="cube-outline" size={50} color="#ccc" />
                <Text style={styles.empty}>Chưa có sản phẩm nào được ghi nhận trên Blockchain tại {currentHub}.</Text>
            </View>
          )
        }
      />

      <Text style={styles.sectionTitle}> Đối tác liên kết</Text>
      <View style={styles.partnerCard}>
        <Ionicons name="business" size={20} color="#A67B5B" />
        <Text style={styles.partnerText}>HTX Nông Nghiệp Cà Mau (VN Hub)</Text>
      </View>
      <View style={styles.partnerCard}>
        <Ionicons name="business" size={20} color="#A67B5B" />
        <Text style={styles.partnerText}>Sydney Fresh Import (AUS Hub)</Text>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfaf6', padding: 15 },
  banner: { backgroundColor: '#6F4E37', padding: 25, borderRadius: 20, marginBottom: 20 },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  bannerSub: { color: '#ddd', fontSize: 12, marginTop: 10, lineHeight: 18 },
  
  hubSelector: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  hubButton: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', alignItems: 'center', elevation: 2 },
  hubActive: { backgroundColor: '#6F4E37', borderColor: '#6F4E37' },
  hubText: { fontSize: 14, color: '#666', fontWeight: '600' },
  hubTextActive: { color: '#fff' },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginVertical: 15, color: '#6F4E37' },
  
  partnerCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    borderLeftWidth: 4, 
    borderLeftColor: '#A67B5B',
    gap: 10,
    elevation: 1
  },
  partnerText: { fontSize: 14, color: '#444' },
  emptyContainer: { alignItems: 'center', marginTop: 30 },
  empty: { textAlign: 'center', color: '#999', marginTop: 10, fontStyle: 'italic', paddingHorizontal: 40 }
});