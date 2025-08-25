import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { SHADOWS } from '../../components/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/components/constants/Colors';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/contexts/AuthContext';

const MAIN_TABS = [
  {
    name: 'index',
    title: 'Home',
    icon: 'home-outline',
  },
  {
    name: 'Patients',
    title: 'Patients',
    icon: 'people-outline',
  },
  {
    name: 'Reports',
    title: 'Reports',
    icon: 'bar-chart-outline',
  },
  {
    name: 'Users',
    title: 'Users',
    icon: 'medkit-outline',
  },
  {
    name: 'Settings',
    title: 'Settings',
    icon: 'settings-outline',
  },
];

const ALL_TABS = [
  ...MAIN_TABS,
];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  // Responsive sizing
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;
  const isLargeScreen = width > 500;
  const iconSize = isSmallScreen ? 20 : isLargeScreen ? 30 : 26;
  const labelFontSize = isSmallScreen ? 11 : isLargeScreen ? 15 : 13;
  const tabPaddingVertical = isSmallScreen ? 2 : isLargeScreen ? 10 : 6;

  // Filter tabs based on user role
  const filteredTabs = React.useMemo(() => {
    if (!user) return ALL_TABS.filter(tab => tab.name !== 'Users');
    if (user.role === 'healthProvider') return ALL_TABS;
    return ALL_TABS.filter(tab => tab.name !== 'Users');
  }, [user]);

  const handleTabPress = (routeName: string) => {
    try {
      navigation.navigate(routeName);
    } catch (e) {
      // Show fallback UI or toast
      console.error('Navigation error:', e);
      // Optionally, set a state to show error UI
    }
  };

  return (
    <View style={styles.tabBar}>
      {filteredTabs.map((tab, idx) => {
        // Find the actual route index in state.routes
        const routeIdx = state.routes.findIndex(r => r.name.toLowerCase() === tab.name.toLowerCase());
        const isFocused = state.index === routeIdx;
        return (
          <TouchableOpacity
            key={tab.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => handleTabPress(tab.name)}
            style={[styles.tabItem, { paddingVertical: tabPaddingVertical }, isFocused && styles.tabItemActive]}
          >
            <Ionicons
              name={tab.icon as any}
              size={iconSize}
              color={isFocused ? '#0a7ea4' : Colors[colorScheme].tabIconDefault}
            />
            <Text style={[styles.tabLabel, { fontSize: labelFontSize }, isFocused && styles.tabLabelActive]}>{tab.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { user } = useAuth();
  // Only include Users tab if role is healthProvider
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="Patients" />
      <Tabs.Screen name="Reports" />
      {user && user.role === 'healthProvider' && <Tabs.Screen name="Users" />}
      <Tabs.Screen name="Settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? 24 : Platform.OS === 'android' ? 40 : 8, 
    paddingTop: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  ...SHADOWS.dark,
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
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  tabLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
});
