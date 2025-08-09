import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { useAppointmentContext } from '../../contexts/AppointmentContext';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const { state: appointmentState, actions: appointmentActions } = useAppointmentContext();

  useEffect(() => {
    // Fetch appointments when component mounts
    appointmentActions.getAllAppointments();
  }, []);

  // Get appointments data from context
  const appointments = appointmentState.appointments;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setSelectedDate(newDate);
  };

  const renderAppointmentCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => {
        // Navigate to appointment details
        router.push(`/appointment/${item._id}`);
      }}
    >
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{item.time || 'N/A'}</Text>
      </View>
      <View style={styles.appointmentDetails}>
        <Text style={styles.patientName}>
          {item.patientName || item.patient?.name || 'Unknown Patient'}
        </Text>
        <Text style={styles.appointmentType}>
          {item.appointmentType || 'Unknown Type'}
        </Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              item.status?.toLowerCase() === 'confirmed' || item.status?.toLowerCase() === 'scheduled'
                ? COLORS.success
                : COLORS.warning,
          },
        ]}
      >
        <Text style={styles.statusText}>
          {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pending'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dateNavigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateDate('prev')}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateDate('next')}
          >
            <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'day' && styles.activeToggle,
            ]}
            onPress={() => setViewMode('day')}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === 'day' && styles.activeToggleText,
              ]}
            >
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'week' && styles.activeToggle,
            ]}
            onPress={() => setViewMode('week')}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === 'week' && styles.activeToggleText,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Appointments List */}
      {appointmentState.loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : appointmentState.error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{appointmentState.error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => appointmentActions.getAllAppointments()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No appointments found</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentCard}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={styles.appointmentsList}
        />
      )}

      {/* Add Appointment Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
        }}
      >
        <Ionicons name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
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
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  navButton: {
    padding: SIZES.base,
  },
  dateText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.base,
    padding: SIZES.base / 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    borderRadius: SIZES.base,
  },
  activeToggle: {
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  toggleText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  activeToggleText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  appointmentsList: {
    padding: SIZES.medium,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.light,
  },
  timeContainer: {
    width: 60,
    alignItems: 'center',
  },
  timeText: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  appointmentDetails: {
    flex: 1,
    marginLeft: SIZES.medium,
  },
  patientName: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  appointmentType: {
    fontSize: SIZES.small,
    color: COLORS.gray,
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
  addButton: {
    position: 'absolute',
    right: SIZES.medium,
    bottom: SIZES.medium,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.medium * 2,
  },
  loadingText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.medium * 2,
  },
  errorText: {
    fontSize: SIZES.font,
    color: COLORS.error || COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.base,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.medium * 2,
  },
  emptyText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
  },
}); 