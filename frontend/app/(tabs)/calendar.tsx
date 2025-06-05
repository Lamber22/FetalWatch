import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export default function CalendarScreen() {
  const { colors } = useTheme();

  const appointments = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      time: '09:00 AM',
      type: 'Regular Checkup',
      status: 'Upcoming',
    },
    {
      id: '2',
      patientName: 'Emily Davis',
      time: '10:30 AM',
      type: 'Ultrasound',
      status: 'Upcoming',
    },
    {
      id: '3',
      patientName: 'Maria Garcia',
      time: '02:00 PM',
      type: 'Lab Results',
      status: 'Upcoming',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/calendar/add')}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {appointments.map((appointment) => (
          <TouchableOpacity
            key={appointment.id}
            style={[styles.appointmentCard, { backgroundColor: colors.white }]}
            onPress={() => router.push(`/calendar/${appointment.id}`)}
          >
            <View style={styles.timeContainer}>
              <Text style={[styles.time, { color: colors.primary }]}>{appointment.time}</Text>
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={[styles.patientName, { color: colors.text }]}>
                {appointment.patientName}
              </Text>
              <Text style={[styles.appointmentType, { color: colors.gray }]}>
                {appointment.type}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: colors.success },
                ]}
              >
                <Text style={styles.statusText}>{appointment.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
}); 