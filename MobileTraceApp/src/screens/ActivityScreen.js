import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import Component dùng chung
import { ProductCard } from '../components/ProductCard'; 

export default function ActivityScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const isFocused = useIsFocused();

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('scan_history');
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (e) {
      console.error("Lỗi khi tải lịch sử:", e);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadHistory();
    }
  }, [isFocused]);

  const clearHistory = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa toàn bộ lịch sử quét không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa hết", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('scan_history');
            setHistory([]);
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Ionicons name="stats-chart" size={18} color="#6F4E37" />
          <Text style={styles.count}> Đã xác thực: {history.length}</Text>
        </View>
        
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory} style={styles.clearBtn}>
            <Text style={styles.clearText}>Xóa lịch sử</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          // --- LOGIC SỬA LỖI HIỂN THỊ HUB TẠI ĐÂY ---
          // Kiểm tra region cho cả trường hợp là số 0 hoặc chuỗi "0"
          const isVietnam = item.region == 0 || item.region === "Vietnam" || item.scannedHub === "VN";
          
          const flag = isVietnam ? "🇻🇳" : "🇦🇺";
          const networkLabel = isVietnam ? "Vietnam Network" : "Australia Network";

          return (
            <View style={styles.wrapper}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              >
                <ProductCard item={item} />
                
                <View style={styles.footerInfo}>
                  <View style={styles.networkBadge}>
                    <Text style={styles.networkText}>
                       {item.networkFlag || flag} {item.networkDisplayName || networkLabel}
                    </Text>
                  </View>
                  <Text style={styles.timeText}> {item.scanTime}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có dữ liệu truy xuất nào.</Text>
            <Text style={styles.emptySubText}>Hãy bắt đầu bằng cách quét mã vạch sản phẩm.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfaf6' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 20, 
    backgroundColor: '#fff',
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    elevation: 2
  },
  headerInfo: { flexDirection: 'row', alignItems: 'center' },
  count: { fontWeight: 'bold', color: '#6F4E37', fontSize: 15 },
  clearBtn: { paddingVertical: 5, paddingHorizontal: 10 },
  clearText: { color: '#cf1322', fontSize: 13, fontWeight: '600' },
  wrapper: { paddingHorizontal: 15, marginTop: 15 },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -8,
    paddingHorizontal: 5
  },
  networkBadge: {
    backgroundColor: 'rgba(111, 78, 55, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  networkText: { fontSize: 10, color: '#6F4E37', fontWeight: '600' },
  timeText: { fontSize: 11, color: '#999', fontStyle: 'italic' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#999', marginTop: 10 },
  emptySubText: { fontSize: 14, color: '#bbb', marginTop: 5 }
});