import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '../../contexts/ThemeContext';
import PatientsListTab from '../../components/Patients/PatientsListTab';
import AppointmentsTab from '../../components/Appointment/AppointmentsTab';

const Tab = createMaterialTopTabNavigator();

export default function PatientsTabsScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <View style={{ flex: 2 }} />
        <View style={styles.titleContainer}>
          <Image source={require('../../assets/logo/fetalwatch.png')} style={styles.logo} />
          <Text style={styles.title} numberOfLines={1}>Patients & Appointments</Text>
        </View>
        <View style={{ flex: 2 }} />
      </View>
      <View style={styles.navigationHint}>
        <Text style={[styles.hintText, { color: colors.gray }]}>
          Tap on "Patients" or "Appointments" tabs below to switch between views
        </Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontWeight: 'bold', color: colors.primary },
          tabBarIndicatorStyle: { backgroundColor: colors.primary },
          tabBarStyle: { backgroundColor: colors.background },
        }}
      >
        <Tab.Screen name="Patients" component={PatientsListTab} />
        <Tab.Screen name="Appointments" component={AppointmentsTab} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#333',
    flexShrink: 0,
  },
  navigationHint: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});