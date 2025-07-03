import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import Modal from '../ui/Modal';
import PatientDetailsView from '../Patients/PatientDetailsView';

interface AppointmentDetailsProps {
  appointment: any;
  onEdit?: () => void;
  onCancel?: () => void;
}

export default function AppointmentDetails({ appointment, onEdit, onCancel }: AppointmentDetailsProps) {
  const { colors } = useTheme();
  const [showPatientModal, setShowPatientModal] = useState(false);

  // Use the passed appointment prop instead of mock data
  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          No appointment data available
        </Text>
      </View>
    );
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleViewPatient = () => {
    setShowPatientModal(true);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'Date not set';
    
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (time: string | undefined) => {
    if (!time || typeof time !== 'string') {
      return 'Time not set';
    }
    
    const [hours, minutes] = time.split(':');
    if (!hours || !minutes) {
      return 'Invalid time';
    }
    
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return colors.success || COLORS.success;
      case 'in progress':
        return colors.primary || COLORS.primary;
      case 'completed':
        return colors.success || COLORS.success;
      case 'cancelled':
      case 'no show':
        return colors.error || COLORS.error;
      default:
        return colors.gray || COLORS.gray;
    }
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background || COLORS.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.white || COLORS.white }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text || COLORS.text }]}>
              {appointment.appointmentType || appointment.type || 'Appointment'}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(appointment.status || 'pending') },
              ]}
            >
              <Text style={styles.statusText}>
                {(appointment.status || 'pending').charAt(0).toUpperCase() +
                  (appointment.status || 'pending').slice(1)}
              </Text>
            </View>
          </View>
          <Text style={[styles.dateTime, { color: colors.gray || COLORS.gray }]}>
            {formatDate(appointment.date)} at {formatTime(appointment.time)}
          </Text>
        </View>

        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
            Patient Information
          </Text>
          <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={colors.gray || COLORS.gray} />
              <Text style={[styles.infoText, { color: colors.text || COLORS.text }]}>
                {appointment.patientName || appointment.patient?.name || 'Unknown Patient'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewPatientButton}
              onPress={handleViewPatient}
            >
              <Text style={[styles.viewPatientText, { color: colors.primary || COLORS.primary }]}>
                View Patient Profile
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary || COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
            Appointment Details
          </Text>
          <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>Type:</Text>
              <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
                {appointment.appointmentType || appointment.type || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>Status:</Text>
              <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
                {appointment.status || 'Pending'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>Duration:</Text>
              <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
                {appointment.duration || '30 minutes'}
              </Text>
            </View>
          </View>
        </View>

        {/* Vitals (if available) */}
        {appointment.vitals && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
              Latest Vitals
            </Text>
            <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
              <View style={styles.vitalsGrid}>
                <View style={styles.vitalItem}>
                  <Text style={[styles.vitalLabel, { color: colors.gray || COLORS.gray }]}>
                    Blood Pressure
                  </Text>
                  <Text style={[styles.vitalValue, { color: colors.text || COLORS.text }]}>
                    {appointment.vitals.bloodPressure || 'N/A'}
                  </Text>
                </View>
                <View style={styles.vitalItem}>
                  <Text style={[styles.vitalLabel, { color: colors.gray || COLORS.gray }]}>
                    Heart Rate
                  </Text>
                  <Text style={[styles.vitalValue, { color: colors.text || COLORS.text }]}>
                    {appointment.vitals.heartRate ? `${appointment.vitals.heartRate} bpm` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.vitalItem}>
                  <Text style={[styles.vitalLabel, { color: colors.gray || COLORS.gray }]}>
                    Temperature
                  </Text>
                  <Text style={[styles.vitalValue, { color: colors.text || COLORS.text }]}>
                    {appointment.vitals.temperature ? `${appointment.vitals.temperature}°C` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.vitalItem}>
                  <Text style={[styles.vitalLabel, { color: colors.gray || COLORS.gray }]}>
                    Weight
                  </Text>
                  <Text style={[styles.vitalValue, { color: colors.text || COLORS.text }]}>
                    {appointment.vitals.weight ? `${appointment.vitals.weight} kg` : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Notes */}
        {appointment.notes && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>Notes</Text>
            <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
              <Text style={[styles.notesText, { color: colors.text || COLORS.text }]}>
                {appointment.notes}
              </Text>
            </View>
          </View>
        )}

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

      {/* Patient Details Modal */}
      <Modal
        visible={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        title="Patient Details"
        size="large"
        animationType="slide"
      >
        <PatientDetailsView 
          patient={appointment.patient || { 
            _id: appointment.patientId,
            name: appointment.patientName 
          }} 
        />
      </Modal>
    </>
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
  errorText: {
    fontSize: SIZES.font,
    textAlign: 'center',
    marginTop: SIZES.large,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: SIZES.font,
    textAlign: 'right',
    flex: 1,
    marginLeft: SIZES.medium,
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