import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { usePatients } from '../../contexts/PatientsContext';
import Modal from '../../components/ui/Modal';
import AddPatient from '../../components/forms/AddPatient';

export default function PatientsScreen() {
  const { colors } = useTheme();
  const { patients, loading, error, fetchPatients } = usePatients();
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const getRiskLevel = (weekOfPregnancy?: number) => {
    if (!weekOfPregnancy) return 'Unknown';
    return weekOfPregnancy < 20 || weekOfPregnancy > 35 ? 'High' : 'Low';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Patients</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.white }]}
          onPress={() => setShowAddPatientModal(true)}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        
        {error && (
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        {!loading && !error && patients.map((patient) => {
          const age = calculateAge(patient.dateOfBirth);
          const risk = getRiskLevel(patient.weekOfPregnancy);
          
          return (
            <TouchableOpacity
              key={patient._id}
              style={[styles.patientCard, { backgroundColor: colors.white }]}
              onPress={() => router.push(`/patients/${patient._id}`)}
            >
              <View style={styles.patientInfo}>
                <Text style={[styles.patientName, { color: colors.text }]}>{patient.name}</Text>
                <Text style={[styles.patientDetails, { color: colors.gray }]}
                >
                  {age} years • {patient.weekOfPregnancy || 'N/A'} weeks
                </Text>
              </View>
              <View style={styles.patientStatus}>
                <View
                  style={[
                    styles.riskBadge,
                    {
                      backgroundColor:
                        risk === 'High' ? colors.error : colors.success,
                    },
                  ]}
                >
                  <Text style={styles.riskText}>{risk} Risk</Text>
                </View>
                <Text style={[styles.lastVisit, { color: colors.gray }]}>
                  Recent
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {!loading && !error && patients.length === 0 && (
          <View style={styles.centerContainer}>
            <Text style={[styles.emptyText, { color: colors.gray }]}>
              No patients found. Add a new patient to get started.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Patient Modal */}
      <Modal
        visible={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        title="Add New Patient"
        size="large"
        animationType="slide"
      >
        <AddPatient
          onSuccess={() => {
            setShowAddPatientModal(false);
            fetchPatients(); // Refresh the patient list
          }}
          onCancel={() => setShowAddPatientModal(false)}
        />
      </Modal>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  errorText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
});