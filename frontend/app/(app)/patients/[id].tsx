import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

// Mock data - replace with actual API call
const mockPatientData = {
  id: 1,
  name: 'Sarah Johnson',
  age: 28,
  address: '123 Main St, City',
  contact: '+1 234 567 8900',
  medicalId: 'MED123456',
  riskLevel: 'High',
  pregnancyDetails: {
    weekOfPregnancy: 24,
    expectedDeliveryDate: '2024-06-15',
    lastCheckup: '2024-03-15',
  },
  vitals: {
    bloodPressure: '120/80',
    heartRate: 75,
    hemoglobin: 12.5,
    temperature: 37.0,
    weight: 65,
  },
  symptoms: ['Mild nausea', 'Back pain'],
  medications: [
    {
      name: 'Prenatal Vitamins',
      dosage: '1 tablet',
      frequency: 'Daily',
    },
  ],
};

export default function PatientDetailsScreen() {
  const { id } = useLocalSearchParams();
  const patient = mockPatientData; // Replace with actual data fetching

  return (
    <ScrollView style={styles.container}>
      {/* Patient Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientDetails}>
            Age: {patient.age} • ID: {patient.medicalId}
          </Text>
        </View>
        <View
          style={[
            styles.riskBadge,
            {
              backgroundColor:
                patient.riskLevel === 'High'
                  ? COLORS.error
                  : patient.riskLevel === 'Medium'
                  ? COLORS.warning
                  : COLORS.success,
            },
          ]}
        >
          <Text style={styles.riskText}>{patient.riskLevel} Risk</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push({
            pathname: '/patients/[id]/add-visit',
            params: { id }
          })}
        >
          <Ionicons name="add-circle" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Add Visit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push({
            pathname: '/patients/[id]/add-vitals',
            params: { id }
          })}
        >
          <Ionicons name="fitness" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Add Vitals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push({
            pathname: '/patients/[id]/add-medication',
            params: { id }
          })}
        >
          <Ionicons name="medkit" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Add Medication</Text>
        </TouchableOpacity>
      </View>

      {/* Pregnancy Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pregnancy Details</Text>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Week of Pregnancy</Text>
            <Text style={styles.detailValue}>{patient.pregnancyDetails.weekOfPregnancy}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expected Delivery</Text>
            <Text style={styles.detailValue}>{patient.pregnancyDetails.expectedDeliveryDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Checkup</Text>
            <Text style={styles.detailValue}>{patient.pregnancyDetails.lastCheckup}</Text>
          </View>
        </View>
      </View>

      {/* Vitals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Vitals</Text>
        <View style={styles.card}>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>{patient.vitals.bloodPressure}</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <Text style={styles.vitalValue}>{patient.vitals.heartRate} bpm</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Hemoglobin</Text>
              <Text style={styles.vitalValue}>{patient.vitals.hemoglobin} g/dL</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Temperature</Text>
              <Text style={styles.vitalValue}>{patient.vitals.temperature}°C</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Weight</Text>
              <Text style={styles.vitalValue}>{patient.vitals.weight} kg</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Symptoms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Symptoms</Text>
        <View style={styles.card}>
          {patient.symptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomItem}>
              <Ionicons name="alert-circle" size={20} color={COLORS.warning} />
              <Text style={styles.symptomText}>{symptom}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Medications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Medications</Text>
        <View style={styles.card}>
          {patient.medications.map((medication, index) => (
            <View key={index} style={styles.medicationItem}>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <Text style={styles.medicationDetails}>
                  {medication.dosage} • {medication.frequency}
                </Text>
              </View>
            </View>
          ))}
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
}); 