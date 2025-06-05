import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { router, usePathname } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const pathname = usePathname();

  // Define paths where the tab bar should be hidden
  const hideTabBarPaths = [
    '/patients/add',
    '/patients/[id]',
    '/calendar/add',
    '/calendar/[id]',
    '/reports/[id]',
    '/profile/personal',
    '/profile/notifications',
    '/profile/security',
    '/profile/support',
    '/profile/about',
  ];

  const shouldShowTabBar = !hideTabBarPaths.some(path => pathname.startsWith(path));

  const handleLogout = () => {
    // Clear any stored tokens or user data here
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          header: () => null,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: `${color}20` },
                ]}>
                <IconSymbol size={28} name="house" color={color} />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name="patients"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: `${color}20` },
                ]}>
                <IconSymbol size={28} name="people" color={color} />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: `${color}20` },
                ]}>
                <IconSymbol size={28} name="calendar" color={color} />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: `${color}20` },
                ]}>
                <IconSymbol size={28} name="chart.bar" color={color} />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: `${color}20` },
                ]}>
                <IconSymbol size={28} name="person" color={color} />
              </Animated.View>
            ),
          }}
        />
      </Tabs>
      {shouldShowTabBar && (
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={handleLogout}>
          <IconSymbol size={24} name="rectangle.portrait.and.arrow.right" color={Colors[colorScheme ?? 'light'].background} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 10,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
