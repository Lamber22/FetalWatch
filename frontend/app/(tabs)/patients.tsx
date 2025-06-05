import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export default function PatientsScreen() {
  const { colors } = useTheme();

  const patients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 28,
      weeks: 24,
      risk: 'Low',
      lastVisit: '2 days ago',
    },
    {
      id: '2',
      name: 'Emily Davis',
      age: 32,
      weeks: 36,
      risk: 'High',
      lastVisit: '1 day ago',
    },
    {
      id: '3',
      name: 'Maria Garcia',
      age: 25,
      weeks: 18,
      risk: 'Low',
      lastVisit: '3 days ago',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Patients</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/patients/add')}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {patients.map((patient) => (
          <TouchableOpacity
            key={patient.id}
            style={[styles.patientCard, { backgroundColor: colors.white }]}
            onPress={() => router.push(`/patients/${patient.id}`)}
          >
            <View style={styles.patientInfo}>
              <Text style={[styles.patientName, { color: colors.text }]}>{patient.name}</Text>
              <Text style={[styles.patientDetails, { color: colors.gray }]}>
                {patient.age} years • {patient.weeks} weeks
              </Text>
            </View>
            <View style={styles.patientStatus}>
              <View
                style={[
                  styles.riskBadge,
                  {
                    backgroundColor:
                      patient.risk === 'High' ? colors.error : colors.success,
                  },
                ]}
              >
                <Text style={styles.riskText}>{patient.risk} Risk</Text>
              </View>
              <Text style={[styles.lastVisit, { color: colors.gray }]}>
                {patient.lastVisit}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  headerTitle: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  patientDetails: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  patientStatus: {
    alignItems: 'flex-end',
  },
  riskBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  riskText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  lastVisit: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
}); 