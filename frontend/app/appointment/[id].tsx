import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppointmentContext } from '../../contexts/AppointmentContext';
import Modal from '../../components/ui/Modal';
import AddAppointmentScreen from '../../components/Appointment/AddAppointment';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { state: appointmentState, actions: appointmentActions } = useAppointmentContext();
  const [appointment, setAppointment] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      // First check if appointment is already in the state
      const existingAppointment = appointmentState.appointments.find(
        (apt) => apt._id === id
      );
      
      if (existingAppointment) {
        setAppointment(existingAppointment);
      } else {
        // Fetch appointment details from API
        appointmentActions.getAppointmentById(id);
      }
    }
  }, [id]);

  useEffect(() => {
    // Update local state when selected appointment changes
    if (appointmentState.selectedAppointment) {
      setAppointment(appointmentState.selectedAppointment);
    }
  }, [appointmentState.selectedAppointment]);

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleCancel = async () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              if (id && typeof id === 'string') {
                await appointmentActions.cancelAppointment(id);
                if (!appointmentState.error) {
                  Alert.alert('Success', 'Appointment cancelled successfully');
                  router.back();
                } else {
                  Alert.alert('Error', appointmentState.error);
                }
              }
            } catch (error) {
              console.error('Error cancelling appointment:', error);
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return colors.success;
      case 'in progress':
        return colors.primary;
      case 'completed':
        return colors.success;
      case 'cancelled':
      case 'no show':
        return colors.error;
      default:
        return colors.gray;
    }
  };

  if (appointmentState.loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.gray }]}>Loading appointment details...</Text>
      </View>
    );
  }

  if (appointmentState.error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{appointmentState.error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            if (id && typeof id === 'string') {
              appointmentActions.getAppointmentById(id);
            }
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.gray }]}>Appointment not found</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.white }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {appointment.appointmentType || 'Appointment'}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(appointment.status || 'pending') },
            ]}
          >
            <Text style={styles.statusText}>
              {appointment.status ? 
                appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : 
                'Pending'
              }
            </Text>
          </View>
        </View>
        <Text style={[styles.dateTime, { color: colors.gray }]}>
          {formatDate(appointment.date)} at {formatTime(appointment.time)}
        </Text>
      </View>

      {/* Patient Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Patient Information</Text>
        <View style={[styles.card, { backgroundColor: colors.white }]}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color={colors.gray} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              {appointment.patientName || 
               appointment.patient?.name || 
               appointment.patientId?.name || 
               'Unknown Patient'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewPatientButton}
            onPress={() => {
              // TODO: Navigate to patient details
              console.log('View patient details');
              Alert.alert('Patient Profile', 'Patient profile navigation will be implemented soon');
            }}
          >
            <Text style={[styles.viewPatientText, { color: colors.primary }]}>
              View Patient Profile
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Appointment Details */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appointment Details</Text>
        <View style={[styles.card, { backgroundColor: colors.white }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.gray }]}>Type:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {appointment.appointmentType || 'Not specified'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.gray }]}>Duration:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {appointment.duration ? `${appointment.duration} minutes` : '30 minutes'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.gray }]}>Doctor:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {appointment.doctor || 'Not assigned'}
            </Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      {appointment.notes && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <Text style={[styles.notesText, { color: colors.text }]}>
              {appointment.notes}
            </Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { backgroundColor: colors.primary }]}
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton, { backgroundColor: colors.error }]}
          onPress={handleCancel}
        >
          <Ionicons name="close-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        title="Edit Appointment"
        size="large"
        animationType="slide"
      >
        <AddAppointmentScreen
          appointment={appointment}
          isEditing={true}
          onSuccess={() => {
            setIsEditModalVisible(false);
            // Refresh appointment data
            if (id && typeof id === 'string') {
              appointmentActions.getAppointmentById(id);
            }
          }}
          onCancel={() => setIsEditModalVisible(false)}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: SIZES.padding,
    ...SHADOWS.light,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  statusText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  dateTime: {
    fontSize: SIZES.medium,
  },
  section: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
  },
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.light,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  infoText: {
    fontSize: SIZES.medium,
    marginLeft: SIZES.padding,
  },
  viewPatientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  viewPatientText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  detailLabel: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: SIZES.medium,
    flex: 1,
    textAlign: 'right',
  },
  notesText: {
    fontSize: SIZES.medium,
    lineHeight: SIZES.medium * 1.5,
  },
  actions: {
    flexDirection: 'row',
    padding: SIZES.padding,
    gap: SIZES.padding,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: SIZES.base,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  loadingText: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  errorText: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  retryButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: SIZES.base,
  },
});
