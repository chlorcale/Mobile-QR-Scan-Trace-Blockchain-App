import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ActivityScreen from '../screens/ActivityScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import ConfigScreen from '../screens/ConfigScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator(); // Stack bao phủ toàn app

// 1. Định nghĩa các Tab như bình thường
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Feedback') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          else if (route.name === 'Scan') iconName = focused ? 'barcode' : 'barcode-outline';
          else if (route.name === 'Activity') iconName = focused ? 'notifications' : 'notifications-outline';
          else if (route.name === 'Config') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6F4E37',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#6F4E37' },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Phản hồi' }} />
      <Tab.Screen name="Scan" component={ScanScreen} options={{ title: 'Quét mã' }} />
      <Tab.Screen name="Activity" component={ActivityScreen} options={{ title: 'Hoạt động' }} />
      <Tab.Screen name="Config" component={ConfigScreen} options={{ title: 'Cấu hình' }} />
    </Tab.Navigator>
  );
}

// 2. ROOT NAVIGATOR: Nơi chứa màn hình chi tiết dùng chung
export default function TabNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Màn hình chính chứa 5 Tabs */}
      <RootStack.Screen name="Main" component={MainTabs} />
      
      {/* Màn hình chi tiết nằm ở đây để Tab nào cũng gọi được */}
      <RootStack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ 
          headerShown: true, 
          title: 'Chi tiết sản phẩm',
          headerStyle: { backgroundColor: '#6F4E37' },
          headerTintColor: '#fff'
        }} 
      />
    </RootStack.Navigator>
  );
}