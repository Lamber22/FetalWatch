import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();

  const stats = [
    { title: 'Total Patients', value: '156', icon: 'people' },
    { title: 'Today\'s Appointments', value: '12', icon: 'calendar' },
    { title: 'High Risk Cases', value: '8', icon: 'warning' },
    { title: 'Completed Visits', value: '45', icon: 'checkmark-circle' },
  ];

  const recentPatients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 28,
      weeks: 24,
      risk: 'Low',
      lastVisit: '2 days ago',
    },
    {
      id: '2',
      name: 'Emily Davis',
      age: 32,
      weeks: 36,
      risk: 'High',
      lastVisit: '1 day ago',
    },
    {
      id: '3',
      name: 'Maria Garcia',
      age: 25,
      weeks: 18,
      risk: 'Low',
      lastVisit: '3 days ago',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Illustration */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back,</Text>
            <Text style={styles.doctorName}>Dr. Sarah Wilson</Text>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: colors.white }]}
            onPress={() => console.log('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../assets/illustration/a_vibrant_2d_illustration_featuring_black_obstetricians_and_healthcare_providers_engaging_with_the__lyacw4geud106dkbw8zq_0.png')}
          style={styles.headerIllustration}
          resizeMode="contain"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/patients/add')}
        >
          <Ionicons name="person-add" size={24} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Add Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/calendar/add')}
        >
          <Ionicons name="calendar" size={24} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/reports')}
        >
          <Ionicons name="bar-chart" size={24} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[styles.statCard, { backgroundColor: colors.white }]}
          >
            <Ionicons name={stat.icon as any} size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statTitle, { color: colors.gray }]}>{stat.title}</Text>
          </View>
        ))}
      </View>

      {/* Recent Patients */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Patients</Text>
          <TouchableOpacity onPress={() => router.push('/patients')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentPatients.map((patient) => (
          <TouchableOpacity
            key={patient.id}
            style={[styles.patientCard, { backgroundColor: colors.white }]}
            onPress={() => router.push(`/patients/${patient.id}`)}
          >
            <View style={styles.patientInfo}>
              <Text style={[styles.patientName, { color: colors.text }]}>{patient.name}</Text>
              <Text style={[styles.patientDetails, { color: colors.gray }]}>
                {patient.age} years • {patient.weeks} weeks
              </Text>
            </View>
            <View style={styles.patientStatus}>
              <View
                style={[
                  styles.riskBadge,
                  {
                    backgroundColor:
                      patient.risk === 'High' ? colors.error : colors.success,
                  },
                ]}
              >
                <Text style={styles.riskText}>{patient.risk} Risk</Text>
              </View>
              <Text style={[styles.lastVisit, { color: colors.gray }]}>
                {patient.lastVisit}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.padding,
    borderBottomLeftRadius: SIZES.radius * 2,
    borderBottomRightRadius: SIZES.radius * 2,
    ...SHADOWS.medium,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  welcomeText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    opacity: 0.8,
  },
  doctorName: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  headerIllustration: {
    width: '100%',
    height: 200,
    marginTop: SIZES.padding,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    marginTop: -SIZES.padding * 2,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SIZES.base,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  actionText: {
    marginTop: SIZES.base,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.padding,
  },
  statCard: {
    width: '45%',
    margin: '2.5%',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  statValue: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    marginVertical: SIZES.base,
  },
  statTitle: {
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  section: {
    padding: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: SIZES.medium,
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    marginBottom: SIZES.base / 2,
  },
  patientDetails: {
    fontSize: SIZES.small,
  },
  patientStatus: {
    alignItems: 'flex-end',
  },
  riskBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base / 2,
  },
  riskText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  lastVisit: {
    fontSize: SIZES.small,
  },
}); 