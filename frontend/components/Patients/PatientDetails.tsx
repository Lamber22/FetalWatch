import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { usePatients } from '../../contexts/PatientsContext';

export default function PatientDetailsScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { selectedPatient, loading, error, getPatient } = usePatients();

  useEffect(() => {
    if (id) {
      getPatient(id);
    }
  }, [id, getPatient]);

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const getRiskLevel = (weekOfPregnancy?: number) => {
    if (!weekOfPregnancy) return 'Medium';
    if (weekOfPregnancy < 20 || weekOfPregnancy > 35) return 'High';
    if (weekOfPregnancy < 24 || weekOfPregnancy > 32) return 'Medium';
    return 'Low';
  };

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

  if (!selectedPatient) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Patient not found</Text>
      </View>
    );
  }

  const age = calculateAge(selectedPatient.dateOfBirth);
  const riskLevel = getRiskLevel(selectedPatient.weekOfPregnancy);

  return (
    <ScrollView style={styles.container}>
      {/* Patient Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.patientName}>{selectedPatient.name}</Text>
          <Text style={styles.patientDetails}>
            Age: {age} • ID: {selectedPatient._id}
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
            <Text style={styles.detailValue}>{selectedPatient.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={styles.detailValue}>{selectedPatient.gender || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{selectedPatient.address || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact</Text>
            <Text style={styles.detailValue}>{selectedPatient.contact || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Pregnancy Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pregnancy Details</Text>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Week of Pregnancy</Text>
            <Text style={styles.detailValue}>{selectedPatient.weekOfPregnancy || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expected Delivery</Text>
            <Text style={styles.detailValue}>{selectedPatient.expectedDeliveryDate || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Risk Level</Text>
            <Text style={styles.detailValue}>{riskLevel}</Text>
          </View>
        </View>
      </View>

      {/* Placeholder sections for future data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Vitals</Text>
        <View style={styles.card}>
          <Text style={styles.placeholderText}>No vitals recorded yet</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Symptoms</Text>
        <View style={styles.card}>
          <Text style={styles.placeholderText}>No symptoms recorded</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Medications</Text>
        <View style={styles.card}>
          <Text style={styles.placeholderText}>No medications recorded</Text>
        </View>
      </View>
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