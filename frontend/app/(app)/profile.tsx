import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function ProfileScreen() {
  const { theme, colors, toggleTheme } = useTheme();

  // Mock data - replace with actual user data
  const user = {
    name: 'Dr. Sarah Wilson',
    role: 'Obstetrician',
    email: 'sarah.wilson@hospital.com',
    phone: '+1 234 567 8900',
    department: 'Obstetrics & Gynecology',
    experience: '8 years',
  };

  const menuItems = [
    {
      title: 'Account Settings',
      icon: 'person-outline',
      onPress: () => console.log('Account Settings'),
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => console.log('Notifications'),
    },
    {
      title: 'Privacy & Security',
      icon: 'shield-checkmark-outline',
      onPress: () => console.log('Privacy & Security'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => console.log('Help & Support'),
    },
    {
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => console.log('About'),
    },
  ];

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: colors.white }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Text>
          </View>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        <Text style={[styles.role, { color: colors.gray }]}>{user.role}</Text>
      </View>

      {/* Contact Information */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>{user.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>{user.department}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>{user.experience} experience</Text>
          </View>
        </View>
      </View>

      {/* Theme Toggle */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        <View style={styles.themeToggle}>
          <View style={styles.themeInfo}>
            <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={20} color={colors.primary} />
            <Text style={[styles.themeText, { color: colors.text }]}>
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.lightGray, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {/* Menu Items */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.white} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.padding,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  avatarContainer: {
    marginBottom: SIZES.base,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  name: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  role: {
    fontSize: SIZES.medium,
  },
  section: {
    marginTop: SIZES.padding,
    padding: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    ...SHADOWS.light,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  infoText: {
    fontSize: SIZES.font,
    color: COLORS.text,
    marginLeft: SIZES.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.medium,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: SIZES.font,
    color: COLORS.text,
    marginLeft: SIZES.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: SIZES.medium,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    ...SHADOWS.light,
  },
  logoutText: {
    fontSize: SIZES.font,
    color: COLORS.error,
    marginLeft: SIZES.base,
    fontWeight: 'bold',
  },
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeText: {
    marginLeft: SIZES.base,
    fontSize: SIZES.medium,
  },
}); 