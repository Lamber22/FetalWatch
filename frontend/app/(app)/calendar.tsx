import { useState } from 'react';
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
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Mock appointments data
  const appointments = [
    {
      id: '1',
      time: '09:00',
      patientName: 'Sarah Johnson',
      type: 'Regular Checkup',
      status: 'confirmed',
    },
    {
      id: '2',
      time: '10:30',
      patientName: 'Emily Davis',
      type: 'Ultrasound',
      status: 'pending',
    },
    {
      id: '3',
      time: '14:00',
      patientName: 'Maria Garcia',
      type: 'Follow-up',
      status: 'confirmed',
    },
  ];

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

  const renderAppointmentCard = ({ item }: { item: typeof appointments[0] }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => {
        // TODO: Navigate to appointment details
        console.log('View appointment:', item.id);
      }}
    >
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.appointmentDetails}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <Text style={styles.appointmentType}>{item.type}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              item.status === 'confirmed'
                ? COLORS.success
                : COLORS.warning,
          },
        ]}
      >
        <Text style={styles.statusText}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
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
      <FlatList
        data={appointments}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.appointmentsList}
      />

      {/* Add Appointment Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // TODO: Navigate to add appointment screen
          console.log('Add new appointment');
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
}); 