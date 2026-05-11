import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './src/navigation/TabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      {/* Thanh trạng thái phía trên điện thoại màu trắng chữ đen */}
      <StatusBar style="dark" />
      
      {/* Toàn bộ giao diện điều hướng đã tách ra TabNavigator */}
      <TabNavigator />
    </NavigationContainer>
  );
}