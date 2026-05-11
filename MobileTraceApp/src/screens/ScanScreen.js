import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

// Import địa chỉ IP tự động nhận diện từ file cấu hình
import { BASE_URL } from '../ip-config'; 

const { width } = Dimensions.get('window');

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();

  // Tự động mở khóa camera khi quay lại tab Scan
  useEffect(() => {
    if (isFocused) {
      setScanned(false);
    }
  }, [isFocused]);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true); // Khóa camera để xử lý

    // 1. Nhận diện Hub dựa trên Prefix (84: VN, 61: AUS)
    const regionPrefix = data.startsWith('84') ? 'VN' : (data.startsWith('61') ? 'AUS' : null);
    
    if (!regionPrefix) {
      Alert.alert(
        "HANG GIA", 
        "Ma vach nay khong ton tai trong he thong xac thuc Blockchain.", 
        [{ text: "Quet lai", onPress: () => setScanned(false) }],
        { onDismiss: () => setScanned(false) }
      );
      return;
    }

    const realId = parseInt(data.substring(2), 10).toString();

    try {
      // 2. Cơ chế Timeout 5s - Sử dụng BASE_URL tự động
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${BASE_URL}/trace/${regionPrefix}/${realId}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const product = await res.json();

        // 3. Xử lý Logic Hub (Map đúng region để hiện cờ ở màn hình khác)
        // Tìm dòng này và sửa lại:
        const isVN = product.region === 0 || product.region === "0" || product.region === "Vietnam" || product.region === "VN";
        const networkName = isVN ? "Vietnam Network" : "Australia Network";

        // 4. Cập nhật Lịch sử (Lưu bản ghi không emote)
        const history = await AsyncStorage.getItem('scan_history') || '[]';
        let historyArr = JSON.parse(history);

        const newEntry = { 
          ...product, 
          scanTime: new Date().toLocaleString('vi-VN'),
          networkDisplayName: networkName,
          networkFlag: "", 
          scannedHub: regionPrefix 
        };

        await AsyncStorage.setItem('scan_history', JSON.stringify([newEntry, ...historyArr].slice(0, 20)));

        // 5. Hiển thị thông báo (Loại bỏ toàn bộ emote)
        Alert.alert(
          "XAC THUC THANH CONG",
          "Nguon: " + networkName + "\nSan pham: " + product.name,
          [
            { 
              text: "Xem Chi Tiet", 
              onPress: () => {
                setScanned(false);
                navigation.navigate('ProductDetail', { product: newEntry });
              } 
            },
            { text: "Quet Tiep", onPress: () => setScanned(false) }
          ],
          { cancelable: true, onDismiss: () => setScanned(false) }
        );
      } else {
        Alert.alert(
          "HANG GIA", 
          "Ma so " + data + " khong co du lieu tren Blockchain " + regionPrefix, 
          [{ text: "Quet lai", onPress: () => setScanned(false) }],
          { onDismiss: () => setScanned(false) }
        );
      }
    } catch (e) {
      const errorMsg = e.name === 'AbortError' ? "Het thoi gian ket noi (Timeout)" : "Khong the ket noi den Server tai " + BASE_URL;
      Alert.alert("Loi", errorMsg, [{ text: "Thu lai", onPress: () => setScanned(false) }]);
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>App can quyen Camera de truy xuat On-chain</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>CAP QUYEN CAMERA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={StyleSheet.absoluteFillObject} 
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["code128", "qr"] }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.middleRow}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.focusedContainer}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <View style={styles.laser} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        <View style={styles.unfocusedContainer}>
          <Text style={styles.instruction}>Dua ma vach vao khung de xac thuc</Text>
          {scanned && (
            <TouchableOpacity style={styles.resetBtn} onPress={() => setScanned(false)}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>BAM DE QUET TIEP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { marginBottom: 20, textAlign: 'center', fontSize: 16 },
  btn: { backgroundColor: '#6F4E37', padding: 15, borderRadius: 10 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  middleRow: { flexDirection: 'row', height: 220 },
  focusedContainer: { width: 280, height: 220, position: 'relative' },
  corner: { position: 'absolute', width: 20, height: 20, borderColor: '#00FF00', borderWidth: 3 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  laser: { width: '100%', height: 1, backgroundColor: '#00FF00', position: 'absolute', top: '50%', opacity: 0.5 },
  instruction: { color: '#fff', marginTop: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 },
  resetBtn: { backgroundColor: '#6F4E37', padding: 15, borderRadius: 25, marginTop: 20, borderWidth: 1, borderColor: '#fff' }
});