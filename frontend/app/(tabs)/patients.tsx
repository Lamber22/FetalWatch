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
        <View style={{ flex: 1 }} />
        <View style={styles.titleContainer}>
          <Image source={require('../../assets/logo/fetalwatch.png')} style={styles.logo} />
          <Text style={styles.title}>Patients & Appointments</Text>
        </View>
        <View style={{ flex: 1 }} />
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
    color: '#333',
  },
});