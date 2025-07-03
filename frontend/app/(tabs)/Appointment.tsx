import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppointmentContext } from '../../contexts/AppointmentContext';
import Modal from '../../components/ui/Modal';
import AddAppointment from '../../components/Appointment/AddAppointment';
import AppointmentDetails from '../../components/Appointment/AppointmentDetails';

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { state: appointmentState, actions: appointmentActions } = useAppointmentContext();
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Fetch appointments when component mounts
    appointmentActions.getAllAppointments();
  }, []);

  const handleRefreshAppointments = () => {
    appointmentActions.getAllAppointments();
  };

  const handleAppointmentPress = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleEditAppointment = () => {
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleCancelAppointment = async () => {
    if (selectedAppointment?._id) {
      try {
        await appointmentActions.cancelAppointment(selectedAppointment._id);
        if (!appointmentState.error) {
          setShowDetailsModal(false);
          setSelectedAppointment(null);
          // Refresh appointments list
          appointmentActions.getAllAppointments();
        }
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const formatTime = (time: string | undefined) => {
    // Handle undefined or invalid time
    if (!time || typeof time !== 'string') {
      return 'Time not set';
    }
    
    // Convert 24-hour format to 12-hour format
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.white }]}
          onPress={() => setShowAddAppointmentModal(true)}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {appointmentState.loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.gray }]}>Loading appointments...</Text>
          </View>
        ) : appointmentState.error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>{appointmentState.error}</Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={handleRefreshAppointments}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : appointmentState.appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.gray }]}>No appointments found</Text>
          </View>
        ) : (
          appointmentState.appointments.map((appointment: any) => {
            // Defensive check for appointment object and required properties
            if (!appointment || !appointment._id) {
              return null;
            }

            return (
              <TouchableOpacity
                key={appointment._id}
                style={[styles.appointmentCard, { backgroundColor: colors.white }]}
                onPress={() => handleAppointmentPress(appointment)}
              >
                <View style={styles.timeContainer}>
                  <Text style={[styles.time, { color: colors.primary }]}>
                    {formatTime(appointment.time)}
                  </Text>
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={[styles.patientName, { color: colors.text }]}>
                    {appointment.patientName || appointment.patient?.name || 'Unknown Patient'}
                  </Text>
                  <Text style={[styles.appointmentType, { color: colors.gray }]}>
                    {appointment.appointmentType || 'Unknown Type'}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(appointment.status || 'pending') },
                    ]}
                  >
                    <Text style={styles.statusText}>{appointment.status || 'Pending'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }).filter(Boolean)
        )}
      </ScrollView>

      {/* Add Appointment Modal */}
      <Modal
        visible={showAddAppointmentModal}
        onClose={() => setShowAddAppointmentModal(false)}
        title="Schedule Appointment"
        size="large"
        animationType="slide"
      >
        <AddAppointment
          onSuccess={() => {
            setShowAddAppointmentModal(false);
            // Refresh appointments list after successful creation
            appointmentActions.getAllAppointments();
          }}
          onCancel={() => setShowAddAppointmentModal(false)}
        />
      </Modal>

      {/* Appointment Details Modal */}
      <Modal
        visible={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedAppointment(null);
        }}
        title="Appointment Details"
        size="large"
        animationType="slide"
      >
        <AppointmentDetails
          appointment={selectedAppointment}
          onEdit={handleEditAppointment}
          onCancel={handleCancelAppointment}
        />
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAppointment(null);
        }}
        title="Edit Appointment"
        size="large"
        animationType="slide"
      >
        <AddAppointment
          appointment={selectedAppointment}
          isEditing={true}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedAppointment(null);
            // Refresh appointments list after successful edit
            appointmentActions.getAllAppointments();
          }}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedAppointment(null);
          }}
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
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  timeContainer: {
    width: 80,
    alignItems: 'center',
  },
  time: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: SIZES.base,
  },
  patientName: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  appointmentType: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  statusContainer: {
    marginLeft: SIZES.base,
  },
  statusBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  loadingText: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  errorText: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    marginBottom: SIZES.padding,
    textAlign: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  emptyText: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    textAlign: 'center',
  },
});