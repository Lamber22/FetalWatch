import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams();

  // Mock appointment data - replace with actual API call
  const appointment = {
    id: '1',
    patientName: 'Sarah Johnson',
    date: '2024-03-20',
    time: '09:00',
    type: 'Regular Checkup',
    status: 'confirmed',
    notes: 'Regular prenatal checkup. Patient is in good health.',
    vitals: {
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '37.0',
      weight: '65',
    },
  };

  const handleEdit = () => {
    // TODO: Navigate to edit appointment screen
    console.log('Edit appointment:', id);
  };

  const handleCancel = () => {
    // TODO: Implement appointment cancellation
    console.log('Cancel appointment:', id);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{appointment.type}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  appointment.status === 'confirmed'
                    ? COLORS.success
                    : COLORS.warning,
              },
            ]}
          >
            <Text style={styles.statusText}>
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.dateTime}>
          {appointment.date} at {appointment.time}
        </Text>
      </View>

      {/* Patient Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color={COLORS.gray} />
            <Text style={styles.infoText}>{appointment.patientName}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewPatientButton}
            onPress={() => {
              // TODO: Navigate to patient details
              console.log('View patient details');
            }}
          >
            <Text style={styles.viewPatientText}>View Patient Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Vitals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Vitals</Text>
        <View style={styles.card}>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>{appointment.vitals.bloodPressure}</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <Text style={styles.vitalValue}>{appointment.vitals.heartRate} bpm</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Temperature</Text>
              <Text style={styles.vitalValue}>{appointment.vitals.temperature}°C</Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Weight</Text>
              <Text style={styles.vitalValue}>{appointment.vitals.weight} kg</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <View style={styles.card}>
          <Text style={styles.notesText}>{appointment.notes}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Ionicons name="close-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>
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
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    ...SHADOWS.light,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.base,
  },
  statusText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  dateTime: {
    fontSize: SIZES.font,
    color: COLORS.gray,
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
  viewPatientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  viewPatientText: {
    fontSize: SIZES.font,
    color: COLORS.primary,
    fontWeight: 'bold',
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
    marginBottom: SIZES.base / 2,
  },
  vitalValue: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  notesText: {
    fontSize: SIZES.font,
    color: COLORS.text,
    lineHeight: SIZES.font * 1.5,
  },
  actions: {
    flexDirection: 'row',
    padding: SIZES.medium,
    gap: SIZES.medium,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    gap: SIZES.base,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.white,
  },
}); 