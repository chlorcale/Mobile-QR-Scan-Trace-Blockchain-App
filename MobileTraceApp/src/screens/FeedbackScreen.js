import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function FeedbackScreen() {
  const [content, setContent] = useState('');

  const sendFeedback = () => {
    Alert.alert("Thành công", "Cảm ơn bạn đã gửi phản ánh. Đội ngũ quản trị sẽ kiểm tra mã hash trên Blockchain.");
    setContent('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phản ánh sản phẩm</Text>
      <Text style={styles.sub}>Nếu phát hiện hàng giả hoặc sai lệch thông tin, hãy gửi báo cáo kèm mã định danh cho chúng tôi.</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Nhập ID sản phẩm hoặc nội dung..." 
        value={content}
        onChangeText={setContent}
        multiline
      />
      
      <TouchableOpacity style={styles.btn} onPress={sendFeedback}>
        <Text style={styles.btnText}>Gửi phản ánh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#6F4E37' },
  sub: { color: '#666', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, height: 150, textAlignVertical: 'top', marginTop: 20 },
  btn: { backgroundColor: '#6F4E37', padding: 18, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});