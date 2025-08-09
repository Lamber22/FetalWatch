import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { usePatient, PatientUtils } from '../../hooks/usePatient';
import { Patient } from '../../interface/iPatient';

export default function PatientDetailsScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { loadPatient, getPatient, isLoading } = usePatient();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          // Check if patient is already cached
          const cachedPatient = getPatient(id);
          if (cachedPatient) {
            setPatient(cachedPatient);
          } else {
            // Load patient from API
            const loadedPatient = await loadPatient(id);
            if (loadedPatient) {
              setPatient(loadedPatient);
            } else {
              setError('Patient not found');
            }
          }
        } catch (err) {
          setError('Failed to load patient');
        }
      }
    };

    fetchPatient();
  }, [id, loadPatient, getPatient]);

  const calculateAge = (dateOfBirth?: string) => {
    return PatientUtils.calculateAge(dateOfBirth) || 'N/A';
  };

  const getRiskLevel = (patient?: Patient) => {
    const gestationalAge = PatientUtils.getGestationalAge(patient);
    if (!gestationalAge) return 'Medium';
    if (gestationalAge < 20 || gestationalAge > 35) return 'High';
    if (gestationalAge < 24 || gestationalAge > 32) return 'Medium';
    return 'Low';
  };

  const loading = isLoading(id);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Patient not found</Text>
      </View>
    );
  }

  const age = calculateAge(patient.dateOfBirth);
  const riskLevel = getRiskLevel(patient);
  const gestationalAge = PatientUtils.getGestationalAge(patient);
  const latestRecord = PatientUtils.getLatestMedicalRecord(patient);

  return (
    <ScrollView style={styles.container}>
      {/* Patient Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientDetails}>
            Age: {age} • ID: {patient._id}
          </Text>
        </View>
        <View
          style={[
            styles.riskBadge,
            {
              backgroundColor:
                riskLevel === 'High'
                  ? COLORS.error
                  : riskLevel === 'Medium'
                  ? COLORS.warning
                  : COLORS.success,
            },
          ]}
        >
          <Text style={styles.riskText}>{riskLevel} Risk</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(app)/Patients/Forms/AddVisit', { id })}
        >
          <Ionicons name="add-circle" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Add Visit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(app)/Patients/Forms/AddVitals', { id })}
        >
          <Ionicons name="fitness" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Add Vitals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(app)/Patients/Forms/AddMedication', { id })}
        >
          <Ionicons name="medkit" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Add Medication</Text>
        </TouchableOpacity>
      </View>

      {/* Patient Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{patient.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={styles.detailValue}>{patient.gender || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth</Text>
            <Text style={styles.detailValue}>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{patient.address || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact</Text>
            <Text style={styles.detailValue}>{patient.contact || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Facility</Text>
            <Text style={styles.detailValue}>{PatientUtils.getFacilityName(patient)}</Text>
          </View>
        </View>
      </View>

      {/* Pregnancy Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pregnancy Details</Text>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gestational Age</Text>
            <Text style={styles.detailValue}>{gestationalAge ? `${gestationalAge} weeks` : 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expected Due Date</Text>
            <Text style={styles.detailValue}>{latestRecord?.expectedDueDate ? new Date(latestRecord.expectedDueDate).toLocaleDateString() : 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Menstrual Period</Text>
            <Text style={styles.detailValue}>{latestRecord?.lastMenstrualPeriod ? new Date(latestRecord.lastMenstrualPeriod).toLocaleDateString() : 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Risk Level</Text>
            <Text style={styles.detailValue}>{riskLevel}</Text>
          </View>
        </View>
      </View>

      {/* Medical History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical History</Text>
        <View style={styles.card}>
          {latestRecord?.medicalHistory ? (
            Object.entries(latestRecord.medicalHistory).map(([condition, hasCondition]) => (
              hasCondition && (
                <View key={condition} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{condition.charAt(0).toUpperCase() + condition.slice(1)}</Text>
                  <Text style={styles.detailValue}>Yes</Text>
                </View>
              )
            ))
          ) : (
            <Text style={styles.placeholderText}>No medical history recorded</Text>
          )}
        </View>
      </View>

      {/* Latest Vitals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Vitals</Text>
        <View style={styles.card}>
          {latestRecord?.physicalExam ? (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Blood Pressure</Text>
                <Text style={styles.detailValue}>{PatientUtils.getLatestBloodPressure(patient)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Weight</Text>
                <Text style={styles.detailValue}>{latestRecord.physicalExam.weight ? `${latestRecord.physicalExam.weight} kg` : 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Height</Text>
                <Text style={styles.detailValue}>{latestRecord.physicalExam.height ? `${latestRecord.physicalExam.height} cm` : 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>BMI</Text>
                <Text style={styles.detailValue}>{PatientUtils.getLatestBMI(patient) || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Pulse</Text>
                <Text style={styles.detailValue}>{latestRecord.physicalExam.pulse ? `${latestRecord.physicalExam.pulse} bpm` : 'N/A'}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.placeholderText}>No vitals recorded yet</Text>
          )}
        </View>
      </View>

      {/* Risk Factors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk Factors</Text>
        <View style={styles.card}>
          {PatientUtils.getRiskFactors(patient).length > 0 ? (
            PatientUtils.getRiskFactors(patient).map((factor, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailValue}>• {factor}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>No risk factors identified</Text>
          )}
        </View>
      </View>

      {/* Latest Medical Record Details */}
      {latestRecord && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Medical Record</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Visit Date</Text>
              <Text style={styles.detailValue}>{latestRecord.date ? new Date(latestRecord.date).toLocaleDateString() : 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Chief Complaint</Text>
              <Text style={styles.detailValue}>{latestRecord.chiefComplaint || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gravida</Text>
              <Text style={styles.detailValue}>{latestRecord.gravida || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Para</Text>
              <Text style={styles.detailValue}>{latestRecord.para || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next Visit</Text>
              <Text style={styles.detailValue}>{latestRecord.followUp?.nextVisitDate ? new Date(latestRecord.followUp.nextVisitDate).toLocaleDateString() : 'N/A'}</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  headerInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  patientDetails: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: SIZES.base / 2,
  },
  riskBadge: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.base,
  },
  riskText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.medium,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    margin: SIZES.base,
    borderRadius: SIZES.base,
    ...SHADOWS.medium,
  },
  actionText: {
    color: COLORS.white,
    marginLeft: SIZES.base,
    fontWeight: 'bold',
  },
  section: {
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  detailLabel: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  detailValue: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -SIZES.base,
  },
  vitalItem: {
    width: '50%',
    padding: SIZES.base,
  },
  vitalLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  vitalValue: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    fontWeight: '500',
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  symptomText: {
    fontSize: SIZES.font,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
  },
  medicationDetails: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    fontSize: SIZES.medium,
    color: COLORS.error,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});