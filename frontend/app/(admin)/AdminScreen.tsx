import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, useColorScheme } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserActivationTab from './UserActivationTab';
import UsersInfoTab from './UsersInfoTab';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

const Tab = createMaterialTopTabNavigator();

export default function AdminScreen() {
  const { signOut } = useAuth();
  const colorScheme = useColorScheme();

  // Define theme colors
  const theme = {
    background: colorScheme === 'dark' ? '#181A20' : '#fff',
    border: colorScheme === 'dark' ? '#333' : '#eee',
    text: colorScheme === 'dark' ? '#fff' : '#333',
    title: colorScheme === 'dark' ? '#fff' : '#333',
    logoutBg: colorScheme === 'dark' ? '#e74c3c' : '#e74c3c',
    logoutText: '#fff',
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/Login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}> 
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo/fetalwatch.png')} style={styles.logo} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.title }]}>FetalWatch Admin Portal</Text>
        </View>
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.logoutBg }]} onPress={handleLogout}>
          <Text style={[styles.logoutText, { color: theme.logoutText }]}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: theme.background },
          tabBarActiveTintColor: theme.text,
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#aaa' : '#888',
          tabBarIndicatorStyle: { backgroundColor: theme.text },
        }}
      >
        <Tab.Screen name="Activate Users" component={UserActivationTab} />
        <Tab.Screen name="Users" component={UsersInfoTab} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor moved to inline for theme support
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    // backgroundColor moved to inline for theme support
    borderBottomWidth: 1,
    // borderBottomColor moved to inline for theme support
  },
  logoContainer: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    // color moved to inline for theme support
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    // backgroundColor moved to inline for theme support
    borderRadius: 6,
  },
  logoutText: {
    // color moved to inline for theme support
    fontWeight: 'bold',
    fontSize: 14,
  },
});
