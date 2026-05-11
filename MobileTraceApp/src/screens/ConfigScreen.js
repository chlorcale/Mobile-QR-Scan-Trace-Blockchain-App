import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ConfigScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hệ thống</Text>
        <View style={styles.row}>
          <Text>Kết nối qua Server (192.168.1.5)</Text>
          <Icon name="checkmark-circle" size={20} color="green" />
        </View>
        <View style={styles.row}>
          <Text>Chế độ quét nhanh (Turbo Scan)</Text>
          <Switch value={true} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin dự án</Text>
        <TouchableOpacity style={styles.row}>
          <Text>Đội ngũ phát triển: Chlorcale Team</Text>
          <Icon name="chevron-forward" size={18} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text>Phiên bản ứng dụng: v1.0.2-beta</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>HCMUT - Faculty of Computer Science</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  section: { backgroundColor: '#fff', marginTop: 20, paddingHorizontal: 15 },
  sectionTitle: { padding: 15, fontSize: 13, color: '#999', textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderTopWidth: 0.5, borderTopColor: '#eee', alignItems: 'center' },
  footer: { textAlign: 'center', marginTop: 40, color: '#ccc', fontSize: 12 }
});