import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const { colors } = useTheme();

  const menuItems = [
    {
      id: '1',
      title: 'Personal Information',
      icon: 'person' as const,
      route: '/(tabs)' as const,
    },
    {
      id: '2',
      title: 'Notifications',
      icon: 'notifications' as const,
      route: '/(tabs)' as const,
    },
    {
      id: '3',
      title: 'Security',
      icon: 'shield' as const,
      route: '/(tabs)' as const,
    },
    {
      id: '4',
      title: 'Help & Support',
      icon: 'help-circle' as const,
      route: '/(tabs)' as const,
    },
    {
      id: '5',
      title: 'About',
      icon: 'information-circle' as const,
      route: '/(tabs)' as const,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.profileCard, { backgroundColor: colors.white }]}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <Text style={[styles.name, { color: colors.text }]}>Dr. Sarah Johnson</Text>
          <Text style={[styles.role, { color: colors.gray }]}>Obstetrician</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: colors.white }]}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color={colors.primary} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={() => router.replace('/(auth)/Login')}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  headerTitle: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  profileCard: {
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    ...SHADOWS.light,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SIZES.base,
  },
  name: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  role: {
    fontSize: SIZES.medium,
  },
  menuContainer: {
    marginBottom: SIZES.padding,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: SIZES.medium,
    marginLeft: SIZES.base,
  },
  logoutButton: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
}); 