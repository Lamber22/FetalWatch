import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/components/constants/Colors';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const MAIN_TABS = [
  {
    name: 'index',
    title: 'Home',
    icon: 'home-outline',
  },
  {
    name: 'patients',
    title: 'Patients',
    icon: 'people-outline',
  },
  {
    name: 'Appointment',
    title: 'Appointments',
    icon: 'calendar-outline',
  },
  {
    name: 'reports',
    title: 'Reports',
    icon: 'bar-chart-outline',
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: 'person-outline',
  },
];

// Add as many extra links as you want here
const EXTRA_TABS = [
  {
    name: 'DoctorScreen',
    title: 'Doctors',
    icon: 'medkit-outline',
  },
  // Add more links here as needed
];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleTabPress = (routeName: string, isExtra = false) => {
    setModalVisible(false);
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.tabBar}>
      {MAIN_TABS.map((tab, idx) => {
        // Find the actual route index in state.routes
        const routeIdx = state.routes.findIndex(r => r.name.toLowerCase() === tab.name.toLowerCase());
        const isFocused = state.index === routeIdx;
        return (
          <TouchableOpacity
            key={tab.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => handleTabPress(tab.name)}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
          >
            <Ionicons
              name={tab.icon as any}
              size={26}
              color={isFocused ? Colors[colorScheme].tint : Colors[colorScheme].tabIconDefault}
              style={isFocused ? styles.iconActive : styles.icon}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{tab.title}</Text>
          </TouchableOpacity>
        );
      })}
      {/* More Tab */}
      {EXTRA_TABS.length > 0 && (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => setModalVisible(true)}
          style={styles.tabItem}
        >
          <Ionicons name="ellipsis-horizontal" size={26} color={Colors[colorScheme].tabIconDefault} />
          <Text style={styles.tabLabel}>More</Text>
        </TouchableOpacity>
      )}
      {/* Modal for extra links */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {EXTRA_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.name}
                style={styles.modalItem}
                onPress={() => handleTabPress(tab.name, true)}
              >
                <Ionicons name={tab.icon as any} size={22} color={Colors[colorScheme].tint} style={{ marginRight: 12 }} />
                <Text style={styles.modalLabel}>{tab.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="patients" />
      <Tabs.Screen name="Appointment" />
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="profile" />
      {/* The DoctorScreen and other extra screens should be registered in your router/navigation */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    zIndex: 100,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minWidth: 60,
    borderRadius: 16,
    marginHorizontal: 2,
    transitionProperty: 'background-color',
    transitionDuration: '200ms',
  },
  tabItemActive: {
    backgroundColor: '#f0f6fa',
  },
  icon: {
    opacity: 0.7,
  },
  iconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 32,
    minHeight: 120,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalLabel: {
    fontSize: 16,
    color: '#222',
  },
});
